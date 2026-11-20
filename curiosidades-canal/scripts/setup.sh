#!/usr/bin/env bash
# Instala (o comprueba con --check) todo lo que necesita la producción de Shorts.
# Idempotente: si algo ya está, no lo vuelve a descargar.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TOOLS="${TOOLS_DIR:-$HOME/tools}"
WCPP="$TOOLS/whisper.cpp"
MODEL="$WCPP/models/ggml-small.bin"
KDIR="$HOME/.cache/hyperframes/tts"
KREL="https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0"

check() {
  local ok=0
  for c in ffmpeg ffprobe node npx python3; do command -v "$c" >/dev/null || { echo "✗ falta $c"; ok=1; }; done
  { command -v whisper-cli >/dev/null || [ -x "$WCPP/build/bin/whisper-cli" ]; } || { echo "✗ falta whisper-cli"; ok=1; }
  [ -s "$MODEL" ] || [ -s "/home/user/tools/whisper.cpp/models/ggml-small.bin" ] || { echo "✗ falta el modelo de Whisper (small)"; ok=1; }
  [ -s "$KDIR/models/kokoro-v1.0.onnx" ] && [ -s "$KDIR/voices/voices-v1.0.bin" ] || { echo "✗ faltan los modelos de Kokoro"; ok=1; }
  python3 -c "import kokoro_onnx, soundfile, numpy, num2words, googleapiclient, google_auth_oauthlib" 2>/dev/null || { echo "✗ faltan paquetes de Python"; ok=1; }
  [ -d "$ROOT/video/node_modules/remotion" ] || { echo "✗ faltan dependencias de Remotion (npm ci)"; ok=1; }
  [ -d "$ROOT/video/node_modules/@remotion/three" ] && [ -d "$ROOT/video/node_modules/gsap" ] || { echo "✗ faltan complementos de animación de Remotion (npm ci)"; ok=1; }
  for c in blender inkscape synfig manim; do command -v "$c" >/dev/null || { echo "✗ falta $c (animación)"; ok=1; }; done
  [ $ok -eq 0 ] && echo "✓ todo listo"
  return $ok
}

if [ "${1:-}" = "--check" ]; then check; exit $?; fi

mkdir -p "$TOOLS" "$KDIR/models" "$KDIR/voices" "$HOME/.local/bin"

if ! command -v whisper-cli >/dev/null && [ ! -x "$WCPP/build/bin/whisper-cli" ]; then
  echo "· compilando whisper.cpp"
  [ -d "$WCPP" ] || git clone --depth 1 https://github.com/ggml-org/whisper.cpp "$WCPP"
  cmake -S "$WCPP" -B "$WCPP/build" -DCMAKE_BUILD_TYPE=Release >/dev/null
  cmake --build "$WCPP/build" -j"$(nproc)" --config Release --target whisper-cli >/dev/null
fi
[ -x "$WCPP/build/bin/whisper-cli" ] && ln -sf "$WCPP/build/bin/whisper-cli" "$HOME/.local/bin/whisper-cli"

if [ ! -s "$MODEL" ] && [ ! -s "/home/user/tools/whisper.cpp/models/ggml-small.bin" ]; then
  echo "· descargando el modelo de Whisper small (multilingüe)"
  mkdir -p "$(dirname "$MODEL")"
  curl -fL --retry 3 -sS -o "$MODEL.part" https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin
  echo "55356645c2b361a969dfd0ef2c5a50d530afd8d5  $MODEL.part" | sha1sum -c - >/dev/null && mv "$MODEL.part" "$MODEL"
fi

[ -s "$KDIR/models/kokoro-v1.0.onnx" ] || { echo "· descargando Kokoro"; curl -fL --retry 3 -sS -o "$KDIR/models/kokoro-v1.0.onnx" "$KREL/kokoro-v1.0.onnx"; }
[ -s "$KDIR/voices/voices-v1.0.bin" ] || curl -fL --retry 3 -sS -o "$KDIR/voices/voices-v1.0.bin" "$KREL/voices-v1.0.bin"

python3 -c "import kokoro_onnx, soundfile, numpy, num2words, googleapiclient, google_auth_oauthlib" 2>/dev/null || \
  pip3 install -q kokoro-onnx soundfile numpy num2words google-api-python-client google-auth-oauthlib google-auth-httplib2

{ [ -d "$ROOT/video/node_modules/remotion" ] && [ -d "$ROOT/video/node_modules/@remotion/three" ]; } || (cd "$ROOT/video" && npm ci --no-audit --no-fund)

# Herramientas de animación (instaladas el 19/11 a petición del propietario)
if ! command -v blender >/dev/null || ! command -v inkscape >/dev/null || ! command -v synfig >/dev/null; then
  echo "· instalando Blender, Inkscape y Synfig"
  apt-get update -qq && DEBIAN_FRONTEND=noninteractive apt-get install -y -qq --no-install-recommends blender inkscape synfig \
    libcairo2-dev libpango1.0-dev pkg-config python3-dev >/dev/null
fi
command -v manim >/dev/null || pip3 install -q --break-system-packages manim

check
