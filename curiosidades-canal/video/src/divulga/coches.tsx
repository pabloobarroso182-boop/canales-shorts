// Escenas del Short «La primera gasolinera del mundo era una farmacia» (estilo divulga).
// Dibujo propio con SVG: surtidor, cruz de farmacia, Benz de 1888, paisaje, mapa, indicador, farmacia y frasco.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, random, spring, staticFile, useVideoConfig } from "remotion";
import { C, EP, Etiqueta } from "./comunes";
import { titleFont, bodyFont } from "../short/fonts";

const K = {
  cielo1: "#1a1f4f",
  cielo2: "#ff9a5a",
  colina1: "#2c3a6b",
  colina2: "#1f2a52",
  colina3: "#141c3d",
  camino: "#5b4636",
  verdeFarm: "#2BE38C",
  rojo: "#FF4D5E",
  laton: "#E8B04A",
  coche: "#1b2b2a",
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ---------------------------------------------------------------- dibujos
const Surtidor: React.FC<{ size?: number; gris?: number }> = ({ size = 520, gris = 0 }) => (
  <svg width={size} height={size * 1.5} viewBox="0 0 200 300" style={{ overflow: "visible", filter: `grayscale(${gris}) drop-shadow(0 0 ${30 * (1 - gris)}px ${C.cian})` }}>
    <defs>
      <linearGradient id="sur" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#0e3a5c" />
        <stop offset="0.5" stopColor="#1677a8" />
        <stop offset="1" stopColor="#0b2c47" />
      </linearGradient>
    </defs>
    <rect x="40" y="40" width="110" height="230" rx="16" fill="url(#sur)" stroke={C.cian} strokeWidth="4" />
    <rect x="58" y="62" width="74" height="54" rx="8" fill="#061826" stroke={C.cian} strokeWidth="2" />
    <text x="95" y="98" textAnchor="middle" fontFamily={titleFont} fontSize="22" fill={C.cian}>0,00</text>
    <rect x="58" y="134" width="74" height="16" rx="4" fill="#0a2236" />
    <rect x="30" y="270" width="130" height="14" rx="6" fill="#0a2236" />
    {/* manguera y boquerel */}
    <path d="M150 120 C 190 130, 190 210, 168 236" stroke="#0a2236" strokeWidth="10" fill="none" strokeLinecap="round" />
    <path d="M158 236 L 178 236 L 184 256 L 166 262 Z" fill="#0a2236" stroke={C.cian} strokeWidth="2" />
    <rect x="70" y="20" width="50" height="22" rx="6" fill={C.cian} />
  </svg>
);

const CruzFarmacia: React.FC<{ size?: number; brillo?: number }> = ({ size = 520, brillo = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible", filter: `drop-shadow(0 0 ${40 * brillo}px ${K.verdeFarm})` }}>
    <defs>
      <linearGradient id="cruz" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7CFFC0" />
        <stop offset="1" stopColor="#13a862" />
      </linearGradient>
    </defs>
    <path d="M70 10 H130 V70 H190 V130 H130 V190 H70 V130 H10 V70 H70 Z" fill="url(#cruz)" stroke="#c9ffe6" strokeWidth="4" strokeLinejoin="round" />
    <path d="M78 20 H122 V78" stroke="rgba(255,255,255,.55)" strokeWidth="6" fill="none" strokeLinecap="round" />
  </svg>
);

const Rueda: React.FC<{ cx: number; cy: number; r: number; giro: number; radios?: number }> = ({ cx, cy, r, giro, radios = 12 }) => (
  <g transform={`rotate(${giro} ${cx} ${cy})`}>
    <circle cx={cx} cy={cy} r={r} fill="none" stroke="#0d0d0d" strokeWidth={r * 0.14} />
    <circle cx={cx} cy={cy} r={r * 0.9} fill="none" stroke={K.laton} strokeWidth={r * 0.05} />
    {new Array(radios).fill(0).map((_, i) => {
      const a = (i / radios) * Math.PI * 2;
      return <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(a) * r * 0.88} y2={cy + Math.sin(a) * r * 0.88} stroke="#d8d2c4" strokeWidth={r * 0.035} />;
    })}
    <circle cx={cx} cy={cy} r={r * 0.14} fill={K.laton} />
  </g>
);

// Triciclo motorizado de 1888 (dibujo propio, simplificado).
const Motorwagen: React.FC<{ ancho?: number; giro?: number; botes?: number; humo?: number; t?: number }> = ({ ancho = 760, giro = 0, botes = 0, humo = 0, t = 0 }) => (
  <svg width={ancho} height={ancho * 0.72} viewBox="0 0 400 288" style={{ overflow: "visible", transform: "scaleX(-1)", filter: "drop-shadow(0 18px 18px rgba(0,0,0,.55))" }}>
    <g transform={`translate(0 ${Math.sin(t / 2.2) * botes})`}>
      {/* chasis */}
      <path d="M70 150 L 300 150" stroke="#2a2a2a" strokeWidth="9" strokeLinecap="round" />
      <path d="M90 150 Q 100 205, 120 222" stroke="#2a2a2a" strokeWidth="7" fill="none" />
      {/* motor y volante de inercia (detrás) */}
      <rect x="250" y="112" width="60" height="40" rx="6" fill="#3a3f45" stroke={K.laton} strokeWidth="3" />
      <ellipse cx="282" cy="166" rx="40" ry="9" fill="#555" stroke={K.laton} strokeWidth="3" />
      <rect x="236" y="88" width="16" height="30" rx="4" fill={K.laton} />
      {/* asiento tipo banco */}
      <path d="M150 150 L 150 92 Q 150 76, 170 76 L 236 76 Q 252 76, 252 92 L 252 150 Z" fill={K.coche} stroke="#3c5a55" strokeWidth="3" />
      <path d="M140 118 L 262 118 L 262 152 L 140 152 Z" fill="#7a2e2e" stroke="#4d1c1c" strokeWidth="3" />
      {/* timón (barra) */}
      <path d="M150 118 L 110 70 L 92 70" stroke="#222" strokeWidth="6" fill="none" strokeLinecap="round" />
      <circle cx="92" cy="70" r="8" fill="#111" />
      {/* guardabarros */}
      <path d="M210 196 A 64 64 0 0 1 338 196" stroke="#222" strokeWidth="6" fill="none" />
    </g>
    {/* ruedas: dos grandes detrás (se ve una), una pequeña delante */}
    <Rueda cx={274} cy={222} r={64} giro={giro} />
    <Rueda cx={120} cy={238} r={46} giro={giro * 1.4} radios={10} />
    {/* humo del escape */}
    {humo > 0
      ? new Array(5).fill(0).map((_, i) => {
          const p = ((t * 0.04 + i / 5) % 1);
          return <circle key={i} cx={330 + p * 120} cy={130 - p * 40} r={8 + p * 26} fill={`rgba(220,220,230,${(1 - p) * 0.45 * humo})`} />;
        })
      : null}
  </svg>
);

const Paisaje: React.FC<{ t: number; vel: number; noche?: number }> = ({ t, vel, noche = 0 }) => {
  const off = (f: number) => -((t * vel * f) % 1080);
  const capa = (f: number, color: string, d: string, top: number) => (
    <div style={{ position: "absolute", left: 0, top, width: 2160, height: 700, transform: `translateX(${off(f)}px)` }}>
      {[0, 1080].map((x) => (
        <svg key={x} width={1080} height={700} viewBox="0 0 1080 700" style={{ position: "absolute", left: x }}>
          <path d={d} fill={color} />
        </svg>
      ))}
    </div>
  );
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `linear-gradient(to bottom, ${K.cielo1} 0%, #4b3f7a 38%, ${K.cielo2} 62%, #ffcf8a 72%)` }} />
      <div style={{ position: "absolute", left: 700, top: 760, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, #fff3c4, #ffb35c 60%, transparent 72%)", opacity: 1 - noche }} />
      {capa(0.15, K.colina1, "M0 420 Q 180 300 360 400 T 720 380 T 1080 420 V700 H0Z", 600)}
      {capa(0.35, K.colina2, "M0 470 Q 220 360 440 460 T 880 440 T 1080 470 V700 H0Z", 680)}
      {capa(0.7, K.colina3, "M0 520 Q 270 430 540 510 T 1080 520 V700 H0Z", 760)}
      {/* camino */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1280, height: 640, background: `linear-gradient(to bottom, ${K.camino}, #2f241c)` }} />
      <div style={{ position: "absolute", left: 0, top: 1330, width: 2160, height: 12, transform: `translateX(${off(1.2)}px)`, background: "repeating-linear-gradient(90deg, rgba(255,230,180,.35) 0 90px, transparent 90px 180px)" }} />
      <AbsoluteFill style={{ background: "#050817", opacity: noche * 0.7 }} />
    </AbsoluteFill>
  );
};

