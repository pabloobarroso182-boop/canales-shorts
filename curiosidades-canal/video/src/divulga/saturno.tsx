// Escenas del Short «Saturno flotaría en una bañera» (estilo divulga, dibujo propio en SVG).
import React from "react";
import { AbsoluteFill, interpolate, random, spring, useVideoConfig } from "remotion";
import { C, EP, Etiqueta } from "./comunes";
import { Centro, Cierre, clamp, Entra, Flash, Luz, Numero, Preguntas, Rayos } from "./piezas";
import { titleFont } from "../short/fonts";

const ORO = "#F5C77E";
const AGUA = "#2BD9FE";

const Saturno: React.FC<{ size?: number; t?: number; giro?: number }> = ({ size = 640, t = 0, giro = -14 }) => (
  <svg width={size} height={size * 0.62} viewBox="0 0 400 248" style={{ overflow: "visible", filter: `drop-shadow(0 0 40px ${ORO}88)` }}>
    <defs>
      <radialGradient id="sat" cx="0.38" cy="0.32" r="0.75">
        <stop offset="0" stopColor="#fff1cf" />
        <stop offset="0.5" stopColor={ORO} />
        <stop offset="1" stopColor="#8a5a2a" />
      </radialGradient>
      <clipPath id="sat-c"><circle cx="200" cy="124" r="92" /></clipPath>
    </defs>
    <g transform={`rotate(${giro} 200 124)`}>
      <ellipse cx="200" cy="124" rx="190" ry="44" fill="none" stroke="#d8b98a" strokeWidth="18" opacity="0.55" />
      <circle cx="200" cy="124" r="92" fill="url(#sat)" />
      <g clipPath="url(#sat-c)">
        {[-50, -22, 4, 30, 58].map((y, i) => (
          <rect key={i} x={100 + ((t * 0.6 + i * 30) % 40) - 20} y={124 + y} width="240" height={8 + (i % 2) * 6} fill="#b98a4e" opacity="0.35" />
        ))}
      </g>
      {/* parte delantera del anillo */}
      <path d="M10 124 A 190 44 0 0 0 390 124" fill="none" stroke="#f2dcb0" strokeWidth="18" opacity="0.9" />
      <path d="M30 124 A 170 34 0 0 0 370 124" fill="none" stroke="#a8875a" strokeWidth="6" opacity="0.6" />
    </g>
  </svg>
);

const Banera: React.FC<{ ancho?: number; t?: number; children?: React.ReactNode; hundir?: number }> = ({ ancho = 900, t = 0, children, hundir = 0 }) => (
  <div style={{ position: "relative", width: ancho, height: ancho * 0.75 }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: -ancho * 0.22 + hundir, display: "flex", justifyContent: "center" }}>{children}</div>
    <svg width={ancho} height={ancho * 0.75} viewBox="0 0 400 300" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <defs>
        <linearGradient id="agua" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={AGUA} stopOpacity="0.75" />
          <stop offset="1" stopColor="#0a4a78" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="ban" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#b9c4d6" />
        </linearGradient>
      </defs>
      <path d={`M24 120 Q 100 ${112 + Math.sin(t / 6) * 6} 200 120 T 376 120 L 360 230 Q 350 260 320 260 L 80 260 Q 50 260 40 230 Z`} fill="url(#agua)" />
      <path d="M10 110 L 390 110 L 372 236 Q 360 274 320 274 L 80 274 Q 40 274 28 236 Z" fill="none" stroke="url(#ban)" strokeWidth="18" strokeLinejoin="round" />
      <rect x="70" y="274" width="24" height="26" rx="6" fill="#b9c4d6" />
      <rect x="306" y="274" width="24" height="26" rx="6" fill="#b9c4d6" />
    </svg>
  </div>
);

