#!/usr/bin/env python3
"""Fish Audio (API oficial) para los Shorts: saldo, voces, clonación y narración en WAV.

La clave API NO está en ningún archivo: el proxy del entorno la inyecta en las
peticiones a api.fish.audio (secreto de red guardado en el entorno «Default»).
Por eso aquí se envía un marcador «proxy-injected» que el proxy sustituye.

Uso:
  python3 fish_audio.py saldo
  python3 fish_audio.py voces [--mias] [--buscar TEXTO] [--idioma es]
  python3 fish_audio.py clonar AUDIO [AUDIO...] --titulo NOMBRE [--texto "transcripción"] [--publica]
  python3 fish_audio.py narrar (--voz ID | --ref muestra.wav --ref-texto "transcripción")
                               (--texto "..." | --archivo guion.txt) --salida voz.wav
                               [--modelo s2.1-pro] [--max-bytes 3000]
  python3 fish_audio.py borrar-voz ID

Coste: la narración cobra por bytes UTF-8 del texto (se muestra antes de generar).
Clonación instantánea (--ref): manda tu muestra en cada petición; no crea voz guardada
(crear voces guardadas por API exige recargar crédito). Clonar en la web, listar voces y consultar saldo es gratis. No sustituye a ElevenLabs:
solo se usa cuando el usuario lo pida.
"""
import argparse, json, os, sys
import httpx, msgpack

API = "https://api.fish.audio"
CLAVE = os.environ.get("FISH_API_KEY") or "proxy-injected"
H = {"Authorization": f"Bearer {CLAVE}"}


def fallo(r):
    sys.exit(f"Error {r.status_code} de Fish Audio: {r.text[:300]}")


def saldo(_):
    r = httpx.get(f"{API}/wallet/self/api-credit", headers=H, timeout=30)
    r.is_success or fallo(r)
    print(f"Crédito de API: {r.json().get('credit')}")


def voces(a):
    q = {"page_size": 20, "self": "true" if a.mias else "false"}
    if a.buscar: q["title"] = a.buscar
    if a.idioma: q["language"] = a.idioma
    r = httpx.get(f"{API}/model", headers=H, params=q, timeout=30)
    r.is_success or fallo(r)
    d = r.json()
    print(f"{d.get('total')} voces")
    for m in d.get("items", []):
        print(f"{m['_id']}  {m.get('state','')}  {m.get('visibility','')}  {m.get('title','')}  {m.get('languages','')}")


def clonar(a):
    files = [("voices", (os.path.basename(p), open(p, "rb"))) for p in a.audios]
    data = {"type": "tts", "title": a.titulo, "train_mode": "fast",
            "visibility": "public" if a.publica else "private",
            "enhance_audio_quality": "false"}
    if a.texto: data["texts"] = a.texto
    r = httpx.post(f"{API}/model", headers=H, data=data, files=files, timeout=300)
    r.is_success or fallo(r)
    m = r.json()
    print(json.dumps({"voz_id": m["_id"], "estado": m.get("state"), "visibilidad": m.get("visibility"),
                      "titulo": m.get("title")}, ensure_ascii=False))


def narrar(a):
    texto = a.texto if a.texto else open(a.archivo, encoding="utf-8").read().strip()
    n = len(texto.encode("utf-8"))
    print(f"Texto: {n} bytes UTF-8 (coste proporcional) · modelo {a.modelo}")
    if n > a.max_bytes:
        sys.exit(f"Supera --max-bytes {a.max_bytes}: no se genera sin permiso expreso.")
    body = {"text": texto, "format": "wav", "sample_rate": 44100, "latency": "normal",
            "normalize": True, "language": a.idioma, "temperature": a.temperatura}
    if a.voz:
        body["reference_id"] = a.voz
    else:
        refs = []
        for i, f in enumerate(a.ref):
            refs.append({"audio": open(f, "rb").read(), "text": (a.ref_texto or [""] * len(a.ref))[i]})
        body["references"] = refs
    hd = {**H, "Content-Type": "application/msgpack", "model": a.modelo}
    os.makedirs(os.path.dirname(os.path.abspath(a.salida)), exist_ok=True)
    with httpx.stream("POST", f"{API}/v1/tts", headers=hd, content=msgpack.packb(body, use_bin_type=True), timeout=None) as r:
        if not r.is_success:
            r.read(); fallo(r)
        with open(a.salida, "wb") as f:
            for c in r.iter_bytes():
                f.write(c)
    print(f"WAV guardado: {a.salida} ({os.path.getsize(a.salida)} bytes)")


def borrar_voz(a):
    r = httpx.delete(f"{API}/model/{a.id}", headers=H, timeout=30)
    r.is_success or fallo(r)
    print(f"Voz {a.id} borrada")


p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
s = p.add_subparsers(dest="cmd", required=True)
s.add_parser("saldo").set_defaults(f=saldo)
v = s.add_parser("voces"); v.add_argument("--mias", action="store_true"); v.add_argument("--buscar"); v.add_argument("--idioma"); v.set_defaults(f=voces)
c = s.add_parser("clonar"); c.add_argument("audios", nargs="+"); c.add_argument("--titulo", required=True)
c.add_argument("--texto", action="append"); c.add_argument("--publica", action="store_true"); c.set_defaults(f=clonar)
n = s.add_parser("narrar"); vg = n.add_mutually_exclusive_group(required=True)
vg.add_argument("--voz"); vg.add_argument("--ref", action="append"); n.add_argument("--ref-texto", action="append")
n.add_argument("--idioma", default="es"); n.add_argument("--temperatura", type=float, default=0.7); g = n.add_mutually_exclusive_group(required=True)
g.add_argument("--texto"); g.add_argument("--archivo"); n.add_argument("--salida", required=True)
n.add_argument("--modelo", default="s2.1-pro"); n.add_argument("--max-bytes", type=int, default=3000); n.set_defaults(f=narrar)
b = s.add_parser("borrar-voz"); b.add_argument("id"); b.set_defaults(f=borrar_voz)
a = p.parse_args(); a.f(a)
