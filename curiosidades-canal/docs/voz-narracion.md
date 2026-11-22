# Estándar de voz y narración · Datos Curiosos

> **Voz oficial desde el 22/11/2026** (propietario: «QUIERO QUE UTILICES LA VOZ DEL ARCHIVO PARA LA CREACIÓN DE LOS SHORTS», «sin elevenlabs» y «aplica también las reglas de audio que teníamos con la otra voz»):
> - La voz es la del archivo del propietario («curiosidades281»), clonada en local con **Qwen3-TTS** (`pipeline/voz_qwen.py`, referencia en `assets/voz/oficial-qwen/`), sin ElevenLabs. Es la misma en los 4 canales.
> - Se aplican **TODAS las reglas de audio de antes** (`docs/voz-narracion.md`): guion que arranca con una pregunta, «preparación, + dato.», golpes cortos, pausas de 0,3–0,5 s, ningún silencio de más de 0,8 s, variación de tono ≥ 3,8 st, arranque ≥ +5 st, 150–185 pal/min, Whisper ≥ 95 %, −14 LUFS, pico ≤ −1 dB, sin estirar el audio, **sin música** y efectos con ducking.
> - Si una narración no lo cumple, se repite hasta 3 veces y se avisa en el informe.
> - «datoscuriosin» (ElevenLabs) queda como voz anterior y no se usa.
> 
> Las secciones 3–6 (interpretación, guion, control de calidad) siguen vigentes con la voz nueva. Las etiquetas de Eleven v4 ya no se leen: `voz_qwen.py` las quita y elige las tomas que cumplen la entonación.


_Creado el 19/11/2026 a partir de la «Configuración definitiva de voz y narración» del propietario. Estado: **APROBADA el 19/11/2026.** El propietario elige la **prueba 1 (Apolo 12)** como voz oficial del canal._

## 1. Herramienta

- Solo **ElevenLabs, modelo `eleven_v4`**. Nada de Chatterbox, Kokoro ni otros modelos para las narraciones (Kokoro queda solo como respaldo de emergencia y no se usa sin permiso).
- Una sola voz y una sola configuración para todos los Shorts, una vez aprobada. El Voice ID se fija en `config/publicacion.json` → `voz`.

## 2. La voz de referencia (qué se ha comprobado)

Comparación de timbre (distancia media de los espectros, 0 = idéntica):

| Audio | Distancia con las referencias |
|---|---|
| Referencias entre sí (`muestra1`, `muestra2`, Short de Einstein, Short de la herida, Short de la piedra) | **0,12–0,37**: son la misma voz |
| Muestra que el propietario dio para clonar (`muestra-clon-datocuriosin.wav`) | **0,16–0,33**: la misma voz que las referencias |
| Voz clonada «datoscuriosin» con Eleven v4 (prueba H1) | 0,30–0,44 (la más cercana generada) |
| Mejores voces del catálogo (≈ 260 voces masculinas comparadas: José A. del Río, Santiago Fernández, Javier, Juanjo…) | 0,52–0,73 |

- **No se ha encontrado la voz original en el catálogo de ElevenLabs.** No hay Voice ID de la voz original; no se inventa ninguno.
- Esa voz aparece en Shorts de varios canales distintos (@PorQu…ciona-yt, @Tu_loco_datos y el de Einstein). Probablemente es una voz de la biblioteca de ElevenLabs o una voz clonada por otra persona. Clonarla solo es aceptable si el propietario tiene derecho sobre ella (lo declaró el 19/11 para su muestra de 62 s).

## 3. Cómo interpreta la voz de referencia (medido frase a frase)

Tono en semitonos respecto a la media del hablante (inicio → final de cada frase):

| Recurso | Ejemplo de las referencias | Medida |
|---|---|---|
| **Arranque con pregunta muy alta** | «¿Qué tiene el cerebro de Einstein que no tenga el tuyo?» | empieza a **+8 / +9 st** y cae a −2 / −4 |
| **Preparación con coma que sube** (suspense antes del dato) | «En Suiza,» · «Pista,» · «Cuando murió,» | termina **subiendo** de +3 a +9 st |
| **Dato o revelación que cae** | «poco más de tres.» · «pesaban menos que el promedio.» · «como una cremallera.» | cae **−5 a −7 st** (tono de documental, seguro) |
| **Golpe de una palabra** | «No,» · «sí,» | grave y seco (−3 a −9 st), muy corto |
| **Pregunta retórica a mitad** | «¿Memorizan más?» | lenta (80–95 pal/min) y con subida |
| **Velocidad variable** | explicaciones rápidas, golpes lentos | **95–245 pal/min**, media ≈ 165 |
| **Pausas** | entre frases | 0,35–0,48 s; casi ninguna dentro de la frase |
| **Cierre** | «…como una cremallera.» | caída marcada y final, sin alargar |

Conclusión práctica: buena parte de la interpretación sale de **cómo está escrito el guion** (pregunta inicial, coma de suspense y después el dato, frases cortas), más que de las etiquetas.

