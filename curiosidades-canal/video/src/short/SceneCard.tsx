import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Icon } from "./Icons";
import { BRAND, Scene } from "./types";
import { titleFont, bodyFont } from "./fonts";

// Tarjeta 3D: orbe con icono que gira en perspectiva + dato grande + texto de apoyo.
export const SceneCard: React.FC<{ scene: Scene; durationInFrames: number }> = ({ scene, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const accent = scene.accent ?? BRAND.chispa;

  const enter = spring({ frame, fps, config: { damping: 14, mass: 0.8 } });
  const exit = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rotY = interpolate(enter, [0, 1], [-90, 0]) + Math.sin(frame / 18) * 14;
  const rotX = Math.cos(frame / 24) * 8;
  const floatY = Math.sin(frame / 14) * 14;
  const bigIn = spring({ frame: frame - 6, fps, config: { damping: 11 } });
  const smallIn = spring({ frame: frame - 12, fps, config: { damping: 16 } });
  const isHook = scene.kind === "hook";

  return (
    <AbsoluteFill style={{ alignItems: "center", opacity: exit }}>
      <div style={{ position: "absolute", top: 300, width: 1080, display: "flex", justifyContent: "center", perspective: 1400 }}>
        <div
          style={{
            width: 440,
            height: 440,
            transform: `translateY(${floatY}px) rotateY(${rotY}deg) rotateX(${rotX}deg) scale(${interpolate(enter, [0, 1], [0.4, 1])})`,
            transformStyle: "preserve-3d",
            borderRadius: "50%",
            background: `radial-gradient(circle at 35% 30%, #ffffff40, transparent 40%), linear-gradient(140deg, ${BRAND.coral}, ${BRAND.violeta} 55%, ${BRAND.cian})`,
            boxShadow: `0 40px 120px ${accent}66, inset 0 -30px 60px rgba(10,14,39,.45), inset 0 20px 40px rgba(255,255,255,.25)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "6px solid rgba(255,255,255,.35)",
          }}
        >
          <div style={{ transform: "translateZ(60px)", filter: "drop-shadow(0 12px 18px rgba(10,14,39,.6))" }}>
            <Icon name={scene.icon} size={250} color={BRAND.blanco} />
          </div>
        </div>
      </div>
      {/* sombra en el suelo */}
      <div style={{ position: "absolute", top: 820, width: 360, height: 50, borderRadius: "50%", background: "rgba(0,0,0,.45)", filter: "blur(18px)", transform: `scale(${1 - floatY / 120})` }} />

      <div style={{ position: "absolute", top: 870, width: 980, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
        <div
          style={{
            textAlign: "center",
            fontFamily: titleFont,
            fontSize: scene.big.length > 9 ? 112 : 150,
            lineHeight: 1,
            color: isHook ? BRAND.chispa : BRAND.blanco,
            transform: `scale(${interpolate(bigIn, [0, 1], [0.6, 1])})`,
            opacity: bigIn,
            textShadow: `0 8px 0 ${BRAND.noche}, 0 0 ${40 + 60 * countFlash(frame)}px ${accent}${countFlash(frame) > 0.05 ? "ff" : "88"}`,
            WebkitTextStroke: `4px ${BRAND.noche}`,
            paintOrder: "stroke fill",
          }}
        >
          {countUp(scene.big, frame)}
        </div>
        {scene.small ? (
          <div
            style={{
              padding: "12px 34px",
              borderRadius: 999,
              background: accent,
              color: BRAND.noche,
              fontFamily: bodyFont,
              fontWeight: 900,
              fontSize: 44,
              opacity: smallIn,
              transform: `translateY(${interpolate(smallIn, [0, 1], [30, 0])}px)`,
              maxWidth: 900,
              textAlign: "center",
            }}
          >
            {scene.small}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// ── Cifras vivas: los números del dato suben hasta su valor y terminan con un destello.
const COUNT_START = 4; // fotograma en que empieza a contar
const COUNT_FRAMES = 18; // ~0,6 s a 30 fps

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export const countFlash = (frame: number) =>
  interpolate(frame, [COUNT_START + COUNT_FRAMES, COUNT_START + COUNT_FRAMES + 4, COUNT_START + COUNT_FRAMES + 14], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// Formato español: 1.181 (miles con punto) y 0,45 (decimales con coma).
export const countUp = (text: string, frame: number): string => {
  const t = easeOut(Math.min(1, Math.max(0, (frame - COUNT_START) / COUNT_FRAMES)));
  return text.replace(/\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+(?:,\d+)?/g, (m) => {
    const decimals = m.includes(",") ? m.split(",")[1].length : 0;
    const value = parseFloat(m.replace(/\./g, "").replace(",", "."));
    // años (p. ej. 1969): cuentan solo los últimos 50 para no parecer un contador desde 0
    const isYear = !decimals && !m.includes(".") && value >= 1000 && value <= 2100;
    const from = isYear ? value - 50 : 0;
    const v = from + (value - from) * t;
    const fixed = v.toFixed(decimals);
    const [int, dec] = fixed.split(".");
    const intFmt = !isYear && int.length > 3 ? int.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : int;
    return dec ? `${intFmt},${dec}` : intFmt;
  });
};
