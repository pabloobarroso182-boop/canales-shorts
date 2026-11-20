# Segundo canal de YouTube Shorts — «AHORA LO ENTIENDES» · explicativos de todo tipo (antes «Sala de Espera»; nombre y marca nuevos el 19/11, en `/home/user/canales-nuevos/marca/`)

Responde siempre en español. Proyecto independiente del primer canal (`/home/user/curiosidades-canal`, no se modifica).

- **Temática (cambiada por el propietario el 19/11):** vídeos explicativos de TODO tipo: cómo funcionan por dentro y por qué son así las cosas de cada día (objetos, tecnología, transporte, cuerpo, comida, naturaleza, seguridad). Formatos A «Ese X NO está de adorno», B «Cómo funciona X por dentro», C «Por qué… (no es lo que crees)», D «Si pasa esto, haz/no hagas aquello». Antes: solo salud. Referencia estudiada: DuoCare-ES (`INVESTIGACION_DUOCARE.md`). Nunca copiar sus temas, guiones ni escenas.
- **Voz y audio:** las MISMAS reglas que Datos Curiosos (propietario, 19/11) → `/home/user/canales-nuevos/REGLAS_VOZ_Y_AUDIO.md`. Voz EXACTAMENTE la del primer canal. `pipeline/producir.py` importa `tts_oficial` y `voz_estandar` del primer canal y para si el voice_id/modelo/ajustes no coinciden. Prohibido crear voces, clonar o usar otra de respaldo.
- **Estilo (propio de este canal, distinto de los otros 3; ver `/home/user/canales-nuevos/CLAUDE.md`):** 2D vectorial propio (crema + turquesa, coral alertas), personajes Nico y Vera (`video/src/kit.tsx`), escáner turquesa, X coral, ✓ turquesa, subtítulos centro-abajo palabra a palabra, firma «Nº Sala de Espera», cierre con ticket de turno. Sin música; efectos de Earshot (`assets/sfx/`).
- **Rigor:** fuentes oficiales para cada dato médico; en emergencias, siempre socorrista/112.
- **Producción diaria:** 4 Shorts/día a las 18:00. SIEMPRE antes se revisa con vidIQ el nicho de este canal (explicativos) y se hacen los 4 mejores (ver `/home/user/canales-nuevos/CLAUDE.md`).
- **Producción:** guion `PRODUCCION/<NNN-slug>/guion.json` → `python3 pipeline/producir.py <carpeta> --render` → control de calidad (`qa.json`: Whisper ≥ 95 %, sin etiquetas leídas, voz verificada, −14 LUFS).
- **Límites:** no publicar ni gastar sin permiso. Caracteres de ElevenLabs compartidos con el primer canal.
