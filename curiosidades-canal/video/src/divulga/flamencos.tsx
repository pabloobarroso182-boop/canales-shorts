// Escenas del Short «Los flamencos nacen grises» (estilo divulga, dibujo propio en SVG).
import React from "react";
import { AbsoluteFill, interpolate, random, spring, useVideoConfig } from "remotion";
import { C, EP, Etiqueta } from "./comunes";
import { Centro, Cierre, clamp, Entra, Flash, Luz, Numero, Preguntas, Rayos, Tachon } from "./piezas";

const ROSA = "#FF6FA8";
const GRIS = "#9AA3B5";
const AGUA = "#2BD9FE";

// mezcla de color gris -> rosa (r de 0 a 1)
const mezcla = (r: number) => {
  const a = [0x9a, 0xa3, 0xb5], b = [0xff, 0x6f, 0xa8];
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * Math.max(0, Math.min(1, r))));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};

// Flamenco propio: cuerpo, cuello en S, pico curvo, una pata recogida
const Flamenco: React.FC<{ size?: number; rosa?: number; t?: number; cria?: boolean }> = ({ size = 520, rosa = 1, t = 0, cria = false }) => {
  const col = mezcla(rosa);
  const osc = mezcla(rosa * 0.8);
  const resp = Math.sin(t / 10) * 3;
  if (cria) {
    return (
      <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible", filter: `drop-shadow(0 0 30px ${col}88)` }}>
        <ellipse cx="100" cy="130" rx="62" ry="50" fill={col} />
        {/* plumón */}
        {new Array(9).fill(0).map((_, i) => <circle key={i} cx={52 + i * 12} cy={92 + Math.sin(i) * 4} r="10" fill={col} />)}
        <circle cx="128" cy={78 + resp} r="34" fill={col} />
        <circle cx="138" cy={72 + resp} r="6" fill="#1a1a2a" />
        <circle cx="140" cy={70 + resp} r="2" fill="#fff" />
        <path d={`M156 ${80 + resp} Q 178 ${84 + resp} 172 ${100 + resp} Q 162 ${92 + resp} 154 ${92 + resp} Z`} fill="#3a3a48" />
        <path d="M80 176 L 76 198 M120 176 L 124 198" stroke="#6b6b7a" strokeWidth="7" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 200 280" style={{ overflow: "visible", filter: `drop-shadow(0 0 40px ${col}aa)` }}>
      {/* patas */}
      <path d="M96 170 L 92 270" stroke={osc} strokeWidth="6" strokeLinecap="round" />
      <path d="M104 170 L 112 214 L 90 224" stroke={osc} strokeWidth="6" strokeLinecap="round" fill="none" />
      {/* cuerpo */}
      <path d={`M40 130 Q 60 ${92 + resp} 120 ${100 + resp} Q 170 108 160 140 Q 140 178 90 176 Q 46 172 40 130 Z`} fill={col} />
      <path d="M70 128 Q 100 112 140 126 Q 118 150 80 150 Z" fill={osc} opacity="0.7" />
      {/* cuello en S */}
      <path d={`M128 ${104 + resp} C 160 80, 120 60, 128 36 C 134 16, 160 14, 166 30`} stroke={col} strokeWidth="16" fill="none" strokeLinecap="round" />
      {/* cabeza y pico */}
      <circle cx="160" cy="28" r="15" fill={col} />
      <circle cx="164" cy="24" r="3.5" fill="#1a1a2a" />
      <path d="M170 24 Q 196 26 192 50 Q 184 40 172 36 Z" fill="#fff4e6" />
      <path d="M186 38 Q 194 44 192 50 Q 186 46 182 42 Z" fill="#1a1a2a" />
    </svg>
  );
};

const Huevo: React.FC<{ size?: number; roto?: number }> = ({ size = 360, roto = 0 }) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 100 120" style={{ overflow: "visible", filter: "drop-shadow(0 0 30px rgba(255,255,255,.35))" }}>
    <path d="M50 4 C 80 4, 94 50, 94 74 C 94 102, 74 116, 50 116 C 26 116, 6 102, 6 74 C 6 50, 20 4, 50 4 Z" fill="#f4efe4" />
    {roto > 0 ? <path d="M10 62 L 24 52 L 36 64 L 50 50 L 62 64 L 76 52 L 90 62" stroke="#7a7060" strokeWidth="3" fill="none" /> : null}
  </svg>
);

