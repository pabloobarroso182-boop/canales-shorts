---
name: produccion-nocturna
description: Prepara los 4 Shorts del día siguiente (antes 6 y, al principio, 3; propietario, 19/11) del canal «Datos Curiosos» (@datoscuriososs.1) (investigación, verificación, guiones originales, voz, escenas, montaje, subtítulos, control de calidad) en PRODUCCION/AAAA-MM-DD/. Úsala cuando el usuario escriba «Me voy a dormir, prepárame el trabajo de mañana» (o algo equivalente) y cuando la lance la tarea programada diaria de las 18:00 (antes 19:00 y 23:00).
---

# Producción nocturna · Datos Curiosos

Trabaja en la raíz del proyecto (donde está `config/publicacion.json`). Todo en español.
**Nunca publiques nada en YouTube, nunca compres créditos ni hagas gastos extra.**
**No uses ningún conector (MCP) para generar contenido**: ni Higgsfield ni Nexlev (ni las herramientas de vidIQ que generan vídeo, voz, música o miniaturas). Solo las herramientas instaladas (Remotion, HyperFrames, FFmpeg, Whisper), la búsqueda web de Claude, **la API de ElevenLabs para la voz oficial** (con la clave del entorno, a través del pipeline; autorizado por el propietario el 19/11) y **vidIQ solo para investigar el nicho** (paso 1; autorizado por el propietario el 19/11).

**Reglas del 19/11 que se aplican siempre:** voz oficial (`docs/voz-narracion.md`), estilo «divulga» (paso 5), **sin marca de agua grande** (solo la firma discreta «@datoscuriososs.1», que ya está en la plantilla) y sin música.

## 0. Preparación (2 min)

1. Fecha objetivo = **mañana** en Europe/Madrid: `TZ=Europe/Madrid date -d tomorrow +%F`. Carpeta: `PRODUCCION/<fecha>/`.
2. Si la carpeta ya tiene 4 Shorts con `qa.json` aprobado **y hechos con la voz oficial** (`metadata.json` → `voz_config.voice_id` = `kQwUFpYQ184OVlnMEzlm`), no rehagas nada: informa y termina. Lo hecho antes del 19/11 con otra voz no cuenta.
3. Comprueba las herramientas: `bash scripts/setup.sh --check`. Si falta algo, ejecuta `bash scripts/setup.sh` e inténtalo de nuevo.
4. Lee `config/publicacion.json`, `data/historial.json` (temas ya hechos), `docs/inspiracion.md` (técnicas y reglas de originalidad) y el último `PRODUCCION/*/INFORME.md`.

## 1. Tendencias: los Shorts del nicho que más lo están petando (sin inventar)

Pedido por el propietario: antes de elegir temas, busca **qué Shorts de curiosidades en español están funcionando mejor ahora mismo**.

- **vidIQ (conector añadido por el propietario el 19/11), con presupuesto: máximo 5 créditos por noche** (la cuenta tiene unos 150 al mes; cada consulta de pago cuesta 5). Haz **una sola** consulta:
  - `vidiq_outliers` con `contentType: "short"`, `language: "es"`, `keyword: "curiosidades datos curiosos"` (o un tema del nicho que convenga esa noche), `publishedWithin: "thisWeek"`, `minEngagementRate: 0.02` y `limit: 30`. Devuelve los Shorts que más están rindiendo frente a su canal, con visualizaciones.
  - **Noches alternas** (para estudiar la estructura con el mismo presupuesto): si la noche anterior ya se hizo `vidiq_outliers`, esta noche, en lugar de eso, haz **`vidiq_video_transcript`** (5 créditos) del Short con mejor rendimiento de esa lista que aún no se haya analizado (mira `docs/estructura-nicho.md`). Con la transcripción y sus tiempos mide la estructura (paso 1b).
  - Solo si el propietario tiene un plan con más créditos (ver `CLAUDE.md`): `vidiq_watch_shortform_content` (10 créditos) de 1–3 Shorts para ver también lo visual (cambios de plano, texto en pantalla, recursos).
  - Antes, comprueba el saldo con `vidiq_balance` (gratis). Si quedan menos de 10 créditos, no gastes y usa solo la búsqueda web.
  - Nunca uses vidIQ para publicar, subir vídeos ni generar contenido.
