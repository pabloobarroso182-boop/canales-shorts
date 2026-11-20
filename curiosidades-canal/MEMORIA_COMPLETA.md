# Memoria completa del proyecto

Conocimiento estable del proyecto: qué quiere el propietario, qué se ha decidido y por qué.
La situación del día está en `ESTADO_DEL_PROYECTO.md` y la cronología en `HISTORIAL.md`.

## 1. Objetivo del propietario

Un canal de YouTube Shorts de curiosidades de todo tipo, **casi automático**:

- **4 Shorts al día** (antes 6 y, al principio, 3; propietario, 19/11 noche: 4 por cada canal), preparados cada tarde a las 18:00 (hora de Madrid; antes 19:00 y 23:00) para el día siguiente.
- Publicación solo con su autorización. Más adelante quiere poder activar la publicación automática.
- Análisis periódico de estadísticas para mejorar.

## 2. Preferencias e instrucciones del propietario (vigentes)

| Tema | Preferencia | Desde |
|---|---|---|
| Idioma | Todo en español, también los commits | 18/11 |
| Nombre del canal | **Datos Curiosos** (antes «Curiosidades de Todo Tipo») | 18/11 |
| Identificador | **@datoscuriososs.1** (antes @curiosidadesdetodotipo.1). No cambiarlo sin consultar si no está libre | 18/11 |
| Cuenta de Google | **datoscuriososs790@gmail.com** (antes curiosidadesdetodotipoo1@gmail.com). Usar solo esta; nunca pedir la contraseña | 18/11 |
| Publicación | Nada publicado sin su autorización | 18/11 |
| Gastos | Ninguno sin su permiso | 18/11 |
| Conectores | **Ninguno** para generar o investigar contenido: solo Remotion, HyperFrames, FFmpeg, Whisper y la búsqueda web | 18/11 |
| Música | **Sin música de fondo**, solo voz y efectos | 18/11 |
| Voz | **Oficial y aprobada: ElevenLabs Eleven v4 + «datoscuriosin» `kQwUFpYQ184OVlnMEzlm`**, español, estabilidad 0,5 y similitud 0,85 (prueba 1, `assets/voz/estandar-v4/prueba-1-apolo12.mp3`; reglas en `docs/voz-narracion.md`). Antes: em_alex ajustada (18/11), descartada | 19/11 |
| Estilo | Ilustración plana narrativa, «similar a los Shorts de duocare-es» | 18/11 |
| Duración | 25–45 s, formato 1080x1920 | 18/11 |
| Contenido | Curiosidades verificadas con fuentes; guiones, ganchos y escenas originales; inspiración sin copiar | 18/11 |
| Activación manual | «Me voy a dormir, prepárame el trabajo de mañana» lanza la producción nocturna | 18/11 |
| Memoria | Memoria permanente y copias de seguridad; no borrar archivos sin autorización; no guardar secretos en texto plano | 18/11 |

## 3. Decisiones técnicas y su motivo

- **Producción 100 % local**: voz Kokoro, visuales Remotion, montaje FFmpeg, subtítulos whisper.cpp. Motivos:
  - ElevenLabs tenía solo 105 caracteres libres (hasta ~18/12) y Higgsfield 1,1 créditos;
  - después el propietario prohibió usar conectores.
- **Voz local parecida a la del propietario**:
  - Su voz clonada en ElevenLabs es «curiosidades281» (`NNgYp96c8FM1iI4HMawH`).
  - El 18/11 envió otra muestra generada por IA (`assets/voz/muestra-objetivo.wav`).
  - La búsqueda (`pipeline/voice_search.py`) eligió la mezcla 50 % em_alex + 50 % em_santa, a velocidad 1,0 y con +0,15 semitonos.
  - Tiene el mismo acento: distinción z/s de España (`pipeline/accent_check.py`). Kokoro no clona, así que solo es parecida.
- **Subtítulos**: Whisper da los tiempos y el texto se toma del guion (alineación con difflib), para que la ortografía sea siempre la correcta. En el estilo ilustrado, una palabra cada vez.
- **Efectos de sonido** (pop, whoosh, ding) que bajan solos cuando habla la voz (*ducking*), porque un «ding» tapaba palabras. Todo normalizado a −14 LUFS.
- **Estilo ilustrado**:
  - Kit propio en `video/src/ilustrado/`: personaje esbelto sin contorno; escenarios habitación, ciudad, espacio, sabana, sala de control, lanzamiento, Luna y plano; capas lupa, multitud, bocadillos, calendario, medidor, cifras y avestruz/nido.
  - La versión anterior de «tarjetas con orbe» se conserva como `estilo: "tarjetas"`.
