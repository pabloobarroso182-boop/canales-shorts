# Datos Curiosos (@datoscuriososs.1) — sistema de producción de Shorts

Sistema para producir y publicar Shorts verticales (1080x1920) de curiosidades verificadas.

```
content/shorts/*.json     guiones: escenas, voz, datos en pantalla, título, descripción, hashtags, fuentes
pipeline/make_short.py    guion -> voz -> Whisper -> mezcla FFmpeg -> render Remotion -> comprobación
pipeline/audio_assets.py  música y efectos originales (sustitutos provisionales)
pipeline/youtube/         auth.py · upload.py · stats.py · check_handle.py (API oficial de Google)
video/                    proyecto Remotion (composición "Short")
brand/                    logo, perfil, banner, marca de agua, hoja de identidad (fuente en brand/src)
config/publicacion.json   horarios, voz, y el interruptor "publicacion_automatica"
docs/estrategia.md        investigación del nicho, estrategia y descripción del canal
output/<id>/              <id>.mp4, portada.jpg, metadata.json, props.json
```

## Producir un Short

```bash
python3 pipeline/make_short.py content/shorts/001-venus.json
```

- **Voz:** siempre la voz oficial, ElevenLabs Eleven v4 + «datoscuriosin» (`docs/voz-narracion.md`). La clave la pone el entorno; si falta, el pipeline se para en vez de cambiar de voz.
- **Visuales:** si una escena tiene `"clip": "assets/clips/xxx.mp4"` (un clip de Higgsfield), se usa de fondo. Si no, se usa el fondo animado 3D de Remotion.
- **Subtítulos:** Whisper `small` en español da los tiempos de cada palabra y se alinean con el texto del guion, para que la ortografía sea siempre la del guion.
- **Audio:** la música baja automáticamente cuando habla la voz (ducking); se añaden whoosh, pop y ding, y todo se normaliza a −14 LUFS.

## Publicar en YouTube

```bash
python3 pipeline/youtube/auth.py                  # una vez, con la cuenta del canal
python3 pipeline/youtube/upload.py output/001-venus             # simulación
python3 pipeline/youtube/upload.py output/001-venus --confirmar  # sube en PRIVADO
python3 pipeline/youtube/stats.py --dias 28       # informe de rendimiento
```

Publicar en público o programar está **bloqueado** hasta que pongas `"publicacion_automatica": true` en `config/publicacion.json`.

## Herramientas necesarias

Node 22 · FFmpeg · whisper.cpp con el modelo `ggml-small.bin` · Python 3 con `kokoro-onnx soundfile numpy google-api-python-client google-auth-oauthlib` · `npm install` dentro de `video/`.
