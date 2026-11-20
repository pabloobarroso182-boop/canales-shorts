// Escenas del Short «¿Por qué tu estómago no se digiere a sí mismo?» (estilo divulga, dibujo propio en SVG).
import React from "react";
import { AbsoluteFill, interpolate, random, spring, useVideoConfig } from "remotion";
import { C, EP, Etiqueta } from "./comunes";
import { Centro, Cierre, clamp, Entra, Flash, Luz, Preguntas, Rayos } from "./piezas";
import { titleFont } from "../short/fonts";

const ROSA = "#FF6B8A";
const ACIDO = "#B6FF3B";
const MOCO = "#7FE7FF";

// Estómago con volumen; burbujas de ácido dentro.
const Estomago: React.FC<{ size?: number; t?: number; acido?: number; brillo?: number }> = ({ size = 640, t = 0, acido = 0.6, brillo = 0.4 }) => (
  <svg width={size} height={size} viewBox="0 0 300 300" style={{ overflow: "visible", filter: `drop-shadow(0 0 ${30 * brillo}px ${ROSA})` }}>
    <defs>
      <radialGradient id="est" cx="0.4" cy="0.35" r="0.75">
        <stop offset="0" stopColor="#ffc2cf" />
        <stop offset="0.55" stopColor={ROSA} />
        <stop offset="1" stopColor="#a8264a" />
      </radialGradient>
      <clipPath id="est-in">
        <path d="M120 40 C 150 40, 150 80, 170 92 C 240 110, 280 170, 250 230 C 220 290, 110 290, 80 240 C 60 205, 90 170, 104 140 C 116 112, 96 70, 120 40 Z" />
      </clipPath>
    </defs>
    {/* esófago e intestino */}
    <path d="M118 0 C 122 20, 118 30, 120 44" stroke="#e05a7a" strokeWidth="26" fill="none" strokeLinecap="round" />
    <path d="M86 250 C 60 270, 40 280, 20 300" stroke="#e05a7a" strokeWidth="24" fill="none" strokeLinecap="round" />
    <path d="M120 40 C 150 40, 150 80, 170 92 C 240 110, 280 170, 250 230 C 220 290, 110 290, 80 240 C 60 205, 90 170, 104 140 C 116 112, 96 70, 120 40 Z" fill="url(#est)" stroke="#ffd6df" strokeWidth="3" />
    <g clipPath="url(#est-in)">
      <rect x="0" y={300 - 170 * acido} width="300" height="300" fill={ACIDO} opacity="0.35" />
      {new Array(10).fill(0).map((_, i) => {
        const p = ((t * 0.02 + random(`b${i}`)) % 1);
        return <circle key={i} cx={100 + random(`bx${i}`) * 150} cy={280 - p * 160 * acido} r={4 + random(`br${i}`) * 7} fill="none" stroke={ACIDO} strokeWidth="2" opacity={1 - p} />;
      })}
    </g>
    <path d="M140 60 C 160 90, 200 100, 230 130" stroke="rgba(255,255,255,.45)" strokeWidth="8" fill="none" strokeLinecap="round" />
  </svg>
);

