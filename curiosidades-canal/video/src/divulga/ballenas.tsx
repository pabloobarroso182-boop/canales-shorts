// Escenas del Short «Las ballenas antes caminaban» (estilo divulga, dibujo propio en SVG).
import React from "react";
import { AbsoluteFill, interpolate, random, spring, useVideoConfig } from "remotion";
import { C, EP, Etiqueta } from "./comunes";
import { Centro, Cierre, clamp, Entra, Flash, Luz, Numero, Preguntas, Rayos } from "./piezas";
import { titleFont } from "../short/fonts";

const AZUL = "#2BD9FE";
const TIERRA = "#E8A25A";

// Ballena azul de perfil; huesos=1 enseña los huesecillos de cadera por transparencia.
const Ballena: React.FC<{ size?: number; t?: number; huesos?: number }> = ({ size = 900, t = 0, huesos = 0 }) => (
  <svg width={size} height={size * 0.42} viewBox="0 0 500 210" style={{ overflow: "visible", filter: `drop-shadow(0 0 30px ${AZUL}66)` }}>
    <defs>
      <linearGradient id="bal" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#5b8fd1" />
        <stop offset="0.6" stopColor="#2c5a9a" />
        <stop offset="1" stopColor="#c8dcef" />
      </linearGradient>
    </defs>
    <g transform={`translate(0 ${Math.sin(t / 10) * 5})`}>
      <path d="M40 110 C 60 50, 260 40, 400 80 C 440 92, 470 100, 480 112 C 460 140, 380 160, 260 160 C 150 160, 70 150, 40 110 Z" fill="url(#bal)" opacity={1 - huesos * 0.55} />
      {/* cola */}
      <path d="M40 110 C 20 100, 10 80, -20 62 C -4 92, -4 120, -24 150 C 10 136, 24 122, 42 116 Z" fill="#2c5a9a" transform={`rotate(${Math.sin(t / 8) * 6} 40 110)`} opacity={1 - huesos * 0.55} />
      {/* aleta pectoral */}
      <path d="M330 140 C 320 170, 290 196, 262 200 C 280 180, 296 160, 306 140 Z" fill="#244b80" opacity={1 - huesos * 0.4} />
      <circle cx="430" cy="102" r="5" fill="#0b1230" />
      {new Array(9).fill(0).map((_, i) => <path key={i} d={`M${330 + i * 14} 140 L ${326 + i * 14} 156`} stroke="#9fbbd8" strokeWidth="3" opacity={1 - huesos * 0.5} />)}
      {/* columna y huesecillos de cadera */}
      {huesos > 0 ? (
        <g opacity={huesos}>
          {new Array(22).fill(0).map((_, i) => <rect key={i} x={60 + i * 16} y={96 + Math.sin(i / 3) * 4} width="12" height="14" rx="3" fill="#f2eee0" />)}
          <path d="M196 132 L 222 150" stroke={C.amarillo} strokeWidth="8" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 10px ${C.amarillo})` }} />
          <path d="M204 140 L 196 158" stroke={C.amarillo} strokeWidth="6" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 10px ${C.amarillo})` }} />
        </g>
      ) : null}
    </g>
  </svg>
);

// Pakicetus: mamífero de cuatro patas, hocico largo y cola (dibujo propio orientativo).
const Pakicetus: React.FC<{ size?: number; t?: number; anda?: number }> = ({ size = 640, t = 0, anda = 1 }) => {
  const paso = Math.sin(t / 4) * 16 * anda;
  const pata = (x: number, fase: number) => <path d={`M${x} 120 l ${(fase * paso) / 2} 44 l 10 0`} stroke="#6b4524" strokeWidth="12" fill="none" strokeLinecap="round" />;
  return (
    <svg width={size} height={size * 0.55} viewBox="0 0 300 165" style={{ overflow: "visible", filter: `drop-shadow(0 0 20px ${TIERRA}66)` }}>
      <defs>
        <linearGradient id="pak" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d6a06a" />
          <stop offset="1" stopColor="#8a5a32" />
        </linearGradient>
      </defs>
      {pata(90, 1)}{pata(110, -1)}{pata(200, -1)}{pata(220, 1)}
      <path d="M60 96 C 20 90, 0 110, -20 130" stroke="#a8743f" strokeWidth="12" fill="none" strokeLinecap="round" />
      <ellipse cx="150" cy="96" rx="100" ry="36" fill="url(#pak)" />
      <path d="M232 78 C 270 66, 300 76, 310 92 C 296 100, 268 100, 240 106 Z" fill="url(#pak)" />
      <circle cx="258" cy="80" r="4" fill="#1a0f06" />
      <path d="M268 96 L 306 94" stroke="#5a3a1c" strokeWidth="2" />
    </svg>
  );
};

