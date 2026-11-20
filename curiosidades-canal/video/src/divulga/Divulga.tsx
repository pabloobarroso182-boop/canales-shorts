// Estilo «divulga»: animación de divulgación a pantalla completa (inspirado en técnicas generales
// de los Shorts de referencia del propietario: fondos oscuros con luz, partículas, transiciones
// continuas con zoom, etiquetas con cifras y subtítulos arriba). Dibujado con código propio.
import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { captionSchema, BRAND, HANDLE, firmaStyle } from "../short/types";
import { bodyFont, titleFont } from "../short/fonts";
import { Anillos, Atomo, Bokeh, C, EP, Etiqueta, Platano, Red, red } from "./comunes";
import { ESCENAS } from "./registro";

export const divulgaSchema = z.object({
  id: z.string(),
  durationMs: z.number(),
  audio: z.string(),
  // Inicio (ms) de cada escena, en orden: gancho, tranquilo, potasio, k40, desintegra, unidad, cuerpo, cta
  escenas: z.array(z.object({ clave: z.string(), startMs: z.number() })),
  // Momentos (ms) en que aparecen las etiquetas
  marcas: z.record(z.string(), z.number()),
  captions: z.array(captionSchema),
});
export type DivulgaProps = z.infer<typeof divulgaSchema>;

const XF = 12; // fotogramas de fundido entre escenas

export const Divulga: React.FC<DivulgaProps> = ({ audio, escenas, marcas, captions }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const f = (ms: number) => Math.round((ms / 1000) * fps);
  const mk = (k: string) => f(marcas[k] ?? 0);

  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, ${C.fondo1}, ${C.fondo2} 75%)` }}>
      <Bokeh />
      {escenas.map((e, i) => {
        const from = f(e.startMs);
        const to = i + 1 < escenas.length ? f(escenas[i + 1].startMs) : durationInFrames;
        if (frame < from - XF || frame > to + XF) return null;
        const local = frame - from;
        const dur = to - from;
        const entra = interpolate(frame, [from - XF, from + XF / 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const sale = i + 1 < escenas.length ? interpolate(frame, [to - XF / 2, to + XF], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
        // Zoom continuo: cada escena entra un poco pequeña y sale «atravesando» la cámara.
        const zIn = interpolate(entra, [0, 1], [0.92, 1]);
        const zOut = interpolate(sale, [0, 1], [1.35, 1]);
        return (
          <AbsoluteFill key={e.clave} style={{ opacity: Math.min(entra, sale), transform: `scale(${zIn * zOut})` }}>
            <Escena clave={e.clave} t={local} dur={dur} mk={(k) => mk(k) - from} />
          </AbsoluteFill>
        );
      })}
      <Subtitulos captions={captions} />
      <Marca />
      <Audio src={staticFile(audio)} />
    </AbsoluteFill>
  );
};


const Escena: React.FC<EP> = (p) => {
  const Extra = ESCENAS[p.clave];
  if (Extra) return <Extra {...p} />;
  switch (p.clave) {
    case "gancho":
      return <EscGancho {...p} />;
    case "tranquilo":
      return <EscTranquilo {...p} />;
    case "potasio":
      return <EscPotasio {...p} />;
    case "k40":
      return <EscK40 {...p} />;
    case "desintegra":
      return <EscDesintegra {...p} />;
    case "unidad":
      return <EscUnidad {...p} />;
    case "cuerpo":
      return <EscCuerpo {...p} />;
    default:
      return <EscCta {...p} />;
  }
};

// ---------------------------------------------------------------- escenas
const EscGancho: React.FC<EP> = ({ t, dur, mk }) => {
  const { fps } = useVideoConfig();
  const s = spring({ frame: t, fps, config: { damping: 12 } });
  const push = interpolate(t, [0, dur], [1, 1.12]);
  const latido = 1 + Math.max(0, Math.sin(t / 3.2)) * 0.025;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Anillos t={t} color={C.verde} fuerza={interpolate(t, [mk("radiactivo") - 4, mk("radiactivo") + 6], [0.2, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      <div style={{ transform: `scale(${s * push * latido}) rotate(${Math.sin(t / 20) * 4 - 8}deg)` }}>
        <Platano size={760} brillo={0.9} />
      </div>
      <Etiqueta t={t} desde={mk("radiactivo")} texto="RADIACTIVO" icono="☢" color={C.verde} top={1240} grande />
    </AbsoluteFill>
  );
};

const EscTranquilo: React.FC<EP> = ({ t, mk }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
    <div style={{ transform: `rotate(${Math.sin(t / 25) * 6 - 6}deg) translateY(${Math.sin(t / 15) * 10}px)` }}>
      <Platano size={700} brillo={0.5} />
    </div>
    <Etiqueta t={t} desde={mk("peligroso")} texto="No es peligroso" icono="✓" color={C.verde} top={1240} />
    <Etiqueta t={t} desde={mk("truco")} texto="…pero tiene truco" color={C.amarillo} top={1360} />
  </AbsoluteFill>
);

const EscPotasio: React.FC<EP> = ({ t, mk }) => {
  // Zoom «a través» de la piel del plátano hasta los átomos.
  const z = interpolate(t, [0, 22], [1, 9], { extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  const platOp = interpolate(t, [10, 24], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const redOp = interpolate(t, [14, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const redZ = interpolate(t, [14, 40], [1.4, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: redOp, transform: `scale(${redZ})` }}>
        <Red t={t} />
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: platOp, transform: `scale(${z})` }}>
        <Platano size={700} />
      </AbsoluteFill>
      <Etiqueta t={t} desde={mk("potasio")} texto="Potasio (K)" color={C.kLuz} top={1500} grande />
    </AbsoluteFill>
  );
};

const EscK40: React.FC<EP> = ({ t, mk }) => {
  const d = mk("radiactiva");
  const elegido = 27; // átomo del centro
  const g = interpolate(t, [d - 6, d + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const z = interpolate(t, [d, d + 30], [1, 1.25], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const p = red[elegido];
  return (
    <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${p.x}px ${p.y}px` }}>
      <AbsoluteFill style={{ opacity: 1 - g * 0.55 }}>
        <Red t={t} />
      </AbsoluteFill>
      <Atomo x={p.x} y={p.y} r={52 + g * 26} color={g > 0.05 ? C.naranja : C.k} luz={g > 0.05 ? "#FFE3B0" : C.kLuz} glow={g * (1 + Math.sin(t / 3) * 0.2)} />
      <Etiqueta t={t} desde={mk("diminuta")} texto="≈ 0,012 % del potasio" color={C.amarillo} top={430} />
      <Etiqueta t={t} desde={mk("cuarenta")} texto="Potasio-40" icono="☢" color={C.naranja} top={1480} grande />
    </AbsoluteFill>
  );
};

