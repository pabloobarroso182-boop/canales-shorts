# Inspiración en Shorts virales (sin copiar)

_Primera versión: 18/11/2026. La amplía el flujo nocturno con referencias concretas en `PRODUCCION/<fecha>/investigacion/`._

## Qué se pudo analizar

- **No se han visto Shorts concretos de otros creadores.** YouTube está bloqueado en este entorno y Nexlev no tiene consultas hasta el 23/11/2026.
- Esta guía resume **técnicas generales** que repiten guías de creadores de 2026. Son blogs, no datos oficiales de YouTube; las cifras son orientativas.
- **No se usan conectores** (Nexlev, Higgsfield, ElevenLabs MCP…). El flujo nocturno investiga solo con la búsqueda web y guarda lo que encuentra (títulos, textos, enlaces) en `referencias.json`. Sirve para dos cosas: inspirarse en la técnica y **comprobar que nuestros guiones no se parecen a ellos**.

## Técnicas que funcionan (resumen)

| Elemento | Técnica general | Cómo la aplicamos nosotros |
|---|---|---|
| **Gancho (0–2 s)** | Contradicción («lo que crees es falso»), pregunta sobre algo «obvio», resultado primero, cifra concreta | Una frase de ≤ 12 palabras con una cifra o una contradicción, y la misma idea escrita en grande en pantalla desde el fotograma 0 |
| **Mantener la atención** | Bucle abierto: prometer la respuesta y darla tarde; cambios visuales cada 2–4 s; texto en pantalla porque muchos ven sin sonido | Promesa en el gancho y respuesta en la penúltima escena; 6–8 escenas con cambio de fondo e icono; subtítulos palabra a palabra |
| **Estructura** | Pregunta → respuesta breve → «y hay más» → dato sorprendente final | Gancho → contexto en una frase → explicación en 2–3 pasos → **giro** (el dato más fuerte) → pregunta al espectador |
| **Ritmo** | Sin tiempos muertos; empezar en mitad de la acción; 30–45 s es un buen equilibrio | Pausas de 0,2 s entre escenas, frases de 8–16 palabras, 25–45 s |
| **Animación** | Movimiento desde el primer fotograma; zooms y cambios de escena frecuentes | Tarjeta 3D que entra girando; cifra con rebote; suelo en perspectiva; clips 3D de Higgsfield cuando haya créditos |
| **Sonido** | El sonido es secundario respecto a lo visual; efectos que marcan los cortes | **Sin música de fondo** (decisión del canal). Whoosh en los cambios de escena, pop al empezar y ding en el giro final, siempre por debajo de la voz |
| **Comentarios y compartidos** | Preguntas reales al espectador; datos que se comentan («¿lo sabías?»); final que enlaza con el principio | Cierre con una pregunta concreta y fácil de contestar («¿Cuál te ha sorprendido más: A o B?»); datos «para contar a alguien» |
| **Repeticiones (bucle)** | Que el final enlace con el principio | La última frase remite al gancho cuando el tema lo permite |

## Reglas de originalidad (obligatorias)

1. **Nunca** se reutilizan vídeos, audios, guiones, animaciones ni miniaturas de otros creadores.
2. Las referencias solo se usan para aprender **técnicas generales** (tipo de gancho, ritmo, estructura). Cada Short combina técnicas de **varias** referencias, nunca la estructura de una sola.
3. Cada guion se escribe desde cero a partir de las **fuentes de verificación**, no a partir de otro vídeo.
4. Si un tema ya está muy explotado (por ejemplo, «el pulpo tiene tres corazones»), se busca un **enfoque nuevo**: un mito desmentido, una comparación inesperada o un dato menos conocido del mismo tema.
5. Antes de entregar, `pipeline/originality.py` compara el guion con las transcripciones de referencia guardadas y con todos nuestros guiones anteriores:
   - **Rechazado** si comparte más del 12 % de sus secuencias de 5 palabras con cualquier texto.
   - **Rechazado** si repite el tema principal de un Short nuestro anterior (historial).
   - Además, el agente revisa que el gancho no sea el título de una referencia.

## Fuentes

