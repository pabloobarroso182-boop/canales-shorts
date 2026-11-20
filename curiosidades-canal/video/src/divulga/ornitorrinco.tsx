// Escenas del Short «El ornitorrinco brilla en la oscuridad» (estilo divulga, dibujo propio en SVG).
import React from "react";
import { AbsoluteFill, interpolate, random, spring, useVideoConfig } from "remotion";
import { C, EP, Etiqueta } from "./comunes";
import { Centro, Cierre, clamp, Entra, Flash, Luz, Preguntas, Rayos } from "./piezas";
import { titleFont } from "../short/fonts";

const UV = "#9B5CFF";
const BRILLO = "#4DFFC3";

// Ornitorrinco de perfil. uv: 0 = marrón normal, 1 = pelo fluorescente verde-azulado.
const Ornitorrinco: React.FC<{ size?: number; uv?: number; t?: number; espolon?: number }> = ({ size = 760, uv = 0, t = 0, espolon = 0 }) => {
  const pelo = uv > 0 ? `url(#pelo-uv)` : "url(#pelo)";
  const nada = Math.sin(t / 7) * 6;
  return (
    <svg width={size} height={size * 0.55} viewBox="0 0 440 242" style={{ overflow: "visible", filter: `drop-shadow(0 0 ${10 + uv * 50}px ${uv > 0.05 ? BRILLO : "rgba(0,0,0,.6)"})` }}>
      <defs>
        <linearGradient id="pelo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a87449" />
          <stop offset="0.6" stopColor="#7a4e2c" />
          <stop offset="1" stopColor="#4a2e18" />
        </linearGradient>
        <linearGradient id="pelo-uv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={interpolate(uv, [0, 1], [0, 1]) > 0.5 ? "#b8fff0" : "#a87449"} />
          <stop offset="0.5" stopColor={uv > 0.5 ? BRILLO : "#7a8a5c"} />
          <stop offset="1" stopColor={uv > 0.5 ? "#1fb8c9" : "#4a3e28"} />
        </linearGradient>
        <linearGradient id="pico" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5d6670" />
          <stop offset="1" stopColor="#2c3238" />
        </linearGradient>
      </defs>
      <g transform={`translate(0 ${nada})`}>
        {/* cola de castor */}
        <path d="M60 120 C 0 100, -10 160, 30 176 C 60 186, 90 160, 96 140 Z" fill={pelo} />
        {/* cuerpo */}
        <ellipse cx="200" cy="140" rx="128" ry="62" fill={pelo} />
        {new Array(14).fill(0).map((_, i) => (
          <path key={i} d={`M${110 + i * 14} ${100 + (i % 3) * 6} q 6 10 0 20`} stroke={uv > 0.5 ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.18)"} strokeWidth="3" fill="none" />
        ))}
        {/* cabeza */}
        <ellipse cx="318" cy="122" rx="52" ry="42" fill={pelo} />
        <circle cx="330" cy="108" r="7" fill="#0b0b0b" />
        <circle cx="332" cy="106" r="2.4" fill="#fff" />
        {/* pico de pato */}
        <path d="M352 110 C 400 96, 446 104, 440 128 C 436 146, 396 150, 352 138 Z" fill="url(#pico)" />
        <path d="M362 124 C 396 128, 420 128, 438 124" stroke="#1d2125" strokeWidth="3" fill="none" />
        <ellipse cx="394" cy="110" rx="3" ry="2" fill="#1d2125" />
        {/* patas palmeadas */}
        <path d="M150 190 l -18 30 l 12 -4 l 6 8 l 8 -8 l 12 4 Z" fill="#3a3f45" />
        <path d="M268 188 l -14 32 l 12 -4 l 8 8 l 6 -9 l 12 3 Z" fill="#3a3f45" />
        {/* espolón con veneno (macho), pata trasera */}
        {espolon > 0 ? (
          <g opacity={espolon}>
            <path d="M140 196 L 122 214 L 146 206 Z" fill="#e8e0c8" stroke="#FF4D5E" strokeWidth="2" />
            {[0, 1, 2].map((i) => {
              const p = ((t * 0.05 + i / 3) % 1);
              return <ellipse key={i} cx={124 - p * 6} cy={216 + p * 40} rx={4} ry={6} fill="#9BFF6B" opacity={1 - p} />;
            })}
          </g>
        ) : null}
      </g>
    </svg>
  );
};

