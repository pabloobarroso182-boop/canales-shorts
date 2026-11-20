# Datos Curiosos · @datoscuriososs.1 (proyecto «Curiosidades de Todo Tipo»)

Responde siempre en español, incluido el razonamiento visible y los mensajes de commit.

## Al empezar cualquier sesión (obligatorio)

1. Lee, en este orden: `ESTADO_DEL_PROYECTO.md` (dónde estamos y siguiente paso) → `MEMORIA_COMPLETA.md` (todo lo decidido) → las últimas entradas de `HISTORIAL.md`.
2. Comprueba las herramientas: `bash scripts/setup.sh --check`. Si falta algo, `bash scripts/setup.sh`. Si el proyecto viene de una copia, sigue antes `RECUPERACION.md`.
3. Resume al propietario en 3–5 líneas el estado y las **tareas pendientes**, y pregúntale si continúas con el siguiente paso de `ESTADO_DEL_PROYECTO.md`.
4. No des nada por hecho que no figure en estos archivos o en git. Si algo no cuadra, compruébalo en los archivos antes de afirmarlo.

## Mantener la memoria (cada vez que haya un avance o una decisión)

- Añade una entrada al final de `HISTORIAL.md`: fecha, hora de Madrid, qué se hizo, qué se decidió y quién lo decidió. **Nunca borres ni reescribas entradas anteriores.**
- Actualiza `ESTADO_DEL_PROYECTO.md`: situación, tareas pendientes y siguiente paso. Una tarea solo pasa a «hecha» si está terminada **y comprobada**.
- Si cambia una decisión, una preferencia, una herramienta o un horario, actualiza `MEMORIA_COMPLETA.md`, `CONFIGURACION.md` o `AUTOMATIZACIONES.md`. Deja constancia de lo anterior: «antes X, ahora Y (fecha)».
- Después, `bash scripts/backup.sh` (commit + copia completa). El hook de fin de turno ya hace el commit automático, pero la copia completa conviene lanzarla tras cada hito.
- **No elimines archivos ni materiales** (vídeos, audios, guiones, diseños) sin autorización expresa del propietario. Para descartar algo, muévelo a `archivo/` y anótalo en `HISTORIAL.md`.
- **Nunca guardes contraseñas, tokens ni claves** en archivos de texto, documentos o git. `secrets/` está excluido de git y de las copias.

## Frase de activación

Si el usuario escribe **«Me voy a dormir, prepárame el trabajo de mañana»** (o algo equivalente), ejecuta **inmediatamente** la skill `produccion-nocturna`. Es el mismo flujo que la tarea programada diaria de las 18:00 (Europe/Madrid; antes 19:00 y, al principio, 23:00).

## Reglas del canal (decididas por el propietario)

