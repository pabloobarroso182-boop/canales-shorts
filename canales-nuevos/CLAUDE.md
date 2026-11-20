# Canales nuevos (19/11/2026) · Ahora Lo Entiendes · Escenario Imposible · Tu Cerebro Te Engaña

Responde siempre en español. «Datos Curiosos» (`/home/user/curiosidades-canal`) se mantiene y no se toca desde aquí.

**Canales:**
- **Ahora Lo Entiendes:** explicativos «cómo funciona / por qué». Proyecto en `/home/user/canal2-shorts`.
- **Escenario Imposible:** hipotéticos «¿qué pasaría si…?».
- **Tu Cerebro Te Engaña:** psicología y dinero del día a día.

**Marca:** `marca/` contiene los perfiles de 800×800, los banners de 2560×1440 y los de 4096×2304 para móvil, y `LEEME.md`.

**Voz y audio:** las MISMAS reglas que Datos Curiosos (propietario, 19/11) → `REGLAS_VOZ_Y_AUDIO.md`.
- Voz ElevenLabs `eleven_v4` «datoscuriosin» `kQwUFpYQ184OVlnMEzlm`, `es`, 0,5 / 0,85.
- Sin música, efectos con *ducking*, −14 LUFS, sin estirar el audio y control de calidad con Whisper.

**Descartado:** las voces de prueba de Qwen3-TTS (`voces/`). Se guardan pero no se usan.

**Límites:**
- No publicar ni gastar sin permiso.
- Los caracteres de ElevenLabs se comparten con Datos Curiosos, que tiene prioridad.

## Producción diaria (orden del propietario, 19/11/2026)
- **4 Shorts al día por canal**, a la misma hora que Datos Curiosos (18:00, Europe/Madrid).
- **SIEMPRE, antes de crear los 4 Shorts de cada canal**, se revisa con **vidIQ** el nicho de contenido de ESE canal y se hacen los **4 mejores Shorts** según lo que esté funcionando:
  - Ahora Lo Entiendes → explicativos «cómo funciona / por qué» (ej. `vidiq_outliers` Shorts, `es`, «cómo funciona por qué explicación»);
  - Escenario Imposible → «qué pasaría si / hipotéticos»;
  - Tu Cerebro Te Engaña → psicología cotidiana y dinero del día a día.
- La revisión del nicho busca temas, ganchos, duración y estructura que funcionan. Se usa como inspiración y nunca se copia.
- Se guarda en `PRODUCCION/<fecha>/investigacion/` de cada canal.
- Créditos de vidIQ: los consume el propietario y son compartidos con Datos Curiosos. Si no hay saldo suficiente, se avisa en el informe; no se compran créditos.

## Estilo de animación (orden del propietario, 19/11/2026)
- **Cada canal tiene SU PROPIO estilo de animación**, distinto del de los demás y del «divulga» de Datos Curiosos, para que no se confundan entre sí.
- **Dentro de cada canal, UNA SOLA animación fija** (la misma regla que Datos Curiosos): todos los Shorts la llevan igual y solo cambia lo que se dibuja. Claude no la cambia por su cuenta; las mejoras se proponen con una muestra y solo se aplican si el propietario las aprueba.
- **Datos Curiosos NO cambia** (propietario, 19/11 noche: «la de datos curiosos la puedes dejar tal cual»). Sigue con su animación «divulga» (`curiosidades-canal/docs/estilo-animacion.md`). Esta regla de elegir la animación del nicho es solo para los 3 canales nuevos.
- **Manda el nicho (propietario, 19/11 noche):** cada estilo se inspira en la animación que **más engancha** en los Shorts virales de su nicho, para que sea atractiva y lo más parecida posible a lo que mejor funciona. **INSPIRARSE, NUNCA COPIAR** (propietario, 19/11 noche: «quiero que te inspires, no la copies»). Se toman ideas generales (tipo de animación, ritmo, movimiento, encuadres, contadores, subtítulos) y se hacen con un diseño propio. Nunca se reproducen personajes, escenas, composiciones, diseños ni secuencias de otros vídeos. Personajes, paleta y marca son siempre propios.
  - **Cuándo se elige (propietario, 19/11 noche: «todavía no»):** NO se analiza nada por adelantado. En la **primera producción de cada canal**, al investigar el nicho con vidIQ, Claude analiza los Shorts que más enganchan (`vidiq_watch_shortform_content`), **elige la animación más atractiva** y la fija en `docs/estilo-animacion.md` del canal. No hace falta que el propietario la apruebe: él delegó la elección.
  - **Desde entonces es SIEMPRE la misma en ese canal.** No se cambia de un día a otro ni por iniciativa propia; solo si el propietario lo pide.
  - Ya analizado (vidIQ, 19/11): Postarg, «¿Qué pasaría si…?» → 2D vectorial con personaje articulado y expresivo, contador visible, microzooms y paneos constantes, plano cada 2,5–3 s, efectos en cada cambio, subtítulo con la palabra activa en caja; Archivos No Humanos, misterio → CGI/IA realista con medidas y pantallas partidas; DuoCare, explicativos → 2D/3D sencillo con personaje fijo y vista «por dentro».
  - Las investigaciones diarias pueden anotar en el informe si ven algo más atractivo, pero **no cambian** la animación fijada.
- Base provisional de cada estilo (sale de su marca en `marca/`; se ajusta con el análisis del nicho). Se fija en la primera producción de cada canal (ver arriba) y se documenta en `docs/estilo-animacion.md` de ese canal:
  - **Ahora Lo Entiendes:** 2D vectorial «por dentro». Cortes y vistas en rayos X de objetos, escáner turquesa, X coral y ✓ turquesa, personajes Nico y Vera. Crema, turquesa #12B5A5, coral #FF5A4E y amarillo #FFC93C. Kit en `canal2-shorts/video/src/kit.tsx`.
  - **Escenario Imposible:** 2D cinematográfico nocturno. Personaje articulado, contador de escalada en pantalla («Día 1 → Día 4», «+2 °C → +6 °C») y fondos de planetas y mapas. Noche #120A2E, violeta #5B2EFF, naranja #FF7A1A y cian #39E1FF.
  - **Tu Cerebro Te Engaña:** infografía de pizarra con la mascota cerebro que guiña. Ilusiones ópticas, flechas, precios tachados y comparativas lado a lado. Rosa #FF4F8B, marino #14213D y menta #3DDC97.
- Comunes a los 4 canales: subtítulos palabra a palabra, movimiento constante (un plano o zoom nuevo cada 2–3 s), sin música y con la firma pequeña del @ de cada canal.

## Copia en GitHub (propietario, 20/11/2026)
- Después de cada producción y de **cada cambio importante** (Shorts nuevos, reglas, marcas, guiones), ejecuta `bash /home/user/canales-shorts/tools/guardar_en_github.sh` (repositorio privado pabloobarroso182-boop/canales-shorts). No esperes a que lo pida el propietario.
- Si el servidor es nuevo y la carpeta `/home/user/canales-shorts` no existe, clona antes el repositorio.
