// Kit visual del canal «Sala de Espera» (identidad propia: crema clínico + turquesa, coral para alertas).
import React from "react";
import { AbsoluteFill, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/fonts";

export const FT = "Archivo Black";
export const FB = "Montserrat";
loadFont({ family: FT, url: staticFile("fonts/archivo-black-latin-400-normal.woff2"), weight: "400" });
for (const w of ["600", "800"]) loadFont({ family: FB, url: staticFile(`fonts/montserrat-latin-${w}-normal.woff2`), weight: w });

export const P = {
  crema: "#FFF6EA",
  crema2: "#F4E6D2",
  turquesa: "#16C2B0",
  turquesaOsc: "#0B7F78",
  coral: "#FF5A5F",
  amarillo: "#FFC83D",
  tinta: "#1E2A3A",
  piel: "#F2C29B",
  pielOsc: "#D9A27A",
  agua: "#4FC3F7",
};
export const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export type EP = { t: number; dur: number; mk: (k: string) => number };

export const Centro: React.FC<{ children: React.ReactNode; top: number; style?: React.CSSProperties }> = ({ children, top, style }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center", ...style }}>{children}</div>
);

export const Pop: React.FC<{ t: number; desde: number; children: React.ReactNode; top: number; left?: number }> = ({ t, desde, children, top, left }) => {
  const { fps } = useVideoConfig();
  if (t < desde) return null;
  const s = spring({ frame: t - desde, fps, config: { damping: 10, mass: 0.6 } });
  const st: React.CSSProperties = { transform: `scale(${s})` };
  return left === undefined ? <Centro top={top} style={st}>{children}</Centro> : <div style={{ position: "absolute", left, top, ...st }}>{children}</div>;
};

// Etiqueta de dato (parte de arriba de la pantalla)
export const Etiqueta: React.FC<{ t: number; desde: number; texto: string; color?: string; top?: number; icono?: string; grande?: boolean }> = ({ t, desde, texto, color = P.turquesa, top = 330, icono, grande }) => (
  <Pop t={t} desde={desde} top={top}>
    <div style={{ background: "#fff", border: `6px solid ${color}`, color: P.tinta, fontFamily: FB, fontWeight: 800, fontSize: grande ? 70 : 54, padding: "12px 34px", borderRadius: 999, boxShadow: `0 10px 0 ${color}, 0 18px 30px rgba(30,42,58,.18)`, whiteSpace: "nowrap" }}>
      {icono ? <span style={{ marginRight: 14 }}>{icono}</span> : null}
      {texto}
    </div>
  </Pop>
);

// X coral que se estampa (lo que NO hay que hacer)
export const XRoja: React.FC<{ t: number; desde: number; size?: number }> = ({ t, desde, size = 520 }) => {
  const { fps } = useVideoConfig();
  if (t < desde) return null;
  const s = spring({ frame: t - desde, fps, config: { damping: 8, mass: 0.5 } });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ transform: `scale(${2 - s}) rotate(${(1 - s) * 30}deg)`, opacity: Math.min(1, s * 1.5), filter: "drop-shadow(0 8px 0 rgba(0,0,0,.15))" }}>
        <path d="M18 18 L 82 82 M82 18 L 18 82" stroke={P.coral} strokeWidth="16" strokeLinecap="round" />
      </svg>
    </AbsoluteFill>
  );
};

export const Check: React.FC<{ size?: number }> = ({ size = 90 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill={P.turquesa} /><path d="M28 52 L 44 68 L 74 34" stroke="#fff" strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

// Barrido del «escáner» turquesa (recurso propio del canal): revela lo que hay debajo a su paso
export const Escaner: React.FC<{ t: number; desde: number; dur?: number; children: React.ReactNode; fuera: React.ReactNode; alto?: number }> = ({ t, desde, dur = 24, children, fuera, alto = 1920 }) => {
  const p = interpolate(t, [desde, desde + dur], [0, 1], cl);
  const y = p * alto;
  return (
    <AbsoluteFill>
      <AbsoluteFill>{fuera}</AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `inset(0 0 ${100 - p * 100}% 0)` }}>{children}</AbsoluteFill>
      {p > 0 && p < 1 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: y - 6, height: 12, background: P.turquesa, boxShadow: `0 0 40px 12px ${P.turquesa}aa` }} />
      ) : null}
    </AbsoluteFill>
  );
};

