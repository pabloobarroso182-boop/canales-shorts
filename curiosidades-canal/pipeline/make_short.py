"""Produce un Short vertical 1080x1920 a partir de un guion JSON.

Pasos: voz por escena (ElevenLabs o respaldo local) -> unión con FFmpeg -> subtítulos
con Whisper (whisper.cpp) alineados al guion -> efectos de sonido con FFmpeg (sin música,
normalizado a -14 LUFS) -> montaje y render con Remotion -> portada y metadatos.

Uso:
  python3 pipeline/make_short.py guion.json [--out PRODUCCION/2026-11-19/01-tema]

Voz OFICIAL (config/publicacion.json -> "voz_estandar", aprobada por el propietario el 19/11/2026):
  ElevenLabs Eleven v4 + «datoscuriosin» (kQwUFpYQ184OVlnMEzlm), español, estabilidad 0,5 y similitud 0,85.
  - Toda la narración se genera en UNA sola petición (la entonación fluye entre frases, como en la prueba 1).
  - El campo "voz" de cada escena puede llevar etiquetas de Eleven v4 ([curious], [dramatically]…);
    se quitan para subtítulos, control de calidad y originalidad (docs/voz-narracion.md).
  - Nunca se cambia de voz en silencio: si falta la clave o no quedan caracteres del plan, se PARA con error.
  - La clave la inyecta el proxy del entorno (secreto de red); no está en ningún archivo.
  Solo para pruebas internas: TTS_PROVIDER=kokoro (voz local antigua, no apta para publicar).
"""
from __future__ import annotations

import argparse
import difflib
import json
import os
import re
import shutil
import subprocess
import unicodedata
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VIDEO = ROOT / "video"
CONFIG = json.loads((ROOT / "config" / "publicacion.json").read_text())
def _first(*paths) -> str:
    for p in paths:
        if p and Path(p).exists():
            return str(p)
    return str(paths[-1])


WHISPER_CLI = os.environ.get("WHISPER_CLI") or shutil.which("whisper-cli") or _first(
    Path.home() / "tools/whisper.cpp/build/bin/whisper-cli", "/home/user/tools/whisper.cpp/build/bin/whisper-cli")
WHISPER_MODEL = os.environ.get("WHISPER_MODEL") or _first(
    Path.home() / "tools/whisper.cpp/models/ggml-small.bin", "/home/user/tools/whisper.cpp/models/ggml-small.bin")
KOKORO_MODEL = Path.home() / ".cache/hyperframes/tts/models/kokoro-v1.0.onnx"
KOKORO_VOICES = Path.home() / ".cache/hyperframes/tts/voices/voices-v1.0.bin"
GAP_S = 0.1    # silencio entre escenas (ritmo ágil, sin huecos)
TAIL_S = 0.6   # cola al final


def run(cmd: list[str], **kw) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, check=True, capture_output=True, text=True, **kw)


def duration(path: Path) -> float:
    return float(run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)]).stdout)


# ---------------------------------------------------------------- voz
def eleven_request(path: str, body: dict | None = None, timeout=120):
    key = os.environ.get("ELEVENLABS_API_KEY", "inyectada-por-el-proxy")
    req = urllib.request.Request(
        "https://api.elevenlabs.io" + path,
        data=json.dumps(body).encode() if body is not None else None,
        headers={"xi-api-key": key, "Content-Type": "application/json"},
    )
    return urllib.request.urlopen(req, timeout=timeout)


ETIQUETA = re.compile(r"\[[^\]]+\]\s*")


def sin_etiquetas(texto: str) -> str:
    """Quita las etiquetas de interpretación de Eleven v4 ([curious], [pause]…)."""
    return re.sub(r"\s+", " ", ETIQUETA.sub("", texto)).strip()


def eleven_available(chars_needed: int) -> tuple[bool, str]:
    """Comprueba clave y caracteres restantes del plan (sin gasto extra)."""
    try:
        with eleven_request("/v1/user/subscription", timeout=20) as r:
            sub = json.load(r)
    except urllib.error.HTTPError as e:
        return False, f"ElevenLabs respondió {e.code} (¿falta la clave de API?)"
    except Exception as e:
        return False, f"ElevenLabs no accesible ({e.__class__.__name__})"
    left = sub.get("character_limit", 0) - sub.get("character_count", 0)
    if left < chars_needed + 50:
        return False, f"ElevenLabs sin caracteres suficientes ({left} disponibles, {chars_needed} necesarios)"
    return True, f"ElevenLabs: {left} caracteres disponibles"