const Mapa: React.FC<{ t: number }> = ({ t }) => (
  <svg width={760} height={560} viewBox="0 0 380 280" style={{ overflow: "visible" }}>
    {/* silueta muy simplificada de Pakistán + India */}
    <path d="M60 30 L 120 20 L 160 50 L 190 40 L 230 70 L 300 90 L 340 130 L 300 150 L 250 160 L 220 220 L 190 270 L 170 230 L 140 180 L 100 160 L 70 120 L 40 90 Z" fill="rgba(232,162,90,.25)" stroke={TIERRA} strokeWidth="3" />
    <circle cx="110" cy="70" r={10 + Math.sin(t / 5) * 3} fill={C.amarillo} style={{ filter: `drop-shadow(0 0 12px ${C.amarillo})` }} />
  </svg>
);

// ---------------------------------------------------------------- escenas
const Gancho: React.FC<EP> = ({ t, dur, mk }) => (
  <AbsoluteFill>
    <Rayos t={t} color={AZUL} fuerza={0.4} />
    <Preguntas t={t} color={TIERRA} />
    <Entra t={t} dur={dur} top={560}>
      <div style={{ position: "relative", width: 860, height: 600 }}>
        <div style={{ position: "absolute", left: 0, top: 0 }}><Ballena size={860} t={t} /></div>
        {/* patitas que asoman */}
        <svg width={860} height={600} viewBox="0 0 500 350" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {[180, 230, 300, 350].map((x, i) => <path key={x} d={`M${x} 150 l ${Math.sin(t / 4 + i) * 10} 50 l 14 0`} stroke="#2c5a9a" strokeWidth="14" fill="none" strokeLinecap="round" />)}
        </svg>
      </div>
    </Entra>
    <Etiqueta t={t} desde={mk("caminaban")} texto="¿Ballenas que caminaban?" icono="🐋" color={AZUL} top={1360} />
  </AbsoluteFill>
);

const Hoy: React.FC<EP> = ({ t, dur, mk }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: "linear-gradient(to bottom, #0b2a5c, #050817)" }} />
    {new Array(16).fill(0).map((_, i) => {
      const p = ((t * 0.01 + random(`bu${i}`)) % 1);
      return <div key={i} style={{ position: "absolute", left: random(`bx${i}`) * 1080, top: 1600 - p * 1200, width: 14, height: 14, borderRadius: 7, border: `2px solid ${AZUL}`, opacity: 0.5 * (1 - p) }} />;
    })}
    <Entra t={t} dur={dur} top={760} zoom={[0.9, 1.1]}>
      <Ballena size={980} t={t} />
    </Entra>
    <Etiqueta t={t} desde={mk("grandes")} texto="Los animales más grandes" icono="🏆" color={C.amarillo} top={460} />
    <Etiqueta t={t} desde={mk("agua") - 30} texto="Solo viven en el agua" color={AZUL} top={1400} />
  </AbsoluteFill>
);

const Pak: React.FC<EP> = ({ t, mk }) => {
  const { fps } = useVideoConfig();
  const mapa = spring({ frame: t - mk("pakistan") + 4, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, #2a2550, #6b4a3a 60%, #3a2a1a)" }} />
      <Luz color={TIERRA} fuerza={0.25} />
      <Centro top={1000} style={{ transform: `translateX(${interpolate(t, [0, 120], [-300, 120], clamp)}px)` }}>
        <Pakicetus size={640} t={t} />
      </Centro>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1360, height: 560, background: "linear-gradient(to bottom, #4a3220, #1d140c)" }} />
      <Centro top={470} style={{ transform: `scale(${mapa * 0.75})`, transformOrigin: "50% 0" }}>
        <Mapa t={t} />
      </Centro>
      <Etiqueta t={t} desde={mk("pakicetus")} texto="PAKICETUS" color={TIERRA} top={1420} grande />
      <Etiqueta t={t} desde={mk("pakistan")} texto="Pakistán e India · hace 50 M años" icono="📍" color="#fff" top={1560} />
    </AbsoluteFill>
  );
};

