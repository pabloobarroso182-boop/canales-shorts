// Escenas del Short «Los vikingos nunca llevaron cuernos» (estilo divulga, dibujo propio en SVG).
import React from "react";
import { AbsoluteFill, interpolate, random, spring, useVideoConfig } from "remotion";
import { C, EP, Etiqueta } from "./comunes";
import { Centro, Cierre, clamp, Entra, Flash, Luz, Numero, Preguntas, Rayos, Tachon } from "./piezas";


const HIERRO = "#9aa6b5";
const ROJO = "#FF4D5E";
const TELON = "#8a1730";

// Casco: redondo de hierro con protector de ojos; con cuernos opcionales.
const Casco: React.FC<{ size?: number; cuernos?: number; brillo?: string }> = ({ size = 560, cuernos = 0, brillo = "#2BD9FE" }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible", filter: `drop-shadow(0 0 30px ${brillo}66)` }}>
    <defs>
      <radialGradient id="hie" cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#eef3f8" />
        <stop offset="0.5" stopColor={HIERRO} />
        <stop offset="1" stopColor="#3d4652" />
      </radialGradient>
      <linearGradient id="cue" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff6e0" />
        <stop offset="1" stopColor="#c9a86a" />
      </linearGradient>
    </defs>
    {cuernos > 0 ? (
      <g opacity={cuernos}>
        <path d="M44 92 C 10 80, 0 40, 20 10 C 26 40, 40 60, 62 70 Z" fill="url(#cue)" stroke="#8a6a32" strokeWidth="2" />
        <path d="M156 92 C 190 80, 200 40, 180 10 C 174 40, 160 60, 138 70 Z" fill="url(#cue)" stroke="#8a6a32" strokeWidth="2" />
      </g>
    ) : null}
    <path d="M30 120 C 30 50, 170 50, 170 120 Z" fill="url(#hie)" stroke="#2c333c" strokeWidth="3" />
    <path d="M100 52 L 100 120" stroke="#2c333c" strokeWidth="6" />
    <path d="M30 104 L 170 104" stroke="#2c333c" strokeWidth="6" />
    {/* protector de ojos (gafas) */}
    <path d="M44 118 C 50 150, 88 150, 96 124 L 104 124 C 112 150, 150 150, 156 118 Z" fill="url(#hie)" stroke="#2c333c" strokeWidth="3" />
    <ellipse cx="72" cy="128" rx="14" ry="8" fill="#0b0f1a" />
    <ellipse cx="128" cy="128" rx="14" ry="8" fill="#0b0f1a" />
    <path d="M96 124 L 100 160 L 104 124 Z" fill={HIERRO} />
    {[50, 70, 130, 150].map((x) => <circle key={x} cx={x} cy={104} r="3" fill="#2c333c" />)}
  </svg>
);

const Barco: React.FC<{ t: number; size?: number }> = ({ t, size = 900 }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 300 180" style={{ overflow: "visible" }}>
    <g transform={`translate(0 ${Math.sin(t / 8) * 4}) rotate(${Math.sin(t / 10) * 2} 150 120)`}>
      <path d="M150 20 L 150 120" stroke="#4a3220" strokeWidth="5" />
      <path d="M150 26 L 230 40 L 226 100 L 150 108 Z" fill="#b8323f" />
      <path d="M150 26 L 230 40 L 228 60 L 150 56 Z" fill="#e8e0c8" opacity="0.5" />
      <path d="M20 110 Q 40 150 150 150 Q 260 150 280 110 L 290 96 Q 270 116 150 120 Q 30 116 10 96 Z" fill="#6b4524" />
      <path d="M10 96 Q 0 70 18 60" stroke="#6b4524" strokeWidth="8" fill="none" strokeLinecap="round" />
      {new Array(8).fill(0).map((_, i) => <circle key={i} cx={50 + i * 28} cy={124} r="9" fill={["#c9a86a", "#b8323f", "#2b7bd9"][i % 3]} stroke="#2a1a0a" strokeWidth="2" />)}
    </g>
  </svg>
);

const Mar: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 1300, height: 620, background: "linear-gradient(to bottom, #123a6b, #061630)" }}>
    {new Array(6).fill(0).map((_, i) => (
      <div key={i} style={{ position: "absolute", left: ((t * (1 + i * 0.3) + i * 200) % 1300) - 200, top: 40 + i * 70, width: 220, height: 8, borderRadius: 4, background: "rgba(150,210,255,.25)" }} />
    ))}
  </div>
);