- [18 Viral Hooks for YouTube Shorts (vidIQ)](https://vidiq.com/blog/post/viral-video-hooks-youtube-shorts/)
- [Viral Hook Formulas for Short-Form Video (UGC Copilot)](https://ugccopilot.ai/blog/viral-hooks-that-convert/)
- [YouTube Shorts viral hack (air.io)](https://air.io/en/youtube-hacks/17-hacks-to-make-youtube-shorts-go-viral)
- [8 formatos virales (Revid)](https://www.revid.ai/blog/youtube-short-video-viral)
- [Psicología de los ganchos virales (Virvid)](https://virvid.ai/blog/viral-hook-psychology-2026-short-videos)
- [Algoritmo de YouTube Shorts (Schedulala)](https://schedulala.com/es/blog/algoritmo-youtube-shorts)
- [Duración de YouTube Shorts (Schedulala)](https://schedulala.com/es/blog/duracion-youtube-shorts)
- [Ganchos y bucles de curiosidad (Crescitaly)](https://blog.crescitaly.com/estrategia-crecimiento-youtube-shorts-hooks-curiosity-loops/)
- [Cómo escribir ganchos virales (Short.now)](https://short.now/blog/how-to-create-viral-video-hooks/)
- [Algoritmo de Shorts explicado (Fliki)](https://fliki.ai/blog/youtube-shorts-algorithm-explained)
- [Métricas de interacción de Shorts (Thunderbit)](https://thunderbit.com/blog/youtube-shorts-statistics-engagement-metrics)

## Referencia analizada nº 1 · «¿Tu contraseña es de 8 letras?» (@rjavier)

_Grabación de pantalla aportada por el propietario (fragmento de 10,7 s). Métricas visibles: 46 K me gusta, 508 comentarios._

| Aspecto | Qué hace | Técnica general que adoptamos (sin copiar) |
|---|---|---|
| **Gancho** | Pregunta que afecta al espectador («¿cuánto tarda un hacker en adivinar **tu** contraseña?»), repetida en el título | Ganchos en segunda persona sobre algo que el espectador tiene o hace; el título y el gancho dicen lo mismo |
| **Imagen** | Un único objeto 3D protagonista (un candado dorado) que se **transforma** con cada frase: rodillos que giran, letras que se colocan, contadores, una explosión de combinaciones | Un «objeto protagonista» por Short que evoluciona, en lugar de escenas sueltas |
| **Datos en pantalla** | Las cifras **cuentan en directo** al decirlas (0,45 s → 1,17 s → 1,27 s; 7 → 95 → 1.181 años) | Los números grandes suben desde 0 hasta su valor mientras la voz los dice |
| **Ritmo** | Plano continuo, sin cortes duros (solo 1 cambio fuerte en 10,7 s), pero algo cambia en pantalla casi cada segundo; voz rápida (~3,1 palabras/s) sin pausas | Pausas entre frases más cortas; movimiento constante aunque no haya corte |
| **Subtítulos** | Centrados, blancos con contorno negro, 1–3 palabras por página; **palabras clave en amarillo** (CONTRASEÑA, FRASE, SIGLOS) | Ya lo hacemos (palabra activa en amarillo); se pueden marcar además palabras clave fijas |
| **Estética** | Fondo verde azulado oscuro, rayos de luz dorada, partículas; aspecto de cine | Mantenemos nuestra paleta propia (noche, chispa, coral, violeta, cian) |
| **Estructura** | Pregunta → cifra del caso típico (sorpresa: «menos de lo que tardas en leer esto») → giro contraintuitivo («una frase larga y tonta aguanta siglos») → explicación («porque…») | Pregunta → dato → giro contraintuitivo → «porque» |
| **Comentarios y compartidos** | Utilidad práctica + algo que el espectador puede comprobar o contar («¿cuántas letras tiene la mía?») | Priorizar curiosidades útiles y comprobables, y cerrar con una pregunta sobre el propio espectador |

**Lo que no haremos:** el tema de las contraseñas y los hackers, el candado, los rodillos de letras ni su guion. Su transcripción está en `docs/referencias/` y el control de originalidad compara cada guion nuestro con ella.

## Referencia analizada nº 2 · «Si la regla te tumba en la cama…» (@duocare-es) — **estilo objetivo del canal**

_Grabación de pantalla aportada por el propietario (fragmento de ~9 s). El propietario quiere que nuestros Shorts se parezcan a este **estilo**._

| Aspecto | Qué hace | Cómo lo hacemos a nuestra manera |
|---|---|---|
| **Estilo visual** | Ilustración plana 2D, personaje en un escenario cotidiano que vive lo que se cuenta | Kit propio en Remotion (`video/src/ilustrado/`): personajes, escenarios y recursos dibujados con código, con nuestra paleta y un contorno oscuro propio |
| **Una metáfora por frase** | Bocadillos con frases típicas, calendario que pasa hojas, lupa circular sobre un detalle, multitud para «1 de cada 10» | Tipos de escena reutilizables: `habitacion`, `ciudad`, `espacio`, `objeto`, con capas `bocadillos`, `lupa`, `multitud`, `calendario`, `medidor` y `cifra` |
| **Cámara** | Movimiento continuo dentro de la ilustración; casi sin cortes duros | Acercamiento lento constante y transición suave entre escenas |
| **Subtítulos** | Una palabra cada vez, blanca con sombra, centrada | Modo «palabra» con Montserrat 900; las cifras en amarillo |
| **Gancho** | Pregunta que interpela («¿te han dicho que…?») + tema cercano y útil | Ganchos en segunda persona y temas cotidianos y útiles |

**Lo que no haremos:** el tema (salud menstrual / endometriosis), su personaje, su habitación ni sus frases. El control de originalidad compara cada guion con su transcripción.
