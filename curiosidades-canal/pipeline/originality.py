"""Control de originalidad de un guion.

Compara el texto narrado de un guion con:
  - las transcripciones/títulos de referencia guardados en PRODUCCION/*/investigacion/referencias.json
  - todos nuestros guiones anteriores (content/shorts y PRODUCCION/*/<id>/guion.json)
y comprueba que el tema principal no se repite (data/historial.json).

Uso: python3 pipeline/originality.py ruta/al/guion.json   -> sale con código 1 si no es original
"""
from __future__ import annotations

import json
import re
import sys
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MAX_SHARED_5GRAMS = 0.12


def words(text: str) -> list[str]:
    t = unicodedata.normalize("NFD", text.lower())
    t = "".join(c for c in t if unicodedata.category(c) != "Mn")
    return re.findall(r"[a-z0-9ñ]+", t)


def grams(ws: list[str], n=5) -> set[tuple[str, ...]]:
    return {tuple(ws[i:i + n]) for i in range(len(ws) - n + 1)}


def script_text(spec: dict) -> str:
    return re.sub(r"\[[^\]]+\]", " ", " ".join(sc["voz"] for sc in spec["escenas"]))  # sin etiquetas de v4


def corpus(exclude: Path) -> list[tuple[str, str]]:
    out = []
    for p in list((ROOT / "content" / "shorts").glob("*.json")) + list((ROOT / "PRODUCCION").glob("*/*/guion.json")):
        if p.resolve() == exclude.resolve():
            continue
        try:
            out.append((str(p.relative_to(ROOT)), script_text(json.loads(p.read_text()))))
        except Exception:
            pass
    refs = list((ROOT / "PRODUCCION").glob("*/investigacion/referencias.json")) + list((ROOT / "docs" / "referencias").glob("*.json"))
    for p in refs:
        for ref in json.loads(p.read_text()):
            txt = " ".join(filter(None, [ref.get("titulo"), ref.get("transcripcion")]))
            if txt:
                out.append((f"referencia: {ref.get('titulo', '?')} ({ref.get('url', '')})", txt))
    return out


def check(path: Path) -> dict:
    spec = json.loads(path.read_text())
    mine = grams(words(script_text(spec)))
    worst = ("", 0.0)
    for name, txt in corpus(path):
        other = grams(words(txt))
        if not mine or not other:
            continue
        shared = len(mine & other) / len(mine)
        if shared > worst[1]:
            worst = (name, shared)

    hist_file = ROOT / "data" / "historial.json"
    hist = json.loads(hist_file.read_text()) if hist_file.exists() else []
    topic = spec.get("tema_clave", "").strip().lower()
    repeated = [h for h in hist if topic and h.get("tema_clave", "").lower() == topic and h.get("id") != spec["id"]]

    ok = worst[1] <= MAX_SHARED_5GRAMS and not repeated
    return {
        "id": spec["id"],
        "original": ok,
        "max_5gramas_compartidos": round(worst[1], 3),
        "texto_mas_parecido": worst[0],
        "tema_repetido": [h["id"] for h in repeated],
        "textos_comparados": len(corpus(path)),
    }


if __name__ == "__main__":
    res = check(Path(sys.argv[1]))
    print(json.dumps(res, ensure_ascii=False, indent=2))
    sys.exit(0 if res["original"] else 1)