- **Cifras vivas**: los números cuentan hasta su valor (inspirado en la técnica, no en un vídeo).
- **Control de calidad** (`pipeline/qa.py`):
  - formato, 30 fps, códecs, duración de 25–45 s, −16 a −12 LUFS, pico ≤ −1 dB;
  - sin silencios largos ni negros, voz entendible ≥ 85 % (Whisper);
  - título, descripción, hashtags y fuentes;
  - gancho ≤ 14 palabras y originalidad.
- **Originalidad** (`pipeline/originality.py`): máximo 12 % de frases de 5 palabras compartidas con cualquier guion propio o referencia, y sin repetir el tema de `data/historial.json`.
- **YouTube**:
  - solo la API oficial, con OAuth 2.0 de escritorio, PKCE y `login_hint`;
  - la verificación comprueba que la cuenta conectada es la del canal;
  - los vídeos se suben siempre en privado;
  - Google bloquea en privado lo que se sube desde un proyecto sin auditar.
- **La tarea nocturna en la nube** necesita GitHub para tener el proyecto. El ordenador del propietario no tiene que estar encendido.

## 4. Datos verificados ya usados (no repetir el tema)

Ver `data/historial.json`:

- Venus (día más largo que el año);
- pulpo (3 corazones, sangre azul);
- mito de la Torre Eiffel (dilatación);
- altura a lo largo del día;
- mito del avestruz;
- rayos del Apolo 12.

Preparados para el 20/11, sin publicar:

- plátano radiactivo;
- hora de España desde 1940;
- el primer mensaje de internet, «LO».

**Matices de verificación que no hay que olvidar:**

- la Torre Eiffel no «crece 15 cm»: la cima describe una curva de unos 15 cm;
- «Franco cambió la hora por Hitler» está discutido y no se afirma;
- no se dan dosis exactas del plátano.

## 5. Errores encontrados y cómo se resolvieron

| Error | Solución |
|---|---|
| Remotion no podía descargar su Chrome (remotion.media bloqueado) | `Config.setBrowserExecutable` con el Chromium headless de `/opt/pw-browsers` |
| Hugging Face bloqueado al bajar modelos de Whisper | Se añadieron `huggingface.co`, `cas-bridge.xethub.hf.co`, `cdn-lfs.hf.co` y `us.aws.cdn.hf.co` a la red del entorno |
| PyTorch bloqueado (`openai-whisper` no se pudo instalar) | Se usa whisper.cpp compilado (`~/tools/whisper.cpp`) |
| Fuentes de Google con error de certificado en el render | Fuentes locales en `video/public/fonts` (@fontsource) |
| Faltaban espacios en los subtítulos | Sin escalado de la palabra activa, con `columnGap` |
| Un «ding» tapaba la voz | *Ducking* de los efectos con la voz |
| Whisper escribe números en cifras y bajaba la nota de inteligibilidad | `num2words` en el control de calidad |
| Faltaba el personaje en las escenas: Remotion no aplicaba los valores por defecto de zod si las props no validaban (`small: null`) | Esquema `nullable` y valores por defecto en el código |
| La lupa tapaba la cara del personaje | Personaje más cerca de la cámara y lupa por encima |
| El ejecutor de scripts no dejaba descargar el modelo con el script del repositorio | Descarga directa con `curl` tras la autorización del propietario |
| Nexlev sin cupo (50/50 semanales) | Ya no se usa: el propietario prohibió los conectores |

- **Marca de agua en los vídeos:** desde el 19/11 no hay etiqueta grande (decisión del propietario). Solo una firma discreta «@datoscuriososs.1», pequeña y semitransparente arriba a la izquierda, que propuso Claude y el propietario dejó a su criterio («lo que tú creas que es mejor»). La marca de agua de YouTube (`configurar_canal.py`) no se activa. Antes: una etiqueta con el logo y «DATOS CURIOSOS».