// Corte de la pared: fila de células, capa de moco y ácido encima.
const Pared: React.FC<{ t: number; moco?: number; dano?: number; renueva?: number }> = ({ t, moco = 0, dano = 0, renueva = 0 }) => {
  const n = 9;
  return (
    <svg width={1000} height={760} viewBox="0 0 500 380" style={{ overflow: "visible" }}>
      {/* ácido */}
      <rect x="0" y="0" width="500" height="150" fill={ACIDO} opacity="0.18" />
      {new Array(14).fill(0).map((_, i) => {
        const p = ((t * 0.015 + random(`a${i}`)) % 1);
        return <circle key={i} cx={random(`ax${i}`) * 500} cy={20 + p * 120} r={3 + random(`ar${i}`) * 5} fill={ACIDO} opacity={0.7 - p * 0.4} />;
      })}
      {/* moco */}
      <path d={`M0 ${170 - 26 * moco} Q 125 ${150 - 30 * moco} 250 ${170 - 26 * moco} T 500 ${170 - 26 * moco} V 190 H 0 Z`} fill={MOCO} opacity={0.55 * moco} />
      {/* células */}
      {new Array(n).fill(0).map((_, i) => {
        const x = 8 + i * 54;
        const herida = dano * (i % 2 === 0 ? 1 : 0.5);
        const nueva = renueva > 0 ? interpolate(renueva, [i / n, i / n + 0.25], [0, 1], clamp) : 0;
        const color = nueva > 0.5 ? "#ffb3c4" : herida > 0.5 ? "#8a3b4c" : "#f07d97";
        return (
          <g key={i} transform={`translate(${x} ${190 + (nueva > 0 && nueva < 1 ? (1 - nueva) * 40 : 0)})`}>
            <rect width="48" height="150" rx="16" fill={color} stroke={nueva > 0.5 ? "#fff" : "#ffd6df"} strokeWidth={nueva > 0.5 ? 4 : 2} style={{ filter: nueva > 0.5 ? "drop-shadow(0 0 10px #fff)" : "none" }} />
            <circle cx="24" cy="100" r="12" fill="#7a1f38" opacity="0.8" />
            {herida > 0.5 && nueva < 0.5 ? <path d="M6 10 L 20 30 L 12 44 L 30 60" stroke="#2a0a12" strokeWidth="4" fill="none" /> : null}
          </g>
        );
      })}
      {/* células madre abajo */}
      <rect x="0" y="350" width="500" height="30" rx="10" fill="#c24a6a" />
    </svg>
  );
};

// ---------------------------------------------------------------- escenas
const Gancho: React.FC<EP> = ({ t, dur, mk }) => (
  <AbsoluteFill>
    <Rayos t={t} color={ACIDO} fuerza={0.5} />
    <Preguntas t={t} color={ROSA} />
    <Entra t={t} dur={dur} top={560}>
      <Estomago size={680} t={t} acido={0.7} />
    </Entra>
    <Etiqueta t={t} desde={mk("acido")} texto="Lleno de ácido" icono="🧪" color={ACIDO} top={1360} />
  </AbsoluteFill>
);

