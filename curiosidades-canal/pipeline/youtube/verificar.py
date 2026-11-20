"""Comprueba la conexión con YouTube sin publicar nada.

1. La cuenta de Google conectada es la de config/publicacion.json (cuenta_google).
2. Esa cuenta tiene un canal y es el esperado (nombre, identificador).
3. Disponibilidad del identificador deseado (@handle).
4. Permisos concedidos y llamadas de prueba de solo lectura: Data API (canal, vídeos, categorías)
   y Analytics API (informe del canal).

Uso: python3 pipeline/youtube/verificar.py
"""
from __future__ import annotations

import json
from datetime import date, timedelta

import requests

from common import SCOPES, credentials, load_config, youtube, analytics


def main():
    cfg = load_config()
    esperado = cfg.get("cuenta_google", "").lower()
    handle = cfg.get("handle_deseado", "")
    creds = credentials()
    res = {}

    # 1. cuenta
    r = requests.get("https://openidconnect.googleapis.com/v1/userinfo", headers={"Authorization": f"Bearer {creds.token}"}, timeout=30)
    email = r.json().get("email", "").lower() if r.ok else ""
    res["cuenta_conectada"] = email or f"(no se pudo leer: {r.status_code})"
    res["cuenta_correcta"] = bool(email) and email == esperado

    # permisos
    tok = requests.get("https://oauth2.googleapis.com/tokeninfo", params={"access_token": creds.token}, timeout=30).json()
    concedidos = set(tok.get("scope", "").split())
    res["permisos_que_faltan"] = sorted(s for s in SCOPES if s not in ("openid",) and s not in concedidos)

    # 2. canal
    yt = youtube()
    items = yt.channels().list(part="id,snippet,brandingSettings,status,contentDetails", mine=True).execute().get("items", [])
    if not items:
        res["canal"] = None
        res["aviso"] = "Esta cuenta todavía no tiene canal de YouTube: hay que crearlo (ver docs/conexion-youtube.md, paso 4)."
    else:
        ch = items[0]
        res["canal"] = {
            "id": ch["id"],
            "nombre": ch["snippet"]["title"],
            "identificador": ch["snippet"].get("customUrl"),
            "nombre_correcto": ch["snippet"]["title"].strip().lower() == cfg["canal"].lower(),
            "estado": ch.get("status", {}).get("privacyStatus"),
            "puede_subir_mas_de_15_min": ch.get("status", {}).get("longUploadsStatus"),
        }
        # vídeos (lectura)
        up = ch["contentDetails"]["relatedPlaylists"]["uploads"]
        try:
            n = yt.playlistItems().list(part="id", playlistId=up, maxResults=1).execute().get("pageInfo", {}).get("totalResults", 0)
            res["videos_subidos"] = n
        except Exception as e:  # lista vacía en canales nuevos
            res["videos_subidos"] = f"0 ({e.__class__.__name__})"
        # analytics (lectura)
        try:
            hoy = date.today()
            a = analytics().reports().query(ids="channel==MINE", startDate=(hoy - timedelta(days=7)).isoformat(),
                                            endDate=hoy.isoformat(), metrics="views").execute()
            res["analytics_api"] = "ok"
        except Exception as e:
            res["analytics_api"] = f"error: {e}"

    # 3. identificador deseado
    h = yt.channels().list(part="id,snippet", forHandle=handle).execute().get("items", [])
    if not h:
        res["identificador_deseado"] = f"{handle}: ningún canal lo usa (confírmalo al asignarlo en YouTube)"
    elif items and h[0]["id"] == items[0]["id"]:
        res["identificador_deseado"] = f"{handle}: ya es el de tu canal ✓"
    else:
        res["identificador_deseado"] = f"{handle}: OCUPADO por «{h[0]['snippet']['title']}»"

    # Data API: categorías de vídeo en España (lectura)
    cats = yt.videoCategories().list(part="snippet", regionCode="ES").execute().get("items", [])
    res["data_api"] = "ok" if cats else "sin respuesta"
    res["categoria_educacion_disponible"] = any(c["id"] == "27" for c in cats)

    print(json.dumps(res, ensure_ascii=False, indent=2))
    if not res["cuenta_correcta"]:
        raise SystemExit(f"\n✗ La cuenta conectada no es {esperado}. Borra secrets/token.json y repite la autorización con la cuenta correcta.")


if __name__ == "__main__":
    main()