const Huevo: React.FC<{ size?: number }> = ({ size = 200 }) => (
  <svg width={size} height={size * 1.25} viewBox="0 0 80 100" style={{ filter: "drop-shadow(0 0 20px rgba(255,240,200,.6))" }}>
    <defs>
      <radialGradient id="hv" cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#fffdf4" />
        <stop offset="1" stopColor="#d8cdb0" />
      </radialGradient>
    </defs>
    <path d="M40 4 C 70 4, 78 60, 74 72 C 68 92, 12 92, 6 72 C 2 60, 10 4, 40 4 Z" fill="url(#hv)" />
  </svg>
);

const Lampara: React.FC<{ on: number }> = ({ on }) => (
  <svg width={360} height={300} viewBox="0 0 120 100" style={{ overflow: "visible" }}>
    <rect x="20" y="10" width="80" height="34" rx="8" fill="#2a2440" stroke={UV} strokeWidth="2" />
    <rect x="28" y="38" width="64" height="8" rx="3" fill={on > 0.5 ? "#e0ccff" : "#4a4068"} style={{ filter: on > 0.5 ? `drop-shadow(0 0 12px ${UV})` : "none" }} />
    <rect x="54" y="0" width="12" height="12" fill="#1a1630" />
  </svg>
);

const Haz: React.FC<{ on: number }> = ({ on }) => (
  <AbsoluteFill style={{ opacity: on }}>
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="haz" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={UV} stopOpacity="0.6" />
          <stop offset="1" stopColor={UV} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M470 720 L 610 720 L 960 1500 L 120 1500 Z" fill="url(#haz)" />
    </svg>
  </AbsoluteFill>
);

const Fondo: React.FC<{ uv?: number }> = ({ uv = 0 }) => (
  <>
    <Luz color={uv > 0 ? UV : "#c58a4a"} fuerza={0.18 + uv * 0.25} />
  </>
);

// ---------------------------------------------------------------- escenas
const Gancho: React.FC<EP> = ({ t, dur, mk }) => {
  const latido = 0.4 + 0.6 * Math.abs(Math.sin(t / 9));
  return (
    <AbsoluteFill>
      <Rayos t={t} color={BRILLO} fuerza={0.4} />
      <Preguntas t={t} color={BRILLO} />
      <Entra t={t} dur={dur} top={760}>
        <div style={{ opacity: 0.35 + 0.5 * latido, filter: "saturate(1.4)" }}>
          <Ornitorrinco size={780} uv={1} t={t} />
        </div>
      </Entra>
      <Etiqueta t={t} desde={mk("mamifero")} texto="¿Un mamífero que brilla?" icono="✨" color={BRILLO} top={1420} />
    </AbsoluteFill>
  );
};

const Quien: React.FC<EP> = ({ t, dur, mk }) => {
  const { fps } = useVideoConfig();
  const entra = spring({ frame: t, fps, config: { damping: 14 } });
  return (
    <AbsoluteFill>
      <Fondo />
      <Centro top={760} style={{ transform: `translateX(${(1 - entra) * 900}px) scale(${interpolate(t, [0, dur], [1, 1.1])})` }}>
        <Ornitorrinco size={820} t={t} />
      </Centro>
      <Etiqueta t={t} desde={mk("ornitorrinco")} texto="ORNITORRINCO" icono="🦆" color={C.amarillo} top={1360} grande />
    </AbsoluteFill>
  );
};

const Raro: React.FC<EP> = ({ t, dur, mk }) => {
  const { fps } = useVideoConfig();
  const h = spring({ frame: t - mk("huevos") + 4, fps, config: { damping: 10 } });
  const v = interpolate(t, [mk("veneno") - 6, mk("veneno") + 6], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Fondo />
      <Entra t={t} dur={dur} top={820} zoom={[1, 1.06]}>
        <Ornitorrinco size={760} t={t} espolon={v} />
      </Entra>
      <Centro top={560} style={{ transform: `scale(${h})` }}>
        <Huevo size={170} />
      </Centro>
      <Etiqueta t={t} desde={mk("huevos")} texto="Pone huevos" icono="🥚" color="#fff" top={450} />
      <Etiqueta t={t} desde={mk("veneno")} texto="Espolón con veneno" icono="☠" color="#9BFF6B" top={1420} />
    </AbsoluteFill>
  );
};

const Falta: React.FC<EP> = ({ t, dur }) => {
  const oscuro = interpolate(t, [0, dur], [0, 0.75], clamp);
  return (
    <AbsoluteFill>
      <Fondo />
      <Centro top={800} style={{ transform: `scale(${interpolate(t, [0, dur], [1.1, 1.5])})` }}>
        <Ornitorrinco size={760} t={t} />
      </Centro>
      <AbsoluteFill style={{ background: "#050817", opacity: oscuro }} />
      <Centro top={560}>
        <div style={{ fontFamily: titleFont, fontSize: 260, color: BRILLO, opacity: interpolate(t, [4, 16], [0, 1], clamp), textShadow: `0 0 50px ${BRILLO}`, transform: `scale(${1 + Math.sin(t / 5) * 0.06})` }}>?</div>
      </Centro>
    </AbsoluteFill>
  );
};

const Museo: React.FC<EP> = ({ t, dur, mk }) => {
  const on = interpolate(t, [mk("ultravioleta") - 2, mk("ultravioleta") + 4], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, #0b0f26, #151030)" }} />
      <Haz on={on} />
      <Centro top={560}>
        <Lampara on={on} />
      </Centro>
      {/* mesa de laboratorio */}
      <div style={{ position: "absolute", left: 60, right: 60, top: 1370, height: 30, background: "#2b2f45", borderRadius: 8, boxShadow: "0 20px 40px rgba(0,0,0,.6)" }} />
      <Centro top={1030} style={{ transform: `scale(${interpolate(t, [0, dur], [0.95, 1.05])})` }}>
        <div style={{ filter: `brightness(${1 - on * 0.4})` }}>
          <Ornitorrinco size={640} />
        </div>
      </Centro>
      <Etiqueta t={t} desde={mk("2020")} texto="Año 2020 · museo" icono="🔬" color={C.cian} top={1450} />
      <Etiqueta t={t} desde={mk("ultravioleta")} texto="Luz ultravioleta" color={UV} top={1560} />
    </AbsoluteFill>
  );
};

const Cambia: React.FC<EP> = ({ t, dur, mk }) => {
  const uv = interpolate(t, [mk("marron") + 4, dur], [0, 0.45], clamp);
  return (
    <AbsoluteFill>
      <Haz on={1} />
      <Fondo uv={1} />
      <Entra t={t} dur={dur} top={820} zoom={[1, 1.15]}>
        <Ornitorrinco size={800} uv={uv} t={t} />
      </Entra>
      <Etiqueta t={t} desde={mk("marron")} texto="Pelo marrón…" color="#c58a4a" top={1400} />
    </AbsoluteFill>
  );
};

const Brilla: React.FC<EP> = ({ t, dur, mk }) => (
  <AbsoluteFill>
    <Rayos t={t * 2} color={BRILLO} />
    <Fondo uv={1} />
    {new Array(18).fill(0).map((_, i) => (
      <div key={i} style={{ position: "absolute", left: random(`ux${i}`) * 1080, top: 500 + random(`uy${i}`) * 900, width: 10, height: 10, borderRadius: 5, background: BRILLO, opacity: 0.3 + 0.5 * Math.abs(Math.sin(t / 6 + i)), boxShadow: `0 0 14px ${BRILLO}` }} />
    ))}
    <Entra t={t} dur={dur} top={760} zoom={[1.05, 1.2]}>
      <Ornitorrinco size={820} uv={1} t={t} />
    </Entra>
    <Etiqueta t={t} desde={mk("verde")} texto="¡Verde y azul!" icono="✨" color={BRILLO} top={460} grande />
    <Etiqueta t={t} desde={mk("biofluorescencia")} texto="Biofluorescencia" color="#fff" top={1360} />
    <Etiqueta t={t} desde={mk("nadie")} texto="¿Para qué? Aún es un misterio" color={C.amarillo} top={1480} />
    <Flash t={t} color={BRILLO} />
  </AbsoluteFill>
);

const Cta: React.FC<EP> = ({ t, mk }) => (
  <AbsoluteFill>
    <Rayos t={t} color={BRILLO} fuerza={0.5} />
    <Centro top={800}>
      <Ornitorrinco size={700} uv={1} t={t} />
    </Centro>
    <Centro top={450}>
      <div style={{ fontFamily: titleFont, fontSize: 200, color: C.amarillo, textShadow: `0 0 50px ${C.amarillo}`, transform: `scale(${1 + Math.sin(t / 5) * 0.06})` }}>?</div>
    </Centro>
    <Cierre t={t} desde={mk("usa") + 18} />
  </AbsoluteFill>
);

export const ESCENAS_ORNITORRINCO: Record<string, React.FC<EP>> = {
  o_gancho: Gancho, o_quien: Quien, o_raro: Raro, o_falta: Falta, o_museo: Museo, o_cambia: Cambia, o_brilla: Brilla, o_cta: Cta,
};
