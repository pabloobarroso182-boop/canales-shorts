"""Ajusta UNA voz base de Kokoro (elegida por el propietario) para que suene lo más parecida
posible a una muestra: velocidad, tono y timbre (ecualización por bandas).

Uso: python3 pipeline/voice_tune.py em_alex assets/voz/muestra-objetivo.wav "texto exacto de la muestra"
Escribe config/voz_respaldo.json (la configuración anterior se guarda con fecha en config/).
"""
from __future__ import annotations

import itertools
import json
import shutil
import subprocess
import sys
import tempfile
from datetime import datetime
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "pipeline"))
from voice_match import KOKORO_MODEL, KOKORO_VOICES, load  # noqa: E402
from voice_search import distance, feats, mel_profile, trim  # noqa: E402

BANDAS = [120, 250, 500, 1000, 2000, 3500, 5000, 7000]


def procesar(samples, sr, st: float, eq: str = "") -> np.ndarray:
    filtros = []
    if abs(st) > 0.01:
        filtros.append(f"rubberband=pitch={2 ** (st / 12):.4f}:formant=preserved")
    if eq:
        filtros.append(eq)
    if not filtros:
        return samples
    with tempfile.TemporaryDirectory() as td:
        i, o = Path(td) / "i.wav", Path(td) / "o.wav"
        sf.write(i, samples, sr)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(i), "-af", ",".join(filtros), str(o)], check=True)
        y, _ = sf.read(o)
    return y


def medir(y, sr) -> dict:
    with tempfile.NamedTemporaryFile(suffix=".wav") as t:
        sf.write(t.name, y, sr)
        return feats(load(Path(t.name)))


def eq_desde_diferencia(ref_x: np.ndarray, cand_x: np.ndarray) -> str:
    """Ganancia por banda = diferencia de energía media (dB) entre muestra y candidata, limitada a ±6 dB."""
    def energia_bandas(x):
        x = trim(x)
        win, hop, sr = 1024, 256, 16000
        frames = np.array([x[i:i + win] * np.hanning(win) for i in range(0, len(x) - win, hop)])
        rms = np.sqrt(np.mean(frames ** 2, axis=1))
        spec = (np.abs(np.fft.rfft(frames, axis=1)) ** 2)[rms > 0.1 * rms.max()].mean(axis=0)
        f = np.fft.rfftfreq(win, 1 / sr)
        out = []
        for c in BANDAS:
            m = (f > c / 1.41) & (f < min(c * 1.41, 7900))
            out.append(10 * np.log10(spec[m].mean() + 1e-12))
        return np.array(out)
    d = energia_bandas(ref_x) - energia_bandas(cand_x)
    d = d - np.median(d)  # solo la forma, no el volumen
    d = np.clip(d, -6, 6)
    return ",".join(f"equalizer=f={c}:t=o:w=1:g={g:.1f}" for c, g in zip(BANDAS, d) if abs(g) >= 0.5)


def main(voz: str, ref_path: str, texto: str):
    from kokoro_onnx import Kokoro  # type: ignore

    k = Kokoro(str(KOKORO_MODEL), str(KOKORO_VOICES))
    ref_x = load(Path(ref_path))
    ref = feats(ref_x)
    resultados = []

    def probar(speed, st, eq=""):
        s, sr = k.create(texto, voice=voz, speed=speed, lang="es")
        y = procesar(s, sr, st, eq)
        f = medir(y, sr)
        score, partes = distance(ref, f)
        r = {"velocidad": round(speed, 3), "tono_st": round(st, 2), "eq": eq, "puntuacion": round(score, 3), **{k2: round(v, 3) for k2, v in partes.items()}}
        resultados.append(r)
        return r, y, sr

    base, _, _ = probar(1.0, 0.0)
    # 1) velocidad para igualar el ritmo
    for sp in [0.9, 0.95, 1.0, 1.05, 1.1, 1.15, 1.2, 1.25]:
        probar(sp, 0.0)
    mejor = min(resultados, key=lambda r: r["ritmo"] + r["timbre"] * 0.2)
    # 2) tono alrededor de la diferencia medida
    s, sr = k.create(texto, voice=voz, speed=mejor["velocidad"], lang="es")
    f0 = medir(s, sr)["f0"]
    necesario = float(np.clip(12 * np.log2(ref["f0"] / f0), -4, 4))
    for st in sorted({round(necesario + d, 2) for d in (-0.5, 0, 0.5)}):
        probar(mejor["velocidad"], st)
    mejor = min(resultados, key=lambda r: r["puntuacion"])
    # 3) ecualización de timbre a partir de la mejor
    _, y, sr = probar(mejor["velocidad"], mejor["tono_st"])
    with tempfile.NamedTemporaryFile(suffix=".wav") as t:
        sf.write(t.name, y, sr)
        cand_x = load(Path(t.name))
    eq = eq_desde_diferencia(ref_x, cand_x)
    final, y, sr = probar(mejor["velocidad"], mejor["tono_st"], eq)

    cfg_path = ROOT / "config" / "voz_respaldo.json"
    if cfg_path.exists():
        shutil.copy(cfg_path, ROOT / "config" / f"voz_respaldo.anterior-{datetime.now():%Y%m%d-%H%M%S}.json")
    cfg = {
        "elegida": voz,
        "velocidad": final["velocidad"],
        "ajuste_tono_semitonos": final["tono_st"],
        "ecualizacion": final["eq"],
        "referencia": {"archivo": ref_path, "texto": texto, "f0_mediana_hz": round(ref["f0"], 1),
                       "variacion_entonacion_st": round(ref["f0var"], 2), "duracion_s": round(ref["dur"], 2)},
        "sin_ajustar": {k2: base[k2] for k2 in ("timbre", "tono_st", "entonacion_st", "ritmo")},
        "ajustada": {k2: final[k2] for k2 in ("timbre", "tono_st", "entonacion_st", "ritmo")},
        "fijada": True,
        "nota": f"Voz {voz} elegida por el propietario (candidata C) y ajustada a su muestra. No retocar sin que lo pida.",
    }
    cfg_path.write_text(json.dumps(cfg, ensure_ascii=False, indent=2))
    print(json.dumps({k2: v for k2, v in cfg.items() if k2 != "referencia"}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], sys.argv[3])
