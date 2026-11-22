# Reglas de voz y audio · canales nuevos

Las mismas que «Datos Curiosos». Decidido por el propietario el 19/11/2026.

**Se aplica a:**
- Ahora Lo Entiendes (antes «Sala de Espera», `/home/user/canal2-shorts`)
- Escenario Imposible
- Tu Cerebro Te Engaña

**Documento maestro:** `/home/user/curiosidades-canal/docs/voz-narracion.md`. Si cambia allí, cambia aquí.

## Voz (idéntica a Datos Curiosos)

**Voz oficial desde el 22/11/2026** (propietario: «QUIERO QUE UTILICES LA VOZ DEL ARCHIVO PARA LA CREACIÓN DE LOS SHORTS», «sin elevenlabs» y «aplica también las reglas de audio que teníamos con la otra voz»):
- La voz es la del archivo del propietario («curiosidades281»), clonada en local con **Qwen3-TTS** (`pipeline/voz_qwen.py`, referencia en `assets/voz/oficial-qwen/`), sin ElevenLabs. Es la misma en los 4 canales.
- Se aplican **TODAS las reglas de audio de antes** (`docs/voz-narracion.md`): guion que arranca con una pregunta, «preparación, + dato.», golpes cortos, pausas de 0,3–0,5 s, ningún silencio de más de 0,8 s, variación de tono ≥ 3,8 st, arranque ≥ +5 st, 150–185 pal/min, Whisper ≥ 95 %, −14 LUFS, pico ≤ −1 dB, sin estirar el audio, **sin música** y efectos con ducking.
- Si una narración no lo cumple, se repite hasta 3 veces y se avisa en el informe.
- «datoscuriosin» (ElevenLabs) queda como voz anterior y no se usa.

### Configuración anterior (hasta el 22/11, ya no se usa)

| Parámetro | Valor |
|---|---|
| Herramienta | ElevenLabs, modelo **`eleven_v4`** |
| Voz | **«datoscuriosin» `kQwUFpYQ184OVlnMEzlm`** |
| Idioma | `es` (español de España) |
| Estabilidad / similitud | **0,5 / 0,85** |
| Muestra de referencia | `curiosidades-canal/assets/voz/estandar-v4/prueba-1-apolo12.mp3` |

- **Misma voz y misma configuración en TODOS los Shorts de los 4 canales** (Datos Curiosos, Ahora Lo Entiendes, Escenario Imposible y Tu Cerebro Te Engaña). El propietario lo confirmó otra vez el 19/11 por la noche: «en todos los shorts se utilice la voz de datoscuriosin».
- La voz es la de **ElevenLabs**. El clon de «datoscuriosin» hecho con Qwen3-TTS (`voz_qwen.py`) **no se usa** salvo que el propietario lo pida expresamente.
- No se cambia ni se «mejora» por iniciativa propia.
- **No se usan** voces diseñadas, voces de catálogo, Qwen3-TTS, Chatterbox ni Kokoro para narrar.
  - Las 3 voces de prueba de Qwen3-TTS (`canales-nuevos/voces/`) quedan **descartadas**. No se borran, pero no se usan.
  - Para cambiar esto hace falta el permiso expreso del propietario.
- La producción comprueba la voz antes de generar (`comprobar_voz()` en `canal2-shorts/pipeline/producir.py`). Si el voice_id, el modelo, el idioma o los ajustes no coinciden, para.

## Guion para la voz
Igual que la sección 4 de `voz-narracion.md`.
- Primera frase: una pregunta o una afirmación imposible, de 8 a 12 palabras.
- Patrón «preparación, + dato.»: la coma sube y el punto cae.
- Golpes de 1 o 2 palabras.
- Frases de 5 a 14 palabras.
- Números cortos en letra; números largos en cifra.
- Final rotundo o una pregunta directa al espectador.
- Etiquetas de Eleven v4: 3 o 4 como máximo por Short, nunca dos seguidas. `[curious]`, `[dramatically]`/`[serious]`, `[excited]`, `[warmly]`; `[pause]` solo antes del golpe principal.

## Audio
- **Sin música de fondo.** Solo voz y efectos de sonido.
- Efectos (whoosh, pop, ding, golpe…) de bibliotecas libres (Earshot), con **ducking**: bajan solos cuando habla la voz.
- **No se estira el audio**, porque produce eco. La velocidad sale de ElevenLabs y del guion.
- Para unir dos tomas, el corte se hace dentro de un silencio medido con `silencedetect`, nunca con los tiempos de Whisper.

## Control de calidad de cada narración (obligatorio)
- Whisper: al menos el 95 % de las palabras coincide con el guion y no se lee ninguna etiqueta en voz alta.
- 150–185 palabras por minuto de media. Pausas entre frases de 0,3 a 0,5 s y ningún silencio de más de 0,8 s.
- Variación de tono de 3,8 st o más. La pregunta inicial empieza a +5 st o más y los datos terminan cayendo.
- Sin recortes de volumen. **−14 LUFS** finales (tolerancia de −16 a −12) y pico de −1 dB como máximo.
- El resultado se guarda en `qa.json` de cada Short.

## Límites
- Los **caracteres de ElevenLabs se comparten con Datos Curiosos** (plan Starter, 40 000 al mes).
- Antes de producir en los canales nuevos hay que confirmar que hay presupuesto. **Datos Curiosos tiene prioridad.**
- No se compran créditos ni se cambia de plan sin permiso.