const Indicador: React.FC<{ nivel: number; alerta: number }> = ({ nivel, alerta }) => {
  const cx = 200, cy = 200, R = 170;
  const ang = interpolate(nivel, [0, 1], [-60, 60]);
  return (
    <svg width={400} height={260} viewBox="0 0 400 260" style={{ overflow: "visible", filter: `drop-shadow(0 0 ${20 + alerta * 30}px ${alerta > 0.5 ? K.rojo : C.cian})` }}>
      <path d={`M ${cx - R * 0.87} ${cy - R * 0.5} A ${R} ${R} 0 0 1 ${cx + R * 0.87} ${cy - R * 0.5}`} stroke={C.cian} strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d={`M ${cx - R * 0.87} ${cy - R * 0.5} A ${R} ${R} 0 0 1 ${cx - R * 0.5} ${cy - R * 0.87}`} stroke={K.rojo} strokeWidth="14" fill="none" strokeLinecap="round" opacity={0.6 + alerta * 0.4} />
      <text x={cx - R * 0.95} y={cy - R * 0.25} fontFamily={titleFont} fontSize="38" fill={K.rojo}>E</text>
      <text x={cx + R * 0.78} y={cy - R * 0.25} fontFamily={titleFont} fontSize="38" fill="#fff">F</text>
      <g transform={`rotate(${ang} ${cx} ${cy})`}>
        <line x1={cx} y1={cy} x2={cx} y2={cy - R + 24} stroke={C.naranja} strokeWidth="10" strokeLinecap="round" />
      </g>
      <circle cx={cx} cy={cy} r="18" fill="#fff" />
    </svg>
  );
};

