#!/usr/bin/env python3
"""Narración con la voz «datoscuriosin» clonada en Qwen3-TTS, aplicando las reglas de
/home/user/curiosidades-canal/docs/voz-narracion.md.

Qué aplica de las reglas:
- Guion por piezas ([HOOK], [FACT], [GIRO], [CTA]). Las etiquetas de Eleven v4 ([curious]…) no se leen:
  se quitan del texto y se usan como pista de interpretación para elegir la mejor toma.
- Arranque: la pregunta inicial debe empezar alta (≥ +5 st sobre la media del hablante). Se generan
  varias tomas y se elige la que más sube.
- Frases de dato ('.') terminan cayendo; preguntas pueden subir. Se elige la toma que lo cumple.
- Pausas entre piezas de 0,40 s (rango de las referencias 0,35–0,48) y ningún silencio de más de 0,8 s.
- No se estira el audio (la velocidad sale del modelo y del guion).
- −14 LUFS, pico ≤ −1 dBTP.
- Control de calidad final: Whisper ≥ 95 %, 150–185 pal/min, variación de tono ≥ 3,8 st,
  arranque ≥ +5 st, silencios ≤ 0,8 s, sonoridad.

Uso:
  python voz_qwen.py guion.txt salida.wav [--qa qa.json]
"""
import argparse, json, re, subprocess, sys, tempfile, time, unicodedata
from difflib import SequenceMatcher
from pathlib import Path

import numpy as np
import soundfile as sf
import torch

MODELO = "/home/user/tools/qwen3-tts/modelos/Qwen3-TTS-12Hz-0.6B-Base"
REF_DIR = Path("/home/user/canales-nuevos/voces/clon-datoscuriosin")
REF_WAV = REF_DIR / "referencia.wav"
REF_TXT = (REF_DIR / "referencia.txt")
WHISPER = "/home/user/tools/whisper.cpp/build/bin/whisper-cli"
WMODEL = "/home/user/tools/whisper.cpp/models/ggml-small.bin"
SR = 24000
PAUSA = 0.40
TOMAS = {"HOOK": 4, "GIRO": 2}  # tomas extra donde más importa la interpretación


def limpiar(t):
    return re.sub(r"\s+", " ", re.sub(r"\[[A-Za-z_]+\]", "", t)).strip()


def piezas(guion):
    out = []
    for linea in guion.splitlines():
        linea = linea.strip()
        if not linea:
            continue
        m = re.match(r"\[([A-Z]+)\]", linea)
        tipo = m.group(1) if m else "FACT"
        tags = re.findall(r"\[([a-z_]+)\]", linea)
        out.append({"tipo": tipo, "tags": tags, "texto": limpiar(linea)})
    return out


# ---------- análisis de tono (mismo método que pipeline/voice_match.py) ----------
def f0_track(x, sr=16000, fmin=60, fmax=320):
    hop, win, out = 160, 640, []
    for i in range(0, len(x) - win, hop):
        fr = x[i:i + win] * np.hanning(win)
        if np.sqrt(np.mean(fr ** 2)) < 0.015:
            out.append(np.nan); continue
        ac = np.correlate(fr, fr, mode="full")[win - 1:]
        lo, hi = int(sr / fmax), int(sr / fmin)
        k = lo + np.argmax(ac[lo:hi])
        out.append(sr / k if ac[k] / (ac[0] + 1e-9) > 0.45 else np.nan)
    return np.array(out)


def a16(x, sr):
    import librosa
    return librosa.resample(np.asarray(x, dtype=np.float64), orig_sr=sr, target_sr=16000)


def st(f0, ref_hz):
    return 12 * np.log2(f0 / ref_hz)


def recortar(x, sr, umbral_db=-40):
    """Quita silencio inicial y final (corte dentro del silencio medido, no por Whisper)."""
    thr = 10 ** (umbral_db / 20) * (np.max(np.abs(x)) + 1e-9)
    idx = np.where(np.abs(x) > thr)[0]
    if not len(idx):
        return x
    a, b = max(idx[0] - int(0.02 * sr), 0), min(idx[-1] + int(0.06 * sr), len(x))
    return x[a:b]


