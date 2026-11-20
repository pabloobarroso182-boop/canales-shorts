import React from "react";
import { Audio, Video } from "@remotion/media";
import { AbsoluteFill, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CosmicBackground } from "./Background";
import { EscenaIlustrada } from "../ilustrado/EscenaIlustrada";
import { SceneCard } from "./SceneCard";
import { Captions } from "./Captions";
import { BRAND, HANDLE, ShortProps, firmaStyle } from "./types";
import { bodyFont, titleFont } from "./fonts";

export const Short: React.FC<ShortProps> = ({ audio, scenes, captions, estilo }) => {
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.noche }}>
      {scenes.map((scene, i) => {
        const from = Math.round((scene.startMs / 1000) * fps);
        const to = i + 1 < scenes.length ? Math.round((scenes[i + 1].startMs / 1000) * fps) : durationInFrames;
        const dur = Math.max(1, to - from);
        return (
          <Sequence key={i} from={from} durationInFrames={dur} name={`Escena ${i + 1}: ${scene.big}`}>
            {scene.ilustracion && scene.kind !== "cta" ? (
              <EscenaIlustrada il={scene.ilustracion} durationInFrames={dur} />
            ) : scene.clip ? (
              <AbsoluteFill>
                <Video src={staticFile(scene.clip)} objectFit="cover" muted style={{ width: "100%", height: "100%" }} />
                <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(10,14,39,.35), rgba(10,14,39,.15) 40%, rgba(10,14,39,.75))" }} />
              </AbsoluteFill>
            ) : (
              <CosmicBackground accent={scene.accent ?? BRAND.violeta} />
            )}
            {scene.kind === "cta" ? <Cta /> : scene.ilustracion ? null : <SceneCard scene={scene} durationInFrames={dur} />}
          </Sequence>
        );
      })}
      <Captions captions={captions} modo={estilo === "ilustrado" ? "palabra" : "frase"} />
      <Header />
      <Audio src={staticFile(audio)} />
    </AbsoluteFill>
  );
};

// Marca del canal arriba + barra de progreso.
const Header: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = frame / Math.max(1, durationInFrames - 1);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 0, left: 0, height: 12, width: `${p * 100}%`, background: `linear-gradient(90deg, ${BRAND.chispa}, ${BRAND.coral})` }} />
      {/* Sin marca de agua grande (decisión del propietario, 19/11/2026): solo una firma discreta con el identificador. */}
      <div style={firmaStyle}>{HANDLE}</div>
    </AbsoluteFill>
  );
};

// Cierre: logo + llamada a seguir el canal.
const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 12 } });
  const rot = Math.sin(frame / 12) * 6;
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <Img
        src={staticFile("brand/perfil-800x800.png")}
        style={{ position: "absolute", top: 330, width: 460, height: 460, borderRadius: "50%", transform: `scale(${s}) rotate(${rot}deg)`, boxShadow: `0 30px 120px ${BRAND.violeta}aa` }}
      />
      <div
        style={{
          position: "absolute",
          top: 880,
          fontFamily: titleFont,
          fontSize: 92,
          color: BRAND.blanco,
          textAlign: "center",
          lineHeight: 1,
          WebkitTextStroke: `4px ${BRAND.noche}`,
          paintOrder: "stroke fill",
          opacity: interpolate(frame, [4, 14], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        ¡SÍGUENOS!
        <div style={{ marginTop: 22, display: "inline-block", fontFamily: bodyFont, fontWeight: 900, fontSize: 46, background: BRAND.chispa, color: BRAND.noche, borderRadius: 999, padding: "12px 36px", WebkitTextStroke: "0" }}>
          Una curiosidad nueva cada día
        </div>
      </div>
    </AbsoluteFill>
  );
};
