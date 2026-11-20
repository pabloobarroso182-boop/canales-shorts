import React from "react";
import { AbsoluteFill, Audio, CalculateMetadataFunction, Composition, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Firma, Subtitulos } from "./kit";
import { ESCENAS } from "./medusa";
import { Banner, Perfil } from "./marca";

type Props = { id: string; durationMs: number; audio: string; escenas: { clave: string; startMs: number }[]; marcas: Record<string, number>; captions: { text: string; startMs: number; endMs: number }[] };

const Sala: React.FC<Props> = ({ audio, escenas, marcas, captions }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const fr = (ms: number) => Math.round((ms / 1000) * fps);
  return (
    <AbsoluteFill style={{ background: "#FFF6EA" }}>
      {escenas.map((e, i) => {
        const from = fr(e.startMs);
        const to = i + 1 < escenas.length ? fr(escenas[i + 1].startMs) : durationInFrames;
        const Esc = ESCENAS[e.clave];
        const t = f - from;
        // transición propia: entrada con zoom corto y ligero giro
        const z = interpolate(t, [0, 8], [1.12, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const op = interpolate(t, [0, 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <Sequence key={e.clave} from={from} durationInFrames={to - from}>
            <AbsoluteFill style={{ transform: `scale(${z}) rotate(${(1 - op) * 1.5}deg)`, opacity: i === 0 ? 1 : op }}>
              {Esc ? <Esc t={t} dur={to - from} mk={(k) => fr(marcas[k] ?? 0) - from} /> : null}
            </AbsoluteFill>
          </Sequence>
        );
      })}
      <Subtitulos captions={captions} />
      <Firma />
      {audio ? <Audio src={staticFile(audio)} /> : null}
    </AbsoluteFill>
  );
};

const calc: CalculateMetadataFunction<Props> = ({ props }) => ({ durationInFrames: Math.max(1, Math.ceil((props.durationMs / 1000) * 30)) });

export const RemotionRoot: React.FC = () => (
  <>
  <Composition id="Perfil" component={Perfil} fps={30} width={800} height={800} durationInFrames={1} />
  <Composition id="Banner" component={Banner} fps={30} width={2560} height={1440} durationInFrames={1} />
  <Composition id="Sala" component={Sala} fps={30} width={1080} height={1920} durationInFrames={90} calculateMetadata={calc}
    defaultProps={{ id: "demo", durationMs: 3000, audio: "", escenas: [{ clave: "m_gancho", startMs: 0 }], marcas: {}, captions: [] }} />
  </>
);