def choose_provider(spec: dict) -> tuple[str, str]:
    forced = os.environ.get("TTS_PROVIDER")
    if forced == "kokoro":
        return "kokoro", "forzado por TTS_PROVIDER (solo pruebas internas: NO es la voz oficial)"
    est = CONFIG["voz_estandar"]
    chars = sum(len(sc["voz"]) for sc in spec["escenas"])
    ok, why = eleven_available(chars)
    if not ok:  # la voz oficial no se sustituye nunca por otra en silencio
        raise SystemExit(f"✗ No se puede generar la voz oficial: {why}. No se produce el Short con otra voz.")
    return "elevenlabs_v4", f"voz oficial {est['nombre_voz']} · {est['modelo']} · {why}"


def tts_oficial(texto: str, dest: Path) -> dict:
    """Narración completa con la voz oficial (Eleven v4) en una sola petición."""
    est = CONFIG["voz_estandar"]
    body = {
        "text": texto,
        "model_id": est["modelo"],
        "language_code": est.get("idioma", "es"),
        "voice_settings": {"stability": est["ajustes"]["stability"], "similarity_boost": est["ajustes"]["similarity"]},
    }
    mp3 = dest.with_suffix(".mp3")
    try:
        with eleven_request(f"/v1/text-to-speech/{est['voice_id']}?output_format=mp3_44100_128", body, timeout=300) as r:
            mp3.write_bytes(r.read())
    except urllib.error.HTTPError as e:
        raise SystemExit(f"✗ ElevenLabs respondió {e.code}: {e.read()[:300]!r}")
    run(["ffmpeg", "-v", "error", "-y", "-i", str(mp3), "-af",
         "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse",
         "-ar", "44100", "-ac", "1", str(dest)])
    return {"proveedor": "elevenlabs", "modelo": est["modelo"], "voice_id": est["voice_id"], "nombre": est["nombre_voz"],
            "idioma": body["language_code"], "ajustes": est["ajustes"], "caracteres": len(texto)}


def tts_elevenlabs(text: str, dest: Path, prev: str, nxt: str) -> None:
    voz = CONFIG["voz"]
    body = {
        "text": text,
        "model_id": voz.get("modelo_elevenlabs", "eleven_multilingual_v2"),
        "previous_text": prev or None,
        "next_text": nxt or None,
        "voice_settings": {"stability": 0.45, "similarity_boost": 0.85, "style": 0.3, "use_speaker_boost": True},
    }
    mp3 = dest.with_suffix(".mp3")
    with eleven_request(f"/v1/text-to-speech/{voz['elevenlabs_voice_id']}?output_format=mp3_44100_128", body) as r:
        mp3.write_bytes(r.read())
    run(["ffmpeg", "-v", "error", "-y", "-i", str(mp3), "-ar", "44100", "-ac", "1", str(dest)])


_kokoro = None


def tts_kokoro(text: str, dest: Path) -> None:
    from kokoro_onnx import Kokoro  # type: ignore
    import soundfile as sf

    global _kokoro
    if _kokoro is None:
        _kokoro = Kokoro(str(KOKORO_MODEL), str(KOKORO_VOICES))
    match = json.loads((ROOT / "config" / "voz_respaldo.json").read_text())
    speed = max(0.95, match.get("velocidad", 1.0))
    if match.get("elegida") == "mezcla":  # mezcla de estilos de voz (pipeline/voice_search.py)
        import numpy as np
        voice = sum(w * _kokoro.get_voice_style(name) for name, w in match["mezcla"].items()).astype(np.float32)
    else:
        voice = match.get("elegida", "em_santa")
    samples, sr = _kokoro.create(text, voice=voice, speed=speed, lang="es")
    raw = dest.with_suffix(".k.wav")
    sf.write(raw, samples, sr)
    ratio = 2 ** (match.get("ajuste_tono_semitonos", 0) / 12)
    filtros = [f"rubberband=pitch={ratio:.4f}:formant=preserved"]
    if match.get("ecualizacion"):  # ajuste de timbre (pipeline/voice_tune.py)
        filtros.append(match["ecualizacion"])
    run(["ffmpeg", "-v", "error", "-y", "-i", str(raw), "-af", ",".join(filtros), str(dest)])


