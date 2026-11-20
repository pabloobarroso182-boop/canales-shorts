# Automatizaciones: horarios y tareas programadas

## Producción nocturna (pedida por el propietario)

- **Cuándo:** todos los días a las **18:00, hora de Madrid** (antes 19:00 y, al principio, 23:00; cambios del propietario el 19/11), **sin que el propietario tenga que pedirlo**. Prepara los **4 Shorts** **del día siguiente** (antes 6 y, al principio, 3; cambiado por el propietario el 19/11).
- **Activación manual:** escribir «Me voy a dormir, prepárame el trabajo de mañana» en una sesión abierta en esta carpeta.
- **Qué hace:**
  - sigue la skill `.claude/skills/produccion-nocturna/SKILL.md`: investigación con la búsqueda web, 4 temas verificados, guiones originales, escenas ilustradas;
  - ejecuta `pipeline/nocturno.py <fecha>`: voz, subtítulos, efectos, render, control de calidad e informe;
  - guarda en git, sube los MP4 a una release de GitHub y avisa al propietario.
- **Salida:** `PRODUCCION/AAAA-MM-DD/` con `INFORME.md`, la investigación y, por cada Short, su carpeta con MP4, portada, guion, fuentes, metadatos y `qa.json`.
- **Nunca publica nada.**

### Estado real de la programación

| Elemento | Estado |
|---|---|
| Aviso único del 18/11 a las 23:00 (`trig_01CmNK8Gevk73vDqFu6jFuUd`, dentro de la sesión) | ✅ disparado; generó la investigación y los guiones del 20/11 |
| **Tarea diaria de las 18:00 (Madrid)** `trig_011KSw9ytKT1TkAvRXq13zDa` (antes 23:00) | ✅ **creada el 19/11** a petición del propietario; pasada a las 19:00 y después a las 18:00 el mismo día. Se ejecuta **en esta misma sesión** (no abre una sesión nueva), porque no hay GitHub. Primera ejecución: 19/11 a las 18:00. **Riesgo:** si la máquina de la sesión se sustituye, el proyecto no estará; la tarea lo comprueba primero y, si falta, avisa sin producir nada. Solución definitiva: conectar GitHub |
| Ordenador del propietario | No hace falta que esté encendido: la tarea se ejecuta en la nube de Claude |

**Para activarla:**

1. El propietario conecta GitHub y crea un repositorio privado vacío.
2. Claude sube el proyecto.
3. Claude crea un entorno con `scripts/env-setup.sh` como script de arranque.
4. Claude crea la tarea programada con `CRON_TZ=Europe/Madrid 0 23 * * *`, sesión nueva en cada ejecución y sin conectores.

## Copias de seguridad

- **Automáticas (hook de fin de turno, `.claude/settings.json`):**
  - al terminar cada turno de Claude, commit automático de los cambios de texto;
  - una copia completa como máximo cada 6 horas.
- **Tras cada hito:** `bash scripts/backup.sh` (lo indica `CLAUDE.md`).
- **Al final de la producción nocturna:** `bash scripts/backup.sh`.
- Detalle y recuperación: `RECUPERACION.md`.

## Publicación (cuando se conecte YouTube)

- Horas previstas: 13:30, 18:30 y 21:30 (Madrid). Se programan con `upload.py --programar`.
- **Bloqueada** hasta que el propietario ponga `publicacion_automatica: true`.
- Mientras el proyecto de Google no esté auditado, los vídeos subidos por la API quedan en privado.

## Estadísticas (cuando se conecte YouTube)

- `python3 pipeline/youtube/stats.py --dias 28` → `output/informes/`. Propuesta: cada lunes. Todavía no está programado.
