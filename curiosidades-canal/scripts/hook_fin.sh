#!/usr/bin/env bash
# Hook Stop: al terminar cada turno de Claude, guarda los cambios en git y,
# si la última copia completa tiene más de 6 horas, hace una nueva.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT" || exit 0
if [ -d .git ]; then
  git add -A >/dev/null 2>&1
  git diff --cached --quiet 2>/dev/null || git -c user.name="Datos Curiosos" -c user.email="noreply@anthropic.com" \
    commit -q -m "Guardado automático $(TZ=Europe/Madrid date '+%d/%m/%Y %H:%M')" >/dev/null 2>&1
fi
bash scripts/backup.sh --si-procede >/dev/null 2>&1 || true
exit 0
