"""Clona una voz con Chatterbox Multilingual (local, licencia MIT) y genera audios.

Se ejecuta con el Python del entorno aislado:
  ~/tools/chatterbox-venv/bin/python pipeline/clonar_voz.py REFERENCIA.wav SALIDA.wav "texto" [--exag 0.5] [--cfg 0.5]

- REFERENCIA: 10–20 s de la voz a clonar (una sola persona, sin música).
- La voz no se "guarda" como en ElevenLabs: el clon ES la referencia; cada generación la usa.
  La referencia aprobada se fija en config/voz_clonada.json.
"""
from __future__ import annotations

import argparse
import time

import torch
import torchaudio as ta


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("referencia")
    ap.add_argument("salida")
    ap.add_argument("texto")
    ap.add_argument("--exag", type=float, default=0.5, help="expresividad (0.25–1.0)")
    ap.add_argument("--cfg", type=float, default=0.5, help="fidelidad al ritmo de la referencia")
    ap.add_argument("--semilla", type=int, default=7)
    a = ap.parse_args()

    from chatterbox.mtl_tts import ChatterboxMultilingualTTS

    torch.manual_seed(a.semilla)
    t0 = time.time()
    modelo = ChatterboxMultilingualTTS.from_pretrained(device="cpu")
    t1 = time.time()
    wav = modelo.generate(a.texto, language_id="es", audio_prompt_path=a.referencia,
                          exaggeration=a.exag, cfg_weight=a.cfg)
    ta.save(a.salida, wav, modelo.sr)
    dur = wav.shape[-1] / modelo.sr
    print(f"✓ {a.salida}: {dur:.1f} s de audio · carga {t1 - t0:.0f} s · generación {time.time() - t1:.0f} s")


if __name__ == "__main__":
    main()
