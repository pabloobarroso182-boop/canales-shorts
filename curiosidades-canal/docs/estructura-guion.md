# Estructura estándar de los guiones · Datos Curiosos

_Propuesta por el propietario el 19/11/2026 como **base**. Matiz del propietario ese mismo día: «tú analiza los Shorts más virales de mi nicho y te inspiras en ellos, no los copies». Por eso **manda lo que funciona en el nicho** (`docs/estructura-nicho.md`): si los Shorts más virales usan otra cosa (ganchos más cortos, revelación antes, menos bucles…), el guion se adapta, combinando patrones de varios vídeos y sin copiar ninguno. En el informe se explica qué estructura usa cada Short y en qué Shorts virales se inspira._

| # | Pieza | Qué hace | Extensión orientativa (Short de 30–45 s, ~100–115 palabras) |
|---|---|---|---|
| 1 | **Gancho** | Rompe las expectativas del espectador. Capta su atención al instante para que deje de deslizar. | 6–12 palabras · ≤ 3 s |
| 2 | **Introducción** | Presenta la curiosidad y prepara al espectador para lo que va a descubrir. | 8–15 palabras |
| 3 | **Primer cuerpo** | Empieza a desarrollar la información con los primeros datos interesantes. | 12–20 palabras |
| 4 | **Primer bucle abierto** | Deja una incógnita **con el propio contenido**, sin anunciarla: una pregunta, una pista a medias o un dato que no cuadra. | 3–12 palabras |
| 5 | **Desarrollo intermedio** | Sigue aportando información interesante sin resolver aún la intriga principal. | 12–20 palabras |
| 6 | **Segundo bucle** | Otra incógnita o más tensión, también **dentro de la historia**: un giro, una pregunta retórica que se tumba o un «pero» que lo complica. | 3–12 palabras |
| 7 | **Último cuerpo** | Desarrolla la última parte y revela lo más sorprendente, **resolviendo todas las incógnitas** planteadas. | 15–25 palabras |
| 8 | **Llamada a la acción** | Cierre natural que invita a comentar, compartir o suscribirse. | 5–12 palabras |

## Reglas

- **Todo bucle abierto se cierra** en la pieza 7. Nada de anzuelos falsos: la intriga tiene que corresponder a un dato real y verificado.
- **Los bucles NO se anuncian** (corrección del propietario el 19/11: «los Shorts de curiosidades no tienen frases de esas»). Prohibidas las frases que hablan del propio vídeo: «lo más sorprendente todavía no te lo he contado», «quédate hasta el final», «espera, que hay más», «y aquí viene lo mejor». La intriga sale del contenido, como en las referencias:
  - **Pista a medias:** «Pista: pesaban menos que el promedio.» (da la mitad y deja la otra mitad para después).
  - **Pregunta que se tumba:** «¿Memorizan más? No.»
  - **Dato que no cuadra:** «Pero la cuenta no sale.» / «Y aun así… llegó a la Luna.»
  - **Misterio dicho como hecho:** «Buscaba el secreto del genio.» / «Nadie sabía por qué.»
  - **Complicación:** «Había un problema: todavía no existían las gasolineras.»
  Cortas, de 3 a 12 palabras, y siempre resueltas en la pieza 7.
- **La llamada a la acción también varía**: una pregunta concreta sobre el tema (que invite a comentar), «mándaselo a quien…» (compartir) o «sígueme para el dato de mañana» (suscribirse). Natural, nunca larga.
- **Voz** (`docs/voz-narracion.md`): gancho con `[curious]` o una afirmación rotunda; los bucles (piezas 4 y 6) con una pausa natural (punto o `…`), como el «Pista,» de la referencia; `[dramatically]` en la revelación de la pieza 7; `[warmly]` en la llamada a la acción. Como mucho 3 o 4 etiquetas por Short.
- **Visual** (estilo «divulga»): cada pieza tiene al menos una escena. En los bucles (4 y 6), un recurso de intriga: zoom lento, oscurecer, una interrogación o un objeto tapado. En la pieza 7, el cambio visual más fuerte del vídeo.
- Duración total de 25–45 s, con el objetivo de unos 35–42 s para que quepan las 8 piezas sin correr.

## En el guion (`guion.json`)

Cada escena lleva `"pieza": 1…8` como referencia (una pieza puede ocupar varias escenas, y se pueden fundir o saltar piezas si el nicho lo pide). El control de calidad (`pipeline/qa.py`) lo muestra como información, sin rechazar el Short.
