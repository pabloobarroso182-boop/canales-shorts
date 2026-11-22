// Escenas del Short «El ciclo nasal» (estilo divulga, dibujo propio en SVG).
import React from "react";
import { AbsoluteFill, interpolate, random, spring, useVideoConfig } from "remotion";
import { C, EP, Etiqueta } from "./comunes";
import { Centro, Cierre, clamp, Entra, Flash, Luz, Numero, Preguntas, Rayos } from "./piezas";
import { titleFont } from "../short/fonts";

const PIEL = "#F2B48C";
const PIEL_OSC = "#C97F57";
const AIRE = "#2BD9FE";
const TEJIDO = "#FF6B8A";

// Nariz de frente con dos fosas. izq/der: 0 = cerrada (tejido hinchado), 1 = abierta
const Nariz: React.FC<{ size?: number; izq?: number; der?: number }> = ({ size = 520, izq = 1, der = 0.35 }) => (
  <svg width={size} height={size * 1.1} viewBox="0 0 200 220" style={{ overflow: "visible", filter: "drop-shadow(0 0 40px rgba(242,180,140,.45))" }}>
    <path d="M100 10 C 112 60, 122 110, 160 150 C 182 172, 172 200, 140 202 C 124 204, 112 196, 100 196 C 88 196, 76 204, 60 202 C 28 200, 18 172, 40 150 C 78 110, 88 60, 100 10 Z" fill={PIEL} />
    <path d="M100 14 C 108 60, 114 104, 128 132" stroke={PIEL_OSC} strokeWidth="3" fill="none" opacity="0.5" />
    {/* fosas: tamaño según lo abiertas que están */}
    <ellipse cx="72" cy="182" rx={8 + 12 * izq} ry={5 + 8 * izq} fill="#3a1e18" />
    <ellipse cx="128" cy="182" rx={8 + 12 * der} ry={5 + 8 * der} fill="#3a1e18" />
  </svg>
);

// Flechas de aire que salen de una fosa (fuerza 0..1)
const Aire: React.FC<{ t: number; x: number; y: number; fuerza: number }> = ({ t, x, y, fuerza }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: fuerza }}>
    {new Array(4).fill(0).map((_, i) => {
      const d = ((t * (3 + fuerza * 4) + i * 40) % 160);
      return (
        <svg key={i} width={60} height={60} viewBox="0 0 60 60" style={{ position: "absolute", left: -30 + Math.sin(i * 2) * 20, top: d, opacity: 1 - d / 160 }}>
          <path d="M30 6 Q 44 22 30 34 Q 16 46 30 56" stroke={AIRE} strokeWidth={4 + fuerza * 4} fill="none" strokeLinecap="round" />
        </svg>
      );
    })}
  </div>
);

// Corte de la nariz por dentro: dos conductos con el tejido (cornete) que se hincha
const Corte: React.FC<{ izq: number; der: number; size?: number }> = ({ izq, der, size = 760 }) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 200 160" style={{ overflow: "visible" }}>
    <rect x="10" y="10" width="180" height="140" rx="30" fill="#2a1430" stroke={PIEL} strokeWidth="4" />
    <rect x="96" y="10" width="8" height="140" fill={PIEL} />
    {/* tejido izquierdo y derecho: más grande = más hinchado = menos aire */}
    <ellipse cx="48" cy="80" rx={14 + 26 * (1 - izq)} ry={30 + 26 * (1 - izq)} fill={TEJIDO} opacity="0.9" />
    <ellipse cx="152" cy="80" rx={14 + 26 * (1 - der)} ry={30 + 26 * (1 - der)} fill={TEJIDO} opacity="0.9" />
  </svg>
);

// ---------------------------------------------------------------- escenas
const Gancho: React.FC<EP> = ({ t, dur, mk }) => (
  <AbsoluteFill>
    <Rayos t={t} color={AIRE} fuerza={0.35} />
    <Preguntas t={t} color={AIRE} />
    <Entra t={t} dur={dur} top={420}>
      <Nariz size={540} izq={1} der={0.3} />
    </Entra>
    <Aire t={t} x={430} y={1040} fuerza={1} />
    <Aire t={t} x={650} y={1040} fuerza={0.25} />
    <Etiqueta t={t} desde={Math.max(4, mk("lado") - 20)} texto="¿Un solo lado?" icono="👃" color={AIRE} top={1440} grande />
  </AbsoluteFill>
);