def acortar_silencios(x, sr, max_s=0.6, deja_s=0.45):
    """Ningún silencio interno de más de max_s: se reduce a deja_s (no se toca la voz)."""
    win = int(0.02 * sr)
    rms = np.array([np.sqrt(np.mean(x[i:i + win] ** 2)) for i in range(0, len(x) - win, win)])
    thr = 0.02 * (rms.max() + 1e-9)
    sil = rms < thr
    out, i = [], 0
    while i < len(sil):
        j = i
        while j < len(sil) and sil[j] == sil[i]:
            j += 1
        seg = x[i * win:j * win]
        if sil[i] and (j - i) * win / sr > max_s:
            seg = np.zeros(int(deja_s * sr))
        out.append(seg); i = j
    out.append(x[len(sil) * win:])
    return np.concatenate(out)


def puntua(x, sr, pieza, ref_hz, es_primera):
    f = f0_track(a16(x, sr))
    v = f[~np.isnan(f)]
    if len(v) < 10:
        return -99, {}
    s = st(f, ref_hz)
    voz = np.where(~np.isnan(s))[0]
    ini = np.nanmedian(s[voz[:25]])    # ~0,25 s de voz al principio
    fin = np.nanmedian(s[voz[-25:]])   # ~0,25 s al final
    var = float(np.nanstd(s))
    texto = pieza["texto"]
    score = var
    if es_primera:
        score += 3 * min(ini, 10)                     # arranque alto
    if texto.endswith(".") or texto.endswith("…"):
        score += 1.5 * (ini - fin)                    # el dato cae
    if texto.endswith("?") and not es_primera:
        score += 0.5 * max(fin - ini, 0)
    return float(score), {"inicio_st": round(float(ini), 2), "final_st": round(float(fin), 2), "variacion_st": round(var, 2)}


def norm_txt(t):
    t = unicodedata.normalize("NFD", t.lower())
    t = "".join(c for c in t if unicodedata.category(c) != "Mn")
    return re.findall(r"[a-z0-9ñ]+", t)


def whisper(path):
    with tempfile.TemporaryDirectory() as td:
        w = Path(td) / "w.wav"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(path), "-ar", "16000", "-ac", "1", str(w)], check=True)
        r = subprocess.run([WHISPER, "-m", WMODEL, "-l", "es", "-nt", "-np", "-f", str(w)], capture_output=True, text=True)
    return r.stdout.strip()


def lufs(path):
    e = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(path), "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
    i = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", e)[-1])
    p = float(re.findall(r"Peak:\s+(-?[\d.]+) dBFS", e)[-1])
    return i, p


