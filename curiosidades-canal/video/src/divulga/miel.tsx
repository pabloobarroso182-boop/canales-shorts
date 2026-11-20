// Escenas del Short «La miel (casi) no caduca» (estilo divulga, dibujo propio en SVG).
import React from "react";
import { AbsoluteFill, interpolate, random, spring, useVideoConfig } from "remotion";
import { C, EP, Etiqueta } from "./comunes";
import { Centro, Cierre, clamp, Entra, Flash, Luz, Numero, Preguntas, Rayos } from "./piezas";
import { titleFont } from "../short/fonts";

const MIEL = "#FFB020";
const BACT = "#8BE36B";

const Tarro: React.FC<{ size?: number; t?: number; antiguo?: number; brillo?: number }> = ({ size = 520, t = 0, antiguo = 0, brillo = 0.6 }) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 200 240" style={{ overflow: "visible", filter: `drop-shadow(0 0 ${40 * brillo}px ${MIEL})` }}>
    <defs>
      <linearGradient id="mi" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffe08a" />
        <stop offset="0.5" stopColor={MIEL} />
        <stop offset="1" stopColor="#b8650a" />
      </linearGradient>
      <linearGradient id="barro" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#7a4a26" />
        <stop offset="0.5" stopColor="#c8844a" />
        <stop offset="1" stopColor="#6b3e1e" />
      </linearGradient>
    </defs>
    {antiguo > 0.5 ? (
      <g>
        {/* ánfora egipcia de barro */}
        <path d="M70 20 L 130 20 L 126 44 C 170 70, 180 160, 140 210 L 60 210 C 20 160, 30 70, 74 44 Z" fill="url(#barro)" stroke="#3d220e" strokeWidth="3" />
        <path d="M60 110 H 140" stroke="#3d220e" strokeWidth="4" />
        {[70, 90, 110, 130].map((x) => <path key={x} d={`M${x} 120 l 6 12 l 6 -12`} stroke="#2BD9FE" strokeWidth="3" fill="none" />)}
        <ellipse cx="100" cy="22" rx="30" ry="6" fill={MIEL} />
      </g>
    ) : (
      <g>
        <rect x="50" y="14" width="100" height="30" rx="8" fill="#c96a1a" stroke="#7a3a0a" strokeWidth="3" />
        <path d="M44 50 Q 40 44 50 44 L 150 44 Q 160 44 156 50 L 166 200 Q 168 226 140 226 L 60 226 Q 32 226 34 200 Z" fill="url(#mi)" stroke="#fff3c4" strokeWidth="3" />
        <path d={`M40 ${90 + Math.sin(t / 8) * 3} Q 100 ${80} 160 ${90 + Math.sin(t / 8) * 3}`} stroke="rgba(255,255,255,.4)" strokeWidth="4" fill="none" />
        <path d="M60 70 C 56 120, 58 170, 66 200" stroke="rgba(255,255,255,.55)" strokeWidth="10" fill="none" strokeLinecap="round" />
        <rect x="64" y="120" width="72" height="50" rx="8" fill="#fff6dc" />
        <text x="100" y="153" textAnchor="middle" fontFamily={titleFont} fontSize="20" fill="#7a3a0a">MIEL</text>
      </g>
    )}
  </svg>
);

const Panal: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ opacity: 0.18 }}>
    <svg width={1080} height={1920}>
      {new Array(10).fill(0).map((_, f) =>
        new Array(8).fill(0).map((__, c) => {
          const x = c * 150 + (f % 2) * 75, y = f * 130 + 300 + Math.sin(t / 30) * 6;
          return <path key={`${f}-${c}`} d={`M${x} ${y} l 60 -35 l 60 35 l 0 70 l -60 35 l -60 -35 Z`} fill="none" stroke={MIEL} strokeWidth="5" />;
        }),
      )}
    </svg>
  </AbsoluteFill>
);

const Bacteria: React.FC<{ x: number; y: number; seca: number; t: number; i: number }> = ({ x, y, seca, t, i }) => (
  <div style={{ position: "absolute", left: x, top: y + Math.sin(t / 6 + i) * 8, transform: `scale(${1 - seca * 0.45}) rotate(${i * 40 + t}deg)` }}>
    <svg width={110} height={60} viewBox="0 0 110 60">
      <rect x="10" y="10" width="90" height="40" rx="20" fill={seca > 0.5 ? "#6b6b52" : BACT} stroke={seca > 0.5 ? "#4a4a38" : "#d6ffc8"} strokeWidth="3" />
      {seca < 0.5 ? [30, 55, 80].map((cx) => <circle key={cx} cx={cx} cy="30" r="5" fill="#3d8a2a" />) : <path d="M20 30 Q 55 14 90 30" stroke="#3a3a2a" strokeWidth="3" fill="none" />}
    </svg>
  </div>
);

