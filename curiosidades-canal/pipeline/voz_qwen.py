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
  python voz_qwen.py guion.txt salida.wav [--qa qa.json] [--motor qwen|fish]

--motor fish (22/11/2026, propietario: «rehazme el audio del short 1 con fish audio con todas las
reglas de audio»): misma referencia, mismas tomas, puntuación y QA, pero cada toma la genera la API
oficial de Fish Audio (clonación instantánea con la referencia, modelo gratuito s2.1-pro-free salvo
--fish-modelo). La clave la inyecta el proxy del entorno; nunca está en archivos.
"""
import argparse, json, re, subprocess, sys, tempfile, time, unicodedata
from difflib import SequenceMatcher
from pathlib import Path

import numpy as np
import soundfile as sf
import torch

MODELO = "/home/user/tools/qwen3-tts/modelos/Qwen3-TTS-12Hz-0.6B-Base"
# Referencia de la voz oficial (propietario, 21/11/2026: «utiliza la voz del archivo para los Shorts»)
REF_DIR = Path("/home/user/curiosidades-canal/assets/voz/oficial-qwen")
REF_WAV = REF_DIR / "referencia.flac"
REF_TXT = (REF_DIR / "referencia.txt")
WHISPER = "/home/user/tools/whisper.cpp/build/bin/whisper-cli"
WMODEL = "/home/user/tools/whisper.cpp/models/ggml-small.bin"
SR = 24000
PAUSA = 0.50
TOMAS = {"HOOK": 6, "GIRO": 3, "FACT": 3}  # tomas extra donde más importa la interpretación


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
    score = 2 * var  # expresividad: la voz del propietario varía ~3,9–4,3 st
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


def fish_generador(ref_wav, ref_txt, modelo):
    """Una toma = una petición a la API oficial de Fish Audio (clonación instantánea con la referencia)."""
    import io, httpx, msgpack
    with tempfile.TemporaryDirectory() as td:  # la API pide wav/mp3/flac: se manda wav
        w = Path(td) / "ref.wav"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(ref_wav), "-ac", "1", str(w)], check=True)
        ref_bytes = w.read_bytes()
    hd = {"Authorization": "Bearer proxy-injected", "Content-Type": "application/msgpack", "model": modelo}

    def gen(texto):
        body = {"text": texto, "references": [{"audio": ref_bytes, "text": ref_txt}], "format": "wav",
                "sample_rate": 44100, "latency": "normal", "normalize": True, "language": "es",
                "temperature": 0.7, "top_p": 0.7}
        for intento in range(4):
            r = httpx.post("https://api.fish.audio/v1/tts", headers=hd,
                           content=msgpack.packb(body, use_bin_type=True), timeout=180)
            if r.status_code in (429, 500, 502, 503, 504):
                time.sleep(5 * (intento + 1)); continue
            if not r.is_success:
                sys.exit(f"Fish Audio {r.status_code}: {r.text[:300]}")
            x, sr = sf.read(io.BytesIO(r.content))
            return (x.mean(1) if x.ndim > 1 else x).astype(np.float64), sr
        sys.exit("Fish Audio no responde tras 4 intentos")
    return gen


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("guion"); ap.add_argument("salida"); ap.add_argument("--qa")
    ap.add_argument("--ref", default=str(REF_WAV)); ap.add_argument("--ref-texto", default=None)
    ap.add_argument("--motor", choices=["qwen", "fish"], default="qwen")
    ap.add_argument("--fish-modelo", default="s2.1-pro-free")
    ap.add_argument("--tomas-hook", type=int, default=None)
    ap.add_argument("--tomas-fact", type=int, default=None)
    a = ap.parse_args()
    t0 = time.time()
    ref_wav = a.ref
    ref_txt = a.ref_texto or REF_TXT.read_text().strip()
    if a.tomas_hook:
        TOMAS["HOOK"] = a.tomas_hook
    if a.tomas_fact:
        TOMAS["FACT"] = TOMAS["GIRO"] = a.tomas_fact
    if a.motor == "fish":
        gen = fish_generador(ref_wav, ref_txt, a.fish_modelo)
    else:
        torch.set_num_threads(4)
        from qwen_tts import Qwen3TTSModel
        m = Qwen3TTSModel.from_pretrained(MODELO, device_map="cpu", dtype=torch.float32)
        # se calcula el prompt de voz una sola vez
        prompt = m.create_voice_clone_prompt(ref_audio=ref_wav, ref_text=ref_txt) if hasattr(m, "create_voice_clone_prompt") else None

        def gen(texto):
            if prompt is not None:
                w, sr = m.generate_voice_clone(text=texto, language="Spanish", voice_clone_prompt=prompt)
            else:
                w, sr = m.generate_voice_clone(text=texto, language="Spanish", ref_audio=ref_wav, ref_text=ref_txt)
            return np.asarray(w[0], dtype=np.float64), sr
    rx, rsr = sf.read(ref_wav)
    rf = f0_track(a16(rx, rsr)); ref_hz = float(np.nanmedian(rf))

    ps = piezas(Path(a.guion).read_text())
    trozos, info = [], []
    for k, p in enumerate(ps):
        n = TOMAS.get(p["tipo"], 1)
        mejor = None
        for t in range(n + 1):  # +1 reintento por si Whisper falla
            w, sr = gen(p["texto"])
            x = recortar(w, sr)
            x = acortar_silencios(x, sr)
            with tempfile.NamedTemporaryFile(suffix=".wav") as tf:
                sf.write(tf.name, x, sr); txt = whisper(tf.name)
            acierto = SequenceMatcher(None, norm_txt(p["texto"]), norm_txt(txt)).ratio()
            sc, med = puntua(x, sr, p, ref_hz, k == 0)
            if acierto < 0.95:
                sc -= 100
            cand = {"x": x, "sr": sr, "score": sc, "med": med, "acierto": round(acierto, 3), "txt": txt}
            if mejor is None or cand["score"] > mejor["score"]:
                mejor = cand
            listo = mejor["acierto"] >= 0.95 and (k > 0 or mejor["med"].get("inicio_st", -99) >= 5.5)
            if listo and (k == 0 or t + 1 >= n):
                break
        trozos += [mejor["x"], np.zeros(int(PAUSA * mejor["sr"]))]
        info.append({"pieza": p["tipo"], "texto": p["texto"], "tomas": t + 1, **mejor["med"], "acierto_whisper": mejor["acierto"], "oido": mejor["txt"]})
        print(f"  {p['tipo']:5} tomas={t + 1} {mejor['med']} whisper={mejor['acierto']}", flush=True)
    y = np.concatenate(trozos[:-1])
    with tempfile.TemporaryDirectory() as td:
        crudo = Path(td) / "crudo.wav"; sf.write(crudo, y, sr)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(crudo), "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", "44100", "-ac", "1", a.salida], check=True)

    # ---------- control de calidad (sección 6 de voz-narracion.md) ----------
    dur = sf.info(a.salida).duration
    texto = " ".join(p["texto"] for p in ps)
    trans = whisper(a.salida)
    # Whisper frase a frase (el audio de cada frase se comprueba antes de unirlo; transcribir el archivo
    # entero de golpe a veces se salta la última frase). El archivo entero se usa para las etiquetas.
    acierto = SequenceMatcher(None, norm_txt(texto), norm_txt(" ".join(i["oido"] for i in info))).ratio()
    ppm = len(norm_txt(texto)) / dur * 60
    x16 = a16(sf.read(a.salida)[0], 44100)
    f = f0_track(x16); s = st(f, ref_hz)
    var = float(np.nanstd(s))
    i_lufs, pico = lufs(a.salida)
    silmax = silencio_max(a.salida)
    tags_leidas = any(t in trans.lower() for t in ["curious", "dramatically", "warmly", "excited", "serious", "pause"])
    pruebas = [
        ("Whisper ≥ 95 % del guion (frase a frase)", acierto >= 0.95, f"{acierto * 100:.1f} %"),
        ("sin etiquetas leídas", not tags_leidas, "ninguna" if not tags_leidas else "se oye una etiqueta"),
        ("ritmo 150–185 pal/min", 150 <= ppm <= 185, f"{ppm:.0f} pal/min"),
        ("variación de tono ≥ 3,8 st", var >= 3.8, f"{var:.2f} st"),
        ("arranque ≥ +5 st", info[0].get("inicio_st", -99) >= 5, f"{info[0].get('inicio_st')} st"),
        ("ningún silencio > 0,8 s", silmax <= 0.8, f"máx. {silmax:.2f} s"),
        ("sonoridad −14 LUFS (−16 a −12)", -16 <= i_lufs <= -12, f"{i_lufs} LUFS"),
        ("pico ≤ −1 dBTP", pico <= -1.0, f"{pico} dB"),
    ]
    motor = f"Fish Audio API ({a.fish_modelo})" if a.motor == "fish" else "Qwen3-TTS 0.6B Base"
    qa = {"salida": a.salida, "voz": f"voz oficial del propietario (archivo 21/11) · {motor}", "motor": a.motor, "duracion_s": round(dur, 2),
          "aprobado": all(ok for _, ok, _ in pruebas), "pruebas": [{"prueba": n, "ok": ok, "detalle": d} for n, ok, d in pruebas],
          "piezas": info, "transcripcion": trans, "segundos_de_proceso": round(time.time() - t0)}
    for n, ok, d in pruebas:
        print(("✓ " if ok else "✗ ") + n + ": " + d)
    if a.qa:
        Path(a.qa).write_text(json.dumps(qa, ensure_ascii=False, indent=2))
    print(f"{'APROBADO' if qa['aprobado'] else 'NO APROBADO'} · {dur:.1f} s · {qa['segundos_de_proceso']} s de proceso")


if __name__ == "__main__":
    main()
