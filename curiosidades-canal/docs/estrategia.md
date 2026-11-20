# Curiosidades de Todo Tipo — Investigación y estrategia

> **Actualización 18/11/2026:** el canal pasa a llamarse **Datos Curiosos** (identificador **@datoscuriososs.1**). El resto del documento conserva el nombre anterior.

_Fecha: 18/11/2026_

## 1. Qué se pudo investigar (y qué no)

- La herramienta de análisis de YouTube conectada (Nexlev, plan gratuito) había agotado su cupo semanal (50/50 consultas, se renueva el 23/11/2026). Por eso **no hay datos propios de vistas, ingresos ni vídeos top de los competidores**. La investigación se hizo con búsqueda web; las cifras de terceros (vidIQ, Social Blade, blogs) son orientativas.
- `youtube.com` está bloqueado en este entorno, así que tampoco se pudieron revisar los canales a mano.

## 2. Competidores principales en español

| Canal | Datos públicos (fuente) | Estilo |
|---|---|---|
| Mundo Curiosidades | ~4,3 M suscriptores; perdió ~10 mil en 30 días (vidIQ) | Recopilatorios largos, voz en off |
| Curiosidades \| Bloopers | ~1,3 M suscriptores, ~2.700 vídeos (Social Blade) | Volumen alto, temas variados |
| SuperCurioso | Canal veterano de curiosidades variadas | Países, misterios, ciencia, cultura |
| El Curioso Ben (CuriosoBen) | ~600 M reproducciones (Xataka); mucho clickbait y temas paranormales | Sensacionalista |
| Inventor Channel | ~907 mil suscriptores | Curiosidades prácticas / DIY |

**Patrón detectado:** los grandes canales de curiosidades en español nacieron con vídeos largos tipo «25 cosas que no sabías» y abusan del clickbait o de datos sin fuente. En Shorts hay mucha competencia general (más de 10 millones de canales publican Shorts cada día según una fuente de 2026), pero la oferta de curiosidades **en español, verificadas y con buena producción** es menor que en inglés.

## 3. Tendencias y lo que premia el algoritmo de Shorts

- **Desde marzo de 2025** una vista de Short cuenta al empezar la reproducción; la métrica exigente pasó a ser «vistas con interacción» (engaged views).
- Señales que más se repiten como importantes: **porcentaje que elige ver** (viewed vs. swiped), **duración media** y **% medio visto**. No hay umbrales oficiales: las cifras del 70–80 % que circulan son de blogs.
- Recomendaciones consistentes: gancho en 1–2 segundos con una promesa concreta, ritmo sin tiempos muertos y final que enlace con el principio (bucle).
- Temas que varias fuentes señalan como poco explotados en Shorts: **historia antigua, cuerpo humano/salud, animales sorprendentes, escenarios «¿qué pasaría si…?» y psicología**.

## 4. Oportunidades y cómo diferenciarnos

1. **Curiosidades verificadas con fuente en la descripción.** Es lo contrario del clickbait de los grandes. Cada guion pasa una verificación (ver el campo `verificacion` de cada JSON). Ejemplo real: el mito de que «la Torre Eiffel crece 15 cm en verano» se cambió por lo que dice la web oficial.
2. **Formato «Mito desmentido».** Engancha por la sorpresa y nos posiciona como canal fiable.
3. **Identidad visual fija y reconocible**: fondo cósmico con suelo 3D, orbe con icono, cifra enorme y subtítulos grandes con la palabra activa en amarillo. Al pasar el dedo se reconoce el canal.
4. **Duración 20–30 s**, con un dato por escena y cierre rápido para favorecer el % visto y las repeticiones.
5. **Series** que se pueden convertir en listas de reproducción: Espacio, Animales increíbles, Mitos desmentidos, Cuerpo humano, Historia en 30 segundos, ¿Qué pasaría si…?

## 5. Estrategia de crecimiento (primeros 90 días)

| Fase | Días | Objetivo | Acciones |
|---|---|---|---|
| Arranque | 1–30 | Encontrar los temas que retienen | 3 Shorts al día (13:30, 18:30 y 21:30, hora de Madrid), rotando 6 series; misma plantilla; medir el % que elige ver y el % visto |
| Doblar lo que funciona | 31–60 | Concentrarse | 60 % de los Shorts en las 2 series con mejor retención; probar 2 ganchos distintos por tema |
| Escalar | 61–90 | Comunidad | Responder comentarios con nuevos Shorts («me preguntasteis…»); listas por serie; Short fijado en el canal |