- Completa con WebSearch (gratis). Haz varias búsquedas en la misma tanda, por ejemplo:
  - Shorts virales de curiosidades o datos curiosos de esta semana o este mes, en español;
  - canales de curiosidades en español que más crecen;
  - temas de ciencia, historia y tecnología con más interés esta semana, y efemérides de mañana.
- Apunta las **visualizaciones** que den vidIQ, YouTube o los artículos, con el enlace. **Nunca inventes visualizaciones ni digas que algo es viral sin una fuente.** Si no encuentras cifras, dilo así en el informe.
- De cada Short o canal de referencia, anota solo **técnicas generales** (tipo de gancho, ritmo, recurso visual, **qué hace atractiva su animación**, cierre) y el **tema**. No copies guiones, frases ni escenas (`docs/inspiracion.md`).
- Guarda en `PRODUCCION/<fecha>/investigacion/`:
  - `tendencias.md`: el «top» encontrado (título, canal, visualizaciones si hay fuente, enlace), las técnicas que tomas y por qué eliges cada tema.
  - `referencias.json`: textos de referencia como `{titulo, url, transcripcion}`, para el control de originalidad. Si no hay, `[]`.

## 1b. Estructura de los Shorts que funcionan (pedido por el propietario el 19/11)

- De los Shorts del nicho que mejor funcionan, analiza **la estructura**, no solo el tema. Usa la ficha de `docs/estructura-nicho.md`: duración, palabras por minuto, tipo de gancho y segundos que dura, promesa, nº de bloques, segundo y % en que llega la revelación, ritmo, texto en pantalla y tipo de cierre.
  - Con transcripción (noches alternas): mide todo con sus tiempos.
  - Sin transcripción: deduce lo que se pueda del título, la duración y las visualizaciones, y márcalo como «estimado».
- **Añade** lo de esta noche al final de `docs/estructura-nicho.md` (sección «Registro por noche») y actualiza «Patrones acumulados» si algo se repite en varios vídeos.
- **Aplícalo a los 4 guiones** (paso 4): cada guion indica en `tendencias.md` qué patrón estructural usa (por ejemplo «pregunta + promesa en 3 s + 3 bloques + revelación al 70 % + pregunta final»). Combina patrones de varios vídeos; nunca la estructura exacta de uno solo, ni sus frases.

## 2. Elegir 3 curiosidades

- **Manda el nicho** (propietario, 19/11: «no tienen que ser siempre de eso, mira el nicho y los que más te cuadren los haces»). Elige los 4 temas a partir de lo que **más está funcionando** en la investigación del paso 1, siempre que se pueda verificar y contar de forma original.
- Las categorías son **ejemplos, no una lista cerrada**: cuerpo humano, aviones, trenes, coches, animales, finanzas, espacio, historia, tecnología, comida, deporte, inventos… Puede salir cualquier otra si el nicho lo pide.
- Busca **variedad**: que los 4 Shorts del día no sean del mismo tema y que no se repita siempre lo mismo de un día a otro (mira `data/historial.json`). Si el nicho pide claramente dos temas parecidos, se puede, pero explícalo en `tendencias.md`.
- Guarda la categoría en el campo `tema` del guion (por ejemplo «Aviones», «Finanzas», «Cuerpo humano»), para que la rotación funcione.
- En finanzas y dinero, solo datos verificables (historia del dinero, curiosidades de monedas, bancos, precios históricos…). Nada de consejos de inversión.
- Que no repitan ningún `tema_clave` de `data/historial.json`.
- Que no sean el tema de un Short de referencia. Si es el mismo tema, el enfoque tiene que ser claramente distinto (mito, comparación nueva o dato menos conocido).

## 3. Verificar