const Fachada: React.FC<{ t: number; noche?: number; ancho?: number }> = ({ t, noche = 0, ancho = 900 }) => {
  const luz = 0.75 + Math.sin(t / 7) * 0.05;
  return (
    <svg width={ancho} height={ancho * 1.05} viewBox="0 0 400 420" style={{ overflow: "visible", filter: "drop-shadow(0 30px 40px rgba(0,0,0,.6))" }}>
      <defs>
        <linearGradient id="pared" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={noche ? "#3b3550" : "#e8d9bd"} />
          <stop offset="1" stopColor={noche ? "#272238" : "#c9b48f"} />
        </linearGradient>
        <radialGradient id="ventana" cx="50%" cy="60%" r="70%">
          <stop offset="0" stopColor="#fff2b8" />
          <stop offset="1" stopColor="#f0a03c" />
        </radialGradient>
      </defs>
      {/* tejado */}
      <path d="M20 120 L 200 30 L 380 120 Z" fill="#7b3b2c" stroke="#4a2018" strokeWidth="4" />
      <rect x="40" y="120" width="320" height="300" fill="url(#pared)" />
      {/* ventanas de arriba */}
      {[80, 170, 260].map((x) => (
        <g key={x}>
          <rect x={x} y="150" width="60" height="70" rx="4" fill="url(#ventana)" opacity={luz} />
          <path d={`M${x + 30} 150 V220 M${x} 185 H${x + 60}`} stroke="#5a3a22" strokeWidth="4" />
        </g>
      ))}
      {/* rótulo */}
      <rect x="95" y="240" width="210" height="34" rx="6" fill="#123d2b" stroke={K.verdeFarm} strokeWidth="3" />
      <text x="200" y="265" textAnchor="middle" fontFamily={titleFont} fontSize="22" fill="#d9ffe9" letterSpacing="3">APOTHEKE</text>
      {/* puerta y escaparates */}
      <rect x="170" y="290" width="60" height="130" rx="6" fill="#4a2c1a" />
      <rect x="178" y="300" width="44" height="60" rx="4" fill="url(#ventana)" opacity={luz} />
      <rect x="70" y="300" width="80" height="90" rx="4" fill="url(#ventana)" opacity={luz} />
      <rect x="250" y="300" width="80" height="90" rx="4" fill="url(#ventana)" opacity={luz} />
      {/* frascos en el escaparate */}
      {[85, 105, 125, 265, 285, 305].map((x, i) => (
        <rect key={x} x={x} y={350 - (i % 3) * 8} width="12" height={30 + (i % 3) * 8} rx="3" fill={["#2BD9FE", "#7CFF6B", "#FF8A1F"][i % 3]} opacity="0.75" />
      ))}
      {/* cruz luminosa */}
      <g transform="translate(330 240) scale(0.32)" style={{ filter: `drop-shadow(0 0 ${12 + Math.sin(t / 4) * 6}px ${K.verdeFarm})` }}>
        <path d="M70 10 H130 V70 H190 V130 H130 V190 H70 V130 H10 V70 H70 Z" fill={K.verdeFarm} />
      </g>
    </svg>
  );
};

