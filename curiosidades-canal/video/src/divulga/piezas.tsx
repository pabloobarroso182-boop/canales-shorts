// Piezas reutilizables del estilo «divulga» (copiadas del modelo de Bertha Benz para que todos los Shorts sean iguales).
import React from "react";
import { AbsoluteFill, Img, interpolate, random, spring, staticFile, useVideoConfig } from "remotion";
import { C } from "./comunes";
import { bodyFont, titleFont } from "../short/fonts";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Centro: React.FC<{ children: React.ReactNode; top?: number; style?: React.CSSProperties }> = ({ children, top, style }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center", ...style }}>{children}</div>
);

export const Rayos: React.FC<{ t: number; color: string; fuerza?: number }> = ({ t, color, fuerza = 1 }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: fuerza }}>
    <div
      style={{
        width: 1600,
        height: 1600,
        borderRadius: "50%",
        background: `repeating-conic-gradient(from ${t * 0.6}deg, ${color}33 0deg 8deg, transparent 8deg 22deg)`,
        maskImage: "radial-gradient(circle, black 15%, transparent 65%)",
        WebkitMaskImage: "radial-gradient(circle, black 15%, transparent 65%)",
      }}
    />
  </AbsoluteFill>
);

// Interrogaciones que suben (ganchos con pregunta)
export const Preguntas: React.FC<{ t: number; color: string }> = ({ t, color }) => (
  <AbsoluteFill>
    {new Array(7).fill(0).map((_, i) => {
      const y = 1500 - ((t * (2 + random(`q${i}`) * 2) + random(`qy${i}`) * 900) % 900);
      return (
        <div key={i} style={{ position: "absolute", left: 120 + random(`qx${i}`) * 820, top: y, fontFamily: titleFont, fontSize: 60 + random(`qs${i}`) * 50, color, opacity: 0.25 }}>
          ?
        </div>
      );
    })}
  </AbsoluteFill>
);

// Aparece con muelle y empuje lento de cámara
export const Entra: React.FC<{ t: number; dur: number; top: number; children: React.ReactNode; desde?: number; zoom?: [number, number]; giro?: number }> = ({ t, dur, top, children, desde = 0, zoom = [1, 1.12], giro = 0 }) => {
  const { fps } = useVideoConfig();
  const s = spring({ frame: t - desde, fps, config: { damping: 12 } });
  const push = interpolate(t, [0, Math.max(1, dur)], zoom);
  return (
    <Centro top={top} style={{ transform: `scale(${s * push}) rotate(${(1 - s) * giro}deg)` }}>
      {children}
    </Centro>
  );
};

export const Numero: React.FC<{ t: number; desde: number; texto: string; sub?: string; color?: string; top: number; size?: number }> = ({ t, desde, texto, sub, color = C.amarillo, top, size = 190 }) => {
  const { fps } = useVideoConfig();
  if (t < desde) return null;
  const s = spring({ frame: t - desde, fps, config: { damping: 10 } });
  return (
    <Centro top={top} style={{ transform: `scale(${s})`, flexDirection: "column", alignItems: "center" }}>
      <div style={{ fontFamily: titleFont, fontSize: size, color, textShadow: `0 0 50px ${color}88`, lineHeight: 1 }}>{texto}</div>
      {sub ? <div style={{ marginTop: 10, fontFamily: bodyFont, fontWeight: 900, fontSize: 48, color: "#fff" }}>{sub}</div> : null}
    </Centro>
  );
};

export const Flash: React.FC<{ t: number; desde?: number; color?: string }> = ({ t, desde = 0, color = "#fff" }) => (t < desde ? null :
  <AbsoluteFill style={{ background: color, opacity: interpolate(t, [desde, desde + 6], [0.7, 0], clamp) }} />
);

export const Tachon: React.FC<{ t: number; desde: number; size: number; color?: string }> = ({ t, desde, size, color = "#FF4D5E" }) => {
  const x = interpolate(t, [desde, desde + 12], [0, 1], clamp);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <path d="M10 10 L 90 90" stroke={color} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={`${x} 1`} style={{ filter: `drop-shadow(0 0 10px ${color})` }} />
      <path d="M90 10 L 10 90" stroke={color} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={`${Math.max(0, x * 2 - 1)} 1`} style={{ filter: `drop-shadow(0 0 10px ${color})` }} />
    </svg>
  );
};

// Tarjeta final del canal (la misma en todos los Shorts)
export const Cierre: React.FC<{ t: number; desde: number }> = ({ t, desde }) => {
  const { fps } = useVideoConfig();
  if (t < desde) return null;
  const logo = spring({ frame: t - desde, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ background: `rgba(5,8,23,${0.75 * logo})` }}>
      <Centro top={620} style={{ transform: `scale(${logo})`, flexDirection: "column", alignItems: "center" }}>
        <Img src={staticFile("brand/perfil-800x800.png")} style={{ width: 360, height: 360, borderRadius: "50%", boxShadow: "0 0 80px #7B5CFF" }} />
        <div style={{ marginTop: 26, fontFamily: titleFont, fontSize: 84, color: "#fff", textAlign: "center" }}>¡SÍGUENOS!</div>
        <div style={{ marginTop: 10, fontFamily: bodyFont, fontWeight: 900, fontSize: 40, color: C.amarillo, textAlign: "center" }}>Un dato curioso cada día</div>
      </Centro>
    </AbsoluteFill>
  );
};

// Fondo de escena con luz de color (sobre el azul noche común)
export const Luz: React.FC<{ color: string; x?: number; y?: number; fuerza?: number }> = ({ color, x = 50, y = 45, fuerza = 0.35 }) => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at ${x}% ${y}%, ${color}${Math.round(fuerza * 255).toString(16).padStart(2, "0")}, transparent 60%)` }} />
);
