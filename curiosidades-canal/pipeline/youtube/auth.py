"""Autoriza el acceso al canal con OAuth 2.0 oficial de Google (una sola vez).

Requisitos (los hace el propietario en Google Cloud Console, con la cuenta del canal):
  1. Proyecto con "YouTube Data API v3" y "YouTube Analytics API" activadas.
  2. Pantalla de consentimiento OAuth (externa, en modo prueba) con la cuenta del canal como usuario de prueba.
  3. Credencial OAuth de tipo "Aplicación de escritorio" -> JSON -> secrets/client_secret.json

Uso:
  python3 pipeline/youtube/auth.py --manual    # servidor sin navegador (este entorno)
  python3 pipeline/youtube/auth.py             # en un ordenador con navegador

La URL lleva login_hint con la cuenta de config/publicacion.json para que Google proponga esa cuenta.
Nunca se pide ni se guarda la contraseña: solo un token de acceso en secrets/token.json.
"""
import sys

from google_auth_oauthlib.flow import InstalledAppFlow

from common import CLIENT_SECRET, SCOPES, TOKEN, load_config

REDIRECT = "http://localhost:8765/"


def main():
    if not CLIENT_SECRET.exists():
        raise SystemExit(f"No encuentro {CLIENT_SECRET}. Descárgalo de Google Cloud Console (OAuth, aplicación de escritorio).")
    cuenta = load_config().get("cuenta_google", "")
    flow = InstalledAppFlow.from_client_secrets_file(str(CLIENT_SECRET), SCOPES)
    if "--manual" in sys.argv:
        flow.redirect_uri = REDIRECT
        if "--codigo" in sys.argv:  # segunda fase: canjear la URL pegada
            url = sys.argv[sys.argv.index("--codigo") + 1]
            flow.code_verifier = (TOKEN.parent / ".pkce").read_text().strip()
            flow.fetch_token(authorization_response=url.replace("http://", "https://", 1))
            (TOKEN.parent / ".pkce").unlink(missing_ok=True)
            guardar(flow.credentials)
            return
        url, _ = flow.authorization_url(access_type="offline", prompt="consent", login_hint=cuenta, include_granted_scopes="true")
        TOKEN.parent.mkdir(parents=True, exist_ok=True)
        if getattr(flow, "code_verifier", None):
            (TOKEN.parent / ".pkce").write_text(flow.code_verifier)
            (TOKEN.parent / ".pkce").chmod(0o600)
        print("Abre esta URL en tu navegador e inicia sesión con", cuenta or "la cuenta del canal", ":\n")
        print(url)
        print("\nAl terminar, el navegador irá a http://localhost:8765/?… y dirá que no puede conectar: es normal.")
        print("Copia la URL completa de la barra de direcciones y ejecuta:")
        print('  python3 pipeline/youtube/auth.py --manual --codigo "<URL>"')
        return
    guardar(flow.run_local_server(port=0, access_type="offline", prompt="consent", login_hint=cuenta))


def guardar(creds):
    TOKEN.parent.mkdir(parents=True, exist_ok=True)
    TOKEN.write_text(creds.to_json())
    TOKEN.chmod(0o600)
    print(f"✓ Autorización guardada en {TOKEN}")


if __name__ == "__main__":
    main()