const Patas: React.FC<EP> = ({ t, dur, mk }) => (
  <AbsoluteFill>
    <Rayos t={t} color={TIERRA} fuerza={0.5} />
    <Entra t={t} dur={dur} top={700} zoom={[1.1, 1.3]}>
      <Pakicetus size={760} t={t} />
    </Entra>
    <Numero t={t} desde={mk("patas") - 10} texto="4" sub="patas" color={C.amarillo} top={1300} size={180} />
    <Etiqueta t={t} desde={mk("cola")} texto="…y cola" color="#fff" top={460} />
  </AbsoluteFill>
);

const Cambio: React.FC<EP> = ({ t, dur, mk }) => {
  const p = interpolate(t, [0, dur], [0, 1], clamp);
  const mar = interpolate(p, [0, 1], [1600, 900]);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, #2a2550, #6b4a3a 70%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: mar, bottom: 0, background: "linear-gradient(to bottom, rgba(43,217,254,.5), #0b2a5c)", borderTop: `6px solid ${AZUL}` }} />
      <Centro top={interpolate(p, [0, 1], [900, 1080])} style={{ opacity: 1 - p * 0.9 }}>
        <Pakicetus size={560} t={t} anda={1 - p} />
      </Centro>
      <Centro top={1180} style={{ opacity: p }}>
        <Ballena size={760} t={t} />
      </Centro>
      <Numero t={t} desde={mk("diez") - 6} texto="10 M" sub="de años" color={C.amarillo} top={470} size={150} />
    </AbsoluteFill>
  );
};

const Atras: React.FC<EP> = ({ t, mk }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: "linear-gradient(to bottom, #0b2a5c, #050817)" }} />
    <Centro top={720} style={{ transform: `scale(${interpolate(t, [0, 80], [1, 1.3], clamp)})` }}>
      <Ballena size={900} t={t} />
    </Centro>
    <Etiqueta t={t} desde={mk("aletas")} texto="Delante: aletas" icono="✓" color={AZUL} top={1360} />
    {t >= mk("atras") - 6 ? (
      <Centro top={1480}>
        <div style={{ fontFamily: titleFont, fontSize: 130, color: C.amarillo, textShadow: `0 0 40px ${C.amarillo}`, transform: `scale(${1 + Math.sin(t / 4) * 0.08})` }}>¿Y detrás?</div>
      </Centro>
    ) : null}
  </AbsoluteFill>
);

const Huesos: React.FC<EP> = ({ t, dur, mk }) => {
  const h = interpolate(t, [mk("fuera") + 6, mk("fuera") + 30], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #10306a, #050817 70%)" }} />
      <Rayos t={t * 2} color={C.amarillo} fuerza={h * 0.6} />
      <Entra t={t} dur={dur} top={700} zoom={[1, 1.15]}>
        <Ballena size={960} t={t} huesos={h} />
      </Entra>
      <Etiqueta t={t} desde={mk("fuera")} texto="¿Desaparecieron?" color="#fff" top={460} />
      <Etiqueta t={t} desde={mk("cadera")} texto="Huesecillos de cadera" icono="🦴" color={C.amarillo} top={1360} grande />
      <Etiqueta t={t} desde={mk("cadera") + 30} texto="Lo que queda de las patas" color="#fff" top={1500} />
      <Flash t={t} desde={mk("cadera")} color="#fff2cc" />
    </AbsoluteFill>
  );
};

const Cta: React.FC<EP> = ({ t, mk }) => (
  <AbsoluteFill>
    <Rayos t={t} color={AZUL} fuerza={0.5} />
    <Centro top={760}>
      <Ballena size={860} t={t} />
    </Centro>
    <Cierre t={t} desde={mk("manana") + 14} />
  </AbsoluteFill>
);

export const ESCENAS_BALLENAS: Record<string, React.FC<EP>> = {
  b_gancho: Gancho, b_hoy: Hoy, b_pak: Pak, b_patas: Patas, b_cambio: Cambio, b_atras: Atras, b_huesos: Huesos, b_cta: Cta,
};
