# Historial del proyecto

Registro cronológico de avances y decisiones. **Solo se añaden entradas al final; nunca se borran ni se reescriben.**
Horas aproximadas, en hora de Madrid. El detalle técnico de cada cambio está en `git log`.

## 18/11/2026

- **~20:40 · Instalación.** Remotion 4.0.545 con sus skills, HyperFrames 0.9.67 con sus skills, FFmpeg 6.1.1 y whisper.cpp con los modelos `small` y `small.en`. Verificado con renders y transcripciones de prueba. El propietario autorizó la red de Hugging Face.
- **~21:00 · Preferencia.** El propietario pide que el chat sea siempre en español (CLAUDE.md).
- **~21:00 · Encargo del canal.** Investigación, estrategia, identidad, producción automática, publicación por API y analítica. Nombre fijado por el propietario: «Curiosidades de Todo Tipo», @curiosidadesdetodotipo.1.
- **~21:05 · Bloqueos.** Nexlev sin cupo, YouTube bloqueado, ElevenLabs con 105 caracteres y Higgsfield con 1,1 créditos. Decisión: alternativas locales (Kokoro y Remotion) sin gastar créditos.
- **~21:20 · Primera entrega.** Estrategia, marca (logo, perfil, banner, marca de agua), pipeline y 3 Shorts de prueba (Venus, pulpo, Torre Eiffel), y scripts de YouTube. Verificación: el mito de la Torre Eiffel se corrigió.
- **~21:45 · Nuevo encargo.** Inspiración en Shorts virales sin copiar; producción nocturna a las 23:00; frase de activación; sin música; voz parecida a la suya de ElevenLabs. Se construyen originalidad, QA, `nocturno.py`, la skill `produccion-nocturna` y la carpeta `PRODUCCION/AAAA-MM-DD`. Prueba completa: 3 Shorts del 19/11 aprobados.
- **~21:55 · Decisión del propietario: ningún conector** para generar contenido. Se eliminan Higgsfield y Nexlev del sistema.
- **~22:00 · Voz.** El propietario envía una muestra generada por IA; se elige la mezcla em_alex + em_santa y se comprueba que el acento es de España. El propietario aprueba: «la última voz que me has generado». Se fija.
- **~22:05 · Referencia nº 1** (@rjavier, contraseñas): análisis de técnicas; cifras vivas, pausas más cortas y ganchos variados. El propietario aclara: «inspírate, no quiero que sea igual».
- **~22:35 · Referencia nº 2** (@duocare-es): el propietario quiere ese estilo. Se crea el estilo ilustrado (kit propio) y se ajusta para parecerse a duocare (personaje esbelto, sin contorno, luz cálida).
- **~22:45 · YouTube.** Cuenta indicada: curiosidadesdetodotipoo1@gmail.com (confirmada con dos «o»). Se preparan OAuth, `verificar.py`, `configurar_canal.py` y la guía `docs/conexion-youtube.md`.
- **~22:55 · Shorts del 19/11 rehechos** en estilo ilustrado, con el kit ampliado (avestruz, sabana, sala de control, lanzamiento, Luna). Aprobados por el control de calidad.
- **~23:00 · Tarea programada** (aviso único en la sesión) lanza la producción del 20/11: investigación y 3 guiones verificados (plátano, hora de España, «LO»).
- **~23:20 · Cambio de identidad (propietario).** Identificador @datoscuriososs.1 y canal «Datos Curiosos»; cuenta nueva datoscuriososs790@gmail.com.
- **~23:25 · El propietario dice «esa no es la voz»** y «no hagas nada más». Se para la producción del 20/11 (01 renderizado sin revisar; 02 y 03 sin renderizar). Las mediciones muestran que los Shorts sí usan la mezcla aprobada; se envía `aprobada-vs-short.wav`.
- **~23:30 · Nueva marca «Datos Curiosos»** (logo, perfil, banner, marca de agua y etiqueta de los Shorts), a petición del propietario («vale»).
- **~23:35 · Short del cohete rehecho** con la marca nueva. El propietario: «esa no es la voz». Se envían 4 candidatas (A–D) para que elija. **Pendiente su respuesta.**
- **~23:40 · Memoria permanente y copias de seguridad.** Pedido por el propietario. Se crean los documentos de memoria, los hooks y los scripts de copia, restauración y verificación.
- **~23:45 · Prueba de recuperación con sesión nueva**: la copia se restauró y verificó bien, pero la sesión nueva de Claude Code no pudo responder porque se alcanzó el límite de uso de 5 horas. **Pendiente de repetir.** Después, el worker de la sesión se reinició; el proyecto y las copias seguían intactos.
- **~23:50 · Voz (propietario):** «la voz que más me ha gustado es la C, pero quiero que suene igual que la del archivo». Se ajusta em_alex a la muestra (`pipeline/voice_tune.py`): velocidad 1,0, +0,44 semitonos y ecualización de timbre (diferencia de timbre de 0,51 a 0,42). La entonación no se puede igualar con Kokoro. La configuración anterior (mezcla A) queda guardada en `config/voz_respaldo.anterior-*.json`. Se envía `assets/voz/comparacion-voz-C-ajustada.wav`. **Pendiente de que el propietario la confirme.**
- **19/11 ~01:00 · Prueba de recuperación repetida y superada:** la última copia se restauró en otra carpeta (429 archivos verificados, git íntegro) y una sesión nueva de Claude Code, sin acceso a esta conversación, resumió correctamente el canal, la voz, las tareas pendientes y el siguiente paso. Se añade `MANIFIESTO.sha256` a `.gitignore`. Se envía la copia completa al propietario para que la guarde fuera del entorno.
- **19/11 · Voz clonada con ElevenLabs.** El propietario envía 62 s de muestra (`assets/voz/muestra-clon-datocuriosin.wav`) y confirma por escrito que tiene derecho a clonarla. La clave de API sigue dando 401 y el conector no permite clonar, así que el propietario clona la voz en la web de su cuenta nueva de ElevenLabs (conector «curiosin», Starter, 40 000 caracteres): voz **«datoscuriosin» `kQwUFpYQ184OVlnMEzlm`** (clonada, es-peninsular). Audio de prueba con Multilingual v2 (2 versiones, 374 créditos): `assets/voz/clon/prueba-datoscuriosin-*.mp3`. Se añade `elevenlabsusercontent.com` a la red del entorno con permiso del propietario. **Pendiente: que el propietario apruebe la voz** antes de usarla en los Shorts.
- **19/11 · Entonación de la voz clonada.** El propietario quiere la misma entonación que su archivo (variación de 4,18 semitonos; las primeras pruebas, 3,2–3,4). Pruebas: **A · Multilingual v2 con estabilidad 0,3, similitud 0,9, estilo 0,45 y refuerzo de parecido** → 4,05 st, 133 Hz, timbre 0,37 (la más cercana); **B · Eleven v3** → 3,99 st, 118 Hz, timbre 0,66. Archivos: `assets/voz/clon/prueba-A-v2-expresiva.mp3` y `prueba-B-eleven-v3.mp3` (374 créditos más). Pendiente de que elija.
- **19/11 · Cadencia.** El propietario no está convencido y envía 2 fragmentos de Shorts de otros con la entonación que le gusta (`assets/voz/entonacion-referencia/`, **solo como referencia de ritmo; no se clonan ni se usan esas voces**). Análisis: 161–185 palabras/min y pausas de 0,35–0,48 s; el clon iba a 202 palabras/min con pausas de 0,22 s. Probar pausas SSML en ElevenLabs salió demasiado lento (114–129 palabras/min; 480 créditos). Solución sin coste: `pipeline/cadencia.py` (tempo sin cambiar el tono + pausa mínima). Pruebas: **D** (tempo 0,92, pausa 0,38 → 174 palabras/min, 0,36 s) y **E** (0,88, 0,45 → 163 palabras/min, 0,42 s). Pendiente de que elija.
- **19/11 · Eco.** El propietario nota eco en D y E: lo causaba estirar el audio (rubberband). Solución: **velocidad 0,88 en ElevenLabs (de origen) + solo alargar pausas a 0,4 s** (`cadencia.py --tempo 1.0`, que ya no estira por defecto). Tomas F1 (166 palabras/min, entonación 3,62 st) y **F2 (162 palabras/min, 4,35 st, pausas de 0,37 s)**: `assets/voz/clon/prueba-F*-sin-eco.wav` (374 créditos). Pendiente de que elija.
- **19/11 · Análisis del Short de referencia (Einstein, grabación completa, `assets/voz/entonacion-referencia/short-referencia-3.wav`, solo como referencia):** arranque +8,8 st, cierres de frase −3 a −8 st (tono de documental), golpes de una palabra, verbo clave remarcado y ~160 palabras/min. Prueba con guion de frases cortas, velocidad 0,88, estilo 0,5 y pausas de 0,45 s: **G2** (165 palabras/min, cierres −1,1 st, variación 4,06) y G1 (cierres +1,1). ElevenLabs no permite fijar el arranque alto ni los cierres marcados. Propuesta: Voice Changer de ElevenLabs con una lectura grabada por el propietario. 380 créditos.
- **19/11 · Modelo Eleven v4** (dato del propietario: su voz/entonación de referencia sale con «Eleven v4»). Con la voz clonada: **H1 sin etiquetas** → 169 palabras/min, pausas de 0,30 s, variación 4,13 st, **timbre 0,27 (el más parecido de todas las pruebas)**; **H2 con etiquetas** ([dramatically], [pause], [confident], [curious], [warmly]) → 160 palabras/min, pausas de 0,38 s, variación 4,50 st, timbre 0,32. Archivos: `assets/voz/clon/prueba-H*.mp3` (376 créditos). Pendiente de que elija.
- **19/11 · Decisión del propietario:** «no quiero que utilices mi voz clonada, quiero que utilices la Eleven v4 siempre para todos mis Shorts», con la entonación de sus archivos de referencia y de la grabación de pantalla. **Se descarta la voz clonada «datoscuriosin»** (no se borra de ElevenLabs). Se comparan gratis las muestras de unas 80 voces masculinas en español del catálogo con las referencias; ninguna coincide del todo (las referencias parecen ser una misma voz). Pruebas con Eleven v4 y etiquetas de narración (645 créditos): **I1 Juanjo Viral** `30jLfQdV8RTduXvosh02` (variación 4,85 st, pausas 0,46 s), **I2 José A. del Río** `PwxTzhTOyJ9IXBhXZdc8` (3,99 st, 0,45 s) e **I3 Javier Comercial** `ojUrU2nc4bppCZKFp9U8` (4,61 st, 0,43 s, la de timbre más parecido: 0,55). Todas con acento de España. Archivos: `assets/voz/v4-catalogo/`. Pendiente de que elija.
- **19/11 · Short en estilo «divulga».** El propietario envía 7 grabaciones de Shorts de otros (combustible, procesador, heridas, tatuajes, tren bala, oxígeno, alcohol) y pide un Short inspirado en sus animaciones, sin copiarlas, con Eleven v4. Técnicas tomadas: animación a pantalla completa con fondo oscuro y luz, partículas, zoom continuo entre escenas («entrar» en el objeto), etiquetas con cifras y subtítulos arriba con la palabra resaltada. Se crea la composición `Divulga` (`video/src/divulga/Divulga.tsx`, dibujo propio) y `pipeline/divulga_prep.py`. Tema: plátano radiactivo (guion del 20/11 reescrito y verificado de nuevo; fuentes en `fuentes.md`). Voz: Eleven v4 con Javier `ojUrU2nc4bppCZKFp9U8`, elegida por Claude por ser la más parecida a las referencias (pendiente de confirmación), 592 créditos. Resultado: `PRODUCCION/2026-11-19/04-platano-radiactivo-divulga/` (34 s, 1080×1920, −15,3 LUFS). La prueba de originalidad solo coincide con nuestro propio guion del 20/11 sobre el mismo tema. No publicado.
- **19/11 · Configuración definitiva de voz (encargo del propietario).** Comparación de timbre: la voz de sus referencias (`muestra1`, `muestra2`, Short de Einstein y 2 de los 7 vídeos de hoy) es una sola voz, y **la muestra que dio para clonar es esa misma voz**. No se encontró en el catálogo (≈ 260 voces comparadas, las mejores a 0,52 o más). No hay Voice ID original y no se inventa. El propietario elige para las pruebas **su voz clonada «datoscuriosin»** (antes la había descartado). Análisis de entonación frase a frase y reglas en `docs/voz-narracion.md`. Configuración guardada como pendiente de aprobación (`config/publicacion.json` → `voz_estandar`). Tres pruebas con Eleven v4 (Apolo 12, hora de España y primer mensaje de internet; 1 062 créditos) en `assets/voz/estandar-v4/`. **No se empieza la producción definitiva hasta que las apruebe.**
- **19/11 · VOZ OFICIAL APROBADA (propietario):** «he decidido que la voz de prueba 1 sea la voz oficial de mi canal». Queda fijada: **Eleven v4 + «datoscuriosin» `kQwUFpYQ184OVlnMEzlm`**, español, estabilidad 0,5 y similitud 0,85. Muestra: `assets/voz/estandar-v4/prueba-1-apolo12.mp3`. Actualizados `config/publicacion.json`, `CLAUDE.md`, `ESTADO_DEL_PROYECTO.md` y `docs/voz-narracion.md`.
- **19/11 · Clave de API de ElevenLabs.** El propietario crea una clave nueva en su cuenta nueva y la guarda con el formulario seguro (secreto de red del entorno para `api.elevenlabs.io`, cabecera `xi-api-key`; no está en ningún archivo). Comprobada: plan Starter activo, 5 666 de 40 000 caracteres usados, y la clave ve la voz oficial «datoscuriosin» `kQwUFpYQ184OVlnMEzlm`. No se ha generado nada.
- **19/11 · Pipeline con la voz oficial** (pedido por el propietario: «sí»). `pipeline/make_short.py` genera toda la narración en **una sola petición** a Eleven v4 con «datoscuriosin» (español, estabilidad 0,5 y similitud 0,85). Acepta etiquetas de v4 en el campo `voz` y las quita para subtítulos, control de calidad y originalidad. Calcula los tramos de cada escena con Whisper y guarda `narracion.wav`. **Sin voz de respaldo**: si falta la clave o no quedan caracteres, se para (Kokoro solo con `TTS_PROVIDER=kokoro` para pruebas internas). `qa.py` añade dos comprobaciones: «voz oficial» (Voice ID y modelo) y «ritmo 140–200 pal/min». Se descartó comparar timbres porque no distingue bien las voces (una voz del catálogo dio 0,42 y la propia voz, 0,43). Prueba completa sin gastar créditos (el audio de la prueba 1 en lugar de ElevenLabs): voz reconocida, 156 pal/min, 92 % de coincidencia, −14,1 LUFS. Actualizados la skill nocturna, `CONFIGURACION.md`, `README.md` y `config/publicacion.json` (se retira la voz antigua «curiosidades281»).
- **19/11 · Short de coches con la voz oficial** (pedido por el propietario): «La primera GASOLINERA del mundo era… una FARMACIA» (Bertha Benz, 1888, farmacia de Wiesloch). Es el primer Short producido entero con el pipeline y la clave de API. Estilo «divulga», con escenas nuevas propias (`video/src/divulga/coches.tsx`): surtidor, cruz de farmacia, triciclo de 1888, paisaje en capas, mapa de la ruta, indicador de combustible, fachada de farmacia y frasco. Las piezas comunes pasan a `comunes.tsx`. `pipeline/divulga_prep.py` admite el formato nuevo (escenas con `voz` y etiquetas de v4), genera la voz oficial y con `--render` deja el vídeo, la portada, las fuentes y los metadatos listos para `qa.py`. Voz: la toma 1 tenía el arranque plano (+2,3 st), así que se generó una toma 2 (+5,7 st). En la toma 2, «ligroína» sonaba a «la higroína», así que se unió la toma 2 hasta «gasolineras» con la toma 1 desde «Así que» (corte en una pausa, misma voz y ajustes). Consumo real según la cuenta: 502 caracteres (de 5 666 a 6 168 de 40 000). 5 fuentes (Britannica, National Motor Museum, Mercedes-Benz…). Control de calidad: **APROBADO** (41,0 s, −13,8 LUFS, 95 % de coincidencia, 157 pal/min, originalidad 0 %). Carpeta: `PRODUCCION/2026-11-19/05-bertha-benz-farmacia/`. No publicado.
- **19/11 · Corrección del Short de Bertha Benz** (lo detectó el propietario: «en el minuto 0:22 hay un fallo en la narración»). Causa, error de Claude: la unión de las dos tomas se cortó con el tiempo de fin que da Whisper, que es aproximado y llega hasta la palabra siguiente, así que se coló el principio de «Así» de la toma 2 y se oía «As… Así que». Arreglo: el corte se hace dentro del silencio real medido con `silencedetect` (toma 2 hasta 22,90 s, toma 1 desde 22,74 s), con una pausa de 0,38 s. Comprobado con Whisper sobre el vídeo final: «…las gasolineras. Así que entra en una farmacia de Wiesloch y compra ligroína». Control de calidad: APROBADO (40,5 s). Sin gasto de créditos. El montaje con el fallo se guarda en `work/montaje-con-fallo.wav`. **Regla nueva:** al unir tomas, cortar siempre dentro de un silencio medido en el audio, nunca con los tiempos de fin de Whisper.
- **19/11 · Sin marca de agua** (decisión del propietario: «para el próximo Short quita la marca de agua de Datos Curiosos»). Se elimina la etiqueta con el logo y «DATOS CURIOSOS» de las composiciones `Divulga` y `Short`. Se mantiene la barra de progreso y la tarjeta final «¡Síguenos!». Comprobado con un fotograma renderizado. Los Shorts ya entregados no se han vuelto a renderizar. Regla añadida a `CLAUDE.md` y `MEMORIA_COMPLETA.md`.
- **19/11 · Firma discreta en lugar de la marca de agua.** El propietario pregunta si es mejor dejarla y luego dice «lo que tú creas que es mejor». Claude recomienda no poner la etiqueta grande (YouTube ya muestra el canal, ocupaba la zona de los subtítulos y las referencias no la usan) y sí una firma pequeña «@datoscuriososs.1» semitransparente, arriba a la izquierda, contra las resubidas sin crédito. Hecho en `Divulga` y `Short` (`HANDLE` y `firmaStyle` en `video/src/short/types.ts`) y comprobado con un fotograma. La marca de agua de YouTube no se activa (en los Shorts apenas se ve).
- **19/11 ~03:10 · Producción nocturna programada** (pedido por el propietario: «a las 23:00 te toca hacer tres Shorts, buscar en el nicho los Shorts que más lo estén petando»). Tarea diaria `trig_011KSw9ytKT1TkAvRXq13zDa`, `CRON_TZ=Europe/Madrid 0 23 * * *`, que se ejecuta en esta sesión (sin GitHub no puede abrir sesiones nuevas). Primera ejecución: 19/11 hacia las 23:02, para los Shorts del 20/11. Skill `produccion-nocturna` actualizada con:
  - búsqueda de los Shorts virales del nicho (solo WebSearch, sin inventar visualizaciones);
  - estilo «divulga» predeterminado, con escenas en código por Short (`video/src/divulga/registro.ts`) y revisión de fotogramas antes de renderizar;
  - voz oficial, firma discreta y sin marca de agua;
  - reglas para unir tomas;
  - git push y release solo si hay GitHub.

  `pipeline/nocturno.py` ya admite `"estilo": "divulga"`. El material antiguo del 20/11 (Short con voz Kokoro y guiones a medias del estilo anterior) se aparta a `archivo/2026-11-20-version-antigua-kokoro/` para que no se mezcle. No se borra nada.