const Prueba: React.FC<EP> = ({ t, mk }) => {
  const otra = t >= mk("prueba") - 4;
  return (
    <AbsoluteFill>
      <Luz color={C.amarillo} fuerza={0.2} />
      <Centro top={460}>
        <div style={{ position: "relative" }}>
          <Nariz size={520} izq={1} der={0.3} />
          {/* dedo que tapa una fosa y luego la otra */}
          <div style={{ position: "absolute", left: otra ? 300 : 60, top: 420, fontSize: 170, transform: "rotate(-20deg)", transition: "none" }}>☝️</div>
        </div>
      </Centro>
      <Etiqueta t={t} desde={2} texto="Tapa una fosa…" icono="1️⃣" color={C.amarillo} top={1300} />
      <Etiqueta t={t} desde={mk("prueba") - 6} texto="…y luego la otra" icono="2️⃣" color={C.amarillo} top={1420} />
    </AbsoluteFill>
  );
};

const Normal: React.FC<EP> = ({ t, mk }) => (
  <AbsoluteFill>
    <Rayos t={t} color={C.verde} fuerza={0.3} />
    <Centro top={460}>
      <Nariz size={460} izq={1} der={0.3} />
    </Centro>
    <Aire t={t} x={430} y={960} fuerza={1} />
    <Aire t={t} x={620} y={960} fuerza={0.2} />
    <Etiqueta t={t} desde={4} texto="Más aire por un lado" icono="💨" color={AIRE} top={1250} />
    <Numero t={t} desde={mk("resfriado") - 8} texto="NORMAL" sub="no es un resfriado" color={C.verde} top={1400} size={150} />
  </AbsoluteFill>
);