const EscDesintegra: React.FC<EP> = ({ t, dur, mk }) => {
  const { fps } = useVideoConfig();
  // Cada ~2 fotogramas «estalla» un átomo distinto y suelta un destello.
  const destellos = new Array(8).fill(0).map((_, k) => {
    const periodo = 16;
    const fase = (t + k * 2) % periodo;
    const ciclo = Math.floor((t + k * 2) / periodo);
    const idx = Math.floor(random(`d${k}-${ciclo}`) * red.length);
    return { idx, fase: fase / periodo, ang: random(`a${k}-${ciclo}`) * Math.PI * 2 };
  });
  const brilla = (i: number) => Math.max(0, ...destellos.filter((d) => d.idx === i).map((d) => 1 - d.fase));
  const segundos = Math.max(0, (t - mk("quince")) / fps);
  const cuenta = Math.min(15, Math.floor(interpolate(segundos, [0, 0.8], [0, 15], { extrapolateRight: "clamp" })));
  return (
    <AbsoluteFill>
      <Red t={t} brilla={brilla} />
      {destellos.map((d, k) => {
        const p = red[d.idx];
        const dist = d.fase * 260;
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: p.x + Math.cos(d.ang) * dist - 8,
              top: p.y + Math.sin(d.ang) * dist - 8,
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: "#FFF2C0",
              boxShadow: `0 0 24px 10px ${C.naranja}`,
              opacity: 1 - d.fase,
            }}
          />
        );
      })}
      {t >= mk("quince") ? (
        <Etiqueta t={t} desde={mk("quince")} texto={`≈ ${cuenta} átomos / segundo`} color={C.naranja} top={1480} grande />
      ) : null}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle, transparent 55%, rgba(5,8,23,.8))`, opacity: interpolate(t, [0, dur], [0.4, 0.8]) }} />
    </AbsoluteFill>
  );
};

const EscUnidad: React.FC<EP> = ({ t, mk }) => {
  const { fps } = useVideoConfig();
  const s = spring({ frame: t, fps, config: { damping: 14 } });
  const aguja = interpolate(t, [mk("dosis") - 4, mk("dosis") + 18], [-120, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.6)) });
  const cx = 540, cy = 860, R = 360;
  return (
    <AbsoluteFill style={{ transform: `scale(${0.85 + 0.15 * s})` }}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <defs>
          <radialGradient id="dial" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#16204d" />
            <stop offset="1" stopColor="#0a0f2b" />
          </radialGradient>
        </defs>
        <circle cx={cx} cy={cy} r={R + 24} fill="none" stroke={C.cian} strokeWidth={8} opacity={0.9} style={{ filter: `drop-shadow(0 0 18px ${C.cian})` }} />
        <circle cx={cx} cy={cy} r={R} fill="url(#dial)" />
        {new Array(13).fill(0).map((_, k) => {
          const a = ((-120 + k * 20) * Math.PI) / 180;
          const r1 = R - 40, r2 = R - (k % 3 === 0 ? 100 : 70);
          return <line key={k} x1={cx + Math.sin(a) * r1} y1={cy - Math.cos(a) * r1} x2={cx + Math.sin(a) * r2} y2={cy - Math.cos(a) * r2} stroke="#fff" strokeWidth={k % 3 === 0 ? 10 : 6} strokeLinecap="round" />;
        })}
        <g transform={`rotate(${aguja} ${cx} ${cy})`}>
          <line x1={cx} y1={cy} x2={cx} y2={cy - R + 90} stroke={C.naranja} strokeWidth={14} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 12px ${C.naranja})` }} />
        </g>
        <circle cx={cx} cy={cy} r={34} fill="#fff" />
      </svg>
      <div style={{ position: "absolute", left: cx - 150, top: cy - R + 110 }}>
        <Platano size={300} brillo={0.4} />
      </div>
      <div style={{ position: "absolute", top: cy + 140, left: 0, right: 0, textAlign: "center", fontFamily: titleFont, fontSize: 64, color: "#fff" }}>1 🍌</div>
      <Etiqueta t={t} desde={mk("broma")} texto="Unidad de broma" icono="😄" color={C.cian} top={400} />
      <Etiqueta t={t} desde={mk("dosis")} texto="Dosis equivalente a un plátano" color={C.amarillo} top={1400} />
    </AbsoluteFill>
  );
};