const Agua: React.FC<{ t: number }> = ({ t }) => (
  <svg width={1080} height={700} style={{ position: "absolute", left: 0, top: 1280 }}>
    <rect x="0" y="40" width="1080" height="700" fill={`${AGUA}22`} />
    {[0, 1, 2].map((i) => (
      <path key={i} d={`M0 ${50 + i * 60} ${new Array(12).fill(0).map((_, k) => `Q ${k * 90 + 45} ${50 + i * 60 + Math.sin(t / 8 + k + i) * 14} ${(k + 1) * 90} ${50 + i * 60}`).join(" ")}`} stroke={`${AGUA}66`} strokeWidth="4" fill="none" />
    ))}
  </svg>
);

const Gamba: React.FC<{ x: number; y: number; t: number; i: number; s?: number }> = ({ x, y, t, i, s = 1 }) => (
  <div style={{ position: "absolute", left: x + Math.sin(t / 9 + i) * 30, top: y + Math.cos(t / 7 + i) * 16, transform: `scale(${s}) rotate(${Math.sin(t / 10 + i) * 20}deg)` }}>
    <svg width={150} height={90} viewBox="0 0 150 90" style={{ overflow: "visible", filter: "drop-shadow(0 0 14px #ff8a5c)" }}>
      <path d="M20 50 Q 50 10 100 30 Q 130 44 120 60 Q 90 76 40 66 Z" fill="#ff8a5c" />
      {[50, 70, 90].map((xx) => <path key={xx} d={`M${xx} 40 L ${xx - 4} 64`} stroke="#c45a30" strokeWidth="3" />)}
      <path d="M120 40 Q 146 20 148 8 M118 44 Q 140 40 150 34" stroke="#ffb08a" strokeWidth="2.5" fill="none" />
      <circle cx="112" cy="40" r="4" fill="#1a1a2a" />
      <path d="M22 50 L 4 38 L 6 62 Z" fill="#ff8a5c" />
    </svg>
  </div>
);

const Alga: React.FC<{ x: number; y: number; t: number; i: number }> = ({ x, y, t, i }) => (
  <div style={{ position: "absolute", left: x, top: y + Math.sin(t / 12 + i) * 10 }}>
    <svg width={60} height={60} viewBox="0 0 60 60" style={{ filter: "drop-shadow(0 0 10px #ff5a7a)" }}>
      <circle cx="30" cy="30" r="22" fill="#ff5a7a" opacity="0.85" />
      <circle cx="24" cy="24" r="6" fill="#ffd0da" />
    </svg>
  </div>
);

// ---------------------------------------------------------------- escenas
const Gancho: React.FC<EP> = ({ t, dur }) => (
  <AbsoluteFill>
    <Rayos t={t} color={ROSA} fuerza={0.45} />
    <Preguntas t={t} color={ROSA} />
    <Entra t={t} dur={dur} top={480} giro={-12}>
      <Flamenco size={560} rosa={1} t={t} />
    </Entra>
    <Etiqueta t={t} desde={8} texto="¿Nacen rosas?" icono="🦩" color={ROSA} top={1420} grande />
  </AbsoluteFill>
);

