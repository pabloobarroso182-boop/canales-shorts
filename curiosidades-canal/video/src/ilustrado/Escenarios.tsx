import React from "react";
import { random } from "remotion";
import { P } from "./paleta";

const OUT = { stroke: P.contorno, strokeWidth: 6, strokeLinejoin: "round" as const };

// Todos los escenarios se dibujan en un lienzo SVG de 1080x1920.

export const Habitacion: React.FC<{ noche?: boolean; frame: number; calendario?: string[]; medidor?: boolean }> = ({
  noche,
  frame,
  calendario,
  medidor,
}) => {
  const pared = noche ? P.paredNoche : P.paredDia;
  const sombra = noche ? P.paredNocheSombra : P.paredDiaSombra;
  return (
    <g>
      <rect x="0" y="0" width="1080" height="1920" fill={pared} />
      {/* papel pintado sutil */}
      {Array.from({ length: 14 }).map((_, i) => (
        <rect key={i} x={i * 80 + 20} y="0" width="34" height="1380" fill={sombra} opacity="0.35" />
      ))}
      {/* ventana */}
      <g transform="translate(600 260)">
        <rect x="0" y="0" width="380" height="460" rx="14" fill={noche ? P.cieloNoche1 : P.cieloDia1} {...OUT} />
        <rect x="0" y="230" width="380" height="230" fill={noche ? P.cieloNoche2 : P.cieloDia2} opacity="0.8" />
        {noche ? (
          <g>
            <circle cx="270" cy="120" r="54" fill="#FFF3C4" />
            <circle cx="292" cy="104" r="46" fill={P.cieloNoche1} />
            {Array.from({ length: 16 }).map((_, i) => (
              <circle key={i} cx={random(`ex${i}`) * 360 + 10} cy={random(`ey${i}`) * 420 + 20} r={2 + random(`er${i}`) * 3}
                fill="#fff" opacity={0.4 + 0.6 * Math.abs(Math.sin(frame / 18 + i))} />
            ))}
          </g>
        ) : (
          <g>
            <circle cx="290" cy="110" r="56" fill={P.chispa} />
            <ellipse cx={(frame * 0.6) % 520 - 80} cy="220" rx="70" ry="26" fill="#fff" opacity="0.9" />
          </g>
        )}
        <path d="M190 0 V460 M0 230 H380" stroke={P.madera} strokeWidth="18" />
        <rect x="0" y="0" width="380" height="460" rx="14" fill="none" {...OUT} strokeWidth="10" />
        {/* cortina */}
        <path d="M-40 -30 Q-10 220 -50 500 L40 500 Q70 240 50 -30 Z" fill={P.coral} {...OUT} />
      </g>
      {/* haz de luz cálida desde la ventana */}
      <defs>
        <linearGradient id="haz" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={noche ? "#BFD3FF" : "#FFD9A0"} stopOpacity={noche ? 0.18 : 0.42} />
          <stop offset="1" stopColor={noche ? "#BFD3FF" : "#FFD9A0"} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`M600 ${280 + Math.sin(frame / 40) * 6} L980 260 L700 1500 L-60 1500 Z`} fill="url(#haz)" />
      {/* motas de polvo en la luz */}
      {Array.from({ length: 22 }).map((_, i) => (
        <circle key={`m${i}`} cx={200 + random(`mx${i}`) * 700 + Math.sin(frame / 30 + i) * 20} cy={(400 + random(`my${i}`) * 900 + frame * 0.4) % 1300 + 200}
          r={2 + random(`mr${i}`) * 3} fill="#FFE9C2" opacity={noche ? 0.15 : 0.45} />
      ))}
      {/* calendario */}
      {calendario && calendario.length > 0 && <Calendario meses={calendario} frame={frame} />}
      {/* medidor de altura en la pared */}
      {medidor && (
        <g transform="translate(110 360)">
          <rect x="0" y="0" width="90" height="880" rx="10" fill="#FFF7E0" {...OUT} />
          {Array.from({ length: 23 }).map((_, i) => (
            <path key={i} d={`M0 ${20 + i * 38} H${i % 5 === 0 ? 50 : 28}`} stroke={P.contorno} strokeWidth="5" />
          ))}
        </g>
      )}
      {/* suelo */}
      <rect x="0" y="1380" width="1080" height="540" fill={noche ? P.sueloNoche : P.suelo} />
      {Array.from({ length: 7 }).map((_, i) => (
        <path key={i} d={`M0 ${1440 + i * 80} H1080`} stroke={P.contorno} strokeWidth="4" opacity="0.25" />
      ))}
      <path d="M0 1380 H1080" stroke={P.contorno} strokeWidth="10" />
      {noche && <rect x="0" y="0" width="1080" height="1920" fill="#0B0E2A" opacity="0.25" />}
    </g>
  );
};