const Frasco: React.FC<{ size?: number; brillo?: number; nivel?: number }> = ({ size = 420, brillo = 1, nivel = 0.7 }) => (
  <svg width={size} height={size * 1.4} viewBox="0 0 200 280" style={{ overflow: "visible", filter: `drop-shadow(0 0 ${40 * brillo}px rgba(255,190,90,${0.8 * brillo}))` }}>
    <defs>
      <linearGradient id="vidrio" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="rgba(160,200,255,.25)" />
        <stop offset="0.5" stopColor="rgba(255,255,255,.08)" />
        <stop offset="1" stopColor="rgba(160,200,255,.3)" />
      </linearGradient>
      <linearGradient id="liquido" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffe9a8" />
        <stop offset="1" stopColor="#f2a53a" />
      </linearGradient>
      <clipPath id="cuerpoFrasco">
        <path d="M70 40 V80 Q 30 100 30 150 V250 Q 30 270 50 270 H150 Q 170 270 170 250 V150 Q 170 100 130 80 V40 Z" />
      </clipPath>
    </defs>
    <g clipPath="url(#cuerpoFrasco)">
      <rect x="0" y={270 - 230 * nivel} width="200" height="280" fill="url(#liquido)" />
    </g>
    <path d="M70 40 V80 Q 30 100 30 150 V250 Q 30 270 50 270 H150 Q 170 270 170 250 V150 Q 170 100 130 80 V40 Z" fill="url(#vidrio)" stroke="rgba(220,235,255,.85)" strokeWidth="4" />
    <rect x="62" y="18" width="76" height="26" rx="6" fill="#6b4a2a" />
    <rect x="48" y="160" width="104" height="64" rx="6" fill="#f6efd9" stroke="#8a6a3a" strokeWidth="3" />
    <text x="100" y="190" textAnchor="middle" fontFamily={titleFont} fontSize="17" fill="#3a2a14">LIGROÍNA</text>
    <text x="100" y="212" textAnchor="middle" fontFamily={bodyFont} fontWeight={800} fontSize="11" fill="#6b4a2a">disolvente</text>
    <path d="M44 120 Q 40 180 46 240" stroke="rgba(255,255,255,.6)" strokeWidth="6" fill="none" strokeLinecap="round" />
  </svg>
);

const Centro: React.FC<{ children: React.ReactNode; top?: number; style?: React.CSSProperties }> = ({ children, top, style }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center", ...style }}>{children}</div>
);