- Cada dato que se dice o se muestra necesita **al menos 2 fuentes fiables**, y al menos una debe ser primaria o institucional: NASA/ESA, museos, universidades, revistas científicas, enciclopedias, webs oficiales. Búscalas con WebSearch.
- Si las fuentes no coinciden, quita ese dato o dilo con precisión («unos», «hasta»). Explícalo en `verificacion`.
- Si un dato no se puede verificar, cambia de curiosidad.

## 4. Guiones originales → `PRODUCCION/<fecha>/0N-<slug>/guion.json`

Mismo formato que `content/shorts/001-venus.json`, con estos campos:

- Campos: `id` (`AAAAMMDD-N-slug`), `tema`, `tema_clave` (3–6 palabras), `titulo` (≤ 100 caracteres, termina en `#shorts`), `descripcion` (2–3 frases con el dato y las fuentes), `hashtags` (5–8), `tags`, `fuentes` (URLs), `verificacion`, `escenas`.
- Escenas: 6–8. Cada una tiene `voz`, `icon`, `big` (≤ 12 caracteres), `small` y `accent` (`#FFD23F`, `#FF4D8D`, `#2BD9FE` o `#7B5CFF`). Opcional: `kind` (`hook` en la primera, `giro` en el dato más fuerte, `cta` en la última) y `clip`.
- Iconos disponibles: planet, sun, spin, orbit, calendar, octopus, heart, drop, tower, thermometer, circle, question, myth, check, copper, gills, body, bulb, bolt, alert, spine, clock, moon, egg, eye, rocket, banana, atom, globe. Si ninguno encaja, usa `question` o `bulb`.
- **Duración 25–45 s** (objetivo: 35–42 s para que quepan las 8 piezas): entre 95 y 120 palabras en total. Los números se escriben en letras en `voz` y con cifras en `big`.
- Varía el tipo de gancho entre los 4 Shorts del día: contradicción o mito, cifra concreta, pregunta sobre algo «obvio» o **en segunda persona, sobre algo que el espectador tiene o hace** («tu…», «ahora mismo…»). Prioriza curiosidades útiles o que el espectador pueda comprobar, porque invitan a comentar y compartir.
- Inspírate en técnicas generales, nunca en un vídeo concreto: no repitas el tema, los objetos, las frases ni la estructura exacta de ninguna referencia (`docs/referencias/`, `investigacion/referencias.json`).
- **Estructura: manda el nicho** (propietario, 19/11: «analiza los Shorts más virales de mi nicho y te inspiras en ellos, no los copies»). Parte de la **base de 8 piezas** (`docs/estructura-guion.md`) y adáptala a lo que hacen los Shorts más virales que has analizado esa noche (paso 1b), combinando varios y sin copiar ninguno: 1 gancho que rompe expectativas → 2 introducción → 3 primer cuerpo → 4 **primer bucle abierto** → 5 desarrollo intermedio → 6 **segundo bucle** → 7 último cuerpo con la revelación más sorprendente, que **resuelve todas las incógnitas** → 8 llamada a la acción natural (comentar, compartir o suscribirse).
  - Marca `"pieza"` en cada escena como referencia. Se pueden fundir o saltar piezas si el nicho lo pide; explícalo en `tendencias.md`.
  - **Los bucles no se anuncian** (propietario, 19/11): nada de «lo más sorprendente todavía no te lo he contado» ni «quédate hasta el final». La intriga sale del contenido: pista a medias, pregunta que se tumba, dato que no cuadra o complicación (ejemplos en `docs/estructura-guion.md`). Varía también la llamada a la acción.
  - Lo aprendido del nicho (`docs/estructura-nicho.md`) ajusta los detalles: duración de cada pieza, tipo de gancho y tipo de bucle.
- Escribe desde las fuentes, nunca desde la transcripción de otro vídeo. Combina técnicas de varias referencias, nunca la estructura de una sola.
- Comprueba cada guion: `python3 pipeline/originality.py <guion.json>`. Si falla, reescríbelo.

## 5. Escenas visuales: estilo «divulga», SIEMPRE EL MISMO (`docs/estilo-animacion.md`)