export const Calendario: React.FC<{ meses: string[]; frame: number }> = ({ meses, frame }) => {
  const idx = Math.min(meses.length - 1, Math.floor(frame / 24));
  const flip = (frame % 24) / 24;
  return (
    <g transform="translate(650 790)">
      <rect x="0" y="0" width="300" height="300" rx="10" fill="#FFFDF7" {...OUT} />
      <rect x="0" y="0" width="300" height="70" rx="10" fill={P.coral} {...OUT} />
      <text x="150" y="50" textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize="34" fill="#fff">
        {meses[idx].toUpperCase()}
      </text>
      {Array.from({ length: 20 }).map((_, i) => (
        <circle key={i} cx={40 + (i % 5) * 55} cy={110 + Math.floor(i / 5) * 48} r="12"
          fill={i < 4 ? P.coral : "#D8D3E6"} />
      ))}
      {idx < meses.length - 1 && flip > 0.7 && (
        <path d={`M0 70 H300 V${70 + 230 * (1 - (flip - 0.7) / 0.3)} H0 Z`} fill="#FFFDF7" opacity="0.9" {...OUT} />
      )}
    </g>
  );
};

export const Cama: React.FC<{ x?: number; y?: number }> = ({ x = 140, y = 1180 }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x="0" y="-160" width="40" height="370" rx="12" fill={P.maderaOscura} {...OUT} />
    <rect x="760" y="-40" width="40" height="250" rx="12" fill={P.maderaOscura} {...OUT} />
    <rect x="20" y="40" width="760" height="120" rx="20" fill={P.madera} {...OUT} />
    <rect x="30" y="-10" width="740" height="80" rx="30" fill={P.sabana} {...OUT} />
    <rect x="60" y="-70" width="190" height="80" rx="34" fill="#fff" {...OUT} />
  </g>
);

export const MantaEncima: React.FC<{ x?: number; y?: number }> = ({ x = 140, y = 1180 }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M300 -40 Q420 -70 770 -30 L770 90 Q520 120 300 90 Z" fill={P.manta} {...OUT} />
    <path d="M340 -10 Q520 -30 740 0" fill="none" stroke="#fff" strokeOpacity="0.25" strokeWidth="10" />
  </g>
);

export const Ciudad: React.FC<{ frame: number }> = ({ frame }) => (
  <g>
    <defs>
      <linearGradient id="cieloCiudad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={P.cieloNoche1} />
        <stop offset="1" stopColor={P.cieloNoche2} />
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="1080" height="1920" fill="url(#cieloCiudad)" />
    {Array.from({ length: 30 }).map((_, i) => (
      <circle key={i} cx={random(`cx${i}`) * 1080} cy={random(`cy${i}`) * 700} r={1.5 + random(`cr${i}`) * 2.5} fill="#fff"
        opacity={0.3 + 0.7 * Math.abs(Math.sin(frame / 22 + i))} />
    ))}
    {Array.from({ length: 9 }).map((_, i) => {
      const w = 110 + random(`bw${i}`) * 60;
      const h = 380 + random(`bh${i}`) * 420;
      const x = i * 125 - 20;
      return (
        <g key={i}>
          <rect x={x} y={1400 - h} width={w} height={h} fill={i % 2 ? "#232858" : "#1B1F4B"} {...OUT} strokeWidth={4} />
          {Array.from({ length: Math.floor(h / 70) }).map((_, r) =>
            [0, 1].map((c) => (
              <rect key={`${r}-${c}`} x={x + 22 + c * 46} y={1400 - h + 30 + r * 70} width="26" height="34"
                fill={random(`w${i}-${r}-${c}`) > 0.45 ? P.chispa : "#2E3366"} opacity="0.85" />
            )),
          )}
        </g>
      );
    })}
    <rect x="0" y="1400" width="1080" height="520" fill="#14173A" />
  </g>
);

export const Espacio: React.FC<{ frame: number }> = ({ frame }) => (
  <g>
    <rect x="0" y="0" width="1080" height="1920" fill={P.cieloNoche1} />
    <circle cx="820" cy="1500" r="520" fill={P.violeta} opacity="0.25" />
    {Array.from({ length: 70 }).map((_, i) => (
      <circle key={i} cx={random(`sx${i}`) * 1080} cy={(random(`sy${i}`) * 1920 + frame * (0.3 + random(`sv${i}`))) % 1920}
        r={1 + random(`sr${i}`) * 3} fill="#fff" opacity={0.3 + 0.7 * Math.abs(Math.sin(frame / 15 + i))} />
    ))}
  </g>
);

export const Plano: React.FC<{ color: string; frame: number }> = ({ color, frame }) => (
  <g>
    <rect x="0" y="0" width="1080" height="1920" fill={color} />
    {Array.from({ length: 18 }).map((_, i) => (
      <circle key={i} cx={random(`px${i}`) * 1080} cy={(random(`py${i}`) * 1920 - frame * (0.5 + random(`pv${i}`))) % 1920 + 1920 * (random(`py${i}`) * 1920 - frame < 0 ? 1 : 0)}
        r={6 + random(`pr${i}`) * 16} fill="#fff" opacity="0.12" />
    ))}
  </g>
);
