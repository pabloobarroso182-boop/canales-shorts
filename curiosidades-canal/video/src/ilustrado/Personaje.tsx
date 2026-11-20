import React from "react";
import { P, PANTALON, PELOS, PIELES, ROPA } from "./paleta";

export type Pose = "de_pie" | "sentado" | "tumbado" | "brazos_arriba";

export type Look = {
  piel: string;
  pelo: string;
  camiseta: string;
  pantalon: string;
  peinado?: "corto" | "coleta" | "rizado" | "largo";
};

const OUT = { stroke: P.contorno, strokeWidth: 6, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

// Personaje plano, cabeza redonda y proporciones "rechonchas" (estilo propio del canal).
// Coordenadas locales: (0,0) = entre los pies; altura ≈ 560 unidades a escala 1.
export const PersonajeRedondo: React.FC<{
  look: Look;
  pose?: Pose;
  frame?: number;
  ojos?: "abiertos" | "cerrados" | "sorpresa";
  boca?: "sonrisa" | "neutra" | "o";
}> = ({ look, pose = "de_pie", frame = 0, ojos = "abiertos", boca = "sonrisa" }) => {
  const respira = Math.sin(frame / 14) * 4;
  const parpadeo = ojos === "abiertos" && frame % 110 > 104;
  const ojosEf = parpadeo ? "cerrados" : ojos;

  const cabeza = (
    <g transform={`translate(0 ${-470 + respira})`}>
      {/* pelo trasero */}
      {look.peinado === "largo" && <path d="M-92 -10 C-100 90 -70 130 -40 120 L40 120 C70 130 100 90 92 -10 Z" fill={look.pelo} {...OUT} />}
      {look.peinado === "coleta" && <ellipse cx="96" cy="10" rx="34" ry="52" fill={look.pelo} {...OUT} />}
      <circle cx="0" cy="0" r="92" fill={look.piel} {...OUT} />
      {/* pelo */}
      {look.peinado === "rizado" ? (
        <g fill={look.pelo} {...OUT}>
          {[-70, -35, 0, 35, 70].map((x) => <circle key={x} cx={x} cy={-62 + Math.abs(x) / 3} r="36" />)}
        </g>
      ) : (
        <path d="M-94 6 C-100 -80 -40 -112 8 -106 C70 -100 104 -60 94 4 C70 -30 30 -44 -10 -46 C-50 -44 -76 -24 -94 6 Z" fill={look.pelo} {...OUT} />
      )}
      {/* cara */}
      {ojosEf === "cerrados" ? (
        <g fill="none" stroke={P.contorno} strokeWidth="6" strokeLinecap="round">
          <path d="M-46 18 Q-34 28 -22 18" />
          <path d="M22 18 Q34 28 46 18" />
        </g>
      ) : (
        <g fill={P.contorno}>
          <ellipse cx="-34" cy="14" rx={ojosEf === "sorpresa" ? 10 : 8} ry={ojosEf === "sorpresa" ? 14 : 11} />
          <ellipse cx="34" cy="14" rx={ojosEf === "sorpresa" ? 10 : 8} ry={ojosEf === "sorpresa" ? 14 : 11} />
        </g>
      )}
      <circle cx="-52" cy="40" r="12" fill={P.coral} opacity="0.35" />
      <circle cx="52" cy="40" r="12" fill={P.coral} opacity="0.35" />
      {boca === "o" ? (
        <ellipse cx="0" cy="54" rx="11" ry="14" fill={P.contorno} />
      ) : boca === "neutra" ? (
        <path d="M-14 54 H14" stroke={P.contorno} strokeWidth="6" strokeLinecap="round" />
      ) : (
        <path d="M-20 48 Q0 66 20 48" fill="none" stroke={P.contorno} strokeWidth="6" strokeLinecap="round" />
      )}
    </g>
  );

  const torso = (
    <g transform={`translate(0 ${respira * 0.6})`}>
      <rect x="-26" y="-392" width="52" height="40" fill={look.piel} {...OUT} />
      <path d="M-104 -360 Q-110 -380 -70 -386 L70 -386 Q110 -380 104 -360 L96 -200 L-96 -200 Z" fill={look.camiseta} {...OUT} />
      <path d="M-60 -370 Q0 -330 60 -370" fill="none" stroke={P.contorno} strokeWidth="5" opacity="0.35" />
    </g>
  );

  const brazo = (lado: 1 | -1, arriba = false) => (
    <g transform={`translate(${lado * 104} -370) rotate(${arriba ? lado * -150 : lado * 10 + Math.sin(frame / 20) * 2})`}>
      <rect x="-22" y="0" width="44" height="170" rx="22" fill={look.camiseta} {...OUT} />
      <circle cx="0" cy="186" r="24" fill={look.piel} {...OUT} />
    </g>
  );

  const piernasDePie = (
    <g>
      <rect x="-82" y="-212" width="72" height="200" rx="30" fill={look.pantalon} {...OUT} />
      <rect x="10" y="-212" width="72" height="200" rx="30" fill={look.pantalon} {...OUT} />
      <ellipse cx="-50" cy="-8" rx="46" ry="20" fill={P.contorno} />
      <ellipse cx="50" cy="-8" rx="46" ry="20" fill={P.contorno} />
    </g>
  );

  const piernasSentado = (
    <g>
      <rect x="-90" y="-216" width="190" height="72" rx="32" fill={look.pantalon} {...OUT} />
      <rect x="40" y="-180" width="70" height="170" rx="30" fill={look.pantalon} {...OUT} />
      <ellipse cx="86" cy="-8" rx="46" ry="20" fill={P.contorno} />
    </g>
  );

  if (pose === "tumbado") {
    return (
      <g transform="rotate(-90) translate(0 0)">
        {piernasDePie}
        {torso}
        {brazo(1)}
        {brazo(-1)}
        {cabeza}
      </g>
    );
  }
  return (
    <g>
      {pose === "sentado" ? piernasSentado : piernasDePie}
      {brazo(-1, pose === "brazos_arriba")}
      {torso}
      {brazo(1, pose === "brazos_arriba")}
      {cabeza}
    </g>
  );
};

// Variedad determinista de looks a partir de un número (para multitudes).
export const lookN = (n: number): Look => ({
  piel: PIELES[(n * 7 + 3) % PIELES.length],
  pelo: PELOS[(n * 5 + 1) % PELOS.length],
  camiseta: ROPA[(n * 3 + 2) % ROPA.length],
  pantalon: PANTALON[(n * 11 + 4) % PANTALON.length],
  peinado: (["corto", "coleta", "rizado", "largo"] as const)[(n * 13 + 2) % 4],
});

export const PROTA: Look = { piel: "#F1C7A5", pelo: "#3A2418", camiseta: P.chispa, pantalon: "#2D3A8C", peinado: "corto" };

// ── Personaje estilizado (predeterminado): cabeza pequeña, cuerpo esbelto, sin contorno,
// sombreado suave con luz desde la izquierda. Altura ≈ 760 unidades a escala 1.
const oscurece = (hex: string, f = 0.78) => {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * f), g = Math.round(((n >> 8) & 255) * f), b = Math.round((n & 255) * f);
  return `rgb(${r},${g},${b})`;
};