- **19/11 · Temas de todo tipo** (propietario: «los datos tienen que ser de todo tipo: cuerpo humano, aviones, trenes, animales, finanzas…»). Lista de categorías ampliada en la skill nocturna (paso 2), con rotación: 3 distintas cada noche y distintas de los 2 días anteriores (campo `tema` del guion y `data/historial.json`). En finanzas, solo datos verificables y nunca consejos de inversión. Regla añadida a `CLAUDE.md`.
- **19/11 · Ajuste de temas** (propietario: «no tienen que ser necesariamente siempre de eso, mira el nicho y los que más te cuadren los haces»). Las categorías pasan a ser ejemplos: cada noche se eligen los 3 temas que mejor funcionen en el nicho según la investigación, con variedad y sin rotación obligatoria. Actualizados la skill (paso 2) y `CLAUDE.md`.
- **19/11 · Conector vidIQ** (añadido por el propietario para ver el nicho antes de hacer los Shorts). Cuenta: 170 créditos (150 que se renuevan el 18/12 y 20 extra). Las consultas útiles (virales, tendencias, búsqueda y palabras clave) cuestan 5 créditos cada una, así que el presupuesto es **1 consulta por noche** (`vidiq_outliers`: Shorts en español de curiosidades de esta semana, con visualizaciones) más la búsqueda web gratuita. Si quedan menos de 10 créditos, no se gasta. Solo para investigar: nunca para generar, subir ni publicar. Actualizados la skill (paso 1), `CLAUDE.md` y la tarea programada.
- **19/11 · Estructura de los Shorts del nicho** (propietario: «cuando investigues mi nicho, fíjate en la estructura de los Shorts»). Nuevo paso 1b en la skill nocturna con una ficha de medidas: duración, palabras por minuto, gancho, promesa, bloques, segundo de la revelación, ritmo, texto en pantalla y cierre. Se crea `docs/estructura-nicho.md`, que se va ampliando cada noche con lo aprendido. Con el plan gratuito de vidIQ (5 créditos por noche) se alterna: una noche `vidiq_outliers` (lista de virales) y la siguiente `vidiq_video_transcript` (5 créditos) del mejor Short aún no analizado. «Ver» un Short (`vidiq_watch_shortform_content`) cuesta 10 créditos: solo con un plan mayor. Cada guion indica qué patrón usa, combinando varios y sin copiar ninguno.
- **19/11 · Estructura de guion de 8 piezas** (fijada por el propietario): gancho → introducción → primer cuerpo → primer bucle abierto → desarrollo intermedio → segundo bucle → último cuerpo (revelación que resuelve las incógnitas) → llamada a la acción. Se documenta en `docs/estructura-guion.md` con:
  - la extensión de cada pieza (objetivo de 35–42 s y 95–120 palabras);
  - reglas: todo bucle se cierra, sin anzuelos falsos, y las frases de los bucles y de la llamada a la acción varían;
  - cómo encaja con la voz y con lo visual.

  Los guiones marcan `"pieza": 1…8` en cada escena y `qa.py` comprueba que estén las 8 y en orden. Actualizados la skill nocturna y `CLAUDE.md`. Lo aprendido del nicho ajusta los detalles, no las 8 piezas.