const Vuelta: React.FC<EP> = ({ t, dur, mk }) => {
  const g = interpolate(t, [mk("vuelta") - 16, mk("vuelta") + 4], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Luz color={AIRE} fuerza={0.25} />
      {/* reloj que avanza */}
      <Centro top={360}>
        <svg width={260} height={260} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 20px ${C.amarillo})` }}>
          <circle cx="50" cy="50" r="44" fill="none" stroke={C.amarillo} strokeWidth="6" />
          <line x1="50" y1="50" x2={50 + 30 * Math.sin(t / 3)} y2={50 - 30 * Math.cos(t / 3)} stroke="#fff" strokeWidth="5" strokeLinecap="round" />
          <line x1="50" y1="50" x2={50 + 20 * Math.sin(t / 30)} y2={50 - 20 * Math.cos(t / 30)} stroke={C.amarillo} strokeWidth="6" strokeLinecap="round" />
        </svg>
      </Centro>
      <Entra t={t} dur={dur} top={720} zoom={[0.95, 1.05]}>
        <Nariz size={440} izq={1 - g * 0.7} der={0.3 + g * 0.7} />
      </Entra>
      <Etiqueta t={t} desde={mk("vuelta") - 6} texto="…y se da la vuelta" icono="🔄" color={C.amarillo} top={1440} grande />
    </AbsoluteFill>
  );
};

const Ciclo: React.FC<EP> = ({ t, mk }) => {
  const { fps } = useVideoConfig();
  const z = spring({ frame: t - 2, fps, config: { damping: 12 } });
  const h = interpolate(t, [mk("hincha") - 4, mk("hincha") + 26], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Rayos t={t * 2} color={TEJIDO} fuerza={0.3} />
      <Centro top={430}>
        <div style={{ fontFamily: titleFont, fontSize: 110, color: "#fff", transform: `scale(${z})`, textShadow: `0 0 40px ${AIRE}` }}>CICLO NASAL</div>
      </Centro>
      <Centro top={700} style={{ transform: `scale(${z})` }}>
        <Corte izq={1 - h * 0.8} der={0.2 + h * 0.8} />
      </Centro>
      <Etiqueta t={t} desde={mk("hincha")} texto="Se hincha" icono="⬆" color={TEJIDO} top={1360} />
      <Etiqueta t={t} desde={mk("hincha") + 22} texto="…y se deshincha" icono="⬇" color={AIRE} top={1470} />
    </AbsoluteFill>
  );
};

const Noche: React.FC<EP> = ({ t, dur, mk }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: "linear-gradient(to bottom, #050817, #10183f)" }} />
    {new Array(40).fill(0).map((_, i) => (
      <div key={i} style={{ position: "absolute", left: random(`sx${i}`) * 1080, top: random(`sy${i}`) * 1100, width: 4, height: 4, borderRadius: 4, background: "#fff", opacity: 0.3 + 0.5 * Math.abs(Math.sin(t / 15 + i)) }} />
    ))}
    <Entra t={t} dur={dur} top={480}>
      <div style={{ fontSize: 320, filter: "drop-shadow(0 0 40px #C3B2FF)" }}>😴</div>
    </Entra>
    <Centro top={900}>
      <div style={{ fontFamily: titleFont, fontSize: 120, color: "#C3B2FF", opacity: interpolate(t, [0, 10], [0, 1], clamp), textShadow: "0 0 30px #7B5CFF" }}>{"z".repeat(1 + (Math.floor(t / 10) % 3))}</div>
    </Centro>
    <Etiqueta t={t} desde={4} texto="Solo, todo el día" icono="⏱" color={C.amarillo} top={1250} />
    <Etiqueta t={t} desde={mk("duermes") - 8} texto="Más aún al dormir" icono="🌙" color="#C3B2FF" top={1380} grande />
  </AbsoluteFill>
);

const Descansa: React.FC<EP> = ({ t, mk }) => {
  const turno = interpolate(t, [mk("turnan") - 10, mk("turnan") + 14], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Rayos t={t * 2} color={AIRE} fuerza={0.35} />
      <Centro top={520}>
        <Corte izq={1 - turno} der={turno} size={700} />
      </Centro>
      <div style={{ position: "absolute", left: 190, top: 1110, fontSize: 70, opacity: interpolate(t, [mk("descansa") - 30, mk("descansa") - 20], [0, 1], clamp) }}>{turno < 0.5 ? "💪" : "💧"}</div>
      <div style={{ position: "absolute", left: 790, top: 1110, fontSize: 70, opacity: interpolate(t, [mk("descansa") - 4, mk("descansa") + 6], [0, 1], clamp) }}>{turno < 0.5 ? "💧" : "💪"}</div>
      <Etiqueta t={t} desde={4} texto="Una explicación:" icono="💡" color={C.amarillo} top={400} />
      <Etiqueta t={t} desde={mk("descansa") - 4} texto="Una trabaja, la otra descansa" color="#fff" top={1300} />
      <Etiqueta t={t} desde={mk("turnan") - 4} texto="Se turnan cada pocas horas" icono="🔄" color={AIRE} top={1420} grande />
      <Flash t={t} desde={mk("turnan")} color="#d6f6ff" />
    </AbsoluteFill>
  );
};

const Cta: React.FC<EP> = ({ t, mk }) => (
  <AbsoluteFill>
    <Rayos t={t} color={AIRE} fuerza={0.4} />
    <Centro top={460}>
      <Nariz size={460} izq={0.5 + 0.5 * Math.sin(t / 8)} der={0.5 - 0.5 * Math.sin(t / 8)} />
    </Centro>
    <Etiqueta t={t} desde={4} texto="¿Izquierda o derecha?" icono="👃" color={C.amarillo} top={1300} grande />
    <Cierre t={t} desde={mk("respiras") + 24} />
  </AbsoluteFill>
);

export const ESCENAS_NARIZ: Record<string, React.FC<EP>> = {
  n_gancho: Gancho, n_prueba: Prueba, n_normal: Normal, n_vuelta: Vuelta, n_ciclo: Ciclo, n_noche: Noche, n_descansa: Descansa, n_cta: Cta,
};
