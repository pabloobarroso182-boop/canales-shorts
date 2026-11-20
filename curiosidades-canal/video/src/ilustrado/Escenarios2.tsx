import React from "react";
import { interpolate, random } from "remotion";
import { P } from "./paleta";

// Escenarios y personajes adicionales del kit ilustrado (sin contorno, sombreado suave).

export const Sabana: React.FC<{ frame: number }> = ({ frame }) => (
  <g>
    <defs>
      <linearGradient id="cieloSabana" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#F59E5B" />
        <stop offset="0.55" stopColor="#F8C978" />
        <stop offset="1" stopColor="#F3D9A4" />
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="1080" height="1920" fill="url(#cieloSabana)" />
    <circle cx="760" cy="520" r="150" fill="#FFE7A8" opacity="0.9" />
    <circle cx="760" cy="520" r="230" fill="#FFE7A8" opacity="0.2" />
    {/* colinas lejanas */}
    <path d="M0 1150 Q260 1040 520 1120 T1080 1090 V1920 H0 Z" fill="#D9A766" />
    <path d="M0 1260 Q300 1180 620 1250 T1080 1230 V1920 H0 Z" fill="#C98F52" />
    {/* acacia */}
    <g transform="translate(180 1200)">
      <path d="M-10 0 L-4 -260 L6 -260 L14 0 Z" fill="#5A3B26" />
      <path d="M0 -240 L-70 -320 M4 -250 L80 -330" stroke="#5A3B26" strokeWidth="14" strokeLinecap="round" />
      <ellipse cx="0" cy="-340" rx="210" ry="48" fill="#4E6B3A" />
      <ellipse cx="-40" cy="-372" rx="140" ry="32" fill="#5E7E45" />
    </g>
    {/* suelo de arena */}
    <path d="M0 1360 Q540 1320 1080 1360 V1920 H0 Z" fill="#E2B877" />
    {Array.from({ length: 40 }).map((_, i) => (
      <circle key={i} cx={random(`ar${i}`) * 1080} cy={1380 + random(`ay${i}`) * 520} r={2 + random(`as${i}`) * 3} fill="#C4955A" opacity="0.6" />
    ))}
    {/* calima */}
    <rect x="0" y="0" width="1080" height="1920" fill="#FFD9A0" opacity={0.08 + 0.04 * Math.sin(frame / 30)} />
  </g>
);

// Hoyo-nido con huevos (en el suelo de la sabana).
export const Nido: React.FC<{ x: number; y: number; frame: number; girando?: boolean }> = ({ x, y, frame, girando }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx="0" cy="0" rx="230" ry="60" fill="#A8743F" />
    <ellipse cx="0" cy="-6" rx="200" ry="44" fill="#7E5530" />
    {[-90, -30, 30, 90].map((dx, i) => (
      <g key={i} transform={`translate(${dx} -14) rotate(${girando ? Math.sin(frame / 6 + i) * 25 : 0})`}>
        <ellipse cx="0" cy="0" rx="34" ry="26" fill="#F6EEDC" />
        <ellipse cx="-8" cy="-8" rx="10" ry="6" fill="#fff" opacity="0.7" />
      </g>
    ))}
  </g>
);