const Acido: React.FC<EP> = ({ t, dur, mk }) => {
  const { fps } = useVideoConfig();
  const s = spring({ frame: t - mk("acero") + 2, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill>
      <Luz color={ACIDO} fuerza={0.2} />
      <Entra t={t} dur={dur} top={520} zoom={[1, 1.08]}>
        <div style={{ fontFamily: titleFont, fontSize: 210, color: ACIDO, textShadow: `0 0 50px ${ACIDO}` }}>HCl</div>
      </Entra>
      {/* barra de acero */}
      <Centro top={900} style={{ transform: `scale(${s})` }}>
        <div style={{ width: 640, height: 150, borderRadius: 18, background: "linear-gradient(to bottom, #e6edf3, #8a96a3 55%, #5a6470)", boxShadow: `0 0 40px ${ACIDO}66`, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${interpolate(t, [mk("acero"), dur], [0, 100], clamp)}%`, background: "linear-gradient(90deg, rgba(255,255,255,.9), rgba(255,255,255,.2))" }} />
        </div>
      </Centro>
      <Etiqueta t={t} desde={mk("clorhidrico")} texto="Ácido clorhídrico" color={ACIDO} top={1320} />
      <Etiqueta t={t} desde={mk("acero")} texto="Se usa para limpiar acero" icono="🏭" color="#fff" top={1440} />
    </AbsoluteFill>
  );
};

const Moco: React.FC<EP> = ({ t, mk }) => {
  const m = interpolate(t, [mk("moco") - 4, mk("moco") + 14], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Luz color={MOCO} fuerza={0.15} />
      <Centro top={560} style={{ transform: `scale(${interpolate(t, [0, 30], [0.9, 1], clamp)})` }}>
        <Pared t={t} moco={m} />
      </Centro>
      <Etiqueta t={t} desde={mk("moco")} texto="Capa de moco" icono="🛡" color={MOCO} top={1400} />
    </AbsoluteFill>
  );
};

const Basta: React.FC<EP> = ({ t, dur }) => (
  <AbsoluteFill>
    <Centro top={560} style={{ transform: `scale(${interpolate(t, [0, dur], [1, 1.25])})` }}>
      <Pared t={t * 3} moco={0.5} />
    </Centro>
    <AbsoluteFill style={{ background: "#050817", opacity: interpolate(t, [0, dur], [0.2, 0.6], clamp) }} />
    <Centro top={700}>
      <div style={{ fontFamily: titleFont, fontSize: 240, color: "#FF4D5E", opacity: interpolate(t, [3, 12], [0, 1], clamp), textShadow: "0 0 50px #FF4D5E" }}>!</div>
    </Centro>
  </AbsoluteFill>
);

const Dano: React.FC<EP> = ({ t, mk }) => {
  const d = interpolate(t, [mk("danando") - 4, mk("danando") + 16], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Luz color="#FF4D5E" fuerza={0.15} />
      <Centro top={560}>
        <Pared t={t * 2} moco={0.4} dano={d} />
      </Centro>
      <Etiqueta t={t} desde={mk("danando")} texto="Células dañadas" icono="⚠" color="#FF4D5E" top={1400} />
    </AbsoluteFill>
  );
};

const Rompe: React.FC<EP> = ({ t, dur, mk }) => {
  const tiembla = Math.sin(t * 1.3) * interpolate(t, [0, dur], [6, 0], clamp);
  return (
    <AbsoluteFill>
      <Rayos t={t} color={ROSA} fuerza={0.4} />
      <Centro top={580} style={{ transform: `translateX(${tiembla}px) scale(${interpolate(t, [0, dur], [1, 1.1])})` }}>
        <Estomago size={660} t={t} acido={0.8} brillo={0.8} />
      </Centro>
      <Etiqueta t={t} desde={mk("rompe")} texto="…y no se rompe" color="#fff" top={1380} />
    </AbsoluteFill>
  );
};

const Renueva: React.FC<EP> = ({ t, dur, mk }) => {
  const r = interpolate(t, [mk("nuevas") - 2, mk("nuevas") + 50], [0, 1], clamp);
  const dias = t >= mk("cinco") - 6;
  return (
    <AbsoluteFill>
      <Rayos t={t * 2} color={ROSA} />
      <Centro top={500} style={{ transform: `scale(${interpolate(t, [0, dur], [1, 1.06])})` }}>
        <Pared t={t} moco={0.6} dano={1} renueva={r} />
      </Centro>
      <Etiqueta t={t} desde={mk("nuevas")} texto="¡Células nuevas!" icono="✨" color="#fff" top={1260} grande />
      {dias ? <Etiqueta t={t} desde={mk("cinco") - 6} texto="Cada 3–5 días" icono="🔄" color={C.amarillo} top={1400} /> : null}
      <Etiqueta t={t} desde={mk("semana")} texto="Forro casi nuevo cada semana" color={ROSA} top={1520} />
      <Flash t={t} desde={mk("nuevas")} color="#ffd6df" />
    </AbsoluteFill>
  );
};

const Cta: React.FC<EP> = ({ t, mk }) => (
  <AbsoluteFill>
    <Rayos t={t} color={ROSA} fuerza={0.5} />
    <Centro top={600}>
      <Estomago size={620} t={t} brillo={0.8} />
    </Centro>
    <Etiqueta t={t} desde={mk("hierro")} texto="¿Estómago de hierro?" icono="💪" color={C.amarillo} top={1360} />
    <Cierre t={t} desde={mk("hierro") + 22} />
  </AbsoluteFill>
);

export const ESCENAS_ESTOMAGO: Record<string, React.FC<EP>> = {
  e_gancho: Gancho, e_acido: Acido, e_moco: Moco, e_basta: Basta, e_dano: Dano, e_rompe: Rompe, e_renueva: Renueva, e_cta: Cta,
};
