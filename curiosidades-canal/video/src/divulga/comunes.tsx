// Piezas comunes del estilo «divulga» (las usan todas las escenas de todos los temas).
import React from "react";
import { AbsoluteFill, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { bodyFont } from "../short/fonts";

export const C = {
  fondo1: "#0B1230",
  fondo2: "#050817",
  amarillo: "#FFD23F",
  platano: "#FFC928",
  platanoOsc: "#D99A0B",
  verde: "#7CFF6B",
  k: "#8E6BFF",
  kLuz: "#C3B2FF",
  naranja: "#FF8A1F",
  cian: "#2BD9FE",
};

export type EP = { clave: string; t: number; dur: number; mk: (k: string) => number };

// ---------------------------------------------------------------- piezas comunes
export const Bokeh: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {new Array(26).fill(0).map((_, i) => {
        const x = random(`bx${i}`) * 1080;
        const y = ((random(`by${i}`) * 1920 - frame * (0.4 + random(`bv${i}`) * 0.8)) % 1920 + 1920) % 1920;
        const r = 6 + random(`br${i}`) * 22;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: r * 2,
              height: r * 2,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(255,214,120,${0.25 + random(`bo${i}`) * 0.25}), transparent 70%)`,
              filter: "blur(2px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const Etiqueta: React.FC<{ t: number; desde: number; texto: string; color?: string; top: number; grande?: boolean; icono?: string }> = ({ t, desde, texto, color = C.amarillo, top, grande, icono }) => {
  const { fps } = useVideoConfig();
  if (t < desde) return null;
  const s = spring({ frame: t - desde, fps, config: { damping: 11, mass: 0.6 } });
  return (
    <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          transform: `scale(${s}) translateY(${(1 - s) * 30}px)`,
          background: "rgba(8,12,34,.82)",
          border: `4px solid ${color}`,
          color,
          fontFamily: bodyFont,
          fontWeight: 900,
          fontSize: grande ? 76 : 56,
          padding: grande ? "14px 40px" : "10px 32px",
          borderRadius: 26,
          boxShadow: `0 0 40px ${color}66, 0 12px 40px rgba(0,0,0,.5)`,
          whiteSpace: "nowrap",
        }}
      >
        {icono ? <span style={{ marginRight: 16 }}>{icono}</span> : null}
        {texto}
      </div>
    </div>
  );
};

export const Platano: React.FC<{ size?: number; brillo?: number }> = ({ size = 640, brillo = 0.6 }) => (
  <svg width={size} height={size * 0.62} viewBox="0 0 400 248" style={{ overflow: "visible", filter: `drop-shadow(0 0 ${30 * brillo}px rgba(255,210,63,${brillo}))` }}>
    <defs>
      <linearGradient id="pl" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFE680" />
        <stop offset="0.45" stopColor={C.platano} />
        <stop offset="1" stopColor={C.platanoOsc} />
      </linearGradient>
      <linearGradient id="pl2" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="rgba(255,255,255,0)" />
        <stop offset="0.5" stopColor="rgba(255,255,255,.55)" />
        <stop offset="1" stopColor="rgba(255,255,255,0)" />
      </linearGradient>
    </defs>
    {/* cuerpo curvado con volumen */}
    <path d="M28 58 C 50 200, 300 262, 388 96 C 340 128, 280 124, 200 122 C 120 120, 62 100, 28 58 Z" fill="url(#pl)" />
    <path d="M40 72 C 90 120, 160 132, 220 132 C 290 132, 340 128, 380 104" stroke="url(#pl2)" strokeWidth="10" fill="none" strokeLinecap="round" />
    <path d="M44 92 C 100 190, 290 230, 384 104" stroke="rgba(150,90,0,.45)" strokeWidth="4" fill="none" />
    <path d="M36 70 C 90 160, 260 205, 386 100" stroke="rgba(150,90,0,.25)" strokeWidth="3" fill="none" />
    {/* rabito y punta */}
    <path d="M30 62 L 12 40 L 24 30 L 42 54 Z" fill="#6B4A12" />
    <ellipse cx="386" cy="98" rx="9" ry="7" fill="#3B2A0A" />
  </svg>
);

export const Anillos: React.FC<{ t: number; color: string; cada?: number; fuerza?: number }> = ({ t, color, cada = 22, fuerza = 1 }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
    {[0, 1, 2].map((k) => {
      const p = (((t + k * (cada / 3)) % cada) + cada) % cada / cada;
      return (
        <div
          key={k}
          style={{
            position: "absolute",
            width: 300 + p * 700,
            height: 300 + p * 700,
            borderRadius: "50%",
            border: `6px solid ${color}`,
            opacity: (1 - p) * 0.7 * fuerza,
            boxShadow: `0 0 30px ${color}`,
          }}
        />
      );
    })}
  </AbsoluteFill>
);

// Átomo: esfera con brillo, estilo 3D simple.
export const Atomo: React.FC<{ x: number; y: number; r: number; color: string; luz: string; glow?: number }> = ({ x, y, r, color, luz, glow = 0 }) => (
  <div
    style={{
      position: "absolute",
      left: x - r,
      top: y - r,
      width: r * 2,
      height: r * 2,
      borderRadius: "50%",
      background: `radial-gradient(circle at 35% 30%, ${luz}, ${color} 55%, #1a0f40 100%)`,
      boxShadow: glow ? `0 0 ${40 * glow}px ${20 * glow}px ${C.naranja}aa` : "0 8px 20px rgba(0,0,0,.45)",
    }}
  />
);

// Red de átomos de potasio (posiciones fijas con ligera oscilación).
export const red = (() => {
  const pts: { x: number; y: number }[] = [];
  for (let fila = 0; fila < 9; fila++) {
    for (let col = 0; col < 6; col++) {
      pts.push({ x: 90 + col * 180 + (fila % 2) * 90, y: 340 + fila * 150 });
    }
  }
  return pts;
})();

export const Red: React.FC<{ t: number; brilla?: (i: number) => number; color?: string }> = ({ t, brilla, color = C.k }) => (
  <AbsoluteFill>
    {red.map((p, i) => {
      const g = brilla ? brilla(i) : 0;
      const ox = Math.sin(t / 14 + i) * 6;
      const oy = Math.cos(t / 17 + i * 1.3) * 6;
      return <Atomo key={i} x={p.x + ox} y={p.y + oy} r={52} color={g > 0.05 ? C.naranja : color} luz={g > 0.05 ? "#FFE3B0" : C.kLuz} glow={g} />;
    })}
  </AbsoluteFill>
);

