#!/usr/bin/env bash
# Comprueba una copia de seguridad sin tocar el proyecto: la restaura en una carpeta temporal,
# verifica el manifiesto, el historial git, los documentos de memoria y los materiales,
# y la compara con el proyecto actual.
# Uso: bash scripts/verificar_backup.sh [backups/datos-curiosos-….tar.gz]   (por defecto, la más reciente)
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COPIA="${1:-$(ls -t "$ROOT"/backups/*.tar.gz | head -1)}"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
ok=0; mal() { echo "  ✗ $1"; ok=1; }

echo "Copia: $COPIA"
bash "$ROOT/scripts/restaurar.sh" "$COPIA" "$TMP/p" | grep -E '✓|✗'
cd "$TMP/p"

for f in CLAUDE.md MEMORIA_COMPLETA.md ESTADO_DEL_PROYECTO.md HISTORIAL.md CONFIGURACION.md AUTOMATIZACIONES.md INVESTIGACION.md RECUPERACION.md \
         config/publicacion.json config/voz_respaldo.json data/historial.json .claude/skills/produccion-nocturna/SKILL.md .claude/settings.json \
         scripts/setup.sh scripts/backup.sh pipeline/make_short.py video/package.json video/src/Root.tsx; do
  [ -s "$f" ] || mal "falta $f"
done
echo "  ✓ documentos de memoria, configuración, skill, hooks y código presentes"

for d in brand PRODUCCION content assets docs output; do
  a=$(find "$ROOT/$d" -type f -not -path '*/work/*' 2>/dev/null | wc -l); b=$(find "$d" -type f 2>/dev/null | wc -l)
  [ "$a" = "$b" ] && echo "  ✓ $d/: $b archivos (igual que el proyecto)" || mal "$d/: $b en la copia frente a $a en el proyecto"
done
mp4=$(find . -name '*.mp4' | wc -l); echo "  ✓ vídeos MP4 en la copia: $mp4"
[ ! -e secrets ] && echo "  ✓ sin carpeta secrets/" || mal "la copia incluye secrets/"
cd "$TMP/p/video" && ln -s "$ROOT/video/node_modules" node_modules && npx tsc --noEmit >/dev/null 2>&1 && echo "  ✓ el código de vídeo compila desde la copia" || mal "el código de vídeo no compila"
cd "$TMP/p" && python3 pipeline/originality.py PRODUCCION/2026-11-19/01-apolo12-rayos/guion.json >/dev/null 2>&1 && echo "  ✓ los scripts de Python funcionan desde la copia" || mal "los scripts de Python fallan desde la copia"

[ $ok -eq 0 ] && echo "COPIA VERIFICADA" || { echo "COPIA CON PROBLEMAS"; exit 1; }