- Nunca publicar en YouTube sin autorización expresa (`config/publicacion.json` → `publicacion_automatica: false`).
- No hacer gastos externos: ni comprar créditos ni superar el plan.
- **No usar conectores (MCP) para generar ni investigar contenido** (ni Higgsfield ni Nexlev). **Excepciones autorizadas por el propietario (19/11):** ElevenLabs para la voz (Eleven v4) y **vidIQ solo para investigar el nicho** (como mucho 5 créditos por noche; nunca para generar, subir ni publicar). Para todo lo demás, solo Remotion, HyperFrames, FFmpeg, Whisper y la búsqueda web. **Confirmado por el propietario el 20/11: los únicos conectores para los Shorts son ElevenLabs y vidIQ** (ScrapeIO, Returbe y TubeLab solo se usaron en el estudio de mercado; no se usan para producir).
- **Temas** (propietario, 19/11): manda el nicho. Cada día, **4 Shorts** (antes 6 y, al principio, 3; propietario, 19/11 noche: «4 por cada canal») con los 4 temas que **mejor estén funcionando** en los Shorts de curiosidades y que mejor encajen, con variedad. Ejemplos, no obligatorios: cuerpo humano, aviones, trenes, coches, animales, finanzas… (`produccion-nocturna`, paso 2).
- **Estructura de guion** (propietario, 19/11): **manda lo que funciona en el nicho**. Se analizan los Shorts más virales y se toma inspiración de ellos, sin copiarlos. Base de 8 piezas (`docs/estructura-guion.md`): gancho → introducción → primer cuerpo → primer bucle abierto → desarrollo intermedio → segundo bucle → último cuerpo (revelación que resuelve los bucles) → llamada a la acción. **Los bucles nunca se anuncian** con frases sobre el propio vídeo: la intriga sale del contenido (pista a medias, pregunta que se tumba…).
- No inventar tendencias ni datos: cada dato con al menos 2 fuentes, una de ellas primaria o institucional.
- Originalidad: inspirarse en técnicas generales, nunca copiar vídeos, audios, guiones ni animaciones de otros (`docs/inspiracion.md`, `pipeline/originality.py`).
- Sin música de fondo. Solo voz y efectos.
- **Sin marca de agua grande de «Datos Curiosos» en los vídeos** (decisión del propietario, 19/11). Solo una **firma discreta «@datoscuriososs.1»** (pequeña, semitransparente, arriba a la izquierda; `HANDLE` y `firmaStyle` en `video/src/short/types.ts`), elegida por Claude porque el propietario dijo «lo que tú creas que es mejor». No vuelvas a poner la etiqueta grande con el logo.
- **UNA SOLA ANIMACIÓN para todo el canal** (propietario, 19/11). Es fija y todos los Shorts la llevan igual: **`docs/estilo-animacion.md`** (vigente: la del Short de Bertha Benz). **Claude no la cambia por su cuenta.** Si en el nicho ve algo claramente más atractivo, lo propone en el informe con una muestra (inspirado, nunca copiado) y solo cambia si el propietario lo aprueba. Otras herramientas (Three.js, Manim, HyperFrames…) solo si el resultado es idéntico a la animación vigente.
- **Voz oficial (aprobada por el propietario el 19/11, prueba 1):** ElevenLabs **Eleven v4**, voz **«datoscuriosin» `kQwUFpYQ184OVlnMEzlm`**, idioma `es`, estabilidad 0,5 y similitud 0,85. Muestra de referencia: `assets/voz/estandar-v4/prueba-1-apolo12.mp3`. Reglas de guion, etiquetas y control de calidad en `docs/voz-narracion.md`. Misma voz y configuración en **todos** los Shorts. No estires el audio, porque produce eco. **No la cambies ni la «mejores» por tu cuenta.** Antes: voces de catálogo de prueba y em_alex (Kokoro), descartadas.

## Mapa rápido

- Memoria: `ESTADO_DEL_PROYECTO.md` · `MEMORIA_COMPLETA.md` · `HISTORIAL.md` · `CONFIGURACION.md` · `AUTOMATIZACIONES.md` · `INVESTIGACION.md` · `RECUPERACION.md`
- Producción: `pipeline/make_short.py` · `pipeline/nocturno.py` · `pipeline/qa.py` · `pipeline/originality.py`
- YouTube: `pipeline/youtube/` (auth, verificar, configurar_canal, upload, stats)
- Copias: `scripts/backup.sh` · `scripts/restaurar.sh` · `scripts/verificar_backup.sh`
- Materiales: `PRODUCCION/AAAA-MM-DD/` · `brand/` · `assets/` · `content/` · `output/` · `docs/`

## Copia en GitHub (propietario, 20/11/2026)
- Después de cada producción y de **cada cambio importante** (Shorts nuevos, reglas, marcas, guiones), ejecuta `bash /home/user/canales-shorts/tools/guardar_en_github.sh` (repositorio privado pabloobarroso182-boop/canales-shorts). No esperes a que lo pida el propietario.
- Si el servidor es nuevo y la carpeta `/home/user/canales-shorts` no existe, clona antes el repositorio.
- **Vídeo de referencia de la animación** (propietario, 20/11): `docs/referencia-animacion/` contiene el modelo de Bertha Benz y la versión actual (ornitorrinco, 20/11), con fotogramas. Está en GitHub. Los Shorts nuevos deben verse como `version-actual-ornitorrinco.mp4`.