const Rayos: React.FC<{ t: number; color: string; fuerza?: number }> = ({ t, color, fuerza = 1 }) => (
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

// ---------------------------------------------------------------- escenas
const EscGancho: React.FC<EP> = ({ t, dur, mk }) => {
  const { fps } = useVideoConfig();
  const s = spring({ frame: t, fps, config: { damping: 13 } });
  const push = interpolate(t, [0, dur], [1, 1.15]);
  return (
    <AbsoluteFill>
      <Rayos t={t} color={C.cian} fuerza={0.6} />
      {new Array(7).fill(0).map((_, i) => {
        const y = 1500 - ((t * (2 + random(`q${i}`) * 2) + random(`qy${i}`) * 900) % 900);
        return (
          <div key={i} style={{ position: "absolute", left: 120 + random(`qx${i}`) * 820, top: y, fontFamily: titleFont, fontSize: 60 + random(`qs${i}`) * 50, color: C.cian, opacity: 0.25 }}>
            ?
          </div>
        );
      })}
      <Centro top={560} style={{ transform: `scale(${s * push})` }}>
        <Surtidor size={480} />
      </Centro>
      <Etiqueta t={t} desde={mk("gasolinera")} texto="¿La primera gasolinera?" icono="⛽" color={C.cian} top={1440} />
    </AbsoluteFill>
  );
};

const EscFarmacia: React.FC<EP> = ({ t }) => {
  const { fps } = useVideoConfig();
  const s = spring({ frame: t, fps, config: { damping: 9, mass: 0.7 } });
  const flash = interpolate(t, [0, 6], [0.8, 0], clamp);
  return (
    <AbsoluteFill>
      <Rayos t={t * 3} color={K.verdeFarm} />
      <Centro top={560} style={{ transform: `scale(${0.4 + 0.6 * s}) rotate(${(1 - s) * -25}deg)` }}>
        <CruzFarmacia size={560} />
      </Centro>
      <Etiqueta t={t} desde={2} texto="FARMACIA" icono="💊" color={K.verdeFarm} top={1300} grande />
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
    </AbsoluteFill>
  );
};

const EscBertha: React.FC<EP> = ({ t, mk }) => {
  const { fps } = useVideoConfig();
  const entra = spring({ frame: t, fps, config: { damping: 16 } });
  const vel = 9;
  const etiquetaAbajo = t >= mk("madre") ? "Rumbo a casa de su madre" : t >= mk("hijos") ? "Con sus 2 hijos" : t >= mk("bertha") ? "Bertha Benz" : null;
  const desdeAbajo = t >= mk("madre") ? mk("madre") : t >= mk("hijos") ? mk("hijos") : mk("bertha");
  return (
    <AbsoluteFill>
      <Paisaje t={t} vel={vel} />
      <Centro top={900} style={{ transform: `translateX(${(1 - entra) * -700}px)` }}>
        <Motorwagen ancho={760} giro={-t * 14} botes={4} humo={1} t={t} />
      </Centro>
      <Etiqueta t={t} desde={mk("1888") - 10} texto="Agosto de 1888" icono="📅" color={C.amarillo} top={450} />
      {etiquetaAbajo ? <Etiqueta key={etiquetaAbajo} t={t} desde={desdeAbajo} texto={etiquetaAbajo} color="#fff" top={1500} /> : null}
    </AbsoluteFill>
  );
};

const EscRuta: React.FC<EP> = ({ t, mk }) => {
  const p = interpolate(t, [4, mk("km") + 24], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const ruta = "M 300 520 C 420 640, 360 760, 470 880 S 640 1080, 600 1220 S 700 1380, 760 1440";
  const km = Math.round(p * 106);
  // posición aproximada del coche sobre la curva (muestreo de la propia curva con getPointAtLength no está
  // disponible en render sin DOM fiable, así que se interpola entre puntos de control)
  const pts = [[300, 520], [400, 690], [470, 880], [560, 1010], [600, 1220], [680, 1350], [760, 1440]];
  const idx = Math.min(pts.length - 2, Math.floor(p * (pts.length - 1)));
  const f = p * (pts.length - 1) - idx;
  const cx = pts[idx][0] + (pts[idx + 1][0] - pts[idx][0]) * f;
  const cy = pts[idx][1] + (pts[idx + 1][1] - pts[idx][1]) * f;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, #17224d, #070b20 75%)" }}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        {/* cuadrícula de mapa */}
        {new Array(12).fill(0).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={420 + i * 100} x2={1080} y2={420 + i * 100} stroke="rgba(43,217,254,.08)" strokeWidth={2} />
        ))}
        {new Array(11).fill(0).map((_, i) => (
          <line key={`v${i}`} x1={i * 108} y1={400} x2={i * 108} y2={1600} stroke="rgba(43,217,254,.08)" strokeWidth={2} />
        ))}
        {/* río Rin, decorativo */}
        <path d="M 120 400 C 200 700, 140 1000, 230 1600" stroke="rgba(43,217,254,.25)" strokeWidth={26} fill="none" />
        <path d={ruta} stroke="rgba(255,255,255,.15)" strokeWidth={14} fill="none" strokeDasharray="4 18" strokeLinecap="round" />
        <path d={ruta} stroke={C.amarillo} strokeWidth={12} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 1`} style={{ filter: `drop-shadow(0 0 14px ${C.amarillo})` }} />
        {[
          [300, 520, "Mannheim"],
          [400, 690, "Wiesloch"],
          [760, 1440, "Pforzheim"],
        ].map(([x, y, n], i) => (
          <g key={String(n)}>
            <circle cx={Number(x)} cy={Number(y)} r={i === 1 ? 12 : 20} fill={i === 1 ? K.verdeFarm : "#fff"} style={{ filter: `drop-shadow(0 0 12px ${i === 1 ? K.verdeFarm : "#fff"})` }} />
            <text x={Number(x) + 34} y={Number(y) + 12} fontFamily={bodyFont} fontWeight={900} fontSize={i === 1 ? 34 : 44} fill={i === 1 ? K.verdeFarm : "#fff"}>
              {n}
            </text>
          </g>
        ))}
        <circle cx={cx} cy={cy} r={22} fill={C.naranja} style={{ filter: `drop-shadow(0 0 16px ${C.naranja})` }} />
      </svg>
      <Centro top={1560}>
        <div style={{ fontFamily: titleFont, fontSize: 130, color: C.amarillo, textShadow: `0 0 40px ${C.amarillo}88` }}>
          {km} <span style={{ fontSize: 70 }}>km</span>
        </div>
      </Centro>
      <Etiqueta t={t} desde={mk("primer")} texto="1.er viaje largo en coche" icono="🏁" color="#fff" top={1440} />
    </AbsoluteFill>
  );
};

const EscSin: React.FC<EP> = ({ t, mk }) => {
  const d = mk("combustible");
  const nivel = interpolate(t, [0, d], [0.35, 0], { ...clamp, easing: Easing.in(Easing.quad) });
  const alerta = t >= d ? 0.5 + 0.5 * Math.abs(Math.sin(t / 3)) : 0;
  const frena = interpolate(t, [0, d], [6, 0], clamp);
  return (
    <AbsoluteFill>
      <Paisaje t={t} vel={frena} />
      <Centro top={900}>
        <Motorwagen ancho={760} giro={-t * frena * 1.5} t={t} />
      </Centro>
      {/* tosidos del motor */}
      {t >= d
        ? [0, 1, 2].map((i) => {
            const p = (((t - d) * 0.05 + i / 3) % 1);
            return <div key={i} style={{ position: "absolute", left: 780 + p * 140, top: 1000 - p * 90, width: 60 + p * 90, height: 60 + p * 90, borderRadius: "50%", background: `rgba(60,60,70,${(1 - p) * 0.55})` }} />;
          })
        : null}
      <Centro top={430}>
        <Indicador nivel={nivel} alerta={alerta} />
      </Centro>
      <Etiqueta t={t} desde={d} texto="Sin combustible" icono="⚠" color={K.rojo} top={1520} grande />
    </AbsoluteFill>
  );
};

const EscNoHay: React.FC<EP> = ({ t, mk }) => {
  const x = interpolate(t, [mk("existian") - 4, mk("existian") + 10], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Centro top={560}>
        <div style={{ position: "relative" }}>
          <Surtidor size={460} gris={0.85} />
          <svg width={460} height={690} viewBox="0 0 460 690" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <path d="M40 120 L 420 600" stroke={K.rojo} strokeWidth={34} strokeLinecap="round" pathLength={1} strokeDasharray={`${x} 1`} style={{ filter: `drop-shadow(0 0 16px ${K.rojo})` }} />
            <path d="M420 120 L 40 600" stroke={K.rojo} strokeWidth={34} strokeLinecap="round" pathLength={1} strokeDasharray={`${Math.max(0, x * 2 - 1)} 1`} style={{ filter: `drop-shadow(0 0 16px ${K.rojo})` }} />
          </svg>
        </div>
      </Centro>
      <Etiqueta t={t} desde={mk("existian")} texto="1888: ninguna gasolinera" color={K.rojo} top={1400} />
    </AbsoluteFill>
  );
};

const EscCompra: React.FC<EP> = ({ t, dur, mk }) => {
  const z = mk("ligroina");
  // 1) acercamiento a la farmacia; 2) dentro: el frasco en el mostrador
  const push = interpolate(t, [0, z], [1, 2.1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const fuera = interpolate(t, [z - 10, z + 2], [1, 0], clamp);
  const dentro = interpolate(t, [z - 4, z + 8], [0, 1], clamp);
  const { fps } = useVideoConfig();
  const frasco = spring({ frame: t - z + 4, fps, config: { damping: 11 } });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: fuera }}>
        <AbsoluteFill style={{ background: "linear-gradient(to bottom, #20285c, #463a73 55%, #2b2340)" }} />
        <Centro top={520} style={{ transform: `scale(${push})`, transformOrigin: "50% 75%" }}>
          <Fachada t={t} ancho={860} />
        </Centro>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1420, height: 500, background: "linear-gradient(to bottom, #3a2f2a, #1b1512)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: dentro }}>
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #5a3a1c, #1d120a 70%)" }} />
        {/* estantes con frascos */}
        {[560, 760].map((y, j) => (
          <div key={y} style={{ position: "absolute", left: 60, right: 60, top: y, height: 14, background: "#6b4a2a", boxShadow: "0 8px 20px rgba(0,0,0,.5)" }}>
            {new Array(9).fill(0).map((_, i) => (
              <div key={i} style={{ position: "absolute", left: 20 + i * 104, bottom: 14, width: 44, height: 70 + ((i + j) % 3) * 24, borderRadius: "10px 10px 6px 6px", background: ["#2BD9FE", "#7CFF6B", "#FF8A1F", "#C3B2FF"][(i + j) % 4], opacity: 0.35 }} />
            ))}
          </div>
        ))}
        <div style={{ position: "absolute", left: 0, right: 0, top: 1360, height: 560, background: "linear-gradient(to bottom, #7a5230, #3d2614)" }} />
        <Centro top={760} style={{ transform: `scale(${frasco}) translateY(${(1 - frasco) * 120}px)` }}>
          <Frasco size={400} brillo={0.6 + 0.4 * Math.abs(Math.sin(t / 8))} />
        </Centro>
      </AbsoluteFill>
      <Etiqueta t={t} desde={mk("wiesloch")} texto="Farmacia de Wiesloch" icono="📍" color={K.verdeFarm} top={450} />
      <Etiqueta t={t} desde={z} texto="Ligroína: un disolvente" color={C.amarillo} top={1440} />
      <Etiqueta t={t} desde={z + Math.round((dur - z) * 0.45)} texto="Se vendía en farmacias" icono="💊" color="#fff" top={1560} />
    </AbsoluteFill>
  );
};

const EscArranca: React.FC<EP> = ({ t, mk }) => {
  const a = mk("arrancar");
  const vel = interpolate(t, [a - 4, a + 16], [0, 12], clamp);
  const flash = interpolate(t, [a, a + 8], [0.6, 0], clamp);
  const { fps } = useVideoConfig();
  const pop = spring({ frame: t - a, fps, config: { damping: 8 } });
  return (
    <AbsoluteFill>
      <Paisaje t={t} vel={vel} />
      {/* gotas que caen al depósito antes de arrancar */}
      {t < a
        ? new Array(6).fill(0).map((_, i) => {
            const p = ((t * 0.08 + i / 6) % 1);
            return <div key={i} style={{ position: "absolute", left: 575 + Math.sin(i) * 6, top: 760 + p * 180, width: 16, height: 22, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "#ffd27a", boxShadow: "0 0 12px #ffb347", opacity: 1 - p * 0.6 }} />;
          })
        : null}
      <Centro top={900} style={{ transform: `translateX(${interpolate(t, [a, a + 40], [0, 120], clamp)}px)` }}>
        <Motorwagen ancho={760} giro={-t * vel * 1.4} botes={t >= a ? 6 : 0} humo={t >= a ? 1 : 0} t={t} />
      </Centro>
      {t >= a ? (
        <Centro top={470} style={{ transform: `scale(${pop})` }}>
          <div style={{ fontFamily: titleFont, fontSize: 120, color: C.amarillo, textShadow: `0 0 40px ${C.naranja}`, WebkitTextStroke: "4px #2a1600", paintOrder: "stroke fill" }}>¡BRRRUM!</div>
        </Centro>
      ) : null}
      <AbsoluteFill style={{ background: "#fff6d8", opacity: flash }} />
    </AbsoluteFill>
  );
};

const EscHoy: React.FC<EP> = ({ t, mk }) => {
  const { fps } = useVideoConfig();
  const medalla = spring({ frame: t - mk("conoce"), fps, config: { damping: 10 } });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, #050817, #141a3e 60%, #241c38)" }} />
      {new Array(40).fill(0).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: random(`sx${i}`) * 1080, top: random(`sy${i}`) * 700 + 380, width: 4, height: 4, borderRadius: 2, background: "#fff", opacity: 0.3 + 0.5 * Math.abs(Math.sin(t / 10 + i)) }} />
      ))}
      <Centro top={640} style={{ transform: `scale(${interpolate(t, [0, 160], [1, 1.08], clamp)})` }}>
        <Fachada t={t} noche={1} ancho={820} />
      </Centro>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1480, height: 440, background: "#0d0a14" }} />
      <Etiqueta t={t} desde={mk("abierta")} texto="Sigue abierta hoy" icono="✓" color={K.verdeFarm} top={460} />
      {t >= mk("conoce") ? (
        <Centro top={1250} style={{ transform: `scale(${medalla}) rotate(${(1 - medalla) * -20}deg)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22, background: "linear-gradient(135deg, #ffe08a, #e8a93a)", color: "#2a1a00", fontFamily: titleFont, fontSize: 52, padding: "22px 40px", borderRadius: 30, boxShadow: `0 0 60px ${C.amarillo}aa`, border: "5px solid #fff4c9" }}>
            <span style={{ fontSize: 70 }}>⛽</span>1.ª GASOLINERA DEL MUNDO
          </div>
        </Centro>
      ) : null}
    </AbsoluteFill>
  );
};