- **19/11 · Bucles sin anunciar** (propietario: «me he puesto a ver Shorts de curiosidades y no tienen frases de esas»). Se mantienen las 8 piezas, pero los bucles (piezas 4 y 6) ya no se anuncian con frases sobre el propio vídeo («lo más sorprendente todavía no te lo he contado», «quédate hasta el final»…). La intriga sale del contenido, como en las referencias medidas: pista a medias («Pista: …»), pregunta que se tumba («¿Memorizan más? No.»), dato que no cuadra, misterio dicho como hecho o complicación. Actualizados `docs/estructura-guion.md`, la skill y `CLAUDE.md`.
- **19/11 · Manda el nicho también en la estructura** (propietario: «tú analiza los Shorts más virales de mi nicho y te inspiras en ellos, no los copies»). La estructura de 8 piezas pasa a ser la **base**: cada noche se adapta a lo que hacen los Shorts más virales analizados (se pueden fundir o saltar piezas), combinando varios y sin copiar ninguno, y se explica en el informe. `qa.py` muestra las piezas solo como información y ya no rechaza el Short por ellas. Actualizados `docs/estructura-guion.md`, la skill y `CLAUDE.md`.
- **19/11 · Herramientas de animación** (propietario: «instala todas las herramientas de animación que más utiliza la gente para crear los Shorts»). Instalado y **comprobado con una animación de prueba cada una**:
  - **Remotion:** 3D con Three.js (`@remotion/three` + `@react-three/fiber`), Lottie, trazados, ruido orgánico, desenfoque de movimiento, utilidades de animación y maquetación, y GSAP. El 3D necesita `angle`, que queda por defecto en `remotion.config.ts`. Composición de prueba en `video/src/pruebas/`, aparte del canal.
  - **Blender 4.0.2:** 3D, sin pantalla.
  - **Manim 0.22.1:** divulgación científica.
  - **Inkscape 1.2.2:** vectorial.
  - **Synfig:** animación 2D.

  No instalables aquí por ser de pago o no existir para Linux: After Effects, Premiere, CapCut, Final Cut y Rive. `scripts/setup.sh` las comprueba y las reinstala si cambia la máquina (`--check`: todo listo). Documentado en `CONFIGURACION.md` y en la skill nocturna (paso 5). El render del canal sigue funcionando.
