#!/bin/bash
# Copia los proyectos de /home/user al repositorio privado canales-shorts y lo sube a GitHub.
# Sin claves, sin vídeos/audios pesados y sin dependencias reinstalables (ver .gitignore).
set -e
R=/home/user/canales-shorts
cd /home/user
tar -cf - --exclude=node_modules --exclude=work --exclude=secrets --exclude=.git --exclude=backups \
  --exclude='*.wav' --exclude='*.mov' --exclude='*.mp4' --exclude=__pycache__ --exclude='*.pyc' \
  INSTRUCCIONES_SHORTS.md curiosidades-canal canal2-shorts canales-nuevos estudio-mercado-shorts \
  | tar -xf - -C "$R"
# Vídeos de referencia de la animación de cada canal: SÍ se guardan (excepción a *.mp4)
find curiosidades-canal canal2-shorts canales-nuevos -path "*/referencia-animacion/*" -type f -not -path "*/node_modules/*" 2>/dev/null | tar -cf - -T - | tar -xf - -C "$R"
# Skills instaladas en el usuario (~/.claude/skills) y proyecto my-hyperframes
for d in hyperframes hyperframes-cli hyperframes-registry media-use reverse-any-video style-sampling; do [ -d /root/.claude/skills/$d ] && mkdir -p "$R/skills-usuario" && cp -r /root/.claude/skills/$d "$R/skills-usuario/"; done
[ -d my-hyperframes ] && tar -cf - --exclude=node_modules my-hyperframes | tar -xf - -C "$R"
cp tools/voz_qwen.py tools/qwen3_tts.py tools/similitud_voz.py "$R/tools/" 2>/dev/null || true
cd "$R"
if grep -rIlqE "sk_[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|AIza[0-9A-Za-z_-]{30,}|\"client_secret\" *: *\"[A-Za-z0-9_-]{10,}" . --exclude-dir=.git; then
  echo "✗ posible clave detectada: no se sube nada"; exit 1
fi
git add -A
# output/ está excluido por el .gitignore del proyecto: se añade igualmente, sin vídeos ni audios
git ls-files -o -i --exclude-standard | grep "/referencia-animacion/" | xargs -r git add -f
git ls-files -o -i --exclude-standard curiosidades-canal/output | grep -vE "\.(mp4|wav|mov)$" | xargs -r git add -f
if git diff --cached --quiet; then echo "✓ sin cambios"; exit 0; fi
git -c user.name="Claude" -c user.email="noreply@anthropic.com" commit -q -m "Copia automática $(TZ=Europe/Madrid date '+%d/%m/%Y %H:%M')"
for i in 1 2 3 4; do git -c push.negotiate=true push -q origin main && { echo "✓ subido a GitHub"; exit 0; }; sleep $((2**i)); done
echo "✗ no se pudo subir"; exit 1