const EscCta: React.FC<EP> = ({ t, mk }) => {
  const { fps } = useVideoConfig();
  const fin = mk("atrevido") + 18;
  const logo = spring({ frame: t - fin, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill>
      <Paisaje t={t} vel={5} />
      <Centro top={900} style={{ transform: `scale(${1 - logo * 0.3}) translateY(${logo * 200}px)` }}>
        <Motorwagen ancho={700} giro={-t * 7} botes={3} humo={1} t={t} />
      </Centro>
      <Centro top={430} style={{ opacity: 1 - logo }}>
        <div style={{ fontFamily: titleFont, fontSize: 220, color: C.amarillo, textShadow: `0 0 50px ${C.amarillo}`, transform: `scale(${1 + Math.sin(t / 5) * 0.06})` }}>?</div>
      </Centro>
      {t >= fin ? (
        <AbsoluteFill style={{ background: `rgba(5,8,23,${0.75 * logo})` }}>
          <Centro top={620} style={{ transform: `scale(${logo})`, flexDirection: "column", alignItems: "center" }}>
            <Img src={staticFile("brand/perfil-800x800.png")} style={{ width: 360, height: 360, borderRadius: "50%", boxShadow: "0 0 80px #7B5CFF" }} />
            <div style={{ marginTop: 26, fontFamily: titleFont, fontSize: 84, color: "#fff", textAlign: "center" }}>¡SÍGUENOS!</div>
            <div style={{ marginTop: 10, fontFamily: bodyFont, fontWeight: 900, fontSize: 40, color: C.amarillo, textAlign: "center" }}>Un dato curioso cada día</div>
          </Centro>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

export const ESCENAS_COCHES: Record<string, React.FC<EP>> = {
  c_gancho: EscGancho,
  c_farmacia: EscFarmacia,
  c_bertha: EscBertha,
  c_ruta: EscRuta,
  c_sin: EscSin,
  c_nohay: EscNoHay,
  c_compra: EscCompra,
  c_arranca: EscArranca,
  c_hoy: EscHoy,
  c_cta: EscCta,
};