const Abeja: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => (
  <div style={{ position: "absolute", left: x + Math.sin(t / 5) * 40, top: y + Math.cos(t / 4) * 20 }}>
    <svg width={160} height={110} viewBox="0 0 80 55" style={{ overflow: "visible", filter: "drop-shadow(0 0 10px rgba(255,210,63,.6))" }}>
      <ellipse cx="30" cy="12" rx="16" ry="10" fill="rgba(220,240,255,.7)" transform={`rotate(${Math.sin(t) * 20} 30 22)`} />
      <ellipse cx="46" cy="12" rx="14" ry="9" fill="rgba(220,240,255,.6)" transform={`rotate(${-Math.sin(t) * 20} 46 22)`} />
      <ellipse cx="38" cy="32" rx="26" ry="16" fill={C.amarillo} />
      {[28, 38, 48].map((xx) => <rect key={xx} x={xx - 3} y="17" width="6" height="30" fill="#1a1a1a" />)}
      <circle cx="66" cy="30" r="9" fill="#1a1a1a" />
    </svg>
  </div>
);

// ---------------------------------------------------------------- escenas
const Gancho: React.FC<EP> = ({ t, dur, mk }) => {
  return (
    <AbsoluteFill>
      <Rayos t={t} color={MIEL} fuerza={0.4} />
      <Preguntas t={t} color={MIEL} />
      <Entra t={t} dur={dur} top={560}>
        <div style={{ fontSize: 360, filter: `drop-shadow(0 0 40px ${MIEL})` }}>⏳</div>
      </Entra>
      <Numero t={t} desde={mk("miles") - 6} texto="MILES" sub="de años" color={C.amarillo} top={1300} size={150} />
    </AbsoluteFill>
  );
};

const Miel: React.FC<EP> = ({ t, dur }) => (
  <AbsoluteFill>
    <Panal t={t} />
    <Rayos t={t * 3} color={MIEL} />
    <Entra t={t} dur={dur} top={560} giro={-20}>
      <Tarro size={520} t={t} brillo={1} />
    </Entra>
    <Etiqueta t={t} desde={2} texto="LA MIEL" icono="🍯" color={MIEL} top={1300} grande />
    <Flash t={t} color="#fff2cc" />
  </AbsoluteFill>
);

const Tumbas: React.FC<EP> = ({ t, dur, mk }) => {
  const { fps } = useVideoConfig();
  const s = spring({ frame: t - mk("egipto") + 4, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, #1a1430, #4a3020 55%, #2a1a0e)" }} />
      {/* pirámide */}
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <path d="M540 520 L 980 1300 L 100 1300 Z" fill="#c8954a" opacity="0.45" />
        <path d="M540 520 L 980 1300 L 540 1300 Z" fill="#8a5f2a" opacity="0.45" />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1300, height: 620, background: "linear-gradient(to bottom, #6b4a24, #2a1a0e)" }} />
      <Centro top={780} style={{ transform: `scale(${s * interpolate(t, [0, dur], [1, 1.08])})` }}>
        <Tarro size={460} antiguo={1} brillo={0.5} />
      </Centro>
      <Etiqueta t={t} desde={mk("egipto")} texto="Tumbas del antiguo Egipto" icono="🏺" color={C.amarillo} top={460} />
      <Etiqueta t={t} desde={mk("egipto") + 30} texto="Miel de hace miles de años" color="#fff" top={1450} />
    </AbsoluteFill>
  );
};

const Truco: React.FC<EP> = ({ t, dur }) => (
  <AbsoluteFill>
    <Rayos t={t} color={C.amarillo} fuerza={0.5} />
    <Centro top={600} style={{ transform: `scale(${interpolate(t, [0, dur], [1, 1.3])})` }}>
      <Tarro size={460} t={t} />
    </Centro>
    <AbsoluteFill style={{ background: "#050817", opacity: interpolate(t, [0, dur], [0, 0.55], clamp) }} />
    <Centro top={640}>
      <div style={{ fontFamily: titleFont, fontSize: 240, color: C.amarillo, opacity: interpolate(t, [3, 12], [0, 1], clamp), textShadow: `0 0 50px ${C.amarillo}` }}>?</div>
    </Centro>
  </AbsoluteFill>
);