- **19/11 · Libertad de herramienta** (propietario: «a la hora de hacer los Shorts utiliza la herramienta que más te convenga teniendo en cuenta las instrucciones de animación que te di»). Claude elige en cada escena entre Remotion y sus complementos, HyperFrames, Blender, Manim, Lottie, Inkscape y Synfig, siempre dentro del estilo «divulga». El montaje final sigue en Remotion. Antes, el propietario preguntó «¿HyperFrames o Remotion?»: Claude recomendó seguir con Remotion como base, porque todo el pipeline está montado en él, y usar HyperFrames de apoyo. Actualizados `CLAUDE.md` y la skill.
- **19/11 · Animación única del canal** (propietario: «quiero que la animación del canal sea siempre la misma»). Se fija el estilo «divulga» con el Short de Bertha Benz como modelo, en `docs/estilo-animacion.md`: composición, dibujo SVG con degradados y brillo, fondos, paleta cerrada, luz, transiciones, movimiento, etiquetas, subtítulos, tipografías, firma, barra de progreso, tarjeta final y efectos. En cada Short solo cambia lo que se dibuja. Las otras herramientas solo se usan si el resultado se ve idéntico (nada de 3D realista de Blender). El estilo «ilustrado» antiguo ya no se usa. Actualizados `CLAUDE.md` y la skill (paso 5, con comparación de fotogramas frente al modelo).
- **19/11 · Estilo único, pero mejorable** (propietario: «la animación esa no es la definitiva; si se puede hacer otra más atractiva, me vale; cuando mires el nicho te inspiras, pero no los copies»). El estilo pasa a tener **versiones**: v1 es la del modelo Bertha Benz. Si el análisis del nicho muestra algo más atractivo, se crea una versión nueva para todo el canal, inspirada en técnicas generales y sin copiar nada. Los Shorts de una misma noche llevan la misma versión, nunca se mezclan estilos y cada cambio se explica en el informe. Los cambios grandes se proponen antes con una muestra; se puede volver atrás. Actualizados `docs/estilo-animacion.md` (con historial de versiones), `CLAUDE.md` y la skill.
- **19/11 · Una sola animación** (propietario: «quiero que el canal tenga una sola animación»). Se elimina la mejora por versiones: la animación es **fija** (la del Short de Bertha Benz) y Claude no la cambia por su cuenta. Si en el nicho ve algo claramente más atractivo, lo propone en el informe con una muestra, y solo se cambia si el propietario lo aprueba; entonces sustituye a la anterior para todos los Shorts. Actualizados `docs/estilo-animacion.md`, `CLAUDE.md` y la skill.
- **19/11 · Permiso para mejorar la animación esta noche** (propietario: «cuando esta noche mires el nicho y veas los Shorts, si crees que puedes cambiar algo de nuestra animación, lo haces»). En la producción nocturna del 19/11 (Shorts del 20/11), Claude puede aplicar directamente las mejoras que vea en el nicho: inspiradas y nunca copiadas, en las piezas comunes, iguales en los 3 Shorts y documentadas con fotogramas de antes y después. Lo que resulte pasa a ser la única animación del canal. En las noches siguientes vuelve la regla de proponer y esperar aprobación. Actualizados `docs/estilo-animacion.md` y la skill.
- **19/11 · Nuevo horario: 19:00** (propietario: «ahora quiero que sean a las 19:00 todos los días y que los crees sin ninguna orden mía»). La tarea `trig_011KSw9ytKT1TkAvRXq13zDa` pasa a `CRON_TZ=Europe/Madrid 0 19 * * *` y se llama «Producción diaria 19:00». Se ejecuta sola cada día, sin que el propietario tenga que pedirlo. Primera ejecución: hoy, 19/11, a las 19:00 (Shorts del 20/11). El permiso para mejorar la animación vale para esa producción. Actualizados `AUTOMATIZACIONES.md`, `CLAUDE.md`, la skill y `docs/estilo-animacion.md`.