def make_voice(spec: dict, work: Path, provider: str) -> tuple[Path, list[tuple[float, float]]]:
    parts, spans, t = [], [], 0.0
    silence = work / "gap.wav"
    run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", "-t", str(GAP_S), str(silence)])
    esc = spec["escenas"]
    for i, sc in enumerate(esc):
        raw = work / f"voz-{i:02d}.raw.wav"
        clean = work / f"voz-{i:02d}.wav"
        if provider == "elevenlabs":
            tts_elevenlabs(sc["voz"], raw, esc[i - 1]["voz"] if i else "", esc[i + 1]["voz"] if i + 1 < len(esc) else "")
        else:
            tts_kokoro(sc["voz"], raw)
        run(["ffmpeg", "-v", "error", "-y", "-i", str(raw), "-af",
             "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse",
             "-ar", "44100", "-ac", "1", str(clean)])
        d = duration(clean)
        spans.append((t, t + d))
        parts += [clean, silence]
        t += d + GAP_S
    (work / "voz.txt").write_text("".join(f"file '{p.name}'\n" for p in parts))
    voice = work / "voz.wav"
    run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", "voz.txt", "-c", "copy", str(voice)], cwd=work)
    return voice, spans


# ---------------------------------------------------------- subtítulos
def norm(w: str) -> str:
    w = unicodedata.normalize("NFD", w.lower())
    w = "".join(c for c in w if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9ñ]", "", w)


def transcribe(audio: Path, work: Path, prompt: str = "") -> list[dict]:
    wav16 = work / "voz16.wav"
    run(["ffmpeg", "-v", "error", "-y", "-i", str(audio), "-ar", "16000", "-ac", "1", "-c:a", "pcm_s16le", str(wav16)])
    base = work / "whisper"
    cmd = [WHISPER_CLI, "-m", WHISPER_MODEL, "-f", str(wav16), "-l", "es", "-t", str(os.cpu_count() or 4),
           "-ml", "1", "-sow", "-oj", "-of", str(base)]
    if prompt:
        cmd += ["--prompt", prompt[:800]]
    run(cmd)
    data = json.loads(Path(str(base) + ".json").read_text())
    return [{"text": s["text"].strip(), "start": s["offsets"]["from"], "end": s["offsets"]["to"]}
            for s in data["transcription"] if s["text"].strip()]


def align(script_words: list[str], heard: list[dict]):
    """Texto del guion (ortografía correcta) con los tiempos que da Whisper."""
    a = [norm(w) for w in script_words]
    b = [norm(w["text"]) for w in heard]
    times: list = [None] * len(a)
    sm = difflib.SequenceMatcher(a=a, b=b, autojunk=False)
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == "equal" or (tag == "replace" and (i2 - i1) == (j2 - j1)):
            for k in range(i2 - i1):
                times[i1 + k] = (heard[j1 + k]["start"], heard[j1 + k]["end"])
        elif tag == "replace" and j2 > j1:
            s, e = heard[j1]["start"], heard[j2 - 1]["end"]
            n = i2 - i1
            for k in range(n):
                times[i1 + k] = (s + (e - s) * k / n, s + (e - s) * (k + 1) / n)
    for i, tm in enumerate(times):
        if tm is None:
            prev = next((times[j][1] for j in range(i - 1, -1, -1) if times[j]), 0)
            nxt = next((times[j][0] for j in range(i + 1, len(times)) if times[j]), prev + 300)
            times[i] = (prev, max(prev + 120, nxt))
    caps = [{"text": (" " if i else "") + w, "startMs": int(s), "endMs": int(max(e, s + 80)),
             "timestampMs": int((s + e) / 2), "confidence": None}
            for i, (w, (s, e)) in enumerate(zip(script_words, times))]
    matched = sum(t[2] - t[1] for t in sm.get_opcodes() if t[0] == "equal")
    return caps, matched / max(1, len(a))


