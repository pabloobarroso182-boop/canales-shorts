#!/usr/bin/env bash
# Hook SessionStart: lo que se imprime aquí entra en el contexto de Claude al abrir la sesión.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT" || exit 0
echo "=== MEMORIA DEL PROYECTO (cargada automáticamente) ==="
echo "Lee CLAUDE.md y sigue «Al empezar cualquier sesión». Estado actual:"
echo
sed -n '1,60p' ESTADO_DEL_PROYECTO.md 2>/dev/null
echo
echo "--- Últimas entradas de HISTORIAL.md ---"
grep -E '^- ' HISTORIAL.md 2>/dev/null | tail -5
echo
if [ -d .git ]; then echo "Último commit: $(git log -1 --format='%h %s (%cr)' 2>/dev/null)"; fi
ult=$(ls -t backups/*.tar.gz 2>/dev/null | head -1); [ -n "$ult" ] && echo "Última copia de seguridad: $ult"
bash scripts/setup.sh --check >/dev/null 2>&1 || echo "AVISO: faltan herramientas → ejecuta: bash scripts/setup.sh"
exit 0
