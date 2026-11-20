"""Configura la información y la imagen del canal por la API oficial (sin publicar vídeos).

Hace (con --confirmar):
  - Descripción del canal, palabras clave, país (ES) e idioma (es).
  - Banner: sube brand/banner-2560x1440.png (channelBanners.insert) y lo asigna.
  - Marca de agua de los vídeos: brand/marca-agua-150x150.png (watermarks.set).

No se puede hacer por la API (se hace a mano en YouTube Studio): nombre del canal,
identificador (@handle) y foto de perfil.

Uso:
  python3 pipeline/youtube/configurar_canal.py              # muestra lo que haría
  python3 pipeline/youtube/configurar_canal.py --confirmar  # lo aplica
"""
from __future__ import annotations

import json
import sys

from googleapiclient.http import MediaFileUpload

from common import ROOT, youtube

DESCRIPCION = """¿Sabías que en Venus un día dura más que un año? En Datos Curiosos te contamos en menos de un minuto los datos más sorprendentes del espacio, los animales, el cuerpo humano, la historia y la ciencia… y desmentimos los mitos que todo el mundo repite.

✅ Curiosidades verificadas: cada vídeo lleva sus fuentes en la descripción.
🎬 Shorts nuevos cada día.
🧠 Aprende algo nuevo en lo que tardas en pasar al siguiente vídeo.

Suscríbete y activa la campanita para no perderte ninguna curiosidad. ¿Tienes una pregunta que quieras que respondamos? Déjala en los comentarios."""

PALABRAS = 'curiosidades "datos curiosos" "sabías que" mitos ciencia espacio animales historia "cuerpo humano" "cultura general" shorts'


def main():
    confirmar = "--confirmar" in sys.argv
    yt = youtube()
    items = yt.channels().list(part="id,snippet,brandingSettings", mine=True).execute().get("items", [])
    if not items:
        raise SystemExit("La cuenta conectada no tiene canal. Créalo primero (docs/conexion-youtube.md, paso 4).")
    ch = items[0]
    bs = ch.get("brandingSettings", {})
    bs.setdefault("channel", {})
    bs["channel"].update({"description": DESCRIPCION, "keywords": PALABRAS, "country": "ES", "defaultLanguage": "es"})
    banner = ROOT / "brand" / "banner-2560x1440.png"
    marca = ROOT / "brand" / "marca-agua-150x150.png"
    plan = {"canal": ch["snippet"]["title"], "id": ch["id"], "descripcion": DESCRIPCION[:120] + "…", "palabras_clave": PALABRAS,
            "pais": "ES", "idioma": "es", "banner": str(banner.relative_to(ROOT)), "marca_de_agua": str(marca.relative_to(ROOT))}
    print(json.dumps(plan, ensure_ascii=False, indent=2))
    if not confirmar:
        print("\n(simulación: añade --confirmar para aplicarlo)")
        return

    up = yt.channelBanners().insert(media_body=MediaFileUpload(str(banner), mimetype="image/png")).execute()
    bs.setdefault("image", {})["bannerExternalUrl"] = up["url"]
    yt.channels().update(part="brandingSettings", body={"id": ch["id"], "brandingSettings": bs}).execute()
    print("✓ descripción, palabras clave, país, idioma y banner")
    yt.watermarks().set(channelId=ch["id"], media_body=MediaFileUpload(str(marca), mimetype="image/png"),
                        body={"timing": {"type": "offsetFromEnd", "offsetMs": 15000, "durationMs": 15000}, "position": {"type": "corner", "cornerPosition": "topRight"}}).execute()
    print("✓ marca de agua (últimos 15 s de cada vídeo)")


if __name__ == "__main__":
    main()
