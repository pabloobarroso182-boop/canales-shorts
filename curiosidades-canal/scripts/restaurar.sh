#!/usr/bin/env bash
# Restaura el proyecto desde una copia de seguridad.
# Uso: bash restaurar.sh datos-curiosos-AAAAMMDD-HHMMSS.tar.gz [carpeta_destino]
#   (funciona aunque se ejecute fuera del proyecto: basta con este script y la copia)
set -euo pipefail
COPIA="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
DESTINO="${2:-$PWD/curiosidades-canal}"
[ -f "$COPIA" ] || { echo "No existe $COPIA"; exit 1; }

if [ -f "$COPIA.sha256" ]; then
  ( cd "$(dirname "$COPIA")" && sha256sum -c "$(basename "$COPIA").sha256" >/dev/null ) \
    && echo "✓ Suma de control correcta" || { echo "✗ La copia está dañada (suma de control)"; exit 1; }
fi
if [ -e "$DESTINO" ] && [ -n "$(ls -A "$DESTINO" 2>/dev/null)" ]; then
  echo "✗ $DESTINO ya existe y no está vacía. Elige otra carpeta (no se sobrescribe nada)."; exit 1
fi
mkdir -p "$DESTINO"
tar -xzf "$COPIA" -C "$DESTINO"
cd "$DESTINO"
sha256sum --quiet -c MANIFIESTO.sha256 && echo "✓ Los $(wc -l < MANIFIESTO.sha256) archivos coinciden con el manifiesto"
[ -d .git ] && git fsck --no-progress >/dev/null 2>&1 && echo "✓ Historial git íntegro ($(git log --oneline | wc -l) commits)"
echo
echo "Proyecto restaurado en: $DESTINO"
echo "Siguientes pasos:"
echo "  1. cd \"$DESTINO\" && bash scripts/setup.sh      # herramientas, modelos y npm ci (la 1.ª vez)"
echo "  2. Abre Claude Code en esa carpeta: leerá CLAUDE.md y ESTADO_DEL_PROYECTO.md"
echo "  3. Si hace falta YouTube: python3 pipeline/youtube/auth.py --manual (las credenciales no viajan en la copia)"
