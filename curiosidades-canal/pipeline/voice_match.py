"""Compara una voz de referencia con las voces locales de Kokoro y elige la más parecida.

Mide el tono medio (F0), la variación de tono, el brillo (centroide espectral) y la
velocidad (sílabas aproximadas por segundo). Después calcula cuánto hay que desplazar el
tono y la velocidad para acercar la voz local a la de referencia.

Uso: python3 pipeline/voice_match.py assets/voz/curiosidades281-preview.mp3
Escribe config/voz_respaldo.json
"""
from __future__ import annotations

import json
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
KOKORO_MODEL = Path.home() / ".cache/hyperframes/tts/models/kokoro-v1.0.onnx"
KOKORO_VOICES = Path.home() / ".cache/hyperframes/tts/voices/voices-v1.0.bin"
TEXT = "Hola, soy yo. ¿Estás en casa ya? Ah, vale. Entonces no hace falta que te llame luego."


def load(path: Path, sr=16000) -> np.ndarray:
    with tempfile.NamedTemporaryFile(suffix=".wav") as t:
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(path), "-ar", str(sr), "-ac", "1", t.name], check=True)
        x, _ = sf.read(t.name)
    return x.astype(np.float64)


def f0_track(x: np.ndarray, sr=16000, fmin=60, fmax=320) -> np.ndarray:
    hop, win = 160, 640
    out = []
    for i in range(0, len(x) - win, hop):
        fr = x[i:i + win] * np.hanning(win)
        if np.sqrt(np.mean(fr ** 2)) < 0.015:
            continue
        ac = np.correlate(fr, fr, mode="full")[win - 1:]
        lo, hi = int(sr / fmax), int(sr / fmin)
        k = lo + np.argmax(ac[lo:hi])
        if ac[k] / (ac[0] + 1e-9) > 0.45:
            out.append(sr / k)
    return np.array(out)


def features(x: np.ndarray, sr=16000) -> dict:
    f0 = f0_track(x, sr)
    spec = np.abs(np.fft.rfft(x * np.hanning(len(x))))
    freqs = np.fft.rfftfreq(len(x), 1 / sr)
    centroid = float(np.sum(freqs * spec) / np.sum(spec))
    # velocidad: picos de energía (aprox. sílabas) por segundo hablado
    hop = 160
    env = np.array([np.sqrt(np.mean(x[i:i + 400] ** 2)) for i in range(0, len(x) - 400, hop)])
    env = np.convolve(env, np.ones(5) / 5, mode="same")
    thr = 0.3 * env.max()
    peaks = np.sum((env[1:-1] > env[:-2]) & (env[1:-1] > env[2:]) & (env[1:-1] > thr))
    voiced_s = np.sum(env > 0.1 * env.max()) * hop / sr
    return {
        "f0_mediana_hz": float(np.median(f0)) if len(f0) else 0.0,
        "f0_variacion_st": float(np.std(12 * np.log2(f0 / np.median(f0)))) if len(f0) else 0.0,
        "centroide_hz": centroid,
        "silabas_por_s": float(peaks / max(voiced_s, 0.1)),
    }


def main(ref_path: str):
    from kokoro_onnx import Kokoro  # type: ignore

    ref = features(load(Path(ref_path)))
    k = Kokoro(str(KOKORO_MODEL), str(KOKORO_VOICES))
    results = {}
    for voice in ["em_alex", "em_santa"]:
        s, sr = k.create(TEXT, voice=voice, speed=1.0, lang="es")
        with tempfile.NamedTemporaryFile(suffix=".wav") as t:
            sf.write(t.name, s, sr)
            feats = features(load(Path(t.name)))
        semitones = 12 * np.log2(ref["f0_mediana_hz"] / feats["f0_mediana_hz"])
        dist = abs(semitones) + abs(np.log(ref["centroide_hz"] / feats["centroide_hz"])) * 6 + abs(ref["f0_variacion_st"] - feats["f0_variacion_st"])
        results[voice] = {**feats, "desplazamiento_st": float(semitones), "distancia": float(dist)}
    best = min(results, key=lambda v: results[v]["distancia"])
    shift = float(np.clip(results[best]["desplazamiento_st"], -3, 3))
    speed = float(np.clip(ref["silabas_por_s"] / results[best]["silabas_por_s"], 0.9, 1.2))
    cfg = {
        "referencia": {"voz_elevenlabs": "curiosidades281", "voice_id": "NNgYp96c8FM1iI4HMawH", **ref},
        "candidatas": results,
        "elegida": best,
        "ajuste_tono_semitonos": round(shift, 2),
        "velocidad": round(speed, 2),
    }
    out = ROOT / "config" / "voz_respaldo.json"
    out.write_text(json.dumps(cfg, ensure_ascii=False, indent=2))
    print(json.dumps(cfg, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main(sys.argv[1])
