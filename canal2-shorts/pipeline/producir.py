"""Produce un Short del canal 2 («Sala de Espera»).

Uso: python3 pipeline/producir.py PRODUCCION/<carpeta> [--render]

VOZ: se usa EXACTAMENTE la del primer canal. No hay configuración de voz propia: se importa la función
`tts_oficial` y la configuración `voz_estandar` de /home/user/curiosidades-canal (única fuente de verdad).
Si el voice_id, el modelo o los ajustes no coinciden con los del primer canal, se para todo.
"""
from __future__ import annotations

import json
import shutil
import subprocess
import sys
from pathlib import Path

C2 = Path(__file__).resolve().parent.parent
C1 = Path("/home/user/curiosidades-canal")
sys.path.insert(0, str(C1 / "pipeline"))
import make_short as ms  # noqa: E402  (voz oficial, Whisper y alineación del primer canal)

VOZ_C1 = json.loads((C1 / "config/publicacion.json").read_text())["voz_estandar"]
SFX = C2 / "assets/sfx"
COLA_S = 1.6


def comprobar_voz(info: dict) -> None:
    esperado = {"voice_id": VOZ_C1["voice_id"], "modelo": VOZ_C1["modelo"], "idioma": VOZ_C1.get("idioma", "es"), "ajustes": VOZ_C1["ajustes"]}
    for k, v in esperado.items():
        if info.get(k) != v:
            raise SystemExit(f"✗ VOZ DISTINTA a la del primer canal en «{k}»: {info.get(k)!r} ≠ {v!r}. No se produce.")


def run(c, **k):
    return subprocess.run(c, check=True, capture_output=True, text=True, **k)


def main(carpeta: Path, render: bool):
    g = json.loads((carpeta / "guion.json").read_text())
    work = carpeta / "work"
    work.mkdir(exist_ok=True)
    texto = " ".join(e["voz"].strip() for e in g["escenas"])
    palabras = ms.sin_etiquetas(texto).split()

    voz = work / "voz-v4.wav"
    info_p = work / "voz_info.json"
    if not voz.exists():
        _, why = ms.choose_provider({"escenas": [{"voz": texto}]})
        print("  · voz:", why)
        info = ms.tts_oficial(texto, voz)
        info_p.write_text(json.dumps(info, ensure_ascii=False, indent=1))
    info = json.loads(info_p.read_text())
    comprobar_voz(info)
    print(f"  · voz verificada: {info['nombre']} · {info['voice_id']} · {info['modelo']} · {info['ajustes']}")

    heard = ms.transcribe(voz, work)
    caps, ok = ms.align(palabras, heard)
    print(f"  · alineación: {ok:.0%}")
    nw = [ms.norm(w) for w in palabras]

    def busca(p: str) -> int:
        for i, w in enumerate(nw):
            if w == ms.norm(p):
                return i
        raise SystemExit(f"no encuentro «{p}»")

    escenas, k = [], 0
    for e in g["escenas"]:
        escenas.append({"clave": e["clave"], "startMs": 0 if k == 0 else max(0, caps[k]["startMs"] - 150)})
        k += len(ms.sin_etiquetas(e["voz"]).split())
    # marcas: la palabra se busca a partir del inicio de su escena si se repite (p. ej. «playa»)
    marcas = {}
    for nombre, w in g["marcas"].items():
        idxs = [i for i, x in enumerate(nw) if x == ms.norm(w)]
        if not idxs:
            raise SystemExit(f"no encuentro la marca «{w}»")
        marcas[nombre] = caps[idxs[-1] if nombre.endswith("2") else idxs[0]]["startMs"]
    total = ms.duration(voz) + COLA_S

    # efectos (banco Earshot, sin música): transición suave en cada cambio de escena + los del guion
    plan = [("transicion", e["startMs"] / 1000, 0.35) for e in escenas[1:]]
    plan += [(n, marcas[m] / 1000, v) for n, m, v in g.get("sonidos", [])]
    entradas, filtros, etq = ["-i", str(voz)], ["[0:a]aresample=48000,aformat=channel_layouts=stereo,asplit=2[v][vk]"], []
    for i, (n, t, vol) in enumerate(plan):
        entradas += ["-i", str(SFX / f"{n}.wav")]
        ms_ = int(t * 1000)
        filtros.append(f"[{i + 1}:a]aformat=channel_layouts=stereo,volume={vol},adelay={ms_}|{ms_}[s{i}]")
        etq.append(f"[s{i}]")
    filtros.append(f"{''.join(etq)}amix=inputs={len(etq)}:normalize=0[fx]")
    filtros.append("[fx][vk]sidechaincompress=threshold=0.04:ratio=6:attack=5:release=250[fxd]")
    filtros.append(f"[v][fxd]amix=inputs=2:normalize=0,apad,atrim=0:{total:.3f},loudnorm=I=-14:TP=-1.5:LRA=11[out]")
    mezcla = work / "mezcla.wav"
    run(["ffmpeg", "-v", "error", "-y", *entradas, "-filter_complex", ";".join(filtros), "-map", "[out]", "-ar", "48000", str(mezcla)])
    shutil.copy(mezcla, C2 / "video/public/shorts" / f"{g['id']}.wav")
    props = {"id": g["id"], "durationMs": int(total * 1000), "audio": f"shorts/{g['id']}.wav", "escenas": escenas, "marcas": marcas, "captions": caps}
    (carpeta / "props.json").write_text(json.dumps(props, ensure_ascii=False, indent=1))
    print(json.dumps({"escenas": escenas, "duracion_s": round(total, 1)}, ensure_ascii=False))
    if not render:
        return
    final = carpeta / f"{g['id']}.mp4"
    run(["npx", "remotion", "render", "src/index.ts", "Sala", str(final), f"--props={carpeta / 'props.json'}", "--codec=h264", "--crf=18",
         "--audio-codec=aac", "--audio-bitrate=192k", "--concurrency=4"], cwd=C2 / "video")
    print("  ✓", final)


if __name__ == "__main__":
    main(Path(sys.argv[1]).resolve(), "--render" in sys.argv)
