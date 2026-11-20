# Conexión oficial de YouTube · paso a paso

Cuenta del canal: **datoscuriososs790@gmail.com**. Usa **solo** esta cuenta en todos los pasos.
Nunca te pediré la contraseña: inicias sesión tú, directamente en las páginas de Google.

> Consejo: abre una ventana de incógnito o un perfil de navegador nuevo e inicia sesión solo con esa cuenta, para no mezclarla con la personal.

---

## Paso 1 · Crear el canal (si todavía no existe) · ~3 min

1. Entra en <https://www.youtube.com> con **datoscuriososs790@gmail.com**.
2. Pulsa la foto de perfil (arriba a la derecha) y luego **Crear un canal**.
3. Nombre: **Datos Curiosos**.
4. Identificador: escribe **datoscuriososs.1**. YouTube te dirá en ese momento si está disponible. **Si no lo está, no elijas otro: avísame.**
5. Foto: sube `brand/perfil-800x800.png` (te la envío en el chat).
6. Pulsa **Crear canal**.

## Paso 2 · Proyecto de Google Cloud y API · ~5 min

1. Entra en <https://console.cloud.google.com> con la misma cuenta. Si te pide aceptar las condiciones, acéptalas. **No hace falta tarjeta ni facturación.**
2. Arriba, en el selector de proyectos, elige **Proyecto nuevo**, ponle de nombre **curiosidades-canal** y pulsa **Crear**. Comprueba que queda seleccionado.
3. Menú → **APIs y servicios** → **Biblioteca**. Busca y pulsa **Habilitar** en:
   - **YouTube Data API v3**
   - **YouTube Analytics API**

## Paso 3 · Pantalla de consentimiento y credencial OAuth · ~5 min

1. Menú → **APIs y servicios** → **Pantalla de consentimiento de OAuth** (en algunas cuentas aparece como **Google Auth Platform**) → **Comenzar**.
   - Nombre de la aplicación: **Datos Curiosos – Automatización**
   - Correo de asistencia: **datoscuriososs790@gmail.com**
   - Público: **Externo**
   - Datos de contacto: el mismo correo. Acepta y pulsa **Crear**.
2. **Público** (Audience) → **Usuarios de prueba** → **Añadir usuarios** → `datoscuriososs790@gmail.com` → **Guardar**.
3. **Clientes** (o **Credenciales** → **Crear credenciales** → **ID de cliente de OAuth**):
   - Tipo de aplicación: **Aplicación de escritorio**
   - Nombre: **curiosidades-pc** → **Crear**
4. En la ventana que aparece, pulsa **Descargar JSON**.
5. **Envíame ese archivo .json por el chat.** Lo guardo en `secrets/`, una carpeta que nunca se sube a ningún repositorio.

## Paso 4 · Autorizar (lo hacemos juntos) · ~2 min

1. Yo ejecuto `python3 pipeline/youtube/auth.py --manual` y te paso un enlace.
2. Lo abres e inicias sesión con **datoscuriososs790@gmail.com**. Google mostrará «Google no ha verificado esta aplicación». Es normal, porque la aplicación es tuya: pulsa **Continuar** y acepta los permisos.
3. El navegador irá a `http://localhost:8765/?...` y dirá que no puede conectar. **Es lo esperado.** Copia la dirección completa de la barra y pégamela en el chat. Ese código solo sirve una vez y caduca en minutos.
4. Yo termino la conexión y ejecuto las comprobaciones:
   - `verificar.py`: cuenta correcta, canal, identificador, permisos y API.
   - `configurar_canal.py`: descripción, palabras clave, banner y marca de agua.

---

## Lo que la API de YouTube no permite (se hace a mano)

- Cambiar el **nombre**, el **identificador** o la **foto de perfil** del canal. Se hace en el paso 1 o en YouTube Studio → Personalización.
- **Publicar en público desde un proyecto sin auditar.** Google bloquea en **privado** los vídeos subidos por la API desde proyectos que no han pasado su auditoría, y esos vídeos no se pueden hacer públicos después. Mientras tanto:
  - el sistema sube en privado para que los revises;
  - para publicar, hay dos opciones:
    - subir el MP4 aprobado desde YouTube Studio (el título, la descripción y los hashtags van en `metadata.json`), o
    - pedir la auditoría gratuita de la API (formulario «YouTube API Services – Audit and Quota Extension»). Te ayudo a rellenarla cuando quieras.

## Mantenimiento

- Con la aplicación en **modo prueba**, Google caduca la autorización cada **7 días**. Para que dure, en **Público** pulsa **Publicar aplicación**. Seguirá sin verificar, pero solo la usas tú. Puedes hacerlo en cualquier momento.
- Para desconectar: <https://myaccount.google.com/permissions> → «Datos Curiosos – Automatización» → **Quitar acceso**.
