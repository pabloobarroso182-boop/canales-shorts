"""Comprueba si algún canal usa ya un @handle (channels.list con forHandle).

Uso: YT_API_KEY=... python3 pipeline/youtube/check_handle.py @datoscuriososs.1

Si devuelve un canal, el handle está OCUPADO. Si no devuelve nada, no hay ningún canal
público con él; la confirmación definitiva la da YouTube Studio al intentar asignarlo
(un handle también puede estar reservado o no cumplir las normas).
"""
import json
import os
import sys
import urllib.parse
import urllib.request

handle = sys.argv[1] if len(sys.argv) > 1 else "@datoscuriososs.1"
key = os.environ.get("YT_API_KEY")
if not key:
    raise SystemExit("Falta YT_API_KEY (clave de API de Google Cloud con YouTube Data API v3).")
q = urllib.parse.urlencode({"part": "id,snippet", "forHandle": handle, "key": key})
with urllib.request.urlopen(f"https://www.googleapis.com/youtube/v3/channels?{q}", timeout=30) as r:
    data = json.load(r)
items = data.get("items", [])
if items:
    c = items[0]
    print(f"OCUPADO: {handle} pertenece a «{c['snippet']['title']}» (https://youtube.com/channel/{c['id']})")
else:
    print(f"No hay ningún canal con {handle}. Confírmalo al asignarlo en YouTube Studio.")
