"""Utilidades compartidas para la API oficial de YouTube (Data API v3 + Analytics API v2)."""
from __future__ import annotations

import json
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SECRETS = Path(os.environ.get("YT_SECRETS_DIR", ROOT / "secrets"))
CLIENT_SECRET = SECRETS / "client_secret.json"   # descargado de Google Cloud Console (OAuth, app de escritorio)
TOKEN = SECRETS / "token.json"                   # se crea con auth.py
CONFIG = ROOT / "config" / "publicacion.json"

SCOPES = [
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",      # comprobar qué cuenta se ha conectado
    "https://www.googleapis.com/auth/youtube.upload",       # subir vídeos
    "https://www.googleapis.com/auth/youtube",              # gestionar el canal (descripción, banner, marca de agua, programar)
    "https://www.googleapis.com/auth/yt-analytics.readonly",# estadísticas
]


def load_config() -> dict:
    return json.loads(CONFIG.read_text())


def credentials():
    from google.auth.transport.requests import Request
    from google.oauth2.credentials import Credentials

    if not TOKEN.exists():
        raise SystemExit(f"Falta {TOKEN}. Ejecuta antes: python3 pipeline/youtube/auth.py")
    creds = Credentials.from_authorized_user_file(str(TOKEN), SCOPES)
    if not creds.valid:
        if creds.expired and creds.refresh_token:
            creds.refresh(Request())
            TOKEN.write_text(creds.to_json())
        else:
            raise SystemExit("La autorización no es válida. Vuelve a ejecutar auth.py")
    return creds


def youtube():
    from googleapiclient.discovery import build
    return build("youtube", "v3", credentials=credentials(), cache_discovery=False)


def analytics():
    from googleapiclient.discovery import build
    return build("youtubeAnalytics", "v2", credentials=credentials(), cache_discovery=False)
