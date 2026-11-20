"""Ajusta la cadencia de una locución: velocidad (sin cambiar el tono) y pausas mínimas.

Imita el ritmo narrativo de los Shorts de referencia del propietario:
~160–185 palabras/min y pausas de ~0,35–0,5 s tras cada frase o golpe.

Uso: python3 pipeline/cadencia.py entrada.mp3 salida.wav [--tempo 0.9] [--pausa 0.4] [--umbral 0.12]
"""
from __future__ import annotations

import argparse
import re
import subprocess
import tempfile
from pathlib import Path

import numpy as np
import soundfile as sf


def silencios(path: str, umbral_s: float) -> list[tuple[float, float]]:
    out = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-af",
                          f"silencedetect=n=-38dB:d={umbral_s}", "-f", "null", "-"], capture_output=True, text=True).stderr
    ini = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", out)]
    fin = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", out)]
    return list(zip(ini, fin))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("entrada")
    ap.add_argument("salida")
    ap.add_argument("--tempo", type=float, default=1.0)
    ap.add_argument("--pausa", type=float, default=0.4)
    ap.add_argument("--umbral", type=float, default=0.12)
    a = ap.parse_args()

    with tempfile.TemporaryDirectory() as td:
        lento = Path(td) / "lento.wav"
        # tempo 1.0 = sin estirar el audio (estirarlo produce un efecto de eco); solo se alargan las pausas
        filtro = ["-af", f"rubberband=tempo={a.tempo}"] if abs(a.tempo - 1) > 1e-3 else []
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", a.entrada, *filtro, "-ac", "1", "-ar", "44100", str(lento)], check=True)
        x, sr = sf.read(lento)
        dur = len(x) / sr
        trozos, pos = [], 0
        for s, e in silencios(str(lento), a.umbral):
            if s < 0.05 or e > dur - 0.05:  # silencio inicial/final: se respeta
                continue
            trozos.append(x[int(pos * sr):int(s * sr)])
            hueco = max(e - s, a.pausa)
            trozos.append(np.zeros(int(hueco * sr)))
            pos = e
        trozos.append(x[int(pos * sr):])
        y = np.concatenate(trozos)
    sf.write(a.salida, y, sr)
    print(f"✓ {a.salida}: {len(y) / sr:.1f} s (antes {dur / a.tempo * a.tempo:.1f} s a tempo 1)")


if __name__ == "__main__":
    main()
