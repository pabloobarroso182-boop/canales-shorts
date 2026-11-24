#!/bin/bash
# Copia los proyectos de /home/user al repositorio privado canales-shorts y lo sube a GitHub.
# Sin claves, sin vídeos/audios pesados y sin dependencias reinstalables (ver .gitignore).
set -e
R=/home/user/canales-shorts
cd /home/user
# Proyectos: TODAS las carpetas de /home/user, también las nuevas (propietario, 20/11),
# menos herramientas, copias y el proyecto de Instagram (pausado y ya comprimido en archivo/).
NO_GUARDAR=" tools archivo copias canales-shorts Instagram_Suspense lost+found "
PROYECTOS="INSTRUCCIONES_SHORTS.md"
for d in */; do d=${d%/}; case "$NO_GUARDAR" in *" $d "*) continue;; esac; PROYECTOS="$PROYECTOS $d"; done
tar -cf - --exclude=node_modules --exclude=work --exclude=secrets --exclude=.git --exclude=backups \
  --exclude='*.wav' --exclude='*.mov' --exclude='*.mp4' --exclude=__pycache__ --exclude='*.pyc' --exclude=.venv --exclude='*-venv' \
  $PROYECTOS | tar -xf - -C "$R"
# Vídeos de referencia de la animación de cada canal: SÍ se guardan (excepción a *.mp4)
find $PROYECTOS -path "*/referencia-animacion/*" -type f -not -path "*/node_modules/*" 2>/dev/null | tar -cf - -T - | tar -xf - -C "$R"
# Skills instaladas en el usuario (~/.claude/skills) y proyecto my-hyperframes
for d in hyperframes hyperframes-cli hyperframes-registry media-use reverse-any-video style-sampling fish-audio-sdk fish-audio-api fish-audio-agents; do [ -d /root/.claude/skills/$d ] && mkdir -p "$R/skills-usuario" && cp -r /root/.claude/skills/$d "$R/skills-usuario/"; done
mkdir -p "$R/claude-usuario" && cp /root/.claude/CLAUDE.md "$R/claude-usuario/CLAUDE.md" 2>/dev/null || true
cp /root/.claude/settings.json "$R/claude-usuario/settings.json" 2>/dev/null || true
cp tools/voz_qwen.py tools/qwen3_tts.py tools/similitud_voz.py "$R/tools/" 2>/dev/null || true
cd "$R"
if grep -rIlqE "sk_[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|AIza[0-9A-Za-z_-]{30,}|\"client_secret\" *: *\"[A-Za-z0-9_-]{10,}" . --exclude-dir=.git; then
  echo "✗ posible clave detectada: no se sube nada"; exit 1
fi
git add -A
# output/ está excluido por el .gitignore del proyecto: se añade igualmente, sin vídeos ni audios
git ls-files -o -i --exclude-standard | grep "/referencia-animacion/" | xargs -r git add -f
git ls-files -o -i --exclude-standard -- "*/output/*" | grep -vE "\.(mp4|wav|mov)$" | xargs -r git add -f
if git diff --cached --quiet; then echo "✓ sin cambios"; exit 0; fi
git -c user.name="Claude" -c user.email="noreply@anthropic.com" commit -q -m "Copia automática $(TZ=Europe/Madrid date '+%d/%m/%Y %H:%M')"
for i in 1 2 3 4; do git -c push.negotiate=true push -q origin main && { git update-ref refs/remotes/origin/main HEAD; echo "✓ subido a GitHub"; exit 0; }; sleep $((2**i)); done
echo "✗ no se pudo subir"; exit 1
