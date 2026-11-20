# Recuperación del proyecto y copias de seguridad

## Dónde está guardado todo

| Qué | Dónde | Incluye |
|---|---|---|
| **Proyecto vivo** | `/home/user/curiosidades-canal/` (entorno en la nube de Claude, **temporal**) | Todo |
| **Historial git** | `.git/` dentro del proyecto | Todos los textos, código, guiones, configuración y documentos, con cada versión (los MP4 no van en git) |
| **Copias completas** | `backups/datos-curiosos-AAAAMMDD-HHMMSS.tar.gz` (+ `.sha256`) | **Todo**: vídeos, audios, diseños, guiones, documentos, configuración e historial git. Con manifiesto SHA-256 de cada archivo |
| **Copia fuera del entorno** | La última copia completa se envía al propietario por el chat; descárgala y guárdala en tu ordenador o tu nube | Igual que la anterior |
| **GitHub** (cuando se conecte) | Repositorio privado + releases con los MP4 de cada día | Recuperación automática en sesiones nuevas en la nube |

**Lo que NO está en las copias (a propósito):** `secrets/`, con la autorización de YouTube y el `client_secret.json`. No se guardan secretos en texto plano. Tras restaurar, se repite la autorización de YouTube (unos 2 minutos). Tampoco van `video/node_modules` ni los modelos de Whisper y Kokoro: se reinstalan con `scripts/setup.sh`.

> ⚠️ **Importante:** este entorno en la nube se borra al cerrar o archivar la conversación. Hasta que GitHub esté conectado, **la única copia que sobrevive es la que descargas tú**. Descarga siempre la última `datos-curiosos-*.tar.gz` que te envíe Claude.

## Cuándo se hacen las copias

- **Automático, en cada turno** (hook `Stop`): commit en git de todos los cambios.
- **Automático, cada 6 h como máximo** (mismo hook): copia completa en `backups/`.
- **Tras cada hito** (regla de `CLAUDE.md`) y al final de cada producción nocturna: `bash scripts/backup.sh`.
- Las copias antiguas **nunca se borran** sin autorización del propietario.

## Comprobar una copia

```bash
bash scripts/verificar_backup.sh                      # la más reciente
bash scripts/verificar_backup.sh backups/datos-curiosos-AAAAMMDD-HHMMSS.tar.gz
```

Restaura en una carpeta temporal y comprueba:

- la suma de control y los SHA-256 de cada archivo;
- el historial git;
- que están los documentos de memoria, la skill, los hooks y el código;
- el número de archivos de cada carpeta de materiales;
- que el código compila y los scripts funcionan.

## Recuperar en un ordenador (Windows, Mac o Linux)

1. Copia la carpeta completa del proyecto, o descarga `datos-curiosos-….tar.gz` y su `.sha256`.
2. Si es la copia comprimida:
   ```bash
   tar -xzf datos-curiosos-AAAAMMDD-HHMMSS.tar.gz -C curiosidades-canal
   ```
   O, con comprobación incluida:
   ```bash
   bash curiosidades-canal/scripts/restaurar.sh datos-curiosos-….tar.gz curiosidades-canal
   ```
   En Windows usa WSL o Git Bash. `tar` viene incluido en Windows 10 y 11.
3. Instala lo necesario una vez: Node 22, Python 3, FFmpeg, git y cmake. Después:
   ```bash
   cd curiosidades-canal && bash scripts/setup.sh
   ```
4. Abre Claude Code **en esa carpeta**:
   ```bash
   cd curiosidades-canal && claude
   ```
   - Claude lee `CLAUDE.md` automáticamente.
   - El hook de inicio le muestra `ESTADO_DEL_PROYECTO.md`, las últimas entradas del historial y la última copia.
   - Te resumirá el estado y las tareas pendientes y continuará desde el siguiente paso.
5. Si necesitas YouTube:
   ```bash
   python3 pipeline/youtube/auth.py --manual
   ```

## Recuperar en una sesión nueva de Claude Code en la web (nube)

- **Con GitHub conectado** (recomendado): abre una sesión nueva con el repositorio seleccionado. El entorno ejecuta `scripts/env-setup.sh`, que instala las herramientas, y `CLAUDE.md` y el hook de inicio hacen el resto. Los MP4 de cada día están en las releases del repositorio.
- **Sin GitHub:** sube la copia `datos-curiosos-….tar.gz` al chat de la sesión nueva y escribe: «Restaura el proyecto con esta copia». Claude ejecutará `scripts/restaurar.sh` y después `scripts/setup.sh`.
