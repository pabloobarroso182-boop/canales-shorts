# Configuración: herramientas e integraciones

**Aquí no se guardan secretos.** Contraseñas, tokens y claves nunca van en texto plano: la autorización de YouTube vive en `secrets/token.json`, que no entra en git ni en las copias.

## Herramientas (lo que pidió instalar el propietario)

| Herramienta | Versión | Dónde | Uso |
|---|---|---|---|
| Remotion | 4.0.545 | `video/` (`npm ci`) | Montaje y render de los Shorts (composición `Short`) |
| HyperFrames | 0.9.67 | `npm i -g hyperframes@0.9.67` | Disponible; su motor de voz local (Kokoro) es el que usa el canal |
| FFmpeg | 6.1.1 | sistema | Voz, efectos, mezcla, normalización, comprobaciones |
| whisper.cpp | compilado del repositorio oficial | `~/tools/whisper.cpp` (+ `~/.local/bin/whisper-cli`) | Subtítulos y control de calidad |
| Modelos de Whisper | `ggml-small.bin` (multilingüe), `ggml-small.en.bin` | `~/tools/whisper.cpp/models/` | `small` para español |
| Kokoro (voz local) | `kokoro-onnx`, modelo v1.0 | `~/.cache/hyperframes/tts/` | Ya **no** es la voz del canal (desde el 19/11); solo pruebas internas con `TTS_PROVIDER=kokoro` |
| **Animación (instalado el 19/11)** | | | |
| Remotion: complementos | `@remotion/three` (3D con Three.js), `@remotion/lottie`, `@remotion/paths`, `@remotion/noise`, `@remotion/motion-blur`, `@remotion/animation-utils`, `@remotion/layout-utils`, `@remotion/shapes`, `@remotion/transitions` (4.0.545) · `three` 0.180 · `@react-three/fiber` 9.3 · `lottie-web` 5.13 · `gsap` 3.13 | `video/node_modules` | Escenas del canal. El 3D usa `Config.setChromiumOpenGlRenderer("angle")` (en `remotion.config.ts`). Prueba: `src/pruebas/` |
| Blender | 4.0.2 (apt) | `/usr/bin/blender` | 3D realista en modo sin pantalla (`blender -b -P script.py`); renderiza con Cycles en CPU |
| Manim | 0.22.1 (pip) | `/usr/local/bin/manim` | Animaciones de ciencia y matemáticas (fórmulas, gráficas, geometría) |
| Inkscape | 1.2.2 (apt) | `/usr/bin/inkscape` | Dibujo vectorial (SVG) y exportación a PNG |
| Synfig | apt | `/usr/bin/synfig` | Animación 2D vectorial por fotogramas clave (`.sif` → PNG o vídeo) |
| ElevenLabs API | Eleven v4 | clave en los secretos de red del entorno (`api.elevenlabs.io`, cabecera `xi-api-key`), nunca en archivos | **Voz oficial del canal** (desde el 19/11) |

Todo se reinstala con `bash scripts/setup.sh` y se comprueba con `bash scripts/setup.sh --check`.
Paquetes de Python: `kokoro-onnx soundfile numpy num2words google-api-python-client google-auth-oauthlib google-auth-httplib2`.

## Configuración del canal: `config/publicacion.json`

- `canal`: Datos Curiosos · `handle_deseado`: @datoscuriososs.1 · `cuenta_google`: datoscuriososs790@gmail.com
- `publicacion_automatica`: **false** · `privacidad_por_defecto`: private
- `shorts_por_dia`: 3 · `horas_publicacion`: 13:30, 18:30 y 21:30 (Europe/Madrid)
- `estilo`: ilustrado · `musica`: false · `duracion_s`: 25–45
- `voz_estandar`: voz oficial ElevenLabs Eleven v4 + «datoscuriosin» (desde el 19/11; antes `voz.proveedor_preferido: local`)

## Voz: `config/voz_respaldo.json`

- **Desde el 19/11: voz oficial ElevenLabs Eleven v4 + «datoscuriosin» `kQwUFpYQ184OVlnMEzlm`** (aprobada por el propietario; `config/publicacion.json` → `voz_estandar`, `docs/voz-narracion.md`). Toda la narración de un Short se genera en una sola petición; sin voz de respaldo.
- Antes (18/11, ~23:50): em_alex (candidata C), elegida por el propietario y ajustada a su muestra**: velocidad 1,0, tono +0,44 semitonos y ecualización de timbre (campo `ecualizacion`). Se rehace con `pipeline/voice_tune.py em_alex assets/voz/muestra-objetivo.wav "<texto>"`.
- Antes: mezcla 50 % em_alex + 50 % em_santa (candidata A), guardada en `config/voz_respaldo.anterior-*.json`.
- Configuración anterior guardada en `config/voz_respaldo.curiosidades281.json`: em_santa, −2,1 semitonos (candidata **B**).
- Candidatas de prueba: `assets/voz/candidatas/A…D.wav`. El propietario eligió la C (18/11).

## Integración con YouTube (API oficial)

- Scripts: `pipeline/youtube/`.
  - `auth.py`: OAuth 2.0 de escritorio, con PKCE y `login_hint`.
  - `verificar.py`: cuenta, canal, identificador, permisos y APIs.
  - `configurar_canal.py`: descripción, palabras clave, banner y marca de agua.
  - `upload.py`: subida, siempre en privado salvo autorización.
  - `stats.py`: estadísticas.
  - `check_handle.py`: comprobar el identificador.
- Permisos que se pedirán: `openid`, `userinfo.email`, `youtube.upload`, `youtube`, `yt-analytics.readonly`.
- Credenciales:
  - `secrets/client_secret.json`: lo descarga el propietario de Google Cloud;
  - `secrets/token.json`: se crea al autorizar.
  - **Ninguno de los dos se copia ni se sube a git.** En un entorno nuevo hay que repetir la autorización (unos 2 minutos).
- Estado: **no conectado todavía** (ver `ESTADO_DEL_PROYECTO.md`, tareas 5–7).
- Guía para el propietario: `docs/conexion-youtube.md`.

## Entorno en la nube (Claude Code en la web)

- Red permitida además de los registros de paquetes: `huggingface.co`, `cas-bridge.xethub.hf.co`, `cdn-lfs.hf.co`, `us.aws.cdn.hf.co`, `api.elevenlabs.io` y `api.us.elevenlabs.io`. Las dos últimas se añadieron para la voz de ElevenLabs, que hoy no se usa.
- Google (`*.googleapis.com`, `accounts.google.com`) y GitHub responden sin añadir nada.
- Script de arranque probado para entornos nuevos: `scripts/env-setup.sh` (unos 2 minutos). Todavía no se ha guardado en el entorno porque falta el repositorio.

## Servicios que NO se usan (decisión del propietario)

- Conectores Higgsfield, Nexlev y ElevenLabs (MCP), para generar o investigar contenido.
- La voz clonada «curiosidades281» en ElevenLabs: queda documentada, pero el plan solo tenía 105 caracteres libres hasta ~18/12.
