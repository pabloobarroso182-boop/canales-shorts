"""Sube un Short con videos.insert (API oficial) usando output/<id>/metadata.json.

Seguridad por defecto:
  - Sin --confirmar solo muestra lo que haría (simulación).
  - La privacidad por defecto es "private". Para publicar o programar hace falta que
    config/publicacion.json tenga "publicacion_automatica": true (lo activas tú tras validar).

Uso:
  python3 pipeline/youtube/upload.py output/001-venus                 # simulación
  python3 pipeline/youtube/upload.py output/001-venus --confirmar     # sube en privado
  python3 pipeline/youtube/upload.py output/001-venus --confirmar --programar 2026-12-01T19:30:00+01:00

Nota: los proyectos de Google Cloud sin auditar solo pueden subir vídeos en PRIVADO
(Google los bloquea en privado aunque se pida otra cosa) hasta pasar la auditoría de la API.
"""
from __future__ import annotations

import argparse
import json
from datetime import datetime
from pathlib import Path

from common import ROOT, load_config, youtube


def build_body(meta: dict, privacy: str, publish_at: str | None) -> dict:
    status = {
        "privacyStatus": privacy,
        "selfDeclaredMadeForKids": False,
        "containsSyntheticMedia": True,  # declaración de contenido sintético (voz/animación con IA)
        "embeddable": True,
    }
    if publish_at:
        status["privacyStatus"] = "private"  # requisito de la API para programar
        status["publishAt"] = publish_at
    return {
        "snippet": {
            "title": meta["titulo"][:100],
            "description": meta["descripcion"][:5000],
            "tags": meta["tags"],
            "categoryId": meta.get("categoria", "27"),
            "defaultLanguage": "es",
            "defaultAudioLanguage": "es",
        },
        "status": status,
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("carpeta", help="output/<id> con metadata.json y el .mp4")
    ap.add_argument("--confirmar", action="store_true", help="sube de verdad (si no, simulación)")
    ap.add_argument("--privacidad", choices=["private", "unlisted", "public"], default=None)
    ap.add_argument("--programar", help="fecha ISO 8601 con zona horaria para publicar automáticamente")
    a = ap.parse_args()

    cfg = load_config()
    folder = (ROOT / a.carpeta).resolve() if not Path(a.carpeta).is_absolute() else Path(a.carpeta)
    meta = json.loads((folder / "metadata.json").read_text())
    privacy = a.privacidad or cfg.get("privacidad_por_defecto", "private")

    if (privacy != "private" or a.programar) and not cfg.get("publicacion_automatica", False):
        raise SystemExit("Bloqueado: la publicación automática está desactivada en config/publicacion.json. "
                         "Solo se permite subir en privado hasta que la actives.")
    if a.programar:
        datetime.fromisoformat(a.programar)  # valida el formato

    body = build_body(meta, privacy, a.programar)
    video = Path(meta["archivo"])
    print(json.dumps({"archivo": str(video), **body}, ensure_ascii=False, indent=2))
    if not a.confirmar:
        print("\n(simulación: añade --confirmar para subirlo)")
        return

    from googleapiclient.http import MediaFileUpload

    req = youtube().videos().insert(
        part="snippet,status",
        body=body,
        media_body=MediaFileUpload(str(video), mimetype="video/mp4", chunksize=8 * 1024 * 1024, resumable=True),
    )
    resp = None
    while resp is None:
        st, resp = req.next_chunk()
        if st:
            print(f"  subiendo… {int(st.progress() * 100)}%")
    vid = resp["id"]
    print(f"✓ Subido: https://youtube.com/shorts/{vid}  (estado: {resp['status'].get('privacyStatus')})")
    log = ROOT / "output" / "publicados.jsonl"
    with log.open("a") as f:
        f.write(json.dumps({"id": meta.get("archivo"), "videoId": vid, "subido": datetime.now().isoformat(),
                            "programado": a.programar, "privacidad": resp["status"].get("privacyStatus")}, ensure_ascii=False) + "\n")


if __name__ == "__main__":
    main()
