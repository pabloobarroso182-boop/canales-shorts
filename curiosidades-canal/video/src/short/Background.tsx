import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { BRAND } from "./types";

// Fondo cósmico con suelo en perspectiva 3D que avanza y estrellas en parallax.
export const CosmicBackground: React.FC<{ accent: string }> = ({ accent }) => {
  const frame = useCurrentFrame();
  const stars = React.useMemo(
    () =>
      Array.from({ length: 90 }).map((_, i) => ({
        x: random(`x${i}`) * 1080,
        y: random(`y${i}`) * 1250,
        r: 1 + random(`r${i}`) * 3,
        depth: 0.2 + random(`d${i}`) * 0.8,
        tw: random(`t${i}`) * Math.PI * 2,
      })),
    [],
  );
  const gridOffset = (frame * 6) % 120;

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.noche, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(900px 900px at 50% 30%, ${accent}55, transparent 65%),
                       radial-gradient(700px 600px at 15% 85%, ${BRAND.violeta}55, transparent 60%),
                       radial-gradient(600px 600px at 90% 75%, ${BRAND.coral}33, transparent 60%)`,
        }}
      />
      {stars.map((s, i) => {
        const y = (s.y + frame * s.depth * 1.6) % 1250;
        const op = 0.35 + 0.65 * Math.abs(Math.sin(frame / 20 + s.tw));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: s.x,
              top: y,
              width: s.r * 2,
              height: s.r * 2,
              borderRadius: "50%",
              background: "#fff",
              opacity: op * s.depth,
            }}
          />
        );
      })}
      {/* Suelo 3D */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 820, perspective: 700, overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            left: "-60%",
            width: "220%",
            height: 1800,
            bottom: -700,
            transform: "rotateX(72deg)",
            transformOrigin: "50% 100%",
            backgroundImage: `linear-gradient(${accent} 4px, transparent 4px), linear-gradient(90deg, ${accent} 4px, transparent 4px)`,
            backgroundSize: "120px 120px",
            backgroundPosition: `0px ${gridOffset}px`,
            maskImage: "linear-gradient(to top, rgba(0,0,0,.9) 15%, transparent 92%)",
            WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,.9) 15%, transparent 92%)",
          }}
        />
      </div>
      {/* horizonte */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1080,
          height: 6,
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          opacity: interpolate(Math.sin(frame / 15), [-1, 1], [0.4, 0.9]),
          filter: "blur(2px)",
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(closest-side, transparent 60%, rgba(0,0,0,.55))" }} />
    </AbsoluteFill>
  );
};