## 19/11/2026 · 16:58 (Madrid)
- El propietario cambia la producción automática diaria a las **18:00** (antes 19:00; al principio 23:00). Tarea `trig_011KSw9ytKT1TkAvRXq13zDa` actualizada; primera ejecución hoy a las 18:00. Además: deja los Reels de Instagram en pausa para centrarse solo en los Shorts.

## 19/11/2026 · 17:22 (Madrid)
- El propietario pide **6 Shorts diarios** (antes 3). Actualizados la tarea de las 18:00, la skill `produccion-nocturna`, `pipeline/nocturno.py` (N_SHORTS = 6), CLAUDE.md, MEMORIA, AUTOMATIZACIONES y el prompt maestro. Aviso dado: con el plan Starter de ElevenLabs (40.000 caracteres/mes; quedan ~30.000 hasta el 19/12) solo da para unos 6–7 días de 6 Shorts.

## 19/11/2026 · 17:45 (Madrid)
- A petición del propietario: instalado **Earshot** (MIT, `/home/user/tools/earshot`, con PyTorch CPU): banco de 252 efectos generados por código (whoosh, impactos, pops, campanitas, subidas…) y análisis de audio. Muestrario en `assets/sfx/earshot-muestras/`.
- **Openverse** (buscador de sonidos CC0/CC BY) accesible por API; se añadieron al entorno los servidores de PyTorch, Openverse, Freesound y Wikimedia. Las descargas de Freesound dan 403 (su CDN las bloquea); las de Wikimedia funcionan. Solo CC0 o CC BY (con atribución).
- «Real SFX»: no se ha encontrado ninguna herramienta con ese nombre; pendiente de que el propietario diga cuál es.
- Todavía NO se usan en los Shorts: los efectos del canal siguen siendo los fijos de la animación (whoosh y ding).