const EscCuerpo: React.FC<EP> = ({ t, mk }) => {
  // Silueta translúcida: el potasio entra y sale; el nivel se queda igual.
  const nivel = 0.62 + Math.sin(t / 9) * 0.015;
  const particulas = new Array(14).fill(0).map((_, k) => {
    const p = ((t * 1.4 + k * 18) % 250) / 250;
    const entra = k % 2 === 0;
    return { k, p, entra };
  });
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="cuerpo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgba(43,217,254,.35)" />
            <stop offset="1" stopColor="rgba(43,217,254,.08)" />
          </linearGradient>
        </defs>
        <g transform="translate(540 330)" style={{ filter: `drop-shadow(0 0 22px ${C.cian})` }}>
          <circle cx={0} cy={110} r={105} fill="url(#cuerpo)" stroke={C.cian} strokeWidth={5} />
          <path d="M-90 230 Q 0 250 90 230 L 210 330 Q 230 360 210 380 L 150 560 L 130 560 L 140 400 L 120 400 L 110 900 L 20 900 L 0 620 L -20 900 L -110 900 L -120 400 L -140 400 L -130 560 L -150 560 L -210 380 Q -230 360 -210 330 Z" fill="url(#cuerpo)" stroke={C.cian} strokeWidth={5} />
        </g>
      </svg>
      {particulas.map(({ k, p, entra }) => {
        const x = entra ? interpolate(p, [0, 1], [60, 470]) : interpolate(p, [0, 1], [610, 1020]);
        const y = 980 + Math.sin(p * Math.PI * 2 + k) * 40 + (k % 3) * 30;
        return <Atomo key={k} x={x} y={y} r={20} color={C.k} luz={C.kLuz} />;
      })}
      <div style={{ position: "absolute", left: 80, top: 860, fontFamily: titleFont, fontSize: 70, color: C.verde }}>→</div>
      <div style={{ position: "absolute", right: 80, top: 860, fontFamily: titleFont, fontSize: 70, color: C.verde }}>→</div>
      {/* medidor de nivel estable */}
      <div style={{ position: "absolute", left: 470, top: 1380, width: 140, height: 0 }} />
      <div style={{ position: "absolute", left: 390, right: 390, top: 1340, height: 36, borderRadius: 18, background: "rgba(255,255,255,.12)", border: "3px solid rgba(255,255,255,.4)" }}>
        <div style={{ width: `${nivel * 100}%`, height: "100%", borderRadius: 18, background: `linear-gradient(90deg, ${C.k}, ${C.kLuz})` }} />
      </div>
      <Etiqueta t={t} desde={mk("regula")} texto="Nivel de potasio: estable" icono="⚖" color={C.verde} top={1420} />
      <Etiqueta t={t} desde={mk("eres")} texto="No te hace más radiactivo" color={C.amarillo} top={1540} />
    </AbsoluteFill>
  );
};