**Regla del propietario (19/11): el canal tiene UNA SOLA ANIMACIÓN.** Usa exactamente la vigente de `docs/estilo-animacion.md` (modelo: Bertha Benz) en los 4 Shorts; solo cambia lo que se dibuja. **No modifiques el estilo** (piezas comunes, paleta, transiciones, subtítulos…). Si en el nicho ves una forma claramente más atractiva, **propónla** en el `INFORME.md` con un fotograma de muestra hecho aparte, sin aplicarla. **Excepción, solo en la producción del 19/11** (Shorts del 20/11): el propietario autorizó aplicar directamente las mejoras que creas convenientes. Hazlas en las piezas comunes para que todos los Shorts las lleven igual, documéntalas en `docs/estilo-animacion.md` y en el informe (con fotogramas de antes y después) y deja que eso sea la única animación del canal desde entonces.


Es el estilo que pidió el propietario, inspirado en técnicas generales de sus 7 vídeos de referencia sin copiarlos. Ejemplos completos: `PRODUCCION/2026-11-19/05-bertha-benz-farmacia/` (guion) y `video/src/divulga/coches.tsx` (escenas).

- Animación de divulgación a pantalla completa: fondos oscuros iluminados, partículas, objetos dibujados con volumen y luz.
- Transiciones continuas con zoom, como entrar dentro del objeto, y una escena nueva cada 2–5 s.
- Etiquetas con cifras que aparecen cuando la voz las dice; subtítulos arriba.

1. **Guion en formato «divulga»**, que sustituye a los campos `icon`, `big` e `ilustracion` del paso 4:
   - `"estilo": "divulga"`.
   - `escenas`: 8–12, cada una con `{clave, kind, pieza, voz}` (`pieza` de 1 a 8, según `docs/estructura-guion.md`). La `clave` lleva un prefijo único del Short (por ejemplo `p3_gancho`). La `voz` lleva el texto de esa escena con sus etiquetas de v4.
   - `marcas`: `{nombre: "palabra exacta del guion"}`, para hacer aparecer etiquetas justo cuando se dice esa palabra.
2. **Escenas en código**: crea `video/src/divulga/<slug>.tsx`, que exporta `ESCENAS_<SLUG>: Record<string, React.FC<EP>>`, y súmalo en `video/src/divulga/registro.ts`. Reutiliza `comunes.tsx` (`C`, `Etiqueta`, `Anillos`, `Bokeh`…) e ideas de `coches.tsx` (paisaje en capas, mapa con ruta que se dibuja, indicador, `Rayos`, `Centro`). Dibuja con SVG propio; nada de imágenes de otros.
3. Comprueba con `npx tsc --noEmit -p video`. Después genera la voz y prepara el montaje sin renderizar: `python3 pipeline/divulga_prep.py PRODUCCION/<fecha>/0N-<slug>`. Esto gasta caracteres de ElevenLabs una sola vez: si existe `work/voz-v4.wav`, se reutiliza.
4. **Revisa la entonación** según `docs/voz-narracion.md`. Si el arranque sale plano o falla una palabra, como mucho **una** toma más. Si hay que unir tomas, el corte va siempre dentro de un silencio medido con `silencedetect`, y luego se comprueba con Whisper que no se repite ni se corta nada.
5. **Revisa los fotogramas antes de renderizar** y compáralos con los del modelo (Bertha Benz): si una escena «no parece del canal», rehazla. `npx remotion still Divulga … --frame=N --scale=0.25` en 10–14 momentos, juntos en una hoja de contactos. Busca solapes con los subtítulos (zona de arriba, `top` 230–420), objetos mal orientados y textos cortados, y corrígelos.
6. **Herramientas de animación disponibles** (instaladas el 19/11; detalle en `CONFIGURACION.md`):
   - Dentro de Remotion: 3D con `@remotion/three` (por ejemplo, un avión, un planeta o un órgano en 3D), Lottie, `@remotion/paths` (trazos que se dibujan), `@remotion/noise` (movimiento orgánico), `@remotion/motion-blur` (desenfoque de movimiento), GSAP (curvas de animación) y transiciones.
   - Fuera de Remotion, para generar piezas que luego se montan como imagen o vídeo: Blender (3D realista), Manim (gráficas y fórmulas), Inkscape (SVG) y Synfig (2D).
   - **Herramienta libre, estilo fijo** (propietario, 19/11): usa la herramienta que más convenga **solo si el resultado se ve idéntico al resto del canal** (`docs/estilo-animacion.md`; por ejemplo, nada de 3D realista). Por defecto, SVG en Remotion como el modelo. Respeta siempre el estilo «divulga»: pantalla completa, fondos oscuros con luz, partículas, zoom continuo entre escenas, etiquetas con cifras, subtítulos arriba, firma discreta y nada copiado de las referencias. El montaje final, con voz, subtítulos y control de calidad, va siempre en Remotion. Si renderizas aparte, deja los archivos en `video/public/shorts/<id>/` y ten en cuenta el tiempo de render (Blender con Cycles en CPU es lento: úsalo en pocos segundos de vídeo).