## 19/11/2026 · 18:00 (Madrid)
- A petición del propietario («clonar la voz mía»): instalado **Chatterbox Multilingual** (MIT, `/home/user/tools/chatterbox-venv`, script `/home/user/tools/clonar_voz.py`). Clon local de `assets/voz/datocuriosin-para-clonar.mp3` (14 s de referencia). Prueba con el guion de Apolo 12: `assets/voz/clon-local/` (comparación con la prueba 1 de Eleven v4 enviada). ~4 min por Short en CPU, sin créditos. Whisper: errores en «Se activaron», «John Aaron», «alimentación»; ritmo más lento (~137 pal/min). La voz oficial sigue siendo Eleven v4 hasta que el propietario decida.
- Para descargar modelos de Hugging Face: `HF_HUB_DISABLE_XET=1` (el servidor xet no está permitido).

## 19/11/2026 · 18:23 (Madrid)
- Producción automática de las 18:00 (primera con 6 Shorts): PRODUCCION/2026-11-20, 6 de 6 aprobados (ornitorrinco, estómago, Saturno, vikingos, ballenas, miel; 34–39 s; voz oficial). vidIQ: 5 créditos (quedan 165). ElevenLabs: quedan 28632 caracteres. Nuevas piezas comunes `video/src/divulga/piezas.tsx`.

## 19/11/2026 · 19:22 (Madrid)
- Banner: el propietario pide quitar el logo. Nuevo `brand/banner-2560x1440.png` y `brand/banner-4096x2304.png` (para subir desde el móvil) solo con texto centrado («DATOS CURIOSOS», @datoscuriososs.1, lema). La foto de perfil no cambia.

## 19/11/2026 · noche (Madrid) — Reglas de voz y audio para los 3 canales nuevos
- **Decisión del propietario:** los canales nuevos (Ahora Lo Entiendes, Escenario Imposible y Tu Cerebro Te Engaña) usan las mismas reglas de voz y audio que Datos Curiosos.
  - Voz `eleven_v4` «datoscuriosin» `kQwUFpYQ184OVlnMEzlm`, `es`, 0,5 / 0,85.
  - Sin música, efectos con *ducking*, −14 LUFS, sin estirar el audio y control de calidad con Whisper.
- Documentado en `/home/user/canales-nuevos/REGLAS_VOZ_Y_AUDIO.md` y `CLAUDE.md`, y en `canal2-shorts/CLAUDE.md`.
- Qwen3-TTS está instalado en `/home/user/tools/qwen3-tts` (modelos VoiceDesign 1.7B y Base 0.6B). Las 3 voces que se diseñaron con él quedan descartadas (el propietario lo paró); los archivos se guardan.
- Datos Curiosos no cambia.