const EscCta: React.FC<EP> = ({ t, dur, mk }) => {
  const { fps } = useVideoConfig();
  const fin = mk("comentarios");
  const logo = spring({ frame: t - fin, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ transform: `rotate(${Math.sin(t / 10) * 10}deg) scale(${1 - logo * 0.35}) translateY(${-logo * 380}px)` }}>
        <Platano size={640} brillo={0.7} />
      </div>
      <div style={{ position: "absolute", top: 1180, fontFamily: titleFont, fontSize: 200, color: C.amarillo, textShadow: `0 0 40px ${C.amarillo}`, transform: `scale(${1 + Math.sin(t / 5) * 0.05})`, opacity: 1 - logo }}>?</div>
      {t >= fin ? (
        <div style={{ position: "absolute", top: 860, display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${logo})` }}>
          <Img src={staticFile("brand/perfil-800x800.png")} style={{ width: 340, height: 340, borderRadius: "50%", boxShadow: `0 0 80px ${BRAND.violeta}` }} />
          <div style={{ marginTop: 26, fontFamily: titleFont, fontSize: 80, color: "#fff" }}>¡SÍGUENOS!</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- texto y marca
// Subtítulos arriba: línea corta que se va escribiendo; la palabra que suena va en un recuadro.
const Subtitulos: React.FC<{ captions: DivulgaProps["captions"] }> = ({ captions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = (frame / fps) * 1000;
  const lineas = React.useMemo(() => {
    const out: DivulgaProps["captions"][] = [];
    let cur: DivulgaProps["captions"] = [];
    for (const c of captions) {
      cur.push(c);
      if (/[.,;:!?…]$/.test(c.text.trim()) || cur.length >= 4) {
        out.push(cur);
        cur = [];
      }
    }
    if (cur.length) out.push(cur);
    return out;
  }, [captions]);
  const idx = lineas.findIndex((l, i) => ms >= l[0].startMs && (i + 1 >= lineas.length || ms < lineas[i + 1][0].startMs));
  if (idx < 0) return null;
  const linea = lineas[idx];
  return (
    <div style={{ position: "absolute", top: 230, left: 50, right: 50, display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: 18, rowGap: 6 }}>
      {linea.map((c, j) => {
        const visible = ms >= c.startMs - 40;
        const activa = ms >= c.startMs && ms < (linea[j + 1]?.startMs ?? c.endMs + 400);
        const num = /\d/.test(c.text);
        return (
          <span
            key={j}
            style={{
              fontFamily: bodyFont,
              fontWeight: 900,
              fontSize: 70,
              lineHeight: 1.2,
              color: activa ? C.fondo2 : num ? C.amarillo : "#fff",
              background: activa ? C.amarillo : "transparent",
              borderRadius: 14,
              padding: "0 14px",
              opacity: visible ? 1 : 0.28,
              textShadow: activa ? "none" : "0 4px 18px rgba(0,0,0,.8)",
            }}
          >
            {c.text.trim()}
          </span>
        );
      })}
    </div>
  );
};

const Marca: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 0, left: 0, height: 10, width: `${(frame / (durationInFrames - 1)) * 100}%`, background: `linear-gradient(90deg, ${C.amarillo}, ${BRAND.coral})` }} />
      {/* Sin marca de agua grande (decisión del propietario, 19/11/2026): solo una firma discreta con el identificador. */}
      <div style={firmaStyle}>{HANDLE}</div>
    </AbsoluteFill>
  );
};