// Avestruz estilizado. Poses: de_pie, cabeza_en_hoyo, tumbado.
export const Avestruz: React.FC<{ x: number; y: number; escala?: number; pose?: "de_pie" | "cabeza_en_hoyo" | "tumbado"; frame: number }> = ({
  x, y, escala = 1, pose = "de_pie", frame,
}) => {
  const res = Math.sin(frame / 14) * 4;
  const pata = "#E8A27C";
  const cuello = "#EFB08E";
  if (pose === "tumbado") {
    return (
      <g transform={`translate(${x} ${y}) scale(${escala})`}>
        <ellipse cx="0" cy="-70" rx="190" ry="90" fill="#2B2420" />
        <path d="M150 -110 Q220 -150 250 -90 Q210 -100 170 -70 Z" fill="#F4F0E8" />
        <path d="M-150 -60 Q-260 -40 -420 -20" stroke={cuello} strokeWidth="34" strokeLinecap="round" fill="none" />
        <ellipse cx="-440" cy="-22" rx="40" ry="26" fill={cuello} />
        <circle cx="-450" cy="-30" r="5" fill="#1A1A1A" />
        <path d="M-478 -18 L-506 -12 L-478 -8 Z" fill="#D58A4E" />
      </g>
    );
  }
  const abajo = pose === "cabeza_en_hoyo";
  return (
    <g transform={`translate(${x} ${y}) scale(${escala})`}>
      {/* patas */}
      <path d="M-40 -400 L-60 -200 L-50 0" stroke={pata} strokeWidth="22" fill="none" strokeLinecap="round" />
      <path d="M30 -400 L50 -210 L36 0" stroke={pata} strokeWidth="22" fill="none" strokeLinecap="round" />
      <path d="M-50 0 L-100 6 M36 0 L84 6" stroke={pata} strokeWidth="16" strokeLinecap="round" />
      {/* cuerpo */}
      <g transform={`translate(0 ${res})`}>
        <ellipse cx="0" cy="-470" rx="200" ry="130" fill="#2B2420" />
        <ellipse cx="40" cy="-430" rx="150" ry="80" fill="#3A302A" />
        <path d="M170 -520 Q260 -580 290 -480 Q240 -500 190 -450 Z" fill="#F4F0E8" />
        <path d="M-120 -520 Q-60 -560 20 -540" stroke="#4A3E36" strokeWidth="10" fill="none" opacity="0.6" />
      </g>
      {/* cuello y cabeza */}
      {abajo ? (
        <g>
          <path d="M-170 -480 Q-300 -420 -300 -60" stroke={cuello} strokeWidth="36" strokeLinecap="round" fill="none" />
        </g>
      ) : (
        <g transform={`rotate(${Math.sin(frame / 20) * 3} -170 -480)`}>
          <path d="M-170 -480 Q-230 -700 -190 -880" stroke={cuello} strokeWidth="36" strokeLinecap="round" fill="none" />
          <ellipse cx="-200" cy="-905" rx="46" ry="34" fill={cuello} />
          <circle cx="-212" cy="-915" r="9" fill="#1A1A1A" />
          <circle cx="-215" cy="-918" r="3" fill="#fff" />
          <path d="M-240 -900 L-286 -892 L-240 -884 Z" fill="#D58A4E" />
          <path d="M-215 -936 Q-200 -956 -180 -940" stroke="#2B2420" strokeWidth="8" fill="none" strokeLinecap="round" />
        </g>
      )}
    </g>
  );
};

// Sala de control nocturna con pantallas; `alarma` hace parpadear en rojo.
export const SalaControl: React.FC<{ frame: number; alarma?: boolean }> = ({ frame, alarma }) => {
  const parpadeo = alarma ? (Math.floor(frame / 6) % 2 === 0 ? 1 : 0.25) : 0;
  return (
    <g>
      <rect x="0" y="0" width="1080" height="1920" fill="#1C2140" />
      {Array.from({ length: 3 }).map((_, f) =>
        Array.from({ length: 3 }).map((__, c) => {
          const x = 80 + c * 320, y = 260 + f * 250;
          const roja = alarma && random(`al${f}${c}`) > 0.35;
          return (
            <g key={`${f}-${c}`}>
              <rect x={x} y={y} width="280" height="200" rx="12" fill="#0E1230" />
              <rect x={x + 14} y={y + 14} width="252" height="172" rx="6" fill={roja ? "#5A1020" : "#10324A"} />
              {Array.from({ length: 5 }).map((_, k) => (
                <rect key={k} x={x + 30} y={y + 34 + k * 28} width={60 + random(`l${f}${c}${k}${Math.floor(frame / 8)}`) * 170} height="10" rx="5"
                  fill={roja ? "#FF5A6E" : P.cian} opacity={roja ? 0.5 + 0.5 * parpadeo : 0.7} />
              ))}
            </g>
          );
        }),
      )}
      {/* consola */}
      <path d="M0 1120 L1080 1120 L1080 1300 L0 1300 Z" fill="#2C3360" />
      <path d="M0 1120 L1080 1120 L1040 1160 L40 1160 Z" fill="#3A4278" />
      {Array.from({ length: 14 }).map((_, i) => (
        <circle key={i} cx={70 + i * 70} cy="1220" r="12" fill={alarma && i % 3 === 0 ? (parpadeo > 0.5 ? "#FF4D5E" : "#5A1020") : i % 2 ? P.menta : P.chispa} />
      ))}
      <rect x="0" y="1300" width="1080" height="620" fill="#141833" />
      {alarma && <rect x="0" y="0" width="1080" height="1920" fill="#FF2040" opacity={0.12 * parpadeo} />}
    </g>
  );
};

