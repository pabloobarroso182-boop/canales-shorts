#!/usr/bin/env bash
# Copia de seguridad completa del proyecto.
#   1. Commit en git de todos los cambios (textos, guiones, configuración…).
#   2. Copia comprimida de TODO el proyecto (incluidos vídeos, audios, diseños y el historial git)
#      en backups/, con manifiesto SHA-256 de cada archivo y suma de control de la copia.
#   3. Comprueba que la copia no contiene secretos y que se puede leer.
# Nunca borra copias anteriores. Excluye: secrets/, video/node_modules, carpetas work/ y backups/.
#
# Uso:  bash scripts/backup.sh                 copia ahora
#       bash scripts/backup.sh --si-procede    solo si la última copia tiene más de 6 h (la usa el hook)
#       BACKUP_DIR=/ruta/externa bash scripts/backup.sh   además copia el .tar.gz a otra carpeta
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
DEST="$ROOT/backups"; mkdir -p "$DEST"
HORAS_MIN=6

if [ "${1:-}" = "--si-procede" ]; then
  ultima=$(ls -t "$DEST"/*.tar.gz 2>/dev/null | head -1 || true)
  if [ -n "$ultima" ] && [ $(( $(date +%s) - $(stat -c %Y "$ultima") )) -lt $((HORAS_MIN*3600)) ]; then
    exit 0
  fi
fi

SELLO=$(TZ=Europe/Madrid date +%Y%m%d-%H%M%S)
NOMBRE="datos-curiosos-$SELLO"

# 1. git
if [ -d .git ]; then
  git add -A
  if ! git diff --cached --quiet; then
    git -c user.name="Datos Curiosos" -c user.email="noreply@anthropic.com" commit -q -m "Copia de seguridad $SELLO"
  fi
fi

# 2. manifiesto + tar
EXCL=(--exclude=./backups --exclude=./secrets --exclude=./video/node_modules --exclude='*/work' --exclude='__pycache__' --exclude='./video/public/shorts')
find . -type f -not -path './backups/*' -not -path './secrets/*' -not -path './video/node_modules/*' -not -path '*/work/*' \
  -not -path '*/__pycache__/*' -not -path './video/public/shorts/*' -not -path './.git/*' -not -name MANIFIESTO.sha256 -print0 \
  | sort -z | xargs -0 sha256sum > MANIFIESTO.sha256
tar "${EXCL[@]}" -czf "$DEST/$NOMBRE.tar.gz" .
rm -f MANIFIESTO.sha256
( cd "$DEST" && sha256sum "$NOMBRE.tar.gz" > "$NOMBRE.tar.gz.sha256" )

# 3. comprobaciones: legible y sin secretos
tar -tzf "$DEST/$NOMBRE.tar.gz" > /tmp/.lista-$$
if grep -qE '(^|/)secrets/|client_secret.*\.json$|token\.json$' /tmp/.lista-$$; then
  rm -f "$DEST/$NOMBRE.tar.gz" "$DEST/$NOMBRE.tar.gz.sha256" /tmp/.lista-$$
  echo "✗ La copia contenía archivos de credenciales: anulada." >&2; exit 1
fi
if tar -xzOf "$DEST/$NOMBRE.tar.gz" --wildcards '*.md' '*.json' '*.py' '*.sh' '*.ts' '*.tsx' 2>/dev/null \
   | grep -qE '"refresh_token"\s*:|"client_secret"\s*:|xi-api-key:\s*[A-Za-z0-9]{20,}|sk_[A-Za-z0-9]{24,}'; then
  rm -f "$DEST/$NOMBRE.tar.gz" "$DEST/$NOMBRE.tar.gz.sha256" /tmp/.lista-$$
  echo "✗ La copia contenía un token o clave en texto: anulada." >&2; exit 1
fi
N=$(wc -l < /tmp/.lista-$$); rm -f /tmp/.lista-$$
TAM=$(du -h "$DEST/$NOMBRE.tar.gz" | cut -f1)

if [ -n "${BACKUP_DIR:-}" ]; then mkdir -p "$BACKUP_DIR" && cp "$DEST/$NOMBRE.tar.gz"* "$BACKUP_DIR/"; fi

echo "✓ Copia: backups/$NOMBRE.tar.gz ($TAM, $N entradas)"
echo "  Suma de control: backups/$NOMBRE.tar.gz.sha256"
TOTAL=$(du -sh "$DEST" | cut -f1); echo "  Espacio total de copias: $TOTAL (no se borran copias antiguas sin autorización)"