# --------------------------------------------------- efectos (sin música)
def mix(voice: Path, spec: dict, spans, total_s: float, work: Path) -> Path:
    sfx = ROOT / "assets" / "sfx"
    events = [("pop", 0.0, 0.7)]
    for i, (s, _) in enumerate(spans[1:], start=1):
        kind = spec["escenas"][i].get("kind", "fact")
        name = "ding" if kind in ("cta", "giro") else "whoosh"
        events.append((name, max(0, s - 0.22), 0.45 if name == "whoosh" else 0.5))
    inputs = ["-i", str(voice)]
    for name, _, _ in events:
        inputs += ["-i", str(sfx / f"{name}.wav")]
    # La voz manda: los efectos se agrupan en un bus que se atenúa cuando hay voz (ducking).
    fc = ["[0:a]aformat=sample_rates=44100:channel_layouts=stereo,asplit=2[v][vkey]"]
    labels = ["[v]"]
    sfx_labels = []
    if CONFIG.get("musica", False):
        music = ROOT / "assets" / "music" / spec.get("musica", "curioso-112bpm.wav")
        inputs += ["-stream_loop", "-1", "-i", str(music)]
        mi = len(events) + 1
        fc[0] = "[0:a]aformat=sample_rates=44100:channel_layouts=stereo,asplit=3[v][vkey][vsc]"
        fc += [f"[{mi}:a]atrim=0:{total_s:.3f},volume=0.22[m]", "[m][vsc]sidechaincompress=threshold=0.04:ratio=8[md]"]
        labels.append("[md]")
    for k, (_, t, g) in enumerate(events):
        fc.append(f"[{k + 1}:a]aformat=sample_rates=44100:channel_layouts=stereo,adelay={int(t*1000)}|{int(t*1000)},volume={g}[s{k}]")
        sfx_labels.append(f"[s{k}]")
    fc.append(f"{''.join(sfx_labels)}amix=inputs={len(sfx_labels)}:normalize=0[sfx]")
    fc.append("[sfx][vkey]sidechaincompress=threshold=0.02:ratio=12:attack=5:release=250:makeup=1[sfxd]")
    labels.append("[sfxd]")
    fc.append(f"{''.join(labels)}amix=inputs={len(labels)}:normalize=0,apad,atrim=0:{total_s:.3f},loudnorm=I=-14:TP=-1.5:LRA=11[out]")
    out = work / "mezcla.wav"
    run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(fc), "-map", "[out]", "-ar", "48000", str(out)])
    return out