// Lanzamiento: cohete despegando con humo; `rayos` = instantes (en fotogramas) de los relámpagos.
export const Lanzamiento: React.FC<{ frame: number; rayos?: number[] }> = ({ frame, rayos = [] }) => {
  const subida = interpolate(frame, [0, 240], [0, 260], { extrapolateRight: "clamp" });
  const flash = rayos.reduce((m, r) => Math.max(m, interpolate(frame, [r, r + 2, r + 10], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })), 0);
  return (
    <g>
      <defs>
        <linearGradient id="cieloTormenta" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1A1F3A" />
          <stop offset="1" stopColor="#4A5378" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="1080" height="1920" fill="url(#cieloTormenta)" />
      {/* nubes de tormenta */}
      {Array.from({ length: 7 }).map((_, i) => (
        <ellipse key={i} cx={i * 170 + 30 + Math.sin(frame / 50 + i) * 20} cy={220 + (i % 2) * 70} rx="200" ry="90" fill="#2A3052" />
      ))}
      {/* lluvia */}
      {Array.from({ length: 50 }).map((_, i) => {
        const yy = (random(`ry${i}`) * 1920 + frame * 28) % 1920;
        const xx = random(`rx${i}`) * 1080;
        return <path key={i} d={`M${xx} ${yy} l-8 40`} stroke="#9AA8D8" strokeWidth="3" opacity="0.4" />;
      })}
      {/* cohete */}
      <g transform={`translate(540 ${1180 - subida})`}>
        <ellipse cx="0" cy="420" rx={140 + Math.sin(frame) * 10} ry="70" fill="#FFB347" opacity="0.9" />
        <ellipse cx="0" cy="370" rx="70" ry="110" fill="#FFE29A" />
        <rect x="-60" y="-420" width="120" height="760" rx="20" fill="#EDEFF5" />
        <rect x="10" y="-420" width="50" height="760" rx="20" fill="#C9CEDD" />
        <path d="M-60 -420 Q0 -560 60 -420 Z" fill="#EDEFF5" />
        <rect x="-60" y="-120" width="120" height="40" fill="#1C1C28" />
        <rect x="-60" y="140" width="120" height="30" fill="#1C1C28" />
        <path d="M-60 260 L-130 360 L-60 340 Z M60 260 L130 360 L60 340 Z" fill="#B23A48" />
      </g>
      {/* humo */}
      {Array.from({ length: 12 }).map((_, i) => (
        <circle key={i} cx={540 + (i - 6) * 70 + Math.sin(frame / 10 + i) * 10} cy={1640 + (i % 3) * 30} r={90 + (i % 4) * 20} fill="#D8DCE8" opacity="0.85" />
      ))}
      {/* relámpago */}
      {flash > 0 && (
        <g opacity={flash}>
          <rect x="0" y="0" width="1080" height="1920" fill="#EAF2FF" opacity="0.35" />
          <path d={`M720 120 L640 420 L700 420 L590 ${760 - subida * 0.4} L660 ${740 - subida * 0.4} L560 ${980 - subida}`} stroke="#FFFBD0" strokeWidth="16" fill="none" strokeLinejoin="round" />
        </g>
      )}
    </g>
  );
};

// Superficie lunar con módulo de aterrizaje y una sonda cercana.
export const Luna: React.FC<{ frame: number }> = ({ frame }) => {
  const bajada = interpolate(frame, [0, 60], [-260, 0], { extrapolateRight: "clamp" });
  return (
    <g>
      <rect x="0" y="0" width="1080" height="1920" fill="#05071A" />
      {Array.from({ length: 60 }).map((_, i) => (
        <circle key={i} cx={random(`lx${i}`) * 1080} cy={random(`ly${i}`) * 1100} r={1 + random(`lr${i}`) * 2.5} fill="#fff" opacity={0.5 + 0.5 * Math.abs(Math.sin(frame / 20 + i))} />
      ))}
      <circle cx="860" cy="300" r="90" fill="#3E7BFA" />
      <path d="M800 260 Q840 240 870 280 Q900 320 880 360" fill="#3CCB9E" />
      <path d="M0 1200 Q300 1150 600 1190 T1080 1170 V1920 H0 Z" fill="#9A9CAE" />
      <path d="M0 1300 Q400 1260 1080 1290 V1920 H0 Z" fill="#B7B9C9" />
      {[[200, 1420, 70], [760, 1520, 50], [520, 1700, 90], [900, 1360, 30]].map(([cx, cy, r], i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={r} ry={r * 0.32} fill="#8E90A2" />
      ))}
      {/* sonda (Surveyor) */}
      <g transform="translate(820 1300)">
        <path d="M-50 0 L0 -90 L50 0 M0 -90 L0 -150" stroke="#D9DCE6" strokeWidth="8" fill="none" />
        <rect x="-30" y="-120" width="60" height="40" fill="#C9A24A" />
        <rect x="10" y="-180" width="70" height="40" fill="#3E5B9A" transform="rotate(-20 10 -180)" />
      </g>
      {/* módulo lunar */}
      <g transform={`translate(400 ${1320 + bajada})`}>
        <path d="M-140 0 L-90 -110 M140 0 L90 -110 M-60 0 L-50 -100 M60 0 L50 -100" stroke="#C9CEDD" strokeWidth="10" />
        <rect x="-110" y="-200" width="220" height="110" fill="#D8B24A" />
        <path d="M-80 -200 L-60 -320 L60 -320 L80 -200 Z" fill="#DADDE6" />
        <rect x="-30" y="-290" width="60" height="44" rx="8" fill="#20263F" />
        {bajada < -5 && <ellipse cx="0" cy="-60" rx="40" ry="80" fill="#FFE29A" opacity="0.7" />}
      </g>
    </g>
  );
};
