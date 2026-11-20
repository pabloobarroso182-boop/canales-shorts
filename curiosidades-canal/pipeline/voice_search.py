"""Busca la voz local (Kokoro, incluida con HyperFrames) más parecida a una muestra.

Genera la MISMA frase que dice la muestra con mezclas de voces, velocidades y tonos,
y compara: timbre (envolvente espectral en escala mel), tono medio, variación de
entonación y duración (ritmo). Guarda la mejor en config/voz_respaldo.json.

Uso: python3 pipeline/voice_search.py assets/voz/muestra-objetivo.wav "texto exacto de la muestra"
"""
from __future__ import annotations

import itertools
import json
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "pipeline"))
from voice_match import f0_track, load, KOKORO_MODEL, KOKORO_VOICES  # noqa: E402

SR = 16000


def trim(x: np.ndarray) -> np.ndarray:
    e = np.abs(x) > 0.02 * np.max(np.abs(x))
    idx = np.where(e)[0]
    return x[idx[0]: idx[-1] + 1] if len(idx) else x


def mel_profile(x: np.ndarray, n_mels=40) -> np.ndarray:
    win, hop = 512, 160
    frames = [x[i:i + win] * np.hanning(win) for i in range(0, len(x) - win, hop)]
    spec = np.abs(np.fft.rfft(np.array(frames), axis=1)) ** 2
    rms = np.sqrt(np.mean(np.array(frames) ** 2, axis=1))
    spec = spec[rms > 0.1 * rms.max()]  # solo tramos con voz
    freqs = np.fft.rfftfreq(win, 1 / SR)
    mel = lambda f: 2595 * np.log10(1 + f / 700)  # noqa: E731
    edges = np.interp(np.linspace(mel(80), mel(7600), n_mels + 2), mel(freqs), freqs)
    fb = np.zeros((n_mels, len(freqs)))
    for m in range(n_mels):
        lo, c, hi = edges[m], edges[m + 1], edges[m + 2]
        fb[m] = np.clip(np.minimum((freqs - lo) / (c - lo + 1e-9), (hi - freqs) / (hi - c + 1e-9)), 0, None)
    prof = np.log(spec @ fb.T + 1e-9).mean(axis=0)
    return prof - prof.mean()


def feats(x: np.ndarray) -> dict:
    x = trim(x)
    f0 = f0_track(x, SR)
    return {"mel": mel_profile(x), "f0": float(np.median(f0)), "f0var": float(np.std(12 * np.log2(f0 / np.median(f0)))),
            "dur": len(x) / SR}


def distance(a: dict, b: dict) -> tuple[float, dict]:
    parts = {
        "timbre": float(np.sqrt(np.mean((a["mel"] - b["mel"]) ** 2))),
        "tono_st": float(abs(12 * np.log2(a["f0"] / b["f0"]))),
        "entonacion_st": float(abs(a["f0var"] - b["f0var"])),
        "ritmo": float(abs(np.log(a["dur"] / b["dur"]))),
    }
    score = parts["timbre"] * 2.0 + parts["tono_st"] * 0.6 + parts["entonacion_st"] * 0.5 + parts["ritmo"] * 6
    return score, parts


def shift(samples: np.ndarray, sr: int, st: float) -> np.ndarray:
    if abs(st) < 0.01:
        return samples
    with tempfile.TemporaryDirectory() as td:
        i, o = Path(td) / "i.wav", Path(td) / "o.wav"
        sf.write(i, samples, sr)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(i), "-af",
                        f"rubberband=pitch={2 ** (st / 12):.4f}:formant=preserved", str(o)], check=True)
        y, _ = sf.read(o)
    return y


def main(ref_path: str, text: str):
    from kokoro_onnx import Kokoro  # type: ignore

    k = Kokoro(str(KOKORO_MODEL), str(KOKORO_VOICES))
    ref = feats(load(Path(ref_path)))
    alex, santa = k.get_voice_style("em_alex"), k.get_voice_style("em_santa")
    results = []

    def evaluate(w, speed, st):
        style = (w * alex + (1 - w) * santa).astype(np.float32)
        s, sr = k.create(text, voice=style, speed=speed, lang="es")
        y = shift(s, sr, st)
        with tempfile.NamedTemporaryFile(suffix=".wav") as t:
            sf.write(t.name, y, sr)
            f = feats(load(Path(t.name)))
        score, parts = distance(ref, f)
        r = {"peso_alex": round(w, 2), "velocidad": round(speed, 2), "tono_st": round(st, 2), "puntuacion": round(score, 3), **parts}
        results.append(r)
        return r

    # 1) mezcla y velocidad sin cambiar el tono
    for w, speed in itertools.product([0.0, 0.25, 0.5, 0.75, 1.0], [1.0, 1.1, 1.2, 1.3]):
        evaluate(w, speed, 0.0)
    best = min(results, key=lambda r: r["puntuacion"])
    # 2) afinar el tono alrededor de la diferencia medida
    style = (best["peso_alex"] * alex + (1 - best["peso_alex"]) * santa).astype(np.float32)
    s, sr = k.create(text, voice=style, speed=best["velocidad"], lang="es")
    with tempfile.NamedTemporaryFile(suffix=".wav") as t:
        sf.write(t.name, s, sr)
        base = feats(load(Path(t.name)))
    needed = float(np.clip(12 * np.log2(ref["f0"] / base["f0"]), -4, 4))
    for st in sorted({round(needed + d, 2) for d in (-1, -0.5, 0, 0.5, 1)}):
        for speed in (best["velocidad"] - 0.05, best["velocidad"], best["velocidad"] + 0.05):
            evaluate(best["peso_alex"], round(speed, 2), st)
    best = min(results, key=lambda r: r["puntuacion"])

    out = {
        "referencia": {"archivo": ref_path, "texto": text, "f0_mediana_hz": round(ref["f0"], 1),
                       "variacion_entonacion_st": round(ref["f0var"], 2), "duracion_s": round(ref["dur"], 2)},
        "elegida": "mezcla",
        "mezcla": {"em_alex": best["peso_alex"], "em_santa": round(1 - best["peso_alex"], 2)},
        "velocidad": best["velocidad"],
        "ajuste_tono_semitonos": best["tono_st"],
        "distancias": {k2: round(best[k2], 3) for k2 in ("timbre", "tono_st", "entonacion_st", "ritmo")},
        "candidatas_probadas": len(results),
        "top5": sorted(results, key=lambda r: r["puntuacion"])[:5],
    }
    (ROOT / "config" / "voz_respaldo.json").write_text(json.dumps(out, ensure_ascii=False, indent=2))
    print(json.dumps({k2: v for k2, v in out.items() if k2 != "top5"}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
