import React from "react";
import { createTikTokStyleCaptions } from "@remotion/captions";
import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BRAND, ShortProps } from "./types";
import { bodyFont, titleFont } from "./fonts";

// Subtítulos por páginas cortas; la palabra que suena se resalta en amarillo.
export const Captions: React.FC<{ captions: ShortProps["captions"]; modo?: "frase" | "palabra" }> = ({ captions, modo = "frase" }) => {
  const { fps } = useVideoConfig();
  const pages = React.useMemo(() => {
    // Agrupa en frases cortas: corta tras puntuación o cada 3 palabras.
    const groups: ShortProps["captions"][] = [];
    let cur: ShortProps["captions"] = [];
    for (const c of captions) {
      cur.push(c);
      if (modo === "palabra" || /[.,;:!?…]$/.test(c.text.trim()) || cur.length >= 3) {
        groups.push(cur);
        cur = [];
      }
    }
    if (cur.length) groups.push(cur);
    return groups.flatMap(
      (g) => createTikTokStyleCaptions({ captions: g, combineTokensWithinMilliseconds: 100000 }).pages,
    );
  }, [captions]);

  return (
    <AbsoluteFill>
      {pages.map((page, i) => {
        const next = pages[i + 1];
        const from = Math.round((page.startMs / 1000) * fps);
        const endMs = next ? next.startMs : page.startMs + page.durationMs;
        const dur = Math.max(1, Math.round((endMs / 1000) * fps) - from);
        return (
          <Sequence key={i} from={from} durationInFrames={dur} name={`Subtítulo ${i + 1}`}>
            {modo === "palabra" ? <Palabra page={page} /> : <Page page={page} />}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const Page: React.FC<{ page: ReturnType<typeof createTikTokStyleCaptions>["pages"][number] }> = ({ page }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = page.startMs + (frame / fps) * 1000;
  const pop = spring({ frame, fps, config: { damping: 12, mass: 0.6 } });

  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div
        style={{
          position: "absolute",
          top: 1240,
          width: 900,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          columnGap: 30,
          fontFamily: titleFont,
          fontSize: 76,
          lineHeight: 1.15,
          textTransform: "uppercase",
          transform: `scale(${0.85 + 0.15 * pop})`,
        }}
      >
        {page.tokens.map((tok, j) => {
          const active = t >= tok.fromMs && t < tok.toMs;
          return (
            <span
              key={j}
              style={{
                color: active ? BRAND.chispa : BRAND.blanco,
                WebkitTextStroke: `10px ${BRAND.noche}`,
                paintOrder: "stroke fill",
                textShadow: `0 6px 0 ${BRAND.noche}`,
                display: "inline-block",
                transform: active ? "translateY(-4px)" : "none",
              }}
            >
              {tok.text.trim()}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Modo "palabra": una palabra cada vez, centrada, blanca con sombra; las cifras en amarillo.
const Palabra: React.FC<{ page: ReturnType<typeof createTikTokStyleCaptions>["pages"][number] }> = ({ page }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 10, mass: 0.5 } });
  const txt = page.tokens.map((t) => t.text).join("").trim();
  const numero = /\d/.test(txt) || /^(uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|cien|mil|doce|veinte|treinta|cuarenta|cincuenta)[,.]?$/i.test(txt);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div
        style={{
          position: "absolute",
          top: 1440,
          width: 1000,
          textAlign: "center",
          fontFamily: bodyFont,
          fontWeight: 900,
          fontSize: 104,
          color: numero ? BRAND.chispa : BRAND.blanco,
          textShadow: `0 6px 0 ${BRAND.noche}, 0 0 24px rgba(10,14,39,.85), 0 10px 30px rgba(0,0,0,.6)`,
          WebkitTextStroke: `3px ${BRAND.noche}`,
          paintOrder: "stroke fill",
          transform: `scale(${0.8 + 0.2 * pop})`,
        }}
      >
        {txt}
      </div>
    </AbsoluteFill>
  );
};