def silencio_max(path):
    e = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(path), "-af", "silencedetect=n=-38dB:d=0.3", "-f", "null", "-"], capture_output=True, text=True).stderr
    d = [float(x) for x in re.findall(r"silence_duration: ([\d.]+)", e)]
    return max(d) if d else 0.0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("guion"); ap.add_argument("salida"); ap.add_argument("--qa")
    a = ap.parse_args()
    t0 = time.time()
    torch.set_num_threads(4)
    from qwen_tts import Qwen3TTSModel
    m = Qwen3TTSModel.from_pretrained(MODELO, device_map="cpu", dtype=torch.float32)
    ref_txt = REF_TXT.read_text().strip()
    # se calcula el prompt de voz una sola vez
    prompt = m.create_voice_clone_prompt(ref_audio=str(REF_WAV), ref_text=ref_txt) if hasattr(m, "create_voice_clone_prompt") else None
    rx, rsr = sf.read(REF_WAV)
    rf = f0_track(a16(rx, rsr)); ref_hz = float(np.nanmedian(rf))

    ps = piezas(Path(a.guion).read_text())
    trozos, info = [], []
    for k, p in enumerate(ps):
        n = TOMAS.get(p["tipo"], 1)
        mejor = None
        for t in range(n + 1):  # +1 reintento por si Whisper falla
            if prompt is not None:
                w, sr = m.generate_voice_clone(text=p["texto"], language="Spanish", voice_clone_prompt=prompt)
            else:
                w, sr = m.generate_voice_clone(text=p["texto"], language="Spanish", ref_audio=str(REF_WAV), ref_text=ref_txt)
            x = recortar(np.asarray(w[0], dtype=np.float64), sr)
            x = acortar_silencios(x, sr)
            with tempfile.NamedTemporaryFile(suffix=".wav") as tf:
                sf.write(tf.name, x, sr); txt = whisper(tf.name)
            acierto = SequenceMatcher(None, norm_txt(p["texto"]), norm_txt(txt)).ratio()
            sc, med = puntua(x, sr, p, ref_hz, k == 0)
            if acierto < 0.9:
                sc -= 100
            cand = {"x": x, "sr": sr, "score": sc, "med": med, "acierto": round(acierto, 3)}
            if mejor is None or cand["score"] > mejor["score"]:
                mejor = cand
            if t + 1 >= n and mejor["acierto"] >= 0.9:
                break
        trozos += [mejor["x"], np.zeros(int(PAUSA * mejor["sr"]))]
        info.append({"pieza": p["tipo"], "texto": p["texto"], "tomas": t + 1, **mejor["med"], "acierto_whisper": mejor["acierto"]})
        print(f"  {p['tipo']:5} tomas={t + 1} {mejor['med']} whisper={mejor['acierto']}", flush=True)
    y = np.concatenate(trozos[:-1])
    with tempfile.TemporaryDirectory() as td:
        crudo = Path(td) / "crudo.wav"; sf.write(crudo, y, sr)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(crudo), "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", "44100", "-ac", "1", a.salida], check=True)

    # ---------- control de calidad (sección 6 de voz-narracion.md) ----------
    dur = sf.info(a.salida).duration
    texto = " ".join(p["texto"] for p in ps)
    trans = whisper(a.salida)
    acierto = SequenceMatcher(None, norm_txt(texto), norm_txt(trans)).ratio()
    ppm = len(norm_txt(texto)) / dur * 60
    x16 = a16(sf.read(a.salida)[0], 44100)
    f = f0_track(x16); s = st(f, ref_hz)
    var = float(np.nanstd(s))
    i_lufs, pico = lufs(a.salida)
    silmax = silencio_max(a.salida)
    tags_leidas = any(t in trans.lower() for t in ["curious", "dramatically", "warmly", "excited", "serious", "pause"])
    pruebas = [
        ("Whisper ≥ 95 % del guion", acierto >= 0.95, f"{acierto * 100:.1f} %"),
        ("sin etiquetas leídas", not tags_leidas, "ninguna" if not tags_leidas else "se oye una etiqueta"),
        ("ritmo 150–185 pal/min", 150 <= ppm <= 185, f"{ppm:.0f} pal/min"),
        ("variación de tono ≥ 3,8 st", var >= 3.8, f"{var:.2f} st"),
        ("arranque ≥ +5 st", info[0].get("inicio_st", -99) >= 5, f"{info[0].get('inicio_st')} st"),
        ("ningún silencio > 0,8 s", silmax <= 0.8, f"máx. {silmax:.2f} s"),
        ("sonoridad −14 LUFS (−16 a −12)", -16 <= i_lufs <= -12, f"{i_lufs} LUFS"),
        ("pico ≤ −1 dBTP", pico <= -1.0, f"{pico} dB"),
    ]
    qa = {"salida": a.salida, "voz": "datoscuriosin clonada · Qwen3-TTS 0.6B Base", "duracion_s": round(dur, 2),
          "aprobado": all(ok for _, ok, _ in pruebas), "pruebas": [{"prueba": n, "ok": ok, "detalle": d} for n, ok, d in pruebas],
          "piezas": info, "transcripcion": trans, "segundos_de_proceso": round(time.time() - t0)}
    for n, ok, d in pruebas:
        print(("✓ " if ok else "✗ ") + n + ": " + d)
    if a.qa:
        Path(a.qa).write_text(json.dumps(qa, ensure_ascii=False, indent=2))
    print(f"{'APROBADO' if qa['aprobado'] else 'NO APROBADO'} · {dur:.1f} s · {qa['segundos_de_proceso']} s de proceso")


if __name__ == "__main__":
    main()