const Grises: React.FC<EP> = ({ t, dur, mk }) => {
  const { fps } = useVideoConfig();
  const sale = spring({ frame: t - 6, fps, config: { damping: 11 } });
  return (
    <AbsoluteFill>
      <Luz color={GRIS} fuerza={0.3} />
      <Centro top={720} style={{ transform: `scale(${interpolate(t, [0, 8], [1, 0.2], clamp)})`, opacity: interpolate(t, [4, 10], [1, 0], clamp) }}>
        <Huevo size={360} roto={1} />
      </Centro>
      <Entra t={t} dur={dur} top={620} desde={6} zoom={[1, 1.1]}>
        <div style={{ transform: `translateY(${(1 - sale) * 60}px)` }}>
          <Flamenco size={460} cria rosa={0} t={t} />
        </div>
      </Entra>
      <Numero t={t} desde={Math.max(0, mk("grises") - 2)} texto="GRISES" sub="al nacer" color={GRIS} top={1300} size={170} />
      <Flash t={t} desde={6} color="#ffffff" />
    </AbsoluteFill>
  );
};

const Rosa: React.FC<EP> = ({ t, dur, mk }) => {
  const r = interpolate(t, [mk("rosa") - 30, mk("rosa") + 10], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Rayos t={t * 2} color={mezcla(r)} fuerza={0.3 + r * 0.4} />
      <Agua t={t} />
      <Entra t={t} dur={dur} top={360} zoom={[0.95, 1.08]}>
        <Flamenco size={540} rosa={r} t={t} />
      </Entra>
      <Etiqueta t={t} desde={mk("rosa") - 4} texto="Rosa intenso" icono="✨" color={ROSA} top={1440} grande />
    </AbsoluteFill>
  );
};