export const Personaje: React.FC<{
  look: Look;
  pose?: Pose;
  frame?: number;
  ojos?: "abiertos" | "cerrados" | "sorpresa";
  boca?: "sonrisa" | "neutra" | "o";
}> = ({ look, pose = "de_pie", frame = 0, ojos = "abiertos", boca = "neutra" }) => {
  const respira = Math.sin(frame / 16) * 3;
  const parpadeo = ojos === "abiertos" && frame % 120 > 114;
  const ojosEf = parpadeo ? "cerrados" : ojos;
  const pielS = oscurece(look.piel, 0.85);

  const cabeza = (
    <g transform={`translate(0 ${-690 + respira})`}>
      {look.peinado === "largo" && <path d="M-66 -10 C-74 70 -60 120 -30 128 L30 128 C60 120 74 70 66 -10 Z" fill={oscurece(look.pelo, 0.9)} />}
      {look.peinado === "coleta" && <path d="M48 -30 C110 -20 118 40 96 90 C86 50 70 20 48 10 Z" fill={look.pelo} />}
      <rect x="-16" y="40" width="32" height="56" fill={pielS} />
      <ellipse cx="0" cy="0" rx="58" ry="66" fill={look.piel} />
      <path d="M8 -64 A58 66 0 0 1 8 64 A70 66 0 0 0 8 -64 Z" fill={pielS} opacity="0.6" />
      {look.peinado === "rizado" ? (
        <g fill={look.pelo}>{[-40, -14, 14, 40].map((x) => <circle key={x} cx={x} cy={-50 + Math.abs(x) / 4} r="28" />)}</g>
      ) : (
        <path d="M-60 4 C-66 -58 -28 -80 6 -76 C46 -72 66 -44 60 0 C44 -24 18 -36 -8 -36 C-32 -34 -48 -20 -60 4 Z" fill={look.pelo} />
      )}
      {ojosEf === "cerrados" ? (
        <g fill="none" stroke="#2A1E1A" strokeWidth="4.5" strokeLinecap="round">
          <path d="M-30 10 Q-22 16 -14 10" />
          <path d="M14 10 Q22 16 30 10" />
        </g>
      ) : (
        <g fill="#2A1E1A">
          <ellipse cx="-22" cy="8" rx={ojosEf === "sorpresa" ? 6 : 5} ry={ojosEf === "sorpresa" ? 9 : 6} />
          <ellipse cx="22" cy="8" rx={ojosEf === "sorpresa" ? 6 : 5} ry={ojosEf === "sorpresa" ? 9 : 6} />
        </g>
      )}
      <path d="M0 14 L-4 28 L3 29" fill="none" stroke={oscurece(look.piel, 0.7)} strokeWidth="3.5" strokeLinecap="round" />
      {boca === "o" ? <ellipse cx="0" cy="42" rx="6" ry="8" fill="#5A2A2A" />
        : boca === "sonrisa" ? <path d="M-12 38 Q0 48 12 38" fill="none" stroke="#5A2A2A" strokeWidth="4" strokeLinecap="round" />
        : <path d="M-9 42 H9" stroke="#5A2A2A" strokeWidth="4" strokeLinecap="round" />}
    </g>
  );

  const torso = (
    <g transform={`translate(0 ${respira * 0.5})`}>
      <path d="M-78 -600 Q-92 -590 -90 -560 L-70 -340 L70 -340 L90 -560 Q92 -590 78 -600 Z" fill={look.camiseta} />
      <path d="M20 -600 L78 -600 Q92 -590 90 -560 L70 -340 L30 -340 Z" fill={oscurece(look.camiseta)} opacity="0.55" />
      <path d="M-26 -600 Q0 -580 26 -600" fill={pielS} />
    </g>
  );

  const brazo = (lado: 1 | -1, arriba = false) => (
    <g transform={`translate(${lado * 92} -585) rotate(${arriba ? lado * -160 : lado * 9 + Math.sin(frame / 22) * 1.5})`}>
      <path d="M-18 0 Q0 -10 18 0 L14 250 L-14 250 Z" fill={oscurece(look.camiseta, lado === 1 ? 0.72 : 0.88)} />
      <ellipse cx="0" cy="262" rx="15" ry="20" fill={lado === 1 ? pielS : look.piel} />
    </g>
  );

  const piernasDePie = (
    <g>
      <path d="M-62 -350 L-6 -350 L-14 -14 L-48 -14 Z" fill={look.pantalon} />
      <path d="M6 -350 L62 -350 L48 -14 L14 -14 Z" fill={oscurece(look.pantalon)} />
      <path d="M-56 -16 Q-30 -26 -8 -16 L-8 0 L-58 0 Z" fill="#2A2238" />
      <path d="M8 -16 Q30 -26 56 -16 L58 0 L8 0 Z" fill="#2A2238" />
    </g>
  );

  const piernasSentado = (
    <g>
      <path d="M-66 -360 L110 -360 L110 -300 L-66 -300 Z" fill={look.pantalon} />
      <path d="M70 -330 L118 -330 L108 -14 L76 -14 Z" fill={oscurece(look.pantalon)} />
      <path d="M70 -16 Q96 -26 120 -16 L122 0 L70 0 Z" fill="#2A2238" />
    </g>
  );

  if (pose === "tumbado") {
    return (
      <g transform="rotate(-90)">
        {piernasDePie}
        {brazo(-1)}
        {torso}
        {brazo(1)}
        {cabeza}
      </g>
    );
  }
  return (
    <g>
      <ellipse cx="0" cy="4" rx="110" ry="16" fill="#000" opacity="0.22" />
      <g transform={pose === "sentado" ? "translate(0 40)" : undefined}>
        {pose === "sentado" ? piernasSentado : piernasDePie}
        {brazo(-1, pose === "brazos_arriba")}
        {torso}
        {brazo(1, pose === "brazos_arriba")}
        {cabeza}
      </g>
    </g>
  );
};