7. **No uses el estilo «ilustrado» antiguo**: el canal tiene una sola animación.

## 6. Producir y revisar

```bash
python3 pipeline/nocturno.py <fecha>
```

(Detecta `"estilo": "divulga"` y usa `pipeline/divulga_prep.py --render`. Para el resto, `make_short.py`.)

- Hace la voz, los subtítulos, los efectos (sin música), el render, el control de calidad (`qa.json`) y el informe (`INFORME.md`).
  - Voz: **siempre la voz oficial** (Eleven v4 + «datoscuriosin» `kQwUFpYQ184OVlnMEzlm`, `config/publicacion.json` → `voz_estandar`), generada en una sola petición con la clave del entorno. **No hay voz de respaldo**: si falta la clave o no quedan caracteres del plan, el pipeline se para y se avisa al propietario. Nunca se produce con otra voz.
  - Escribe el campo `voz` siguiendo `docs/voz-narracion.md`: pregunta inicial, «preparación, + dato.», golpes cortos y 3 o 4 etiquetas de Eleven v4 como máximo por Short (por ejemplo `[curious]` al principio, `[dramatically]` antes de la revelación y `[warmly]` en la pregunta final).
- Si un Short falla el control de calidad, corrige la causa y vuelve a ejecutar. Por ejemplo: duración fuera de rango → ajusta el número de palabras; voz poco clara → cambia palabras difíciles; originalidad → reescribe. Máximo 2 rondas.
- **No entregues vídeos incompletos**: un Short sin `qa.json` aprobado no cuenta.

## 7. Guardar y avisar

1. Guarda en git los textos (los `.mp4` están en `.gitignore`):
   - `git add PRODUCCION/<fecha> data/historial.json`.
   - Commit «Producción <fecha>». `git push` **solo si hay un remoto configurado** (`git remote -v`); hoy no hay GitHub conectado, así que se queda en local.
2. **Solo si hay GitHub conectado**, sube los MP4 aprobados como release de GitHub: `gh release create produccion-<fecha> PRODUCCION/<fecha>/*/*.mp4 --title "Shorts del <fecha>" --notes-file PRODUCCION/<fecha>/INFORME.md`. Si la release ya existe, usa `gh release upload produccion-<fecha> ... --clobber`.
3. Envía al propietario los 4 MP4 y el `INFORME.md` con la herramienta SendUserFile, con `status: proactive`, para que le lleguen al móvil.
4. Resumen final en el chat:
   - Los 3 títulos, la duración y la voz usada.
   - Qué faltó y por qué (por ejemplo, ElevenLabs sin caracteres: entonces ese Short no se produce).
   - Créditos de ElevenLabs y de vidIQ gastados y restantes.
   - La ruta `PRODUCCION/<fecha>/`.
   - Si faltan Shorts, cuántos y por qué.
5. Recuerda que **nada se publica** sin la aprobación del propietario.
