// Marca del canal «Sala de Espera»: foto de perfil (800×800) y banner de YouTube (2560×1440).
import React from "react";
import { AbsoluteFill, random } from "remotion";
import { FB, FT, NICO, P, Persona, VERA } from "./kit";

// Logo: ticket de turno con «Nº» y línea de pulso
export const Ticket: React.FC<{ size?: number }> = ({ size = 520 }) => (
  <svg width={size} height={size * 0.78} viewBox="0 0 200 156" style={{ overflow: "visible", filter: "drop-shadow(0 10px 0 rgba(11,127,120,.35))" }}>
    <defs>
      <mask id="muescas">
        <rect x="0" y="0" width="200" height="156" fill="#fff" />
        <circle cx="0" cy="78" r="16" fill="#000" />
        <circle cx="200" cy="78" r="16" fill="#000" />
      </mask>
    </defs>
    <rect x="0" y="0" width="200" height="156" rx="22" fill="#fff" mask="url(#muescas)" />
    <rect x="0" y="0" width="200" height="34" rx="22" fill={P.turquesa} mask="url(#muescas)" />
    <rect x="0" y="22" width="200" height="12" fill={P.turquesa} />
    <line x1="22" y1="118" x2="178" y2="118" stroke={P.crema2} strokeWidth="3" strokeDasharray="6 6" />
    <text x="100" y="98" textAnchor="middle" fontFamily={FT} fontSize="62" fill={P.tinta}>Nº</text>
    <path d="M24 138 H 70 L 80 124 L 92 150 L 104 128 L 112 138 H 176" stroke={P.coral} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Icono: React.FC<{ tipo: number; x: number; y: number; s?: number; c: string }> = ({ tipo, x, y, s = 90, c }) => {
  const d = [
    <path key="c" d="M38 10 H62 V38 H90 V62 H62 V90 H38 V62 H10 V38 H38 Z" />,
    <path key="h" d="M50 86 C 10 58, 8 30, 28 18 C 40 12, 48 20, 50 28 C 52 20, 60 12, 72 18 C 92 30, 90 58, 50 86 Z" />,
    <g key="t"><rect x="42" y="8" width="16" height="62" rx="8" /><circle cx="50" cy="78" r="14" /></g>,
    <g key="j"><rect x="20" y="40" width="54" height="20" rx="6" /><path d="M74 50 H 94 M8 50 H 20 M30 40 V 30 M44 40 V 30 M58 40 V 30" /></g>,
    <path key="p" d="M6 50 H 30 L 40 26 L 54 76 L 64 50 H 94" />,
  ][tipo % 5];
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" style={{ position: "absolute", left: x, top: y, opacity: 0.55 }}>
      <g fill="none" stroke={c} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">{d}</g>
    </svg>
  );
};

export const Perfil: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 35% 30%, #5BE3D5, ${P.turquesa} 55%, ${P.turquesaOsc})`, alignItems: "center", justifyContent: "center" }}>
    <div style={{ position: "absolute", width: 640, height: 640, borderRadius: "50%", border: "10px solid rgba(255,255,255,.35)" }} />
    <div style={{ transform: "rotate(-8deg)", marginTop: 20 }}>
      <Ticket size={450} />
    </div>
  </AbsoluteFill>
);

export const Banner: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, ${P.crema}, ${P.crema2} 85%)`, overflow: "hidden" }}>
    {/* manchas suaves de color */}
    <div style={{ position: "absolute", left: -200, top: -300, width: 1000, height: 1000, borderRadius: "50%", background: `${P.turquesa}22` }} />
    <div style={{ position: "absolute", right: -260, bottom: -360, width: 1100, height: 1100, borderRadius: "50%", background: `${P.coral}18` }} />
    {/* iconos de salud repartidos por los bordes (fuera de la zona segura de texto) */}
    {new Array(22).fill(0).map((_, i) => {
      const x = random(`ix${i}`) * 2460;
      const y = random(`iy${i}`) * 1340;
      if (x > 420 && x < 2140 && y > 420 && y < 1000) return null;
      return <Icono key={i} tipo={i} x={x} y={y} s={70 + random(`is${i}`) * 50} c={[P.turquesa, P.coral, P.amarillo][i % 3]} />;
    })}
    {/* zona segura 1546×423 centrada: (507,508)–(2053,931) */}
    <div style={{ position: "absolute", left: 507, top: 508, width: 1546, height: 423, display: "flex", alignItems: "center", justifyContent: "center", gap: 40 }}>
      <div style={{ transform: "rotate(-8deg)", flexShrink: 0 }}><Ticket size={280} /></div>
      <div>
        <div style={{ fontFamily: FT, fontSize: 132, color: P.tinta, lineHeight: 0.95, letterSpacing: 2 }}>SALA DE</div>
        <div style={{ display: "inline-block", marginTop: 10, background: P.turquesa, color: "#fff", fontFamily: FT, fontSize: 118, lineHeight: 1, padding: "8px 34px 14px", borderRadius: 30, boxShadow: `0 12px 0 ${P.turquesaOsc}` }}>ESPERA</div>
        <div style={{ marginTop: 26, fontFamily: FB, fontWeight: 800, fontSize: 42, color: P.tinta, whiteSpace: "nowrap" }}>
          Tu salud, explicada por dentro <span style={{ color: P.coral }}>•</span> Shorts nuevos cada día
        </div>
      </div>
    </div>
    {/* personajes del canal a los lados (se ven en TV y escritorio) */}
    <div style={{ position: "absolute", left: 90, top: 330 }}><Persona look={VERA} size={300} g={{ expr: "feliz", brazoD: -150, codoD: -20 }} /></div>
    <div style={{ position: "absolute", right: 90, top: 330 }}><Persona look={NICO} size={300} g={{ expr: "sorpresa", brazoI: 150, codoI: 20, mira: -1 }} /></div>
  </AbsoluteFill>
);