## 4. Reglas para escribir el guion (para que Eleven v4 lo interprete así)

1. **Primera frase: una pregunta o una afirmación imposible**, de 8 a 12 palabras.
2. Patrón **«preparación, + dato.»**: «En Brasil, más de sesenta.» La coma crea la subida y el punto la caída.
3. **Golpes de una o dos palabras** con punto: «No.» «Dos.» «Pista:»
4. Frases de **5 a 14 palabras**. Alterna: explicación rápida, golpe corto y explicación rápida.
5. Números escritos en letra si son cortos («tres», «sesenta») y en cifra si son largos («240»).
6. **Final**: un dato rotundo que cae, o una pregunta directa al espectador. Sin despedidas largas.

## 5. Etiquetas de Eleven v4 (con moderación)

- **Como máximo 3 o 4 por Short**, y nunca dos seguidas.
- `[curious]` en la pregunta inicial, `[dramatically]` o `[serious]` antes de la revelación principal, `[excited]` en el dato más sorprendente y `[warmly]` en la pregunta final.
- `[pause]` solo antes del golpe más importante. El resto de las pausas salen de la puntuación (punto, coma o puntos suspensivos).
- Las etiquetas no se pronuncian. Se comprueba con Whisper que el texto transcrito coincide con el guion.

## 6. Control de calidad de cada narración

- Transcripción con Whisper: al menos el 95 % de las palabras coincide con el guion, sin etiquetas leídas en voz alta.
- Entre 150 y 185 palabras por minuto de media. Pausas entre frases de 0,3 a 0,5 s.
- Variación de tono ≥ 3,8 st. La pregunta inicial empieza a ≥ +5 st y las frases de dato terminan cayendo.
- Sin recortes de volumen ni silencios de más de 0,8 s. Volumen final de −14 LUFS.
- **No se estira el audio** (produce eco): la velocidad sale de ElevenLabs y del guion.

## 7. Lo que no se puede reproducir (dicho claramente)

- **El timbre exacto** de las referencias solo se consigue con la voz clonada a partir de la muestra del propietario. Ninguna voz del catálogo lo iguala.
- **La entonación no se puede copiar frase a frase**: Eleven v4 decide la melodía final. Se puede guiar con el guion, la puntuación y las etiquetas, pero cada generación varía un poco.
- **El arranque a +9 st** a veces sale más plano (+3 / +5 st). Si pasa, se vuelve a generar esa frase.

## 8. Prueba obligatoria (19/11/2026) · voz «datoscuriosin» `kQwUFpYQ184OVlnMEzlm`, Eleven v4, español

Misma voz y configuración en las tres (`assets/voz/estandar-v4/`). 1 062 créditos.

| Prueba | Duración | Variación | Pausas (media) | Timbre frente a las referencias | Arranque |
|---|---|---|---|---|---|
| 1 · Apolo 12 | 24 s | 4,47 st | 0,28 s | 0,45 | **+10 st** (como la referencia) |
| 2 · Hora de España | 21 s | 4,73 st | 0,33 s | **0,28 (dentro del margen de la propia voz original)** | +2,4 st (más plano) |
| 3 · Primer mensaje | 24 s | 4,49 st | 0,31 s | 0,39 | +1,9 st (más plano) |
| Referencias | — | 4,0–4,6 st | 0,35–0,48 s | 0,12–0,37 entre sí | +8 / +9 st |

Lo que coincide con las referencias: las comas de preparación suben («Cinco días después,» +5 st; «Pista,» +8,7 st, igual que el «Pista,» de la referencia, +9,4 st), las revelaciones caen («estaban pisando la Luna» −8,8 st; «a más de 500 kilómetros» −7,3 st) y la velocidad varía entre 68 y 243 pal/min. Ninguna etiqueta se leyó en voz alta.

Lo que no coincide: en 2 de las 3 pruebas el arranque sale más plano que en las referencias. Las pausas son algo más cortas (0,3 s frente a 0,35–0,48 s). El «lo» final de la prueba 3 sube como una pregunta en lugar de caer. En la plataforma, la generación solo muestra el ajuste de idioma; no se ha podido confirmar que se aplicaran la estabilidad y la similitud.

## 9. Decisión

**19/11/2026: el propietario aprueba la prueba 1** como voz oficial y permanente de Datos Curiosos: `eleven_v4` + `kQwUFpYQ184OVlnMEzlm` + `es` + estabilidad 0,5 y similitud 0,85. Muestra de referencia: `assets/voz/estandar-v4/prueba-1-apolo12.mp3`.

## 10. Unir tomas (lección del 19/11)

Si hay que combinar dos tomas, el corte se hace **dentro de un silencio medido en el propio audio** (`ffmpeg … silencedetect`), nunca con los tiempos de fin de Whisper: llegan hasta la palabra siguiente y se cuela un trozo de ella. Después se transcribe el resultado para comprobar que no se repite ni se corta ninguna palabra.
