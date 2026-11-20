"""Produce y revisa los Shorts de un día a partir de los guiones ya escritos.

Estructura esperada (la crea el agente en la fase de guiones):
  PRODUCCION/AAAA-MM-DD/
    investigacion/tendencias.md, referencias.json
    01-<tema>/guion.json … 04-<tema>/guion.json (4 Shorts al día desde el 19/11 noche; antes 6)

Para cada guion: originalidad -> make_short -> qa (1 reintento si falla el render).
Al final escribe PRODUCCION/AAAA-MM-DD/INFORME.md y actualiza data/historial.json
con los Shorts aprobados.

Uso: python3 pipeline/nocturno.py 2026-11-19
"""
from __future__ import annotations

N_SHORTS = 4  # propietario, 19/11 (noche): 4 Shorts diarios (antes 6; al principio 3)
import json
import sys
import traceback
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import make_short  # noqa: E402
import originality  # noqa: E402
import qa  # noqa: E402
import divulga_prep  # noqa: E402

ROOT = make_short.ROOT


def main(day: str) -> int:
    base = ROOT / "PRODUCCION" / day
    folders = sorted(p.parent for p in base.glob("*/guion.json"))
    if not folders:
        print(f"No hay guiones en {base}")
        return 2
    results = []
    for f in folders:
        spec = json.loads((f / "guion.json").read_text())
        res = {"carpeta": f.name, "id": spec["id"], "titulo": spec["titulo"]}
        orig = originality.check(f / "guion.json")
        res["originalidad"] = orig
        if not orig["original"]:
            res.update(estado="rechazado por originalidad", aprobado=False)
            results.append(res)
            continue
        for intento in (1, 2):
            try:
                if spec.get("estilo") == "divulga":  # animación con escenas propias (video/src/divulga/)
                    divulga_prep.main(f, render=True)
                    meta = json.loads((f / "metadata.json").read_text())
                else:
                    meta = make_short.produce(f / "guion.json", f)
                q = qa.check(f)
                res.update(estado="aprobado" if q["aprobado"] else "no aprobado en control de calidad",
                           aprobado=q["aprobado"], qa=q, voz=meta["voz"], voz_motivo=meta["voz_motivo"], duracion_s=meta["duracion_s"])
                break
            except Exception as e:
                res.update(estado=f"error: {e.__class__.__name__}: {e}", aprobado=False, traza=traceback.format_exc()[-1500:])
                print(f"  ✗ intento {intento} falló: {e}")
        results.append(res)

    ok = [r for r in results if r.get("aprobado")]
    hist_file = ROOT / "data" / "historial.json"
    hist = json.loads(hist_file.read_text()) if hist_file.exists() else []
    known = {h["id"] for h in hist}
    for r in ok:
        spec = json.loads((base / r["carpeta"] / "guion.json").read_text())
        if spec["id"] not in known:
            hist.append({"id": spec["id"], "fecha": day, "tema_clave": spec.get("tema_clave", ""), "categoria": spec.get("tema", "")})
    hist_file.parent.mkdir(exist_ok=True)
    hist_file.write_text(json.dumps(hist, ensure_ascii=False, indent=2))

    lines = [f"# Producción para el {day}", "",
             f"_Generado: {datetime.now().strftime('%d/%m/%Y %H:%M')} · {len(ok)} de {len(results)} Shorts aprobados_", ""]
    for r in results:
        lines.append(f"## {'✅' if r.get('aprobado') else '❌'} {r['titulo']}")
        lines.append(f"- Carpeta: `{r['carpeta']}/` · estado: **{r['estado']}**")
        if r.get("duracion_s"):
            lines.append(f"- Duración: {r['duracion_s']} s · voz: {r.get('voz')} ({r.get('voz_motivo')})")
        o = r["originalidad"]
        lines.append(f"- Originalidad: máx. {o['max_5gramas_compartidos']:.0%} de frases de 5 palabras compartidas "
                     f"(con «{o['texto_mas_parecido'] or '—'}»), {o['textos_comparados']} textos comparados")
        for c in (r.get("qa") or {}).get("pruebas", []):
            if not c["ok"]:
                lines.append(f"- ✗ {c['prueba']}: {c['detalle']}")
        lines.append("")
    if len(ok) < N_SHORTS:
        lines.append(f"**Faltan {N_SHORTS - len(ok)} Shorts aprobados.** Revisa los motivos de arriba.")
    (base / "INFORME.md").write_text("\n".join(lines) + "\n")
    (base / "resultado.json").write_text(json.dumps(results, ensure_ascii=False, indent=2))
    print("\n".join(lines))
    return 0 if len(ok) == len(results) == N_SHORTS else 1


if __name__ == "__main__":
    sys.exit(main(sys.argv[1]))