const Tierra: React.FC<{ r: number }> = ({ r }) => (
  <div style={{ width: r * 2, height: r * 2, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #9be7ff, #2b7bd9 55%, #0b2a5c)", boxShadow: "0 0 10px #2BD9FE88" }} />
);

const Estrellas: React.FC<{ t: number }> = ({ t }) => (
  <>
    {new Array(50).fill(0).map((_, i) => (
      <div key={i} style={{ position: "absolute", left: random(`sx${i}`) * 1080, top: random(`sy${i}`) * 1920, width: 3 + random(`ss${i}`) * 3, height: 3 + random(`ss${i}`) * 3, borderRadius: 3, background: "#fff", opacity: 0.25 + 0.5 * Math.abs(Math.sin(t / 12 + i)) }} />
    ))}
  </>
);

// ---------------------------------------------------------------- escenas
const Gancho: React.FC<EP> = ({ t, dur, mk }) => (
  <AbsoluteFill>
    <Estrellas t={t} />
    <Rayos t={t} color={ORO} fuerza={0.4} />
    <Preguntas t={t} color={AGUA} />
    <Entra t={t} dur={dur} top={760} zoom={[1, 1.08]}>
      <Banera ancho={860} t={t}>
        <div style={{ transform: `translateY(${interpolate(t, [0, dur], [-260, 0], clamp)}px)` }}>
          <Saturno size={560} t={t} />
        </div>
      </Banera>
    </Entra>
    <Etiqueta t={t} desde={mk("banera")} texto="¿Saturno en una bañera?" icono="🛁" color={AGUA} top={1480} />
  </AbsoluteFill>
);

const Grande: React.FC<EP> = ({ t, dur, mk }) => {
  const n = Math.round(interpolate(t, [4, mk("tierras") + 6], [0, 700], clamp));
  return (
    <AbsoluteFill>
      <Estrellas t={t} />
      <Entra t={t} dur={dur} top={520} zoom={[1, 1.1]}>
        <Saturno size={780} t={t} />
      </Entra>
      <Centro top={1080} style={{ flexWrap: "wrap", width: 900, left: 90, gap: 6 }}>
        {new Array(Math.min(80, Math.round(n / 9))).fill(0).map((_, i) => <Tierra key={i} r={22} />)}
      </Centro>
      <Numero t={t} desde={6} texto={`+${n}`} sub="Tierras dentro" color={AGUA} top={1450} size={120} />
    </AbsoluteFill>
  );
};

const Gas: React.FC<EP> = ({ t, dur, mk }) => (
  <AbsoluteFill>
    <Estrellas t={t} />
    <Luz color={ORO} fuerza={0.2} />
    <Entra t={t} dur={dur} top={560} zoom={[1.1, 1.3]}>
      <Saturno size={760} t={t} />
    </Entra>
    {/* moléculas de gas que suben */}
    {new Array(16).fill(0).map((_, i) => {
      const p = ((t * 0.012 + random(`g${i}`)) % 1);
      const he = i % 3 === 0;
      return (
        <div key={i} style={{ position: "absolute", left: 120 + random(`gx${i}`) * 840, top: 1500 - p * 700, width: he ? 54 : 38, height: he ? 54 : 38, borderRadius: "50%", background: he ? "radial-gradient(circle at 35% 30%, #fff, #FF8A1F)" : "radial-gradient(circle at 35% 30%, #fff, #2BD9FE)", opacity: 1 - p, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: titleFont, fontSize: he ? 22 : 18, color: "#0b1230" }}>
          {he ? "He" : "H"}
        </div>
      );
    })}
    <Etiqueta t={t} desde={mk("helio") - 14} texto="Hidrógeno + helio" color={AGUA} top={1380} />
    <Etiqueta t={t} desde={mk("helio")} texto="Los gases más ligeros" icono="🎈" color="#fff" top={1500} />
  </AbsoluteFill>
);

const Cuenta: React.FC<EP> = ({ t, dur }) => (
  <AbsoluteFill>
    <Rayos t={t} color={C.amarillo} fuerza={0.5} />
    <Entra t={t} dur={dur} top={640} giro={-20}>
      <div style={{ fontFamily: titleFont, fontSize: 300, color: C.amarillo, textShadow: `0 0 60px ${C.amarillo}` }}>⚖</div>
    </Entra>
  </AbsoluteFill>
);

const Jarra: React.FC<{ color: string; nivel: number; etiqueta: string; size?: number }> = ({ color, nivel, etiqueta, size = 300 }) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 100 120" style={{ overflow: "visible", filter: `drop-shadow(0 0 20px ${color}88)` }}>
    <rect x="10" y={110 - 90 * nivel} width="80" height={90 * nivel} rx="6" fill={color} opacity="0.75" />
    <path d="M8 18 L 8 108 Q 8 116 16 116 L 84 116 Q 92 116 92 108 L 92 18" fill="none" stroke="#fff" strokeWidth="4" />
    <text x="50" y="70" textAnchor="middle" fontFamily={titleFont} fontSize="18" fill="#fff">{etiqueta}</text>
  </svg>
);

const Litro: React.FC<EP> = ({ t, mk }) => {
  const { fps } = useVideoConfig();
  const a = spring({ frame: t - 2, fps, config: { damping: 12 } });
  const b = spring({ frame: t - mk("gramos") + 20, fps, config: { damping: 12 } });
  const inclina = interpolate(t, [mk("gramos"), mk("gramos") + 20], [0, 10], clamp);
  return (
    <AbsoluteFill>
      <Luz color={AGUA} x={30} fuerza={0.18} />
      <Luz color={ORO} x={70} fuerza={0.18} />
      {/* balanza */}
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <g transform={`rotate(${inclina} 540 1180)`}>
          <line x1="180" y1="1180" x2="900" y2="1180" stroke="#cfd8e6" strokeWidth="14" strokeLinecap="round" />
        </g>
        <path d="M540 1180 L 480 1460 L 600 1460 Z" fill="#8a96a3" />
      </svg>
      <div style={{ position: "absolute", left: 120, top: 780 + inclina * 6, transform: `scale(${a})` }}>
        <Jarra color={AGUA} nivel={1} etiqueta="AGUA" />
      </div>
      <div style={{ position: "absolute", left: 660, top: 780 - inclina * 6, transform: `scale(${b})` }}>
        <Jarra color={ORO} nivel={1} etiqueta="SATURNO" />
      </div>
      <Etiqueta t={t} desde={mk("kilo")} texto="1 litro = 1 kg" icono="💧" color={AGUA} top={460} />
      <Etiqueta t={t} desde={mk("gramos")} texto="1 litro ≈ 700 g" icono="🪐" color={ORO} top={1520} />
    </AbsoluteFill>
  );
};

const Menos: React.FC<EP> = ({ t, dur }) => (
  <AbsoluteFill>
    <Rayos t={t * 2} color={AGUA} />
    <Entra t={t} dur={dur} top={620}>
      <div style={{ fontFamily: titleFont, fontSize: 170, color: "#fff", textShadow: `0 0 50px ${AGUA}`, textAlign: "center", lineHeight: 1.05 }}>
        0,69 <span style={{ color: AGUA }}>&lt;</span> 1
      </div>
    </Entra>
    <Centro top={900}>
      <div style={{ fontFamily: titleFont, fontSize: 52, color: C.amarillo }}>g/cm³ · Saturno vs agua</div>
    </Centro>
  </AbsoluteFill>
);

const Flota: React.FC<EP> = ({ t, mk }) => {
  const baja = interpolate(t, [mk("teoria") - 30, mk("teoria") + 6], [-320, 40], { ...clamp });
  const bote = t > mk("teoria") ? Math.sin((t - mk("teoria")) / 5) * 10 : 0;
  const deshace = interpolate(t, [mk("solido") - 30, mk("solido") + 10], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Estrellas t={t} />
      <Rayos t={t} color={ORO} fuerza={0.5} />
      <Centro top={740}>
        <Banera ancho={900} t={t} hundir={baja + bote}>
          <div style={{ opacity: 1 - deshace * 0.6, filter: `blur(${deshace * 6}px)` }}>
            <Saturno size={560} t={t} />
          </div>
        </Banera>
      </Centro>
      <Etiqueta t={t} desde={mk("unico")} texto="Menos denso que el agua" color={C.amarillo} top={450} />
      <Etiqueta t={t} desde={mk("teoria")} texto="En teoría… ¡flota!" icono="🛁" color={AGUA} top={1450} grande />
      <Etiqueta t={t} desde={mk("solido")} texto="No es sólido" icono="⚠" color="#FF4D5E" top={1580} />
      <Flash t={t} desde={mk("teoria")} color={AGUA} />
    </AbsoluteFill>
  );
};

const Cta: React.FC<EP> = ({ t, mk }) => (
  <AbsoluteFill>
    <Estrellas t={t} />
    <Centro top={700}>
      <Saturno size={640} t={t} giro={-14 + Math.sin(t / 20) * 4} />
    </Centro>
    <Centro top={430}>
      <div style={{ fontFamily: titleFont, fontSize: 200, color: C.amarillo, textShadow: `0 0 50px ${C.amarillo}`, transform: `scale(${1 + Math.sin(t / 5) * 0.06})` }}>?</div>
    </Centro>
    <Cierre t={t} desde={mk("meterias") + 30} />
  </AbsoluteFill>
);

export const ESCENAS_SATURNO: Record<string, React.FC<EP>> = {
  s_gancho: Gancho, s_grande: Grande, s_gas: Gas, s_cuenta: Cuenta, s_litro: Litro, s_menos: Menos, s_flota: Flota, s_cta: Cta,
};