const Azucar: React.FC<EP> = ({ t, mk }) => {
  const seca = interpolate(t, [mk("secas") - 20, mk("secas") + 6], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, ${MIEL}55, #3a2208 75%)` }} />
      {/* cristales de azúcar */}
      {new Array(22).fill(0).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: random(`zx${i}`) * 1000, top: 480 + random(`zy${i}`) * 1100, width: 40, height: 40, background: "rgba(255,255,255,.55)", transform: `rotate(${45 + i * 13 + t}deg)`, borderRadius: 6 }} />
      ))}
      {[[200, 760], [620, 700], [380, 1000], [700, 1120], [180, 1240]].map(([x, y], i) => <Bacteria key={i} x={x} y={y} seca={seca} t={t} i={i} />)}
      <Etiqueta t={t} desde={mk("azucar")} texto="~80 % azúcar · poca agua" icono="🍬" color="#fff" top={460} />
      <Etiqueta t={t} desde={mk("secas")} texto="Bacterias secas" icono="☠" color={BACT} top={1450} grande />
    </AbsoluteFill>
  );
};

const Abejas: React.FC<EP> = ({ t, dur, mk }) => (
  <AbsoluteFill>
    <Panal t={t} />
    <Luz color={C.amarillo} fuerza={0.2} />
    <Abeja x={240} y={700} t={t} />
    <Abeja x={640} y={900} t={t + 20} />
    <Abeja x={400} y={1150} t={t + 40} />
    <Entra t={t} dur={dur} top={1300} zoom={[1, 1.1]}>
      <div style={{ fontFamily: titleFont, fontSize: 90, color: C.amarillo, textShadow: `0 0 30px ${C.amarillo}` }}>+ algo más</div>
    </Entra>
    <Etiqueta t={t} desde={mk("abejas")} texto="Las abejas" icono="🐝" color={C.amarillo} top={460} />
  </AbsoluteFill>
);

const Enzima: React.FC<EP> = ({ t, mk }) => {
  const { fps } = useVideoConfig();
  const z = spring({ frame: t - mk("enzima"), fps, config: { damping: 11 } });
  const fase = t >= mk("cerrada") - 10;
  return (
    <AbsoluteFill>
      <Rayos t={t * 2} color={MIEL} />
      {!fase ? (
        <Centro top={620} style={{ transform: `scale(${z}) rotate(${t * 0.8}deg)` }}>
          <svg width={420} height={420} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 30px ${C.cian})` }}>
            <path d="M50 8 C 76 8, 92 30, 86 52 C 80 74, 60 92, 40 86 C 18 80, 8 58, 16 38 C 22 22, 34 8, 50 8 Z" fill="none" stroke={C.cian} strokeWidth="6" />
            <circle cx="50" cy="50" r="18" fill={C.cian} opacity="0.5" />
          </svg>
        </Centro>
      ) : (
        <Centro top={560} style={{ transform: `scale(${interpolate(t, [mk("cerrada") - 10, mk("cerrada") + 10], [0.7, 1], clamp)})` }}>
          <Tarro size={500} t={t} brillo={1} />
        </Centro>
      )}
      <Etiqueta t={t} desde={mk("enzima")} texto="Una enzima" icono="🧬" color={C.cian} top={460} />
      <Etiqueta t={t} desde={mk("oxigenada") - 26} texto="Ácido" color={C.amarillo} top={1300} />
      <Etiqueta t={t} desde={mk("oxigenada")} texto="+ agua oxigenada" icono="🧴" color="#fff" top={1410} />
      <Etiqueta t={t} desde={mk("caduca")} texto="(Casi) no caduca" icono="✓" color={C.verde} top={1530} grande />
      <Flash t={t} desde={mk("caduca")} color="#fff2cc" />
    </AbsoluteFill>
  );
};

const Cta: React.FC<EP> = ({ t, mk }) => (
  <AbsoluteFill>
    <Panal t={t} />
    <Rayos t={t} color={MIEL} fuerza={0.5} />
    <Centro top={600}>
      <Tarro size={480} t={t} />
    </Centro>
    <Etiqueta t={t} desde={mk("fecha") - 30} texto="¿La tiras por la fecha?" icono="🗑" color={C.amarillo} top={1360} />
    <Cierre t={t} desde={mk("fecha") + 14} />
  </AbsoluteFill>
);

export const ESCENAS_MIEL: Record<string, React.FC<EP>> = {
  m_gancho: Gancho, m_miel: Miel, m_tumbas: Tumbas, m_truco: Truco, m_azucar: Azucar, m_abejas: Abejas, m_enzima: Enzima, m_cta: Cta,
};
