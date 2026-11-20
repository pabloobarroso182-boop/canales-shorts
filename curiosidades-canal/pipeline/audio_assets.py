"""Sintetiza música de fondo y efectos de sonido originales (sin derechos de terceros).

Son sustitutos provisionales: cuando haya créditos de ElevenLabs se pueden cambiar
por pistas generadas (Music / Sound Effects) dejando los archivos en assets/.

Uso: python3 pipeline/audio_assets.py
"""
from pathlib import Path
import numpy as np
import soundfile as sf

SR = 44100
ROOT = Path(__file__).resolve().parent.parent
MUSIC = ROOT / "assets" / "music"
SFX = ROOT / "assets" / "sfx"


def note(midi: float) -> float:
    return 440.0 * 2 ** ((midi - 69) / 12)


def pluck(freq, dur, decay=6.0, bright=0.35):
    t = np.arange(int(SR * dur)) / SR
    env = np.exp(-decay * t) * np.minimum(1, t * 400)
    tone = np.sin(2 * np.pi * freq * t) + bright * np.sin(4 * np.pi * freq * t) + 0.12 * np.sin(6 * np.pi * freq * t)
    return tone * env


def pad(freqs, dur):
    t = np.arange(int(SR * dur)) / SR
    env = np.minimum(1, t / 0.6) * np.minimum(1, (dur - t) / 0.6)
    out = sum(np.sin(2 * np.pi * f * t + 0.3 * np.sin(2 * np.pi * 0.25 * t)) for f in freqs)
    return out * env / len(freqs)


def kick(dur=0.35):
    t = np.arange(int(SR * dur)) / SR
    f = 120 * np.exp(-18 * t) + 45
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-9 * t)


def hat(dur=0.06, seed=0):
    rng = np.random.default_rng(seed)
    n = rng.standard_normal(int(SR * dur))
    n = np.diff(n, prepend=0)  # paso alto sencillo
    return n * np.exp(-60 * np.arange(len(n)) / SR) * 0.25


def place(buf, clip, start_s, gain=1.0):
    i = int(start_s * SR)
    j = min(len(buf), i + len(clip))
    if i < len(buf):
        buf[i:j] += clip[: j - i] * gain


def make_music(path: Path, bpm=112, bars=24, seed=1):
    """Arpegio "curioso" sobre Am–F–C–G con bombo suave y hi-hat."""
    beat = 60 / bpm
    total = bars * 4 * beat
    buf = np.zeros(int(SR * (total + 2)))
    prog = [(57, [0, 3, 7, 12]), (53, [0, 4, 7, 12]), (48, [0, 4, 7, 12]), (55, [0, 4, 7, 12])]
    pattern = [0, 1, 2, 3, 2, 1, 2, 3]
    for bar in range(bars):
        root, iv = prog[bar % 4]
        t0 = bar * 4 * beat
        place(buf, pad([note(root + x) for x in iv[:3]], 4 * beat + 0.4), t0, 0.22)
        place(buf, pluck(note(root - 12), 4 * beat, decay=1.5, bright=0.1), t0, 0.35)
        for k, p in enumerate(pattern):
            place(buf, pluck(note(root + 12 + iv[p]), beat, decay=7), t0 + k * beat / 2, 0.22)
        if bar >= 2:
            for b in range(4):
                place(buf, kick(), t0 + b * beat, 0.45)
                place(buf, hat(seed=bar * 4 + b), t0 + b * beat + beat / 2, 0.5)
    buf = buf[: int(SR * total)]
    # fundido de entrada/salida suave para que el bucle no "salte"
    fade = int(SR * 0.05)
    buf[:fade] *= np.linspace(0, 1, fade)
    buf[-fade:] *= np.linspace(1, 0, fade)
    buf = buf / np.max(np.abs(buf)) * 0.7
    sf.write(path, np.stack([buf, buf], axis=1), SR)


def make_sfx():
    rng = np.random.default_rng(7)
    # Whoosh: ruido filtrado con barrido de banda
    d = 0.6
    t = np.arange(int(SR * d)) / SR
    noise = rng.standard_normal(len(t))
    env = np.sin(np.pi * t / d) ** 2
    sweep = np.sin(2 * np.pi * np.cumsum(300 + 2500 * (t / d)) / SR)
    whoosh = np.convolve(noise, np.ones(12) / 12, mode="same") * env * (0.6 + 0.4 * sweep)
    sf.write(SFX / "whoosh.wav", (whoosh / np.max(np.abs(whoosh)) * 0.6), SR)
    # Pop
    d = 0.18
    t = np.arange(int(SR * d)) / SR
    pop = np.sin(2 * np.pi * np.cumsum(900 * np.exp(-25 * t) + 300) / SR) * np.exp(-30 * t)
    sf.write(SFX / "pop.wav", pop * 0.7, SR)
    # Ding (campanita de "dato")
    d = 1.2
    t = np.arange(int(SR * d)) / SR
    ding = (np.sin(2 * np.pi * 1318.5 * t) + 0.5 * np.sin(2 * np.pi * 2637 * t) + 0.25 * np.sin(2 * np.pi * 3955 * t)) * np.exp(-4 * t)
    sf.write(SFX / "ding.wav", ding / np.max(np.abs(ding)) * 0.5, SR)
    # Riser para el gancho
    d = 1.0
    t = np.arange(int(SR * d)) / SR
    riser = np.sin(2 * np.pi * np.cumsum(200 + 1400 * (t / d) ** 2) / SR) * (t / d) ** 1.5
    riser += 0.3 * rng.standard_normal(len(t)) * (t / d) ** 2
    sf.write(SFX / "riser.wav", riser / np.max(np.abs(riser)) * 0.45, SR)


if __name__ == "__main__":
    MUSIC.mkdir(parents=True, exist_ok=True)
    SFX.mkdir(parents=True, exist_ok=True)
    make_music(MUSIC / "curioso-112bpm.wav")
    make_music(MUSIC / "curioso-98bpm.wav", bpm=98, seed=2)
    make_sfx()
    for p in sorted(list(MUSIC.glob("*.wav")) + list(SFX.glob("*.wav"))):
        print("✓", p.relative_to(ROOT))
