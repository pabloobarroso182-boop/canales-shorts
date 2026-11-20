"""Control de calidad automático de un Short terminado.

Comprueba:
  vídeo   1080x1920, 30 fps, H.264 + AAC, 25–45 s, sin tramos negros
  audio   −16 a −12 LUFS, pico ≤ −1 dBTP, sin silencios de más de 1,2 s
  voz     Whisper vuelve a transcribir el MP4 y debe coincidir ≥ 85 % con el guion
  textos  título (≤ 100 caracteres, con #shorts), descripción, 3–15 hashtags, ≥ 2 fuentes (≥ 1 URL)
  original  pipeline/originality.py

Uso: python3 pipeline/qa.py PRODUCCION/2026-11-19/01-tema   -> escribe qa.json; código 1 si falla
"""
from __future__ import annotations

import difflib
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import make_short  # noqa: E402
import originality  # noqa: E402

CFG = make_short.CONFIG


def sh(cmd: list[str]) -> str:
    p = subprocess.run(cmd, capture_output=True, text=True)
    return p.stdout + p.stderr


def check(folder: Path) -> dict:
    spec = json.loads((folder / "guion.json").read_text())
    meta = json.loads((folder / "metadata.json").read_text())
    mp4 = folder / f"{spec['id']}.mp4"
    checks: list[dict] = []

    def add(name, ok, detail):
        checks.append({"prueba": name, "ok": bool(ok), "detalle": detail})

    if not mp4.exists():
        add("archivo MP4", False, "no existe")
        return {"id": spec["id"], "aprobado": False, "pruebas": checks}

    info = json.loads(sh(["ffprobe", "-v", "error", "-show_entries",
                          "stream=codec_type,codec_name,width,height,r_frame_rate:format=duration", "-of", "json", str(mp4)]))
    v = next((s for s in info["streams"] if s["codec_type"] == "video"), {})
    a = next((s for s in info["streams"] if s["codec_type"] == "audio"), {})
    dur = float(info["format"]["duration"])
    lo, hi = CFG["duracion_s"]["min"], CFG["duracion_s"]["max"]
    add("resolución 1080x1920", (v.get("width"), v.get("height")) == (1080, 1920), f"{v.get('width')}x{v.get('height')}")
    add("30 fps", v.get("r_frame_rate") == "30/1", v.get("r_frame_rate"))
    add("códecs H.264 + AAC", v.get("codec_name") == "h264" and a.get("codec_name") == "aac", f"{v.get('codec_name')} + {a.get('codec_name')}")
    add(f"duración {lo}–{hi} s", lo <= dur <= hi, f"{dur:.1f} s")

    ebu = sh(["ffmpeg", "-hide_banner", "-nostats", "-i", str(mp4), "-af", "ebur128=peak=true", "-f", "null", "-"])
    i_lufs = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", ebu)[-1])
    peak = float(re.findall(r"Peak:\s+(-?[\d.]+) dBFS", ebu)[-1])
    add("sonoridad −16 a −12 LUFS", -16 <= i_lufs <= -12, f"{i_lufs} LUFS")
    add("pico ≤ −1 dB", peak <= -1.0, f"{peak} dBFS")

    sil = sh(["ffmpeg", "-hide_banner", "-nostats", "-i", str(mp4), "-af", "silencedetect=n=-45dB:d=1.2", "-f", "null", "-"])
    starts = re.findall(r"silence_start: ([\d.]+)", sil)
    long_sil = [float(s) for s in starts if float(s) < dur - 1.5]
    add("sin silencios largos", not long_sil, f"{len(long_sil)} tramos" if long_sil else "ninguno")

    blk = sh(["ffmpeg", "-hide_banner", "-nostats", "-i", str(mp4), "-vf", "blackdetect=d=0.5:pix_th=0.05", "-an", "-f", "null", "-"])
    add("sin pantallas negras", "black_start" not in blk, "ninguna" if "black_start" not in blk else "detectadas")

    with tempfile.TemporaryDirectory() as td:
        heard = make_short.transcribe(mp4, Path(td))
    said = " ".join(w["text"] for w in heard)
    try:  # Whisper escribe los números en cifras; el guion, en letras
        from num2words import num2words
        said = re.sub(r"\d+", lambda m: num2words(int(m.group()), lang="es"), said)
    except ImportError:
        pass
    script = " ".join(make_short.sin_etiquetas(sc["voz"]) for sc in spec["escenas"])
    sim = difflib.SequenceMatcher(a=originality.words(script), b=originality.words(said), autojunk=False).ratio()
    add("la voz se entiende (Whisper ≥ 85 %)", sim >= 0.85, f"{sim:.0%}")

    title = meta["titulo"]
    add("título ≤ 100 caracteres con #shorts", len(title) <= 100 and "#shorts" in title.lower(), f"{len(title)} caracteres")
    add("descripción", len(spec["descripcion"]) >= 120, f"{len(spec['descripcion'])} caracteres")
    add("3–15 hashtags", 3 <= len(spec["hashtags"]) <= 15, f"{len(spec['hashtags'])}")
    urls = [f for f in spec["fuentes"] if "http" in f]
    add("≥ 2 fuentes y ≥ 1 enlace", len(spec["fuentes"]) >= 2 and len(urls) >= 1, f"{len(spec['fuentes'])} fuentes, {len(urls)} enlaces")
    hook_words = len(make_short.sin_etiquetas(spec["escenas"][0]["voz"]).split())
    add("gancho corto (≤ 14 palabras)", hook_words <= 14, f"{hook_words} palabras")

    piezas = [sc.get("pieza") for sc in spec["escenas"]]  # informativo: manda lo que funciona en el nicho
    seq = [p for p in piezas if p is not None]
    add("estructura (informativo)", True, " → ".join(str(p) for p in seq) if seq else "sin piezas marcadas")

    est = make_short.CONFIG["voz_estandar"]
    vc = meta.get("voz_config") or {}
    add("voz oficial (Eleven v4 + datoscuriosin)", vc.get("voice_id") == est["voice_id"] and vc.get("modelo") == est["modelo"],
        f"{vc.get('nombre', meta.get('voz'))} · {vc.get('modelo', '—')}")
    ppm = meta.get("voz_palabras_min")
    add("ritmo de narración 140–200 pal/min", ppm is not None and 140 <= ppm <= 200, f"{ppm} pal/min")

    orig = originality.check(folder / "guion.json")
    add("originalidad", orig["original"],
        f"máx. {orig['max_5gramas_compartidos']:.0%} de 5-gramas compartidos con «{orig['texto_mas_parecido'] or '—'}»"
        + (f"; tema repetido: {orig['tema_repetido']}" if orig["tema_repetido"] else ""))

    result = {"id": spec["id"], "aprobado": all(c["ok"] for c in checks), "duracion_s": round(dur, 2),
              "voz": meta.get("voz"), "pruebas": checks}
    (folder / "qa.json").write_text(json.dumps(result, ensure_ascii=False, indent=2))
    return result


if __name__ == "__main__":
    r = check(Path(sys.argv[1]).resolve())
    for c in r["pruebas"]:
        print(f"  {'✓' if c['ok'] else '✗'} {c['prueba']}: {c['detalle']}")
    print(("APROBADO" if r["aprobado"] else "NO APROBADO") + f" · {r['id']}")
    sys.exit(0 if r["aprobado"] else 1)
