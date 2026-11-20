"""Produce un Short en estilo «divulga» (animación de divulgación, composición Remotion `Divulga`).

Uso: python3 pipeline/divulga_prep.py CARPETA [--render]

CARPETA/guion.json, formato nuevo (recomendado):
  {"id", "titulo", "descripcion", "hashtags", "tags", "fuentes", "verificacion",
   "escenas": [{"clave", "kind", "voz"}],   # "voz" puede llevar etiquetas de Eleven v4
   "marcas": {"nombre": "palabra del guion"}}
Formato antiguo (Short del plátano): "texto" + escenas con "empieza_en".

La voz es SIEMPRE la oficial (make_short.tts_oficial: Eleven v4 + «datoscuriosin»). Si ya existe
work/voz-v4.(wav|mp3) se reutiliza y no se gasta nada. Con --render, renderiza, hace la portada y los
metadatos, y deja el Short listo para pipeline/qa.py.
"""
from __future__ import annotations

import argparse
import json
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "pipeline"))
import make_short as ms  # noqa: E402
from make_short import align, duration, mix, norm, sin_etiquetas, transcribe  # noqa: E402

TAIL_S = 1.3  # margen final para el logo (qa admite ≤ 1,5 s de silencio al final)


def main(carpeta: Path, render: bool):
    g = json.loads((carpeta / "guion.json").read_text())
    work = carpeta / "work"
    work.mkdir(exist_ok=True)
    nuevo = "texto" not in g
    texto_v4 = " ".join(e["voz"].strip() for e in g["escenas"]) if nuevo else g["texto"]
    palabras = sin_etiquetas(texto_v4).split()

    voz = next((p for p in (work / "voz-v4.wav", work / "voz-v4.mp3") if p.exists()), None)
    voz_info = None
    if voz is None:
        _, why = ms.choose_provider({"escenas": [{"voz": texto_v4}]})
        print(f"  · voz: {why}")
        voz = work / "voz-v4.wav"
        voz_info = ms.tts_oficial(texto_v4, voz)
        (work / "voz_info.json").write_text(json.dumps(voz_info, ensure_ascii=False, indent=1))
    elif (work / "voz_info.json").exists():
        voz_info = json.loads((work / "voz_info.json").read_text())

    heard = transcribe(voz, work)  # sin prompt: con él Whisper repite frases
    caps, ok = align(palabras, heard)
    print(f"  · alineación: {ok:.0%} de las palabras")
    nw = [norm(w) for w in palabras]

    def busca(palabra: str, desde: int = 0) -> int:
        objetivo = norm(palabra)
        for i in range(desde, len(nw)):
            if nw[i] == objetivo:
                return i
        raise SystemExit(f"no encuentro «{palabra}» en el guion")

    escenas = []
    if nuevo:  # cada escena empieza en su primera palabra
        k = 0
        for e in g["escenas"]:
            escenas.append({"clave": e["clave"], "startMs": 0 if k == 0 else max(0, caps[k]["startMs"] - 150)})
            k += len(sin_etiquetas(e["voz"]).split())
    else:
        pos = 0
        for e in g["escenas"]:
            i = max(0, busca(e["empieza_en"], pos) - e.get("retroceder", 0)) if e["empieza_en"] else 0
            pos = i
            escenas.append({"clave": e["clave"], "startMs": max(0, caps[i]["startMs"] - 150) if i else 0})
    marcas = {k: caps[busca(w)]["startMs"] for k, w in g["marcas"].items()}
    total = duration(voz) + TAIL_S
    spans = [(e["startMs"] / 1000, 0) for e in escenas]
    kinds = [e.get("kind", "fact") for e in g["escenas"]] if nuevo else ["fact"] * len(escenas)
    mezcla = mix(voz, {"escenas": [{"kind": "cta" if k in ("cta", "giro") else "fact"} for k in kinds]}, spans, total, work)
    destino = ROOT / "video/public/shorts" / f"{g['id']}.wav"
    shutil.copy(mezcla, destino)
    props = {"id": g["id"], "durationMs": int(total * 1000), "audio": f"shorts/{g['id']}.wav",
             "escenas": escenas, "marcas": marcas, "captions": caps}
    (carpeta / "props.json").write_text(json.dumps(props, ensure_ascii=False, indent=1))
    print(json.dumps({"escenas": escenas, "duracion_s": round(total, 1)}, ensure_ascii=False))
    if not render:
        return

    final = carpeta / f"{g['id']}.mp4"
    print("  · render (remotion, Divulga)")
    ms.run(["npx", "remotion", "render", "src/index.ts", "Divulga", str(final), f"--props={carpeta / 'props.json'}",
            "--codec=h264", "--crf=18", "--audio-codec=aac", "--audio-bitrate=192k", "--concurrency=4"], cwd=ms.VIDEO)
    ms.run(["ffmpeg", "-v", "error", "-y", "-ss", "1.0", "-i", str(final), "-frames:v", "1", "-q:v", "2", str(carpeta / "portada.jpg")])
    shutil.copy(voz, carpeta / "narracion.wav")
    if nuevo:
        (carpeta / "guion.txt").write_text("\n\n".join(f"[{e.get('kind', 'fact').upper()}] {e['voz']}" for e in g["escenas"]) + "\n")
        (carpeta / "fuentes.md").write_text(f"# Fuentes · {g['titulo']}\n\n" + "\n".join(f"- {f}" for f in g["fuentes"])
                                            + f"\n\n**Verificación:** {g.get('verificacion', '')}\n")
        habla = (caps[-1]["endMs"] - caps[0]["startMs"]) / 1000
        meta = {"titulo": g["titulo"], "descripcion": g["descripcion"] + "\n\n" + " ".join(g["hashtags"]),
                "hashtags": g["hashtags"], "tags": g["tags"], "categoria": "27", "idioma": "es", "archivo": str(final),
                "duracion_s": round(duration(final), 2), "voz": "elevenlabs_v4", "voz_motivo": "voz oficial",
                "voz_config": voz_info, "voz_palabras_min": round(len(palabras) / max(1.0, habla) * 60),
                "subtitulos_coincidencia": round(ok, 3), "estilo": "divulga", "publicar": False}
        (carpeta / "metadata.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2))
    print(f"✓ {final.name}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("carpeta")
    ap.add_argument("--render", action="store_true")
    a = ap.parse_args()
    main(Path(a.carpeta).resolve(), a.render)
