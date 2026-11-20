# Instrucciones de los Shorts · 4 canales de YouTube

Documento único con todo lo que ha decidido el propietario hasta el 19/11/2026 (hora de Madrid). Si empiezas una conversación nueva, pégalo o adjúntalo.

> **Para empezar una conversación nueva** (GitHub ya conectado), no hace falta seleccionar nada ni subir archivos. Escribe solo:
> «Añade el repositorio pabloobarroso182-boop/canales-shorts, recupera mis proyectos de Shorts y sigue al pie de la letra INSTRUCCIONES_SHORTS.md (sección 8). Vuelve a crear la tarea diaria de las 18:00 y dime qué falta.»
> Si GitHub fallara, adjunta en su lugar la copia ZIP (`canales-shorts-TODO-…zip`).

## 1. Los canales

| Canal | @ | Temática | Animación |
|---|---|---|---|
| **Datos Curiosos** | @datoscuriososs.1 | Curiosidades verificadas de todo tipo | «Divulga» (modelo: Short de Bertha Benz). **Se deja tal cual.** |
| **Ahora Lo Entiendes** | @ahoraloentiendes (pendiente de comprobar) | Explicativos: cómo funciona y por qué es así | Se elige en su primera producción (ver 5) |
| **Escenario Imposible** | @escenarioimposible (pendiente) | «¿Qué pasaría si…?» | Se elige en su primera producción |
| **Tu Cerebro Te Engaña** | @tucerebroteengana (pendiente) | Psicología y dinero del día a día | Se elige en su primera producción |

La marca de cada canal (perfil 800×800 y banners de 2560×1440 y de 4096×2304 para el móvil) está en `canales-nuevos/marca/` y en `curiosidades-canal/brand/`.

## 2. Producción diaria
- **4 Shorts al día por canal** (Datos Curiosos: antes 6 y, al principio, 3).
- **Cada día a las 18:00 (hora de Madrid)** se preparan los Shorts del día siguiente, sin que el propietario lo pida.
- **SIEMPRE antes de crear los Shorts**, se revisa con **vidIQ** el nicho de cada canal y se hacen **los 4 mejores** según lo que esté funcionando: temas, ganchos, estructura y duración.
- **Inspirarse, nunca copiar:** ni guiones, ni frases, ni escenas, ni personajes, ni animaciones de otros.
- Cada dato se verifica con al menos 2 fuentes, una de ellas primaria o institucional. No se inventan datos ni tendencias.
- **Guion de 8 piezas:**
  1. gancho;
  2. introducción;
  3. primer cuerpo;
  4. primer bucle abierto;
  5. desarrollo;
  6. segundo bucle;
  7. revelación que resuelve los bucles;
  8. llamada a la acción.
- **Los bucles nunca se anuncian** («quédate hasta el final…»): la intriga sale del propio contenido.
- **Duración:** Datos Curiosos, 25–45 s. Los canales nuevos, según su nicho (en el estudio, los Shorts que más destacan duran 45–70 s).
- **Recomendación (estudio del 19/11):** subir los Shorts de forma escalonada, unas 2–3 h entre uno y otro, nunca todos a la vez.

- **MINIATURA OBLIGATORIA en todos los Shorts de los 4 canales** (propietario, 20/11/2026):
  - `miniatura.jpg`, de 1080×1920;
  - el fondo es el fotograma del gancho, donde se ve el protagonista;
  - arriba, el gancho en 3–7 letras grandes sobre una banda difuminada, con la palabra clave en el color de acento del canal;
  - abajo, la firma del @ del canal;
  - se genera sola en la producción (`pipeline/miniatura.py`), se revisa a ojo y se envía con cada MP4.
  - Datos Curiosos: amarillo #FFD23F. Los canales nuevos usan el acento de su marca.