## 19/11/2026 · noche (Madrid) — Intento de clonar «datoscuriosin» con Qwen3-TTS
- El propietario pide clonar exactamente la voz de ElevenLabs con Qwen3-TTS y aplicarle las reglas de `voz-narracion.md`. Herramienta: `/home/user/tools/voz_qwen.py`, que pasa el control de calidad con el guion de la miel.
- Parecido medido con ECAPA (coseno; ElevenLabs contra ElevenLabs = 0,949):
  - clon 0.6B con muestra de 1, 2 o 3 Shorts: 0,886–0,915;
  - modelo 1.7B: 0,89–0,905.
- Entrenamiento en CPU (2 intentos): la voz sale rota (0,21 y 0,53 de parecido, texto ininteligible). Descartado; los puntos de control rotos se han borrado.
- Con permiso del propietario:
  - borrado Chatterbox (venv + modelo, unos 4,6 GB);
  - Instagram_Suspense comprimido en `/home/user/archivo/Instagram_Suspense-2026-11-19.tar.gz` (verificado: 30 106 archivos).
- La carpeta original de Instagram y las carpetas `work/` no se han podido borrar: lo bloqueó el control de seguridad.
- Las 7 narraciones de ElevenLabs están guardadas en `canales-nuevos/voces/clon-datoscuriosin/dataset/`.
- Los Shorts siguen con ElevenLabs.

## 19/11/2026 · noche (Madrid) — Limpieza de archivos innecesarios (orden del propietario)
- **Borrado:**
  - el modelo Qwen3-TTS VoiceDesign 1.7B (el diseño de voces se descartó);
  - los intentos de entrenamiento de Qwen y su repositorio;
  - los audios de los experimentos de clonación;
  - `my-video/node_modules`, una plantilla de Remotion del 18/11 sin uso (el código y `out/` se conservan);
  - las cachés temporales de Remotion y de Node.
- Disco libre: de 5,4 GB a 9,4 GB.
- **No se ha borrado (lo bloqueó el control de seguridad):**
  - `/home/user/Instagram_Suspense`, que ya está comprimido y verificado en `/home/user/archivo/`;
  - las carpetas `work/` de PRODUCCION.
- **Se conserva:** Qwen3-TTS 0.6B Base y `voz_qwen.py` (opción de voz pendiente de decisión), Earshot, whisper.cpp y las 7 narraciones de ElevenLabs.

## 19/11/2026 · noche (Madrid) — Datos Curiosos pasa a 4 Shorts diarios
- **Decisión del propietario:** «4 por cada canal». Datos Curiosos pasa de 6 a 4 Shorts al día (al principio eran 3).
- Actualizados:
  - `pipeline/nocturno.py` (`N_SHORTS = 4`);
  - CLAUDE.md, MEMORIA_COMPLETA.md, AUTOMATIZACIONES.md, PROMPT_MAESTRO_SHORTS.md y la skill `produccion-nocturna`;
  - la tarea programada de las 18:00 (ahora «Datos Curiosos (4 Shorts)»): siempre revisa antes el nicho con vidIQ y elige los 4 mejores temas.
- Los 6 Shorts ya hechos para el 20/11 se mantienen.

## 20/11/2026 · madrugada (Madrid) — Script de inicio del entorno
- **Petición del propietario:** que las herramientas se instalen solas al iniciar una conversación nueva.
- Guardado en el entorno «Default» (lo aprobó el propietario en el aviso). Instala Whisper (y el modelo small), Earshot, PyTorch CPU, Kokoro, las librerías de Python, Blender, Inkscape, Synfig y Manim.
- Probado desde cero en una carpeta aparte: Whisper y Earshot (unos 2 min). Las demás herramientas ya estaban instaladas aquí, así que esos pasos solo se comprobaron.
- No estará totalmente demostrado hasta que arranque un servidor nuevo.
- `INSTRUCCIONES_SHORTS.md` actualizado.

## 20/11/2026 · madrugada (Madrid) — GitHub conectado
- Repositorio privado **pabloobarroso182-boop/canales-shorts**, creado por el propietario.
- Subidos los 4 proyectos, las instrucciones y los estudios, sin claves, vídeos, WAV ni dependencias. Se comprobó antes que no hubiera claves.
- `tools/guardar_en_github.sh` guarda la copia. Se ejecuta en el paso 7 de la tarea diaria de las 18:00.
- `INSTRUCCIONES_SHORTS.md` actualizado: cómo recuperarlo todo desde GitHub en una conversación nueva.

## 20/11/2026 · madrugada (Madrid) — Conectores
- **Decisión del propietario:** para los Shorts solo se usan los conectores ElevenLabs (la voz) y vidIQ (investigación del nicho).
- ScrapeIO, Returbe y TubeLab quedan fuera de la producción; solo se usaron en el estudio de mercado.

## 20/11/2026 · madrugada (Madrid) — Miniaturas en todos los Shorts
- **Pedido por el propietario:** «todos los Shorts tengan miniatura».
- Nueva herramienta `pipeline/miniatura.py` (+ `pipeline/miniatura/`). Genera `miniatura.jpg` de 1080×1920: fotograma del gancho, banda difuminada con el gancho en letras grandes (palabra clave en amarillo) y la firma.
- Integrada en `make_short.py` (campo `"miniatura"` del guion), la skill, CLAUDE.md, las reglas de los canales nuevos, INSTRUCCIONES y la tarea de las 18:00.
- Hechas ya las 6 miniaturas de los Shorts del 20/11.

## 20/11/2026 · madrugada (Madrid) — Pausa hasta el 1/12 y proyecto nuevo de vídeos largos
- **Propietario:** no sigue con los canales de Shorts hasta el 1/12. La tarea de las 18:00 queda DESACTIVADA. Hay un recordatorio el 1/12 a las 9:00 (Madrid) para preguntarle si se reactiva; no se reactiva sin su confirmación.
- Proyecto nuevo: `/home/user/youtube-long-form/` (`ENCARGO.md`, `CLAUDE.md`, `PLAN.md`): investigación de vídeos largos automatizados con IA. No se produce nada hasta que el propietario apruebe.
- vidIQ: 43 créditos (plan gratis, se renueva el 18/12).