const Teatro: React.FC<{ t: number; abre: number }> = ({ t, abre }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 55%, #3a2a1a, #120a06 70%)" }} />
    {/* foco */}
    <div style={{ position: "absolute", left: 240, top: 420, width: 600, height: 1100, background: "radial-gradient(ellipse at 50% 70%, rgba(255,230,160,.35), transparent 65%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 1480, height: 440, background: "linear-gradient(to bottom, #5a3a1c, #2a1a0a)" }} />
    {/* telones */}
    <div style={{ position: "absolute", left: 0, top: 380, width: 540 * (1 - abre * 0.75), height: 1140, background: `repeating-linear-gradient(90deg, ${TELON} 0 50px, #6a1024 50px 90px)`, boxShadow: "10px 0 30px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", right: 0, top: 380, width: 540 * (1 - abre * 0.75), height: 1140, background: `repeating-linear-gradient(90deg, ${TELON} 0 50px, #6a1024 50px 90px)`, boxShadow: "-10px 0 30px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 360, height: 90, background: `repeating-linear-gradient(90deg, #a01f3a 0 60px, ${TELON} 60px 120px)`, borderBottom: "6px solid #d8a84a" }} />
    {new Array(8).fill(0).map((_, i) => (
      <div key={i} style={{ position: "absolute", left: 60 + i * 130, top: 1600 + (i % 2) * 40, width: 90, height: 120, borderRadius: "45px 45px 10px 10px", background: "#0a0604", opacity: 0.9 }} />
    ))}
    {t < 0 ? null : null}
  </AbsoluteFill>
);

// ---------------------------------------------------------------- escenas
const Gancho: React.FC<EP> = ({ t, dur, mk }) => (
  <AbsoluteFill>
    <Rayos t={t} color={ROJO} fuerza={0.4} />
    <Entra t={t} dur={dur} top={560}>
      <div style={{ position: "relative", width: 640, height: 640 }}>
        <Casco size={640} cuernos={1} brillo={C.amarillo} />
        <Tachon t={t} desde={mk("nunca")} size={640} />
      </div>
    </Entra>
    <Etiqueta t={t} desde={mk("nunca")} texto="NUNCA" icono="❌" color={ROJO} top={1360} grande />
  </AbsoluteFill>
);

const Imagen: React.FC<EP> = ({ t, dur, mk }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: "linear-gradient(to bottom, #1a2a52, #2b3a6b 60%)" }} />
    <Mar t={t} />
    <Entra t={t} dur={dur} top={760} zoom={[1, 1.1]}>
      <Barco t={t} />
    </Entra>
    <Centro top={540}>
      <div style={{ transform: `scale(${0.6})`, opacity: interpolate(t, [0, 10], [0, 1], clamp) }}>
        <Casco size={360} cuernos={1} brillo={C.amarillo} />
      </div>
    </Centro>
    <Etiqueta t={t} desde={mk("invento")} texto="Es un invento" icono="🎭" color={C.amarillo} top={1440} />
  </AbsoluteFill>
);

const Real: React.FC<EP> = ({ t, dur, mk }) => {
  const { fps } = useVideoConfig();
  const giro = spring({ frame: t - 4, fps, config: { damping: 14 } });
  return (
    <AbsoluteFill>
      <Luz color="#2BD9FE" fuerza={0.18} />
      {/* vitrina */}
      <Centro top={500}>
        <div style={{ width: 760, height: 760, borderRadius: 30, border: "4px solid rgba(160,220,255,.4)", background: "linear-gradient(135deg, rgba(160,220,255,.08), rgba(160,220,255,.02))", boxShadow: "inset 0 0 60px rgba(160,220,255,.15)" }} />
      </Centro>
      <Centro top={560} style={{ transform: `scale(${giro * interpolate(t, [0, dur], [1, 1.08])}) rotateY(${(1 - giro) * 80}deg)` }}>
        <Casco size={600} />
      </Centro>
      <Etiqueta t={t} desde={mk("noruega")} texto="Casco de Gjermundbu · Noruega" icono="📍" color="#2BD9FE" top={1340} />
      <Etiqueta t={t} desde={mk("hierro")} texto="Redondo y de hierro" color="#fff" top={1460} />
      <Etiqueta t={t} desde={mk("cuerno")} texto="0 cuernos" icono="✓" color={C.verde} top={1580} />
    </AbsoluteFill>
  );
};

const Salen: React.FC<EP> = ({ t, dur }) => (
  <AbsoluteFill>
    <Rayos t={t} color={C.amarillo} fuerza={0.5} />
    <Preguntas t={t} color={C.amarillo} />
    <Entra t={t} dur={dur} top={600}>
      <svg width={520} height={300} viewBox="0 0 200 110" style={{ overflow: "visible", filter: `drop-shadow(0 0 30px ${C.amarillo})` }}>
        <path d="M44 92 C 10 80, 0 40, 20 10 C 26 40, 40 60, 62 70 Z" fill="#f2deb0" />
        <path d="M156 92 C 190 80, 200 40, 180 10 C 174 40, 160 60, 138 70 Z" fill="#f2deb0" />
      </svg>
    </Entra>
  </AbsoluteFill>
);

const Ano: React.FC<EP> = ({ t, dur, mk }) => {
  const n = Math.round(interpolate(t, [0, mk("1876") + 4], [1000, 1876], { ...clamp }));
  return (
    <AbsoluteFill>
      <Rayos t={t * 2} color={C.amarillo} fuerza={0.6} />
      <Centro top={560} style={{ transform: `scale(${interpolate(t, [0, dur], [1, 1.1])})` }}>
        <svg width={520} height={520} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 30px ${C.amarillo}66)` }}>
          <rect x="10" y="10" width="80" height="80" rx="10" fill="#1a1f4f" stroke={C.amarillo} strokeWidth="2" />
          {[0, 1, 2].map((i) => <rect key={i} x="10" y={10 + i * 26.6} width="80" height="26.6" fill={["#111", "#d0101f", "#f5c518"][i]} opacity="0.85" />)}
        </svg>
      </Centro>
      <Etiqueta t={t} desde={mk("alemania")} texto="Alemania" icono="📍" color="#fff" top={1150} />
      <Numero t={t} desde={4} texto={String(n)} color={C.amarillo} top={1300} size={200} />
    </AbsoluteFill>
  );
};

const TeatroEsc: React.FC<EP> = ({ t, mk }) => {
  const abre = interpolate(t, [mk("teatro") - 6, mk("teatro") + 20], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Teatro t={t} abre={abre} />
      <Etiqueta t={t} desde={mk("teatro")} texto="Un teatro" icono="🎭" color={C.amarillo} top={1180} grande />
    </AbsoluteFill>
  );
};

const Guerrero: React.FC<{ size?: number; t: number }> = ({ size = 520, t }) => (
  <div style={{ position: "relative", width: size, height: size * 1.4 }}>
    <svg width={size} height={size * 1.4} viewBox="0 0 200 280" style={{ position: "absolute", overflow: "visible" }}>
      {/* capa */}
      <path d="M50 110 Q 20 200 30 270 L 170 270 Q 180 200 150 110 Z" fill="#8a1730" />
      {/* cuerpo con cota */}
      <rect x="62" y="100" width="76" height="120" rx="20" fill="#5a6470" />
      {new Array(6).fill(0).map((_, i) => <path key={i} d={`M64 ${112 + i * 18} H 136`} stroke="#3d4652" strokeWidth="3" />)}
      {/* cara */}
      <circle cx="100" cy="78" r="30" fill="#f0c8a0" />
      <path d="M72 82 Q 100 130 128 82 Q 120 104 100 106 Q 80 104 72 82 Z" fill="#e8b048" />
      {/* lanza */}
      <path d="M170 40 L 170 270" stroke="#6b4524" strokeWidth="6" />
      <path d="M170 20 L 162 44 L 178 44 Z" fill="#cfd8e6" />
    </svg>
    <div style={{ position: "absolute", left: size * 0.5 - size * 0.24, top: -size * 0.12 + Math.sin(t / 8) * 2 }}>
      <Casco size={size * 0.48} cuernos={1} brillo={C.amarillo} />
    </div>
  </div>
);

const Opera: React.FC<EP> = ({ t, mk }) => {
  const { fps } = useVideoConfig();
  const g = spring({ frame: t - mk("doepler"), fps, config: { damping: 11 } });
  const cuadros = t >= mk("hoy") - 40;
  return (
    <AbsoluteFill>
      <Teatro t={t} abre={1} />
      <Centro top={640} style={{ transform: `scale(${0.5 + 0.5 * g}) translateY(${(1 - g) * 200}px)` }}>
        <Guerrero t={t} size={540} />
      </Centro>
      {cuadros
        ? ["🖼", "📰", "📚"].map((ico, i) => {
            const s = spring({ frame: t - (mk("hoy") - 40) - i * 8, fps, config: { damping: 10 } });
            return <div key={i} style={{ position: "absolute", left: 90 + i * 330, top: 470, fontSize: 130, transform: `scale(${s}) rotate(${(i - 1) * 8}deg)`, filter: `drop-shadow(0 0 20px ${C.amarillo})` }}>{ico}</div>;
          })
        : null}
      <Etiqueta t={t} desde={mk("wagner")} texto="Ópera de Wagner · 1876" icono="🎼" color="#fff" top={1380} />
      <Etiqueta t={t} desde={mk("doepler")} texto="Trajes de C. E. Doepler" color={C.amarillo} top={1500} />
      <Flash t={t} desde={mk("doepler")} color="#fff2cc" />
    </AbsoluteFill>
  );
};

const Cta: React.FC<EP> = ({ t, mk }) => (
  <AbsoluteFill>
    <Rayos t={t} color={C.amarillo} fuerza={0.5} />
    {new Array(10).fill(0).map((_, i) => (
      <div key={i} style={{ position: "absolute", left: random(`cx${i}`) * 980, top: 500 + random(`cy${i}`) * 900, opacity: 0.25 }}>
        <Casco size={110} cuernos={i % 2} brillo={C.amarillo} />
      </div>
    ))}
    <Centro top={600}>
      <Casco size={560} cuernos={0.5 + 0.5 * Math.sin(t / 8)} brillo={C.amarillo} />
    </Centro>
    <Etiqueta t={t} desde={mk("imaginabas")} texto="¿Con o sin cuernos?" color={C.amarillo} top={1380} />
    <Cierre t={t} desde={mk("imaginabas") + 26} />
  </AbsoluteFill>
);

export const ESCENAS_VIKINGOS: Record<string, React.FC<EP>> = {
  v_gancho: Gancho, v_imagen: Imagen, v_real: Real, v_salen: Salen, v_ano: Ano, v_teatro: TeatroEsc, v_opera: Opera, v_cta: Cta,
};
