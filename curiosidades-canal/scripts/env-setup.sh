#!/usr/bin/env bash
# Script de arranque del entorno en la nube (herramientas, sin depender del repositorio).
set -e
T="$HOME/tools"; K="$HOME/.cache/hyperframes/tts"; mkdir -p "$T" "$K/models" "$K/voices" "$HOME/.local/bin"
if [ ! -x "$T/whisper.cpp/build/bin/whisper-cli" ]; then
  git clone --depth 1 https://github.com/ggml-org/whisper.cpp "$T/whisper.cpp"
  cmake -S "$T/whisper.cpp" -B "$T/whisper.cpp/build" -DCMAKE_BUILD_TYPE=Release >/dev/null
  cmake --build "$T/whisper.cpp/build" -j"$(nproc)" --target whisper-cli >/dev/null
fi
ln -sf "$T/whisper.cpp/build/bin/whisper-cli" "$HOME/.local/bin/whisper-cli"
M="$T/whisper.cpp/models/ggml-small.bin"
[ -s "$M" ] || curl -fsSL --retry 3 -o "$M" https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin
R=https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0
[ -s "$K/models/kokoro-v1.0.onnx" ] || curl -fsSL --retry 3 -o "$K/models/kokoro-v1.0.onnx" "$R/kokoro-v1.0.onnx"
[ -s "$K/voices/voices-v1.0.bin" ] || curl -fsSL --retry 3 -o "$K/voices/voices-v1.0.bin" "$R/voices-v1.0.bin"
pip3 install -q kokoro-onnx soundfile numpy num2words google-api-python-client google-auth-oauthlib google-auth-httplib2
if [ -d curiosidades-canal/video ]; then (cd curiosidades-canal/video && npm ci --no-audit --no-fund); fi
echo "entorno listo"