// Lupa circular con detalle (zoom microscópico)
export const Lupa: React.FC<{ t: number; desde: number; size?: number; children: React.ReactNode; top: number }> = ({ t, desde, size = 620, children, top }) => {
  const { fps } = useVideoConfig();
  if (t < desde) return null;
  const s = spring({ frame: t - desde, fps, config: { damping: 13 } });
  return (
    <Centro top={top} style={{ transform: `scale(${s})` }}>
      <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", border: `14px solid #fff`, boxShadow: `0 0 0 8px ${P.turquesa}, 0 24px 50px rgba(30,42,58,.3)`, background: "#FDE3D6", position: "relative" }}>{children}</div>
    </Centro>
  );
};

// Fondo crema con «mota» suave (todas las escenas interiores)
export const Fondo: React.FC<{ color?: string; color2?: string }> = ({ color = P.crema, color2 = P.crema2 }) => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, ${color}, ${color2} 80%)` }}>
    {new Array(14).fill(0).map((_, i) => (
      <div key={i} style={{ position: "absolute", left: random(`f${i}`) * 1080, top: random(`g${i}`) * 1920, width: 120 + random(`h${i}`) * 200, height: 120 + random(`h${i}`) * 200, borderRadius: "50%", background: "rgba(255,255,255,.35)" }} />
    ))}
  </AbsoluteFill>
);

// ---------------------------------------------------------------- personajes originales (vista frontal, articulados)
export type Look = { piel: string; pielOsc?: string; pelo: string; arriba: string; abajo: string; peinado: "corto" | "mono"; gafas?: boolean; banador?: boolean };
export const NICO: Look = { piel: P.piel, pelo: "#3B2A20", arriba: "#FF8A3D", abajo: "#2E4B7A", peinado: "corto" };
export const NICO_PLAYA: Look = { ...NICO, banador: true };
export const VERA: Look = { piel: "#C98E6A", pelo: "#2B1A12", arriba: P.turquesa, abajo: P.turquesaOsc, peinado: "mono", gafas: true };

export type Gesto = { expr?: "neutro" | "dolor" | "sorpresa" | "feliz" | "duda"; brazoD?: number; codoD?: number; brazoI?: number; codoI?: number; cabeza?: number; mira?: number };

export const Persona: React.FC<{ look: Look; g?: Gesto; size?: number; manoD?: React.ReactNode; marcaBrazo?: number }> = ({ look: L, g = {}, size = 520, manoD, marcaBrazo = 0 }) => {
  const f = useCurrentFrame();
  const { expr = "neutro", brazoD = 10, codoD = 0, brazoI = -10, codoI = 0, cabeza = 0, mira = 0 } = g;
  const parpadeo = (f % 95) < 4 ? 0.15 : 1;
  const resp = Math.sin(f / 14) * 2;
  const ojoH = (expr === "sorpresa" ? 22 : expr === "dolor" ? 6 : 16) * parpadeo;
  const boca = {
    neutro: "M128 160 Q 150 168 172 160",
    feliz: "M124 154 Q 150 182 176 154",
    dolor: "M126 166 Q 150 150 174 166",
    sorpresa: "M140 160 Q 150 182 160 160 Q 150 150 140 160",
    duda: "M130 164 Q 145 158 172 166",
  }[expr];
  const cejas = expr === "dolor" ? ["M98 92 L 130 104", "M202 92 L 170 104"] : expr === "sorpresa" ? ["M100 84 Q 115 74 132 84", "M168 84 Q 185 74 200 84"] : expr === "duda" ? ["M100 92 L 132 92", "M168 84 Q 185 76 200 88"] : ["M100 92 Q 115 86 132 92", "M168 92 Q 185 86 200 92"];
  const brazo = (lado: 1 | -1, ang: number, codo: number, mano?: React.ReactNode) => (
    <g transform={`translate(${150 + lado * 70} 236) rotate(${ang})`}>
      <rect x={-17} y={0} width={34} height={96} rx={17} fill={L.banador ? L.piel : L.arriba} />
      <g transform={`translate(0 90) rotate(${codo})`}>
        <rect x={-15} y={0} width={30} height={92} rx={15} fill={L.piel} />
        {lado === -1 && marcaBrazo > 0 ? (
          <g opacity={marcaBrazo}>
            <path d="M-12 20 Q 0 30 12 20 M-12 40 Q 0 50 12 40 M-12 60 Q 0 70 12 60" stroke={P.coral} strokeWidth="5" fill="none" strokeLinecap="round" />
          </g>
        ) : null}
        <circle cx={0} cy={98} r={20} fill={L.piel} />
        <g transform="translate(0 98)">{mano}</g>
      </g>
    </g>
  );
  return (
    <svg width={size} height={size * 2} viewBox="0 0 300 600" style={{ overflow: "visible" }}>
      <ellipse cx="150" cy="590" rx="110" ry="14" fill="rgba(30,42,58,.15)" />
      {/* piernas */}
      {[-1, 1].map((k) => (
        <g key={k}>
          <rect x={150 + k * 34 - 22} y={400} width={44} height={170} rx={20} fill={L.banador ? L.piel : L.abajo} />
          <ellipse cx={150 + k * 40} cy={574} rx={34} ry={16} fill={L.banador ? L.piel : P.tinta} />
        </g>
      ))}
      <g transform={`translate(0 ${resp})`}>
        {/* tronco */}
        <rect x="80" y="210" width="140" height="210" rx="50" fill={L.banador ? L.piel : L.arriba} />
        {L.banador ? <rect x="80" y="370" width="140" height="60" rx="16" fill={L.arriba} /> : <path d="M120 212 L 150 250 L 180 212" fill="none" stroke="rgba(0,0,0,.15)" strokeWidth="6" />}
        {brazo(-1, brazoI, codoI)}
        {brazo(1, brazoD, codoD, manoD)}
        {/* cuello y cabeza */}
        <rect x="132" y="180" width="36" height="40" rx="12" fill={L.pielOsc ?? L.piel} />
        <g transform={`rotate(${cabeza} 150 200)`}>
          {L.peinado === "mono" ? <circle cx="150" cy="30" r="34" fill={L.pelo} /> : null}
          <ellipse cx="150" cy="120" rx="72" ry="82" fill={L.piel} />
          <ellipse cx="78" cy="124" rx="12" ry="18" fill={L.piel} />
          <ellipse cx="222" cy="124" rx="12" ry="18" fill={L.piel} />
          {L.peinado === "corto" ? <path d="M78 110 Q 70 30 150 34 Q 232 30 222 110 Q 200 70 150 74 Q 104 72 78 110 Z" fill={L.pelo} /> : <path d="M78 116 Q 72 40 150 42 Q 228 40 222 116 Q 196 78 150 80 Q 104 78 78 116 Z" fill={L.pelo} />}
          {/* ojos ovalados con brillo */}
          {[118, 182].map((x) => (
            <g key={x}>
              <ellipse cx={x} cy={120} rx={11} ry={ojoH} fill={P.tinta} />
              {parpadeo > 0.5 ? <circle cx={x + 4 + mira * 3} cy={114} r={4} fill="#fff" /> : null}
            </g>
          ))}
          {cejas.map((d, i) => <path key={i} d={d} stroke={L.pelo} strokeWidth="7" strokeLinecap="round" fill="none" />)}
          <ellipse cx="106" cy="148" rx="14" ry="8" fill={P.coral} opacity="0.25" />
          <ellipse cx="194" cy="148" rx="14" ry="8" fill={P.coral} opacity="0.25" />
          <path d="M146 128 Q 150 142 156 136" stroke={L.pielOsc ?? "#c98e6a"} strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d={boca} stroke={P.tinta} strokeWidth="6" fill={expr === "sorpresa" ? P.tinta : "none"} strokeLinecap="round" />
          {L.gafas ? (
            <g fill="none" stroke={P.tinta} strokeWidth="5">
              <circle cx="118" cy="120" r="24" /><circle cx="182" cy="120" r="24" /><path d="M142 118 L 158 118" />
            </g>
          ) : null}
          {expr === "dolor" ? <path d="M226 70 l 14 -10 M232 90 l 18 -2 M226 52 l 6 -16" stroke={P.coral} strokeWidth="5" strokeLinecap="round" /> : null}
        </g>
      </g>
    </svg>
  );
};

// Subtítulos en el centro-abajo, palabra a palabra, la activa en turquesa
export const Subtitulos: React.FC<{ captions: { text: string; startMs: number; endMs: number }[] }> = ({ captions }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = (f / fps) * 1000;
  const lineas = React.useMemo(() => {
    const out: (typeof captions)[] = [];
    let cur: typeof captions = [];
    for (const c of captions) {
      cur.push(c);
      if (/[.,;:!?…]$/.test(c.text.trim()) || cur.length >= 3) { out.push(cur); cur = []; }
    }
    if (cur.length) out.push(cur);
    return out;
  }, [captions]);
  const idx = lineas.findIndex((l, i) => ms >= l[0].startMs - 60 && (i + 1 >= lineas.length || ms < lineas[i + 1][0].startMs - 60));
  if (idx < 0) return null;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 1400, display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: 30, rowGap: 4 }}>
      {lineas[idx].map((c, j) => {
        const activa = ms >= c.startMs - 60 && ms < (lineas[idx][j + 1]?.startMs ?? c.endMs + 300) - 60;
        return (
          <span key={j} style={{ fontFamily: FB, fontWeight: 800, fontSize: 82, color: activa ? P.turquesa : "#fff", WebkitTextStroke: `9px ${P.tinta}`, paintOrder: "stroke fill", textTransform: "uppercase", letterSpacing: 1, transform: activa ? "scale(1.08)" : "none", display: "inline-block" }}>
            {c.text.trim()}
          </span>
        );
      })}
    </div>
  );
};

export const Firma: React.FC = () => (
  <div style={{ position: "absolute", left: 40, top: 40, display: "flex", alignItems: "center", gap: 12, opacity: 0.75 }}>
    <div style={{ background: P.turquesa, color: "#fff", fontFamily: FT, fontSize: 24, borderRadius: 10, padding: "4px 10px" }}>Nº</div>
    <div style={{ fontFamily: FB, fontWeight: 800, fontSize: 26, color: P.tinta }}>Sala de Espera</div>
  </div>
);

// Tarjeta final: ticket de turno (marca del canal)
export const Cierre: React.FC<{ t: number; desde: number }> = ({ t, desde }) => {
  const { fps } = useVideoConfig();
  if (t < desde) return null;
  const s = spring({ frame: t - desde, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ background: `rgba(30,42,58,${0.55 * s})` }}>
      <Centro top={560} style={{ transform: `scale(${s}) rotate(${(1 - s) * -8}deg)` }}>
        <div style={{ width: 640, background: "#fff", borderRadius: 30, padding: "40px 30px", textAlign: "center", boxShadow: `0 16px 0 ${P.turquesa}, 0 30px 60px rgba(0,0,0,.3)`, borderTop: `22px solid ${P.turquesa}` }}>
          <div style={{ fontFamily: FB, fontWeight: 800, fontSize: 36, color: P.turquesaOsc, letterSpacing: 6 }}>SU TURNO</div>
          <div style={{ fontFamily: FT, fontSize: 150, color: P.tinta, lineHeight: 1.1 }}>Nº 001</div>
          <div style={{ fontFamily: FT, fontSize: 64, color: P.turquesa }}>SALA DE ESPERA</div>
          <div style={{ marginTop: 12, fontFamily: FB, fontWeight: 800, fontSize: 38, color: P.tinta }}>Síguenos: tu salud, explicada</div>
        </div>
      </Centro>
    </AbsoluteFill>
  );
};