**Reglas de mejora semanal** (con `stats.py`):
- Gancho: si el % que elige ver de un Short está muy por debajo de la media del canal, se reescribe ese tipo de gancho.
- Retención: si el % medio visto cae a mitad de vídeo, se acorta el guion (menos de 75 palabras).
- Temas: se repiten los temas que superan la media en vistas con interacción y suscriptores ganados.

**Monetización** (Programa de Partners de YouTube): exige suscriptores y vistas mínimas que cambian con el tiempo; hay que comprobar los requisitos vigentes en YouTube Studio.

## 6. Identidad del canal

- **Nombre:** Curiosidades de Todo Tipo
- **Handle deseado:** @datoscuriososs.1 (pendiente de comprobar, ver el README)
- **Paleta:** Noche `#0A0E27` · Chispa `#FFD23F` · Coral `#FF4D8D` · Violeta `#7B5CFF` · Cian `#2BD9FE` · Blanco
- **Tipografías:** Archivo Black (titulares y subtítulos) · Montserrat 600–900 (textos de apoyo)
- **Símbolo:** «?» amarillo dentro de un orbe degradado, con una órbita y una chispa como punto: «el universo de las preguntas».

### Descripción del canal (para pegar en YouTube Studio)

> ¿Sabías que en Venus un día dura más que un año? En **Curiosidades de Todo Tipo** te contamos en menos de 30 segundos los datos más sorprendentes del espacio, los animales, el cuerpo humano, la historia y la ciencia… y desmentimos los mitos que todo el mundo repite.
>
> ✅ Curiosidades verificadas: cada vídeo lleva sus fuentes en la descripción.
> 🎬 Shorts nuevos cada día.
> 🧠 Aprende algo nuevo en lo que tardas en pasar al siguiente vídeo.
>
> Suscríbete y activa la campanita para no perderte ninguna curiosidad. ¿Tienes una pregunta que quieras que respondamos? Déjala en los comentarios.

Palabras clave del canal: curiosidades, datos curiosos, sabías que, mitos, ciencia, espacio, animales, historia, cultura general.

## Fuentes

- [Mundo Curiosidades en vidIQ](https://vidiq.com/youtube-stats/channel/@mundocuriosidad-es/)
- [Curiosidades | Bloopers en Social Blade](https://socialblade.com/youtube/handle/curiosidadesbloopers/achievements)
- [4 canales de YouTube para aprender sobre curiosidades del mundo (WWWhat's New)](https://wwwhatsnew.com/2019/01/12/4-canales-de-youtube-para-aprender-sobre-curiosidades-del-mundo/)
- [CuriosoBen (Xataka)](https://www.xataka.com/otros/curiosoben-nuevo-cabronazi-600-millones-reproducciones-youtube-facebook-lleno-videos-ajenos/amp)
- [Tendencias de YouTube 2026 (Content Society)](https://contentsociety.co/blog/tendencias-youtube-2026)
- [Cómo funciona el algoritmo de Shorts en 2026 (OutlierKit)](https://outlierkit.com/resources/youtube-shorts-algorithm/)
- [Viewed vs. Swiped (ContentMatch)](https://contentmatch.io/youtube-shorts-algorithm-viewed-vs-swiped-ratio-2026/)
- [Cambio en el recuento de vistas de Shorts (Gyre)](https://gyre.pro/blog/youtube-shorts-view-count-update-impact-strategy-what-to-do-next)
- [Nichos faceless 2026 (Revid)](https://www.revid.ai/blog/best-faceless-youtube-niches)
- [Nichos con IA, 500 vídeos virales (Virvid)](https://virvid.ai/blog/best-ai-niches-faceless-channels-2026)
- [Canal faceless con IA (Autoshort)](https://autoshort.io/es/blog/faceless-youtube-channel-ai-guide-2026)
- [Why does the Eiffel Tower change size? (web oficial)](https://www.toureiffel.paris/en/news/history-and-culture/why-does-eiffel-tower-change-size)
- [Ten curious facts about octopuses (Smithsonian)](https://www.smithsonianmag.com/science-nature/ten-curious-facts-about-octopuses-7625828/)
- [Why Venus spins the wrong way (Scientific American)](https://www.scientificamerican.com/article/why-venus-spins-the-wrong/)
- [Restricción a privado de proyectos sin auditar (Ayrshare)](https://www.ayrshare.com/solutions/google-api-error-403-unverified-app-how-to-fix-the-audit-pipeline/)
- [Cuota de la API de YouTube en 2026 (Phyllo)](https://www.getphyllo.com/post/is-the-youtube-api-free-in-2026-quota-limits-costs-when-to-pay)