# --------------------------------------------------------------- main
def produce(spec_path: Path, out: Path) -> dict:
    spec = json.loads(spec_path.read_text())
    sid = spec["id"]
    work = out / "work"
    work.mkdir(parents=True, exist_ok=True)
    print(f"▶ {sid} -> {out.relative_to(ROOT) if out.is_relative_to(ROOT) else out}")

    provider, why = choose_provider(spec)
    print(f"  · voz: {provider} ({why})")
    script = " ".join(sin_etiquetas(sc["voz"]) for sc in spec["escenas"])
    voz_info = None
    if provider == "elevenlabs_v4":
        voice = work / "voz.wav"
        voz_info = tts_oficial(" ".join(sc["voz"].strip() for sc in spec["escenas"]), voice)
        heard = transcribe(voice, work)  # sin «prompt»: con audio de v4, Whisper repetía frases
        caps, ratio = align(script.split(), heard)
        # tramos de cada escena a partir de los tiempos de sus palabras
        spans, k = [], 0
        for sc in spec["escenas"]:
            n = len(sin_etiquetas(sc["voz"]).split())
            spans.append((caps[k]["startMs"] / 1000, caps[k + n - 1]["endMs"] / 1000))
            k += n
        spans[-1] = (spans[-1][0], max(spans[-1][1], duration(voice)))
    else:
        voice, spans = make_voice(spec, work, provider)
        heard = transcribe(voice, work, prompt=script)
        caps, ratio = align(script.split(), heard)
    total_s = spans[-1][1] + TAIL_S
    print(f"  · subtítulos: {len(heard)} palabras oídas, {ratio:.0%} coinciden con el guion")
    if ratio < 0.9:
        print("  ⚠ la voz no coincide bien con el guion (¿alguna etiqueta leída en voz alta o palabra mal dicha?)")

    mixed = mix(voice, spec, spans, total_s, work)
    pub = VIDEO / "public" / "shorts" / sid
    pub.mkdir(parents=True, exist_ok=True)
    shutil.copy(mixed, pub / "mezcla.wav")

    scenes = []
    for i, (sc, (s, e)) in enumerate(zip(spec["escenas"], spans)):
        clip = sc.get("clip")
        clip_path = (spec_path.parent / clip) if clip else None
        if clip_path and not clip_path.exists():
            clip_path = ROOT / clip
        if clip_path and clip_path.exists():
            shutil.copy(clip_path, pub / clip_path.name)
            clip = f"shorts/{sid}/{clip_path.name}"
        else:
            clip = None
        kind = sc.get("kind", "fact")
        scenes.append({"startMs": 0 if i == 0 else int((s - GAP_S / 2) * 1000), "endMs": int(e * 1000), "clip": clip,
                       "icon": sc["icon"], "big": sc["big"], "small": sc.get("small"), "accent": sc.get("accent"),
                       "kind": "fact" if kind == "giro" else kind, "ilustracion": sc.get("ilustracion")})
    props = {"id": sid, "durationMs": int(total_s * 1000), "audio": f"shorts/{sid}/mezcla.wav", "scenes": scenes, "captions": caps,
             "estilo": spec.get("estilo", CONFIG.get("estilo", "tarjetas"))}
    props_path = out / "props.json"
    props_path.write_text(json.dumps(props, ensure_ascii=False, indent=1))

    final = out / f"{sid}.mp4"
    print("  · render (remotion)")
    run(["npx", "remotion", "render", "src/index.ts", "Short", str(final), f"--props={props_path}",
         "--codec=h264", "--crf=18", "--audio-codec=aac", "--audio-bitrate=192k", "--concurrency=4"], cwd=VIDEO)
    run(["ffmpeg", "-v", "error", "-y", "-ss", "1.0", "-i", str(final), "-frames:v", "1", "-q:v", "2", str(out / "portada.jpg")])

    # entregables de texto
    shutil.copy(spec_path, out / "guion.json") if spec_path.resolve() != (out / "guion.json").resolve() else None
    (out / "guion.txt").write_text("\n\n".join(f"[{sc.get('kind', 'fact').upper()}] {sc['voz']}" for sc in spec["escenas"]) + "\n")
    shutil.copy(voice, out / "narracion.wav")  # la narración limpia, por si hay que reutilizarla
    (out / "fuentes.md").write_text(
        f"# Fuentes · {spec['titulo']}\n\n" + "\n".join(f"- {f}" for f in spec["fuentes"]) +
        f"\n\n**Verificación:** {spec.get('verificacion', '')}\n")
    meta = {
        "titulo": spec["titulo"],
        "descripcion": spec["descripcion"] + "\n\n" + " ".join(spec["hashtags"]),
        "hashtags": spec["hashtags"],
        "tags": spec["tags"],
        "categoria": "27",
        "idioma": "es",
        "archivo": str(final),
        "duracion_s": round(duration(final), 2),
        "voz": provider,
        "voz_motivo": why,
        "voz_config": voz_info,
        "voz_palabras_min": round(len(script.split()) / max(1.0, spans[-1][1] - spans[0][0]) * 60),
        "subtitulos_coincidencia": round(ratio, 3),
    }
    (out / "metadata.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2))
    shutil.rmtree(work, ignore_errors=True)
    shutil.rmtree(pub, ignore_errors=True)
    print(f"✓ {final.name} ({meta['duracion_s']} s)")
    return meta


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("guion")
    ap.add_argument("--out", help="carpeta de salida (por defecto output/<id>)")
    a = ap.parse_args()
    spec_path = Path(a.guion).resolve()
    sid = json.loads(spec_path.read_text())["id"]
    out = Path(a.out).resolve() if a.out else ROOT / "output" / sid
    out.mkdir(parents=True, exist_ok=True)
    produce(spec_path, out)
