# Estado del proyecto

> **22/11/2026 18:15 (Madrid):** la tarea de las 18:00 arrancó en una máquina nueva. Proyecto recuperado desde GitHub; **no se produjeron los Shorts del 23/11** (la tarea lo prohíbe en máquina nueva y además faltan Whisper, Remotion y las librerías de Python). Pendiente del propietario: (1) confirmar si sigue la pausa hasta el 1/12; (2) aclarar la voz (la tarea dice ElevenLabs, las reglas del 22/11 dicen Qwen3-TTS); (3) que la tarea use el entorno «Default» con el script de inicio. En `PRODUCCION/2026-11-23/` hay un Short (01, flamencos) a medio hacer y el guion del 02.

_Última actualización: 19/11/2026 (Madrid)._

## Situación en una frase

El sistema de producción funciona y está probado, con el estilo ilustrado, la marca «Datos Curiosos» y el control de calidad. **Falta que el propietario confirme la voz (C ajustada) y conecte YouTube.** Todavía no se ha publicado nada.

## Identidad actual

- Canal: **Datos Curiosos** · identificador deseado: **@datoscuriososs.1** (disponibilidad sin comprobar).
- Cuenta de Google del canal: **datoscuriososs790@gmail.com**.
- Antes se llamaba «Curiosidades de Todo Tipo», con @curiosidadesdetodotipo.1 y curiosidadesdetodotipoo1@gmail.com. Lo cambió el propietario el 18/11.

## Tareas pendientes (en orden)

| # | Tarea | Quién | Estado |
|---|---|---|---|
| 1 | ~~Elegir la voz~~ → **Hecho 19/11:** voz oficial aprobada (prueba 1: Eleven v4 + «datoscuriosin» `kQwUFpYQ184OVlnMEzlm`, `docs/voz-narracion.md`) | Propietario | ✅ |
| 1b | Clave de API de ElevenLabs y pipeline con la voz oficial: **hecho y comprobado el 19/11** (prueba completa sin gastar créditos, reutilizando el audio de la prueba 1) | Claude | ✅ |
| 2 | Rehacer el Short del cohete (`PRODUCCION/2026-11-19/01-apolo12-rayos`) con la voz elegida | Claude | ⏳ tras la tarea 1 |
| 3 | Rehacer los Shorts 02 y 03 del 19/11 con la marca «Datos Curiosos» y la voz elegida (ahora llevan la etiqueta antigua) | Claude | ⏳ pendiente de que el propietario lo pida |
| 4 | Terminar la producción del 20/11: los guiones están verificados; el 01 está renderizado pero **sin revisar** y el 02 y el 03 sin renderizar (se paró a petición del propietario) | Claude | ⏳ pendiente de que el propietario lo pida |
| 5 | Crear el canal en YouTube (nombre, identificador, foto de perfil `brand/perfil-800x800.png`) con datoscuriososs790@gmail.com | Propietario | ⏳ |
| 6 | Proyecto de Google Cloud, APIs y credencial OAuth de escritorio; **enviar el .json** a Claude (`docs/conexion-youtube.md`) | Propietario | ⏳ |
| 7 | Autorizar (`pipeline/youtube/auth.py --manual`), luego `verificar.py` y `configurar_canal.py --confirmar` | Juntos | ⏳ tras la tarea 6 |
| 8 | Conectar GitHub (<https://claude.ai/connect-github>) y crear un repositorio privado vacío, para las copias en la nube y la tarea nocturna diaria | Propietario | ⏳ |
| 9 | Tarea programada diaria, **a las 18:00 desde el 19/11** (antes 19:00 y 23:00): **creada el 19/11** dentro de esta sesión (`trig_011KSw9ytKT1TkAvRXq13zDa`). Pasarla a la nube con sesión nueva cuando haya GitHub (tarea 8) | Claude | ✅ / ⏳ mejora |
| 10 | Pedir la auditoría de la API de YouTube para poder publicar en público vía API | Propietario + Claude | ⏳ opcional |

## Siguiente paso

Voz oficial aprobada y conectada al pipeline. Siguiente: producir Shorts con ella cuando el propietario lo pida (por ejemplo, el Short de coches con el guion de Bertha Benz ya verificado, o rehacer el del cohete).

## Hecho y comprobado

- Herramientas instaladas y verificadas: Remotion, HyperFrames, FFmpeg, whisper.cpp con modelos `small` y `small.en`, y Kokoro.
- Investigación del nicho, estrategia, inspiración y 2 referencias analizadas (`INVESTIGACION.md`).
- Marca «Datos Curiosos»: logotipo, perfil, banner y marca de agua (`brand/`).
- Pipeline completo, con control de calidad (15 pruebas) y control de originalidad.
- Estilo ilustrado con kit propio.
- 3 Shorts del 19/11 aprobados por el control de calidad. El del cohete ya tiene la marca nueva; la voz está pendiente de la tarea 1.
- Scripts oficiales de YouTube preparados y probados en simulación (sin conexión real todavía).
- Memoria y copias de seguridad: ver `RECUPERACION.md`. **Comprobado el 19/11 ~01:00:** copia restaurada en otra carpeta, 429 archivos verificados por SHA-256 y una sesión nueva de Claude Code recuperó correctamente el estado, las tareas y el siguiente paso.
