"""Mide rasgos de acento en una frase con «vez» (z final) y palabras con «s».

Distinción (España): la z suena [θ], fricativa de energía baja y espectro plano.
Seseo (Latinoamérica, Canarias, parte de Andalucía): la z suena [s], con mucha energía en 4–9 kHz.
Compara el final de «vez» con el final de palabras con s y devuelve la relación.

Uso: python3 pipeline/accent_check.py audio.wav
"""
from __future__ import annotations

import json
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
import soundfile as sf

sys.path.insert(0, str(Path(__file__).resolve().parent))
import make_short  # noqa: E402


def fric_stats(x: np.ndarray, sr: int, t0: float, t1: float) -> dict:
    """Busca el tramo fricativo (más ruido agudo) en los últimos 120 ms de la palabra."""
    seg = x[int(max(t0, t1 - 0.16) * sr): int((t1 + 0.04) * sr)]
    win = int(0.025 * sr)
    best = None
    for i in range(0, max(1, len(seg) - win), int(0.005 * sr)):
        fr = seg[i:i + win] * np.hanning(win)
        sp = np.abs(np.fft.rfft(fr)) ** 2
        f = np.fft.rfftfreq(win, 1 / sr)
        hi = sp[(f > 4000) & (f < 9000)].sum()
        lo = sp[(f > 300) & (f < 3000)].sum()
        ratio = hi / (lo + 1e-12)
        if best is None or ratio > best["ratio"]:
            best = {"ratio": float(ratio), "energia_aguda_db": float(10 * np.log10(hi + 1e-12)),
                    "centroide_hz": float((f * sp).sum() / (sp.sum() + 1e-12))}
    return best


def main(path: str) -> dict:
    with tempfile.TemporaryDirectory() as td:
        words = make_short.transcribe(Path(path), Path(td))
        wav = Path(td) / "a.wav"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", path, "-ar", "22050", "-ac", "1", str(wav)], check=True)
        x, sr = sf.read(wav)
    norm = lambda w: make_short.norm(w)  # noqa: E731
    out = {}
    for w in words:
        n = norm(w["text"])
        if n in ("vez", "personas", "juntos", "todas", "repartidos"):
            out.setdefault(n, fric_stats(x, sr, w["start"] / 1000, w["end"] / 1000))
    z = out.get("vez")
    s_vals = [v for k, v in out.items() if k != "vez"]
    if z and s_vals:
        s_ratio = float(np.median([v["ratio"] for v in s_vals]))
        z_ratio = z["ratio"]
        out["z_frente_a_s_db"] = round(10 * np.log10(z_ratio / s_ratio), 1)
        out["lectura"] = ("la z suena como [θ] (distinción, España)" if out["z_frente_a_s_db"] < -6
                          else "la z suena como [s] (seseo)")
    return out


if __name__ == "__main__":
    print(json.dumps(main(sys.argv[1]), ensure_ascii=False, indent=1))
