#!/usr/bin/env python3
"""Miniatura de un Short (orden del propietario, 20/11/2026: «todos los Shorts tengan miniatura»).

Elige el fotograma más llamativo del vídeo, pone encima el gancho en letras grandes (2–6 palabras,
con la palabra clave resaltada en el color de acento del canal) y la firma del canal.
Salida: miniatura.jpg (1080×1920, para Shorts) en la carpeta del Short.

Uso: python3 pipeline/miniatura.py <carpeta_del_short> [--texto "GANCHO con *PALABRA* clave"]
     [--acento "#FFD23F"] [--handle "@datoscuriososs.1"] [--fonts <carpeta de fuentes woff2>]
El texto sale de: --texto > guion.json["miniatura"] > título (sin emojis ni hashtags).
El fondo: guion.json["miniatura_segundo"] si existe; si no, el fotograma más llamativo del gancho (0,6–2,6 s).
"""
import argparse, glob, json, os, re, subprocess, sys, tempfile
import numpy as np
from PIL import Image

AQUI = os.path.dirname(os.path.abspath(__file__))
FONTS_DEF = os.path.join(AQUI, "..", "video", "public", "fonts")


def texto_desde_titulo(t):
    t = re.sub(r"#\S+", "", t)
    t = re.sub(r"[^\w\sáéíóúüñÁÉÍÓÚÜÑ¿?¡!,.%-]", "", t).strip()
    palabras = t.split()
    return " ".join(palabras[:7])


def colorido(img):
    a = np.asarray(img.convert("RGB").resize((270, 480))).astype(float)
    rg, yb = a[..., 0] - a[..., 1], 0.5 * (a[..., 0] + a[..., 1]) - a[..., 2]
    col = np.sqrt(rg.std() ** 2 + yb.std() ** 2) + 0.3 * np.sqrt(rg.mean() ** 2 + yb.mean() ** 2)
    contraste = a.mean(axis=2).std()
    return col + 0.5 * contraste


def mejor_fotograma(mp4, tmp, segundo=None):
    # Por defecto, el GANCHO (0,6–2,6 s): es donde siempre aparece el protagonista del Short.
    # Si el guion indica "miniatura_segundo", se usa ese momento exacto.
    tiempos = [segundo] if segundo is not None else [0.6, 1.0, 1.4, 1.8, 2.2, 2.6]
    mejor, puntos = None, -1
    for i, t in enumerate(tiempos):
        out = os.path.join(tmp, f"f{i}.jpg")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.2f}", "-i", mp4, "-frames:v", "1", "-q:v", "2", out], check=True)
        p = colorido(Image.open(out))
        if p > puntos:
            mejor, puntos = out, p
    return mejor


def marcar(texto):
    # *palabra* -> resaltada; si no hay marca, se resalta la palabra más larga
    if "*" not in texto:
        pal = max(texto.split(), key=len)
        texto = texto.replace(pal, f"*{pal}*", 1)
    return re.sub(r"\*(.+?)\*", r"<b>\1</b>", texto)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("carpeta"); ap.add_argument("--texto"); ap.add_argument("--titulo"); ap.add_argument("--segundo", type=float); ap.add_argument("--acento", default="#FFD23F")
    ap.add_argument("--handle", default="@datoscuriososs.1"); ap.add_argument("--fonts", default=FONTS_DEF)
    a = ap.parse_args()
    d = os.path.abspath(a.carpeta)
    mp4 = sorted(glob.glob(os.path.join(d, "*.mp4")))[0]
    texto, segundo = a.texto, a.segundo
    if not texto and a.titulo:
        texto = texto_desde_titulo(a.titulo)
    if os.path.exists(os.path.join(d, "guion.json")):
        g = json.load(open(os.path.join(d, "guion.json")))
        texto = texto or g.get("miniatura")
        segundo = segundo if segundo is not None else g.get("miniatura_segundo")
    if not texto:
        meta = json.load(open(os.path.join(d, "metadata.json")))
        texto = texto_desde_titulo(meta["titulo"])
    n = len(re.sub(r"\*", "", texto))
    size = 150 if n <= 18 else 128 if n <= 30 else 108 if n <= 44 else 92
    with tempfile.TemporaryDirectory() as tmp:
        fondo = mejor_fotograma(mp4, tmp, segundo)
        cfg = {"fondo": fondo, "texto": marcar(texto), "acento": a.acento, "handle": a.handle, "size": size,
               "fonts": os.path.abspath(a.fonts), "salida": os.path.join(d, "miniatura.jpg")}
        cj = os.path.join(tmp, "c.json"); json.dump(cfg, open(cj, "w"), ensure_ascii=False)
        subprocess.run(["node", os.path.join(AQUI, "miniatura", "render.cjs"), cj], check=True)
    print("✓", os.path.join(d, "miniatura.jpg"))


if __name__ == "__main__":
    main()