const Genes: React.FC<EP> = ({ t, mk }) => (
  <AbsoluteFill>
    <Luz color={C.cian} fuerza={0.25} />
    <Centro top={560} style={{ transform: `rotate(${t * 0.7}deg)` }}>
      <svg width={420} height={420} viewBox="0 0 100 100" style={{ overflow: "visible", filter: `drop-shadow(0 0 24px ${C.cian})` }}>
        {new Array(14).fill(0).map((_, i) => {
          const y = 8 + i * 6.2, a = Math.sin(i / 2 + t / 10) * 34;
          return (
            <g key={i}>
              <line x1={50 - a} y1={y} x2={50 + a} y2={y} stroke="#fff" strokeWidth="2" opacity="0.6" />
              <circle cx={50 - a} cy={y} r="3.4" fill={C.cian} />
              <circle cx={50 + a} cy={y} r="3.4" fill={ROSA} />
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", left: "50%", marginLeft: -210, top: 0, width: 420, height: 420 }}>
        <Tachon t={t} desde={mk("genes") - 6} size={420} />
      </div>
    </Centro>
    <Etiqueta t={t} desde={4} texto="Pista:" icono="🔍" color={C.amarillo} top={420} />
    <Etiqueta t={t} desde={mk("genes") - 4} texto="No es genético" color="#fff" top={1260} grande />
  </AbsoluteFill>
);

const Comida: React.FC<EP> = ({ t, mk }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 55%, ${AGUA}33, transparent 70%)` }} />
    {new Array(16).fill(0).map((_, i) => <Alga key={i} x={80 + random(`ax${i}`) * 900} y={560 + random(`ay${i}`) * 900} t={t} i={i} />)}
    {[[160, 700], [560, 820], [300, 1060], [680, 1180]].map(([x, y], i) => (
      <Gamba key={i} x={x} y={y} t={t} i={i} s={interpolate(t, [mk("comida") + i * 6, mk("comida") + i * 6 + 10], [0, 1], clamp)} />
    ))}
    <Etiqueta t={t} desde={mk("comida")} texto="Algas + gambitas" icono="🦐" color={C.amarillo} top={420} />
    <Etiqueta t={t} desde={mk("carotenoides") - 10} texto="CAROTENOIDES" icono="🧪" color={ROSA} top={1450} grande />
  </AbsoluteFill>
);

const Zanahoria: React.FC<EP> = ({ t, dur, mk }) => (
  <AbsoluteFill>
    <Rayos t={t} color="#FF9A3C" fuerza={0.5} />
    <Entra t={t} dur={dur} top={560} giro={18}>
      <svg width={420} height={520} viewBox="0 0 100 124" style={{ overflow: "visible", filter: "drop-shadow(0 0 40px #FF9A3C)" }}>
        <path d="M38 26 Q 50 22 62 26 L 52 120 Q 50 124 48 120 Z" fill="#FF8A1E" />
        {[40, 56, 72, 88].map((y) => <path key={y} d={`M${44 + (y - 40) / 12} ${y} l 8 2`} stroke="#c45a00" strokeWidth="2" />)}
        <path d="M50 26 Q 40 6 30 2 M50 26 Q 52 4 50 0 M50 26 Q 62 6 72 4" stroke="#4CD07D" strokeWidth="6" fill="none" strokeLinecap="round" />
      </svg>
    </Entra>
    <Etiqueta t={t} desde={4} texto="Mismo pigmento" icono="🥕" color="#FF9A3C" top={1400} grande />
    <Flash t={t} desde={mk("zanahoria") - 2} color="#ffe0c0" />
  </AbsoluteFill>
);

const Plumas: React.FC<EP> = ({ t, dur, mk }) => {
  const anos = mk("anos");
  const r = interpolate(t, [mk("plumas"), anos + 10], [0.15, 1], clamp);
  const palido = interpolate(t, [mk("palidos") - 30, mk("palidos")], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Rayos t={t * 2} color={ROSA} fuerza={0.35} />
      <Agua t={t} />
      {/* plumas nuevas que se tiñen */}
      {new Array(8).fill(0).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: 90 + i * 115, top: 400 + Math.sin(t / 10 + i) * 20, opacity: interpolate(t, [mk("plumas") + i * 3, mk("plumas") + i * 3 + 8], [0, 0.9], clamp) }}>
          <svg width={70} height={130} viewBox="0 0 40 80"><path d="M20 2 C 36 20, 36 56, 20 78 C 4 56, 4 20, 20 2 Z" fill={mezcla(r)} /><path d="M20 4 L 20 78" stroke="#fff" strokeWidth="1.5" opacity="0.6" /></svg>
        </div>
      ))}
      <Centro top={620} style={{ display: "flex", gap: 30 }}>
        <div style={{ transform: `scale(${interpolate(t, [0, dur], [1, 1.06])})` }}>
          <Flamenco size={palido > 0.5 ? 380 : 460} rosa={r} t={t} />
        </div>
        {palido > 0.02 ? (
          <div style={{ opacity: palido, transform: `scale(${palido})` }}>
            <Flamenco size={380} rosa={0.25} t={t + 30} />
          </div>
        ) : null}
      </Centro>
      <Numero t={t} desde={anos - 4} texto="2-3 AÑOS" sub="para ponerse rosa" color={ROSA} top={1360} size={130} />
      <Etiqueta t={t} desde={mk("palidos") - 6} texto="Si comen mal: pálidos" icono="⚠" color={GRIS} top={1640} />
      <Flash t={t} desde={mk("plumas")} color="#ffd6e6" />
    </AbsoluteFill>
  );
};

const Cta: React.FC<EP> = ({ t, mk }) => (
  <AbsoluteFill>
    <Rayos t={t} color={ROSA} fuerza={0.4} />
    <Centro top={520}>
      <Flamenco size={480} rosa={1} t={t} />
    </Centro>
    <Etiqueta t={t} desde={4} texto="¿Eres lo que comes?" icono="🍽" color={C.amarillo} top={1380} />
    <Cierre t={t} desde={mk("comes") + 14} />
  </AbsoluteFill>
);

export const ESCENAS_FLAMENCOS: Record<string, React.FC<EP>> = {
  f_gancho: Gancho, f_grises: Grises, f_rosa: Rosa, f_genes: Genes, f_comida: Comida, f_zanahoria: Zanahoria, f_plumas: Plumas, f_cta: Cta,
};