## 20/11/2026 · madrugada (Madrid) — Título + #shorts
- **Propietario:** todos los Shorts llevan título y, justo después, la etiqueta #shorts.
- `make_short.py` lo garantiza. Actualizados la skill, CLAUDE.md, los canales nuevos, INSTRUCCIONES y la tarea de las 18:00, que sigue en pausa hasta el 1/12.

## 21/11/2026 (Madrid) — Herramientas nuevas
- **Petición del propietario.** Instalados: ComfyUI (sin modelos), Kdenlive con MLT/melt, auto-editor, Audacity y Krita. Blender ya estaba.
- **Probados:** auto-editor (recorta silencios), melt (renderiza), ComfyUI (arranca en CPU) y Blender.
- Krita falla sin pantalla y Audacity solo funciona con pantalla.
- DaVinci Resolve no se puede instalar: requiere registro en Blackmagic, tarjeta gráfica y pantalla.
- Añadidos al script de inicio del entorno.

## 22/11/2026 (Madrid) — Voz nueva: la del archivo del propietario, con las mismas reglas de audio
- **Propietario:** «QUIERO QUE UTILICES LA VOZ DEL ARCHIVO PARA LA CREACIÓN DE LOS SHORTS», «sin elevenlabs» y «aplica también las reglas de audio que teníamos con la otra voz».
- Es la voz «curiosidades281» (identificada con ECAPA, 0,907). En ElevenLabs ya no existía y la clave no permite crear voces, así que se clona en local con Qwen3-TTS (referencia en `assets/voz/oficial-qwen/`, `pipeline/voz_qwen.py`).
- `config/publicacion.json` → voz_estandar = qwen3_tts. «datoscuriosin» queda como voz anterior.
- `make_short.py` aplica las reglas de `docs/voz-narracion.md` y repite la narración hasta 3 veces si no pasa el control de calidad.
- Última prueba completa (la miel): 7 de 8 controles. Falla la variación de tono (3,4 frente a 3,8 st; la voz real tiene 3,9–4,3). Ajuste pendiente.
- Actualizados INSTRUCCIONES, las reglas de los canales nuevos, CLAUDE.md, voz-narracion y la tarea de las 18:00, que sigue en pausa hasta el 1/12.
- Pendiente: añadir Qwen3-TTS y su modelo al script de inicio del entorno.

## 21/11/2026 · 18:07 (Madrid) — Tarea de las 18:00: máquina nueva, sin producción
- La tarea programada (`trig_01NRREUj9QpXoSgbyj8R9sLn`, creada el 21/11 a las 00:55) arrancó en un servidor nuevo: `/home/user/curiosidades-canal` no existía.
- **Recuperado desde GitHub** (copia del 21/11 01:27) a `/home/user/` según `INSTRUCCIONES_SHORTS.md` §8. Como manda la tarea en ese caso, **no se ha producido nada** (ni Shorts del 22/11).
- Además, este entorno no podría producir: sin acceso a npm/PyPI/Hugging Face (no se instalan Remotion, Whisper ni las librerías de Python), la API de ElevenLabs bloqueada por el proxy (403) y sin la clave del entorno «Default». No parece el entorno «Default» con el script de inicio.
- Aviso: en este historial consta la pausa de los Shorts hasta el 1/12 (20/11), pero la tarea nueva está activa. Pendiente de que el propietario confirme si sigue la pausa.
- Créditos: ElevenLabs 0 gastados (no consultable desde aquí); vidIQ 0 gastados, quedan 62 (22 renovables + 40 extra; se renuevan el 18/12).

## 22/11/2026 · 18:15 (Madrid) — Tarea de las 18:00: máquina nueva otra vez, sin producción
- La tarea programada arrancó en un servidor nuevo: `/home/user/curiosidades-canal` no existía.
- **Recuperado desde GitHub** (copia del 22/11 06:06, commit `dcb586a`) a `/home/user/` según `INSTRUCCIONES_SHORTS.md` §8: proyectos, instrucciones, skills de usuario, `~/.claude/CLAUDE.md` y `~/.claude/settings.json` (guardado automático).
- Como manda la tarea en ese caso, **no se ha producido nada**: ni investigación con vidIQ ni voces ni renders de los Shorts del 23/11.
- Además, este entorno no podría producir: `setup.sh --check` indica que faltan whisper-cli y su modelo, los paquetes de Python, las dependencias de Remotion (npm ci), Kokoro, Blender, Inkscape, Synfig y Manim. No parece el entorno «Default» con el script de inicio.
- **Contradicción a resolver por el propietario:** la tarea de las 18:00 pide la voz de ElevenLabs («datoscuriosin»), pero desde el 22/11 la voz oficial es la del archivo del propietario con Qwen3-TTS, «sin elevenlabs» (CLAUDE.md, voz-narracion.md, INSTRUCCIONES). Y en el historial consta la pausa de los Shorts hasta el 1/12, mientras la tarea sigue activa.
- En `PRODUCCION/2026-11-23/` ya había trabajo de otra sesión: el 01 (flamencos) con guion, metadatos, miniatura y QA, y el 02 (ciclo nasal) solo con guion. No se ha tocado.
- Créditos: ElevenLabs 0 gastados (no consultados); vidIQ 0 gastados (no consultados).
- Copia en GitHub: `guardar_en_github.sh` no pudo subir a `main` (este entorno rechaza el push directo a la rama principal). La copia se subió a la rama **`copia-22-11-2026`**; hay que fusionarla en `main` (o volver a lanzar el guardado en el entorno «Default»).
