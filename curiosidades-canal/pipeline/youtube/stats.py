"""Informe de rendimiento de los Shorts publicados (Data API v3 + Analytics API v2).

Métricas: visualizaciones, minutos vistos, duración media, % medio visto (retención),
suscriptores ganados, me gusta, comentarios, compartidos y últimos comentarios.

Uso: python3 pipeline/youtube/stats.py [--dias 28]  -> output/informes/informe-AAAA-MM-DD.json

Nota: el dato "Viewed vs swiped away" (cuántos eligen ver el Short) aparece en YouTube
Studio; si la Analytics API no lo ofrece para tu canal, se anota como no disponible.
"""
from __future__ import annotations

import argparse
import json
from datetime import date, timedelta

from common import ROOT, analytics, youtube


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dias", type=int, default=28)
    a = ap.parse_args()

    yt = youtube()
    ch = yt.channels().list(part="id,snippet,statistics,contentDetails", mine=True).execute()["items"][0]
    uploads = ch["contentDetails"]["relatedPlaylists"]["uploads"]
    items = yt.playlistItems().list(part="contentDetails", playlistId=uploads, maxResults=50).execute().get("items", [])
    ids = [i["contentDetails"]["videoId"] for i in items]

    end = date.today()
    start = end - timedelta(days=a.dias)
    rows = []
    if ids:
        rep = analytics().reports().query(
            ids="channel==MINE",
            startDate=start.isoformat(),
            endDate=end.isoformat(),
            metrics="views,engagedViews,estimatedMinutesWatched,averageViewDuration,averageViewPercentage,subscribersGained,likes,comments,shares",
            dimensions="video",
            filters="video==" + ",".join(ids[:200]),
            sort="-views",
            maxResults=200,
        ).execute()
        cols = [c["name"] for c in rep.get("columnHeaders", [])]
        rows = [dict(zip(cols, r)) for r in rep.get("rows", [])]

    titles = {}
    for k in range(0, len(ids), 50):
        for v in yt.videos().list(part="snippet,statistics", id=",".join(ids[k:k + 50])).execute()["items"]:
            titles[v["id"]] = {"titulo": v["snippet"]["title"], "publicado": v["snippet"]["publishedAt"], "totales": v["statistics"]}

    comments = {}
    for vid in [r["video"] for r in rows[:10]]:
        try:
            ct = yt.commentThreads().list(part="snippet", videoId=vid, maxResults=20, order="relevance").execute()
            comments[vid] = [c["snippet"]["topLevelComment"]["snippet"]["textOriginal"] for c in ct.get("items", [])]
        except Exception as e:  # comentarios desactivados, etc.
            comments[vid] = [f"(no disponible: {e.__class__.__name__})"]

    report = {
        "canal": {"titulo": ch["snippet"]["title"], "estadisticas": ch["statistics"]},
        "periodo": [start.isoformat(), end.isoformat()],
        "videos": [{**r, **titles.get(r["video"], {}), "comentarios": comments.get(r["video"], [])} for r in rows],
        "viewed_vs_swiped": "consultar en YouTube Studio (no expuesto en esta consulta)",
    }
    out = ROOT / "output" / "informes"
    out.mkdir(parents=True, exist_ok=True)
    path = out / f"informe-{end.isoformat()}.json"
    path.write_text(json.dumps(report, ensure_ascii=False, indent=2))
    print(f"✓ {path}")
    for r in rows[:10]:
        t = titles.get(r["video"], {}).get("titulo", r["video"])
        print(f"  {r['views']:>7} vistas · {r['averageViewPercentage']:>5.1f}% visto · +{r['subscribersGained']} subs · {t}")


if __name__ == "__main__":
    main()
