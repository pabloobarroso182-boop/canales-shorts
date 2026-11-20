#!/usr/bin/env python3
"""Qwen3-TTS local (Apache-2.0) en CPU.

Usos:
  # 1) Diseñar una voz nueva a partir de una descripción (modelo VoiceDesign 1.7B)
  python qwen3_tts.py disenar --desc "Hombre de 35 años, español de España..." --texto "..." --salida voz.wav
  # 2) Narrar con una voz fija clonando una muestra de referencia (modelo Base 0.6B)
  python qwen3_tts.py clonar --ref voz.wav --ref-texto "texto exacto de la muestra" --texto "..." --salida narracion.wav
"""
import argparse, os, time
import soundfile as sf
import torch

BASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "qwen3-tts", "modelos")
torch.set_num_threads(os.cpu_count() or 4)


def cargar(nombre):
    from qwen_tts import Qwen3TTSModel
    return Qwen3TTSModel.from_pretrained(os.path.join(BASE, nombre), device_map="cpu", dtype=torch.float32)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("modo", choices=["disenar", "clonar"])
    ap.add_argument("--texto", required=True)
    ap.add_argument("--salida", required=True)
    ap.add_argument("--desc")
    ap.add_argument("--ref")
    ap.add_argument("--ref-texto")
    ap.add_argument("--idioma", default="Spanish")
    a = ap.parse_args()
    t0 = time.time()
    if a.modo == "disenar":
        m = cargar("Qwen3-TTS-12Hz-1.7B-VoiceDesign")
        wavs, sr = m.generate_voice_design(text=a.texto, language=a.idioma, instruct=a.desc)
    else:
        m = cargar("Qwen3-TTS-12Hz-0.6B-Base")
        wavs, sr = m.generate_voice_clone(text=a.texto, language=a.idioma, ref_audio=a.ref, ref_text=a.ref_texto)
    sf.write(a.salida, wavs[0], sr)
    print(f"✓ {a.salida} ({len(wavs[0])/sr:.1f} s de audio en {time.time()-t0:.0f} s)")


if __name__ == "__main__":
    main()