- Cada Short lleva **título y, justo después, la etiqueta `#shorts`** (por ejemplo «Los VIKINGOS nunca llevaron cuernos 🪖❌ #shorts»), además de descripción y hashtags (`metadata.json`). Lo garantiza la producción (propietario, 20/11).

## 3. Voz (la misma en TODOS los Shorts de los 4 canales)
- **ElevenLabs, modelo `eleven_v4`, voz «datoscuriosin» `kQwUFpYQ184OVlnMEzlm`**, idioma `es` (español de España), estabilidad **0,5** y similitud **0,85**.
- No se cambia ni se «mejora». No se usan otras voces: ni de catálogo, ni diseñadas, ni el clon de Qwen3-TTS.
- Si los caracteres no llegan, se hacen los Shorts que se puedan con esta voz y se avisa al propietario. Nunca se compra nada.

## 4. Entonación y audio
- Primera frase: una pregunta o una afirmación imposible, de 8 a 12 palabras, que arranca alta (al menos +5 semitonos).
- Patrón **«preparación, + dato.»**: la coma sube y el punto cae.
- Golpes de 1 o 2 palabras («No.», «Pista:»).
- Frases de 5 a 14 palabras. Final con un dato rotundo o una pregunta directa.
- Etiquetas de Eleven v4: 3 o 4 como máximo, nunca dos seguidas.
  - `[curious]` en el gancho;
  - `[dramatically]` o `[serious]` antes de la revelación;
  - `[excited]` en el dato más sorprendente;
  - `[warmly]` en la pregunta final;
  - `[pause]` solo antes del golpe principal.
- **Control de calidad de cada narración:**
  - Whisper reconoce al menos el 95 % del guion y no se lee ninguna etiqueta;
  - 150–185 palabras por minuto;
  - variación de tono de 3,8 semitonos o más;
  - pausas de 0,3–0,5 s y ningún silencio de más de 0,8 s;
  - −14 LUFS y pico de −1 dB como máximo.
- **No se estira el audio**, porque produce eco.
- **SIN MÚSICA DE FONDO.** Solo la voz y efectos de sonido (whoosh, pop, ding…) de bibliotecas libres, que bajan solos cuando habla la voz.

## 5. Animación
- **Datos Curiosos:** la animación «divulga», tal cual. No se cambia. Vídeo de referencia guardado en `curiosidades-canal/docs/referencia-animacion/` (el modelo de Bertha Benz y la versión actual).
- **Canales nuevos:** cada uno tiene **su propio estilo**, distinto de los demás.
  - En su **primera producción**, al investigar el nicho con vidIQ, se elige la animación **más atractiva y que más engancha**, inspirada en el nicho y nunca copiada, con personajes y colores propios.
  - **Desde entonces es SIEMPRE la misma en ese canal.** Queda guardada en su código (`video/src/`) y en su `docs/estilo-animacion.md`, y se sube a GitHub en el momento, como la de Datos Curiosos. Además, del primer Short de cada canal se guarda un **vídeo de referencia** con fotogramas en `docs/referencia-animacion/`, también en GitHub.
- Comunes a los 4 canales:
  - subtítulos palabra a palabra;
  - movimiento constante (un plano o zoom nuevo cada 2–3 s);
  - solo una **firma pequeña con el @**, sin marca de agua grande.

## 6. Límites y permisos
- **No publicar en YouTube sin autorización expresa** del propietario.
- **No comprar ni gastar sin permiso:** ni créditos, ni planes, ni suscripciones.
- **Conectores para los Shorts: SOLO ElevenLabs (la voz) y vidIQ (investigar el nicho)** (propietario, 20/11). vidIQ nunca se usa para generar, subir ni publicar. La búsqueda web se sigue usando para verificar datos (no es un conector). GitHub solo guarda las copias.
- No usar Higgsfield ni Nexlev.
- Las contraseñas y claves nunca van en archivos ni en el chat.
- No borrar materiales sin permiso.
- Los vídeos de cada día se envían al propietario con un informe: temas y por qué, fuentes, control de calidad y créditos gastados y restantes.

## 7. Presupuesto previsto (si se contratan ElevenLabs Pro y vidIQ Boost)
- **ElevenLabs Pro (600.000 créditos al mes):** 4 Shorts × 4 canales son unos 384.000 al mes. Lo que sobra pasa al mes siguiente.
- **vidIQ Boost (2.000 créditos al mes):** unos 15 al día por canal, entre la búsqueda de los Shorts que más destacan (5) y el análisis de un vídeo (10). Unos 1.800 al mes.
- **Sin esos planes:** el plan Starter de ElevenLabs (40.000 al mes) no llega ni para Datos Curiosos solo.

## 7b. Herramientas que se usan

**Producción (instaladas en el servidor):**

| Herramienta | Para qué | Cómo se instala |
|---|---|---|
| **Remotion** 4.0.545 + Chromium | Animación y render de los Shorts (React → MP4, 1080×1920, 30 fps) | `scripts/setup.sh` de cada proyecto (`npm ci`). Chromium ya viene en el servidor |
| **FFmpeg** | Mezcla de voz y efectos, −14 LUFS, cortes en silencios, comprobaciones | Ya viene en el servidor |
| **Whisper** (whisper.cpp, modelo small) | Transcribir la narración, sincronizar subtítulos y control de calidad (≥ 95 %) | Script de inicio del entorno |
| **Earshot** (MIT) | Efectos de sonido generados por código (whoosh, pop, ding, golpe…) | Script de inicio del entorno |
| **Playwright / Chromium** | Logos, fotos de perfil y banners (HTML → PNG) | Ya viene en el servidor |
| Blender, Inkscape, Synfig, Manim | Animación (instaladas a petición del propietario; opcionales) | Script de inicio del entorno |
| Python (numpy, soundfile, librosa, google-api…) | Pipeline, análisis de audio y API de YouTube | Script de inicio del entorno |
| Kokoro | Voz de emergencia. **Solo con permiso del propietario** | Script de inicio del entorno |
| Qwen3-TTS | Pruebas de clonación. **No se usa** | No se instala |

**Servicios y conectores (en tu cuenta; no se pierden con el servidor). Para los Shorts, SOLO ElevenLabs y vidIQ:**

| Servicio | Para qué | Notas |
|---|---|---|
| **ElevenLabs** (`eleven_v4`, voz «datoscuriosin») | La voz de todos los Shorts | La clave está guardada como secreto del entorno |
| **vidIQ** | Investigar el nicho cada día (outliers, transcripciones, análisis de vídeo) | Solo para investigar |
| Búsqueda web | Verificar datos con fuentes primarias | — |
| **No se usan para los Shorts:** ScrapeIO, Returbe, TubeLab, OutlierKit, Higgsfield, Nexlev ni ningún otro conector | Decisión del propietario (20/11): para los Shorts, **solo ElevenLabs y vidIQ** | ScrapeIO, Returbe y TubeLab se usaron solo en el estudio de mercado del 19/11 |
| Pendientes de conectar | API de YouTube (Google Cloud) y GitHub | Ver la sección 9 |

## 8. Si se cierra la conversación (cómo seguir en una nueva)
El servidor es temporal: si la conversación se cierra o pasa tiempo sin uso, se borra con todo lo que tiene (proyectos, Shorts y herramientas).

**Lo que hay que enviar en la conversación nueva:**
1. Este documento (`INSTRUCCIONES_SHORTS.md`).
2. `copia-1-proyectos-sin-video.zip`: proyectos, guiones, marcas, instrucciones y estudios. Con esto basta para seguir.
3. `copia-2-videos-y-audios.zip`, solo si hay que recuperar Shorts ya hechos.
- Las copias tienen que ser **recientes**. Si hay cambios, hay que pedir una copia nueva antes de cerrar.

**Lo que hace Claude en la conversación nueva:**
- Descomprimir y seguir `curiosidades-canal/RECUPERACION.md`.
- Las herramientas ya vienen instaladas por el script de inicio del entorno. Solo falta `bash curiosidades-canal/scripts/setup.sh` para las dependencias de Remotion del proyecto (unos minutos). Qwen3-TTS no se instala porque no se usa.
- **Volver a crear la tarea diaria de las 18:00** (Europe/Madrid), porque está ligada a la conversación anterior y no pasa sola a la nueva. El nombre, el horario y el mensaje exacto están en `curiosidades-canal/docs/tarea-diaria-18h.md`: hay que copiarlos tal cual.

**Lo que NO se pierde, porque está en la cuenta y no en el servidor:**
- la clave de ElevenLabs (guardada como secreto del entorno);
- los permisos de red;
- los conectores (vidIQ, ScrapeIO, Returbe…).

**Para no depender de copias manuales (recomendado):**
- **GitHub: YA CONECTADO (20/11/2026).** Repositorio privado `pabloobarroso182-boop/canales-shorts`. La tarea diaria de las 18:00 guarda la copia al terminar (`tools/guardar_en_github.sh`), y además se guarda **automáticamente al final de cada respuesta de Claude** (hook en `~/.claude/settings.json`): cualquier modificación queda en GitHub sin pedirlo. **También los proyectos nuevos:** cualquier carpeta nueva dentro de `/home/user/` se guarda automáticamente. Solo quedan fuera `tools/`, `archivo/`, `copias/` y el proyecto pausado de Instagram, que ya está comprimido. Sin claves, sin vídeos MP4 ni audios WAV y sin dependencias reinstalables.
  - Para recuperarlo en un servidor nuevo: clonar el repositorio y copiar TODAS sus carpetas de proyecto a `/home/user/` (`curiosidades-canal`, `canal2-shorts`, `canales-nuevos`, `estudio-mercado-shorts`, `my-hyperframes`, `my-video`, cualquier proyecto nuevo e `INSTRUCCIONES_SHORTS.md`; no `skills-usuario/`, `claude-usuario/` ni `tools/`, que van a su sitio), y después `bash curiosidades-canal/scripts/setup.sh`. Copia `claude-usuario/settings.json` a `~/.claude/settings.json` (guardado automático en GitHub al final de cada respuesta). Si falta `~/.claude/CLAUDE.md` (regla: responder siempre en español), cópialo desde `claude-usuario/CLAUDE.md`. Copia también las skills: `cp -r skills-usuario/* ~/.claude/skills/` (HyperFrames, media-use, reverse-any-video, style-sampling) y la carpeta `my-hyperframes` a `/home/user/`. Después, vuelve a crear el enlace `canal2-shorts/video/node_modules → /home/user/curiosidades-canal/video/node_modules` (los proyectos de los canales nuevos usan las mismas librerías de Remotion que Datos Curiosos).
- **Script de inicio del entorno: YA CONFIGURADO (20/11/2026).** Cada servidor nuevo instala solo Whisper (y su modelo), Earshot, PyTorch, Kokoro, las librerías de Python, Blender, Inkscape, Synfig y Manim. Las dependencias de Remotion de cada proyecto se instalan al recuperarlo, con `scripts/setup.sh`.
- Con los dos configurados, en cualquier conversación nueva todo estaría listo desde el principio.

## 9. Pendiente
- Crear los 3 canales nuevos en YouTube y comprobar sus @.
- Conectar YouTube: proyecto de Google Cloud y el `.json` de la credencial (guía en `curiosidades-canal/docs/conexion-youtube.md`).
- Montar los sistemas de producción y las tareas de las 18:00 de los 3 canales nuevos.
