// Short 001 · «Si te pica una medusa, NO te eches agua dulce». Cada escena dibuja lo que se narra.
import React from "react";
import { AbsoluteFill, interpolate, random, spring, useVideoConfig } from "remotion";
import { Centro, Check, Cierre, cl, EP, Escaner, Etiqueta, Fondo, FT, FB, Lupa, NICO_PLAYA, P, Persona, Pop, VERA, XRoja } from "./kit";

// ---------------------------------------------------------------- dibujos
const Playa: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: "linear-gradient(to bottom, #BFEFFF 0%, #E9FBFF 40%)" }} />
    <div style={{ position: "absolute", left: 760, top: 220, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, #FFF3B0, #FFC83D 70%)", boxShadow: "0 0 80px #FFE58A" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 700, height: 360, background: "linear-gradient(to bottom, #3EC6E0, #1A9EC0)" }}>
      {new Array(6).fill(0).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: ((t * 1.2 + i * 190) % 1300) - 200, top: 40 + i * 50, width: 160, height: 10, borderRadius: 5, background: "rgba(255,255,255,.55)" }} />
      ))}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1040, bottom: 0, background: "linear-gradient(to bottom, #F7DFA9, #EBC57E)" }} />
    {/* sombrilla */}
    <svg width={360} height={420} viewBox="0 0 180 210" style={{ position: "absolute", left: 40, top: 700 }}>
      <path d="M10 70 Q 90 -20 170 70 Z" fill={P.coral} />
      <path d="M50 70 Q 90 0 130 70" fill="#fff" opacity="0.8" />
      <line x1="90" y1="40" x2="90" y2="210" stroke="#8a6a4a" strokeWidth="6" />
    </svg>
  </AbsoluteFill>
);

const Botella: React.FC<{ size?: number; inclina?: number }> = ({ size = 160, inclina = 0 }) => (
  <svg width={size} height={size * 2} viewBox="0 0 60 120" style={{ transform: `rotate(${inclina}deg)`, overflow: "visible" }}>
    <rect x="22" y="0" width="16" height="12" rx="3" fill={P.turquesaOsc} />
    <path d="M18 12 h24 q6 10 6 22 v76 q0 8 -8 8 h-20 q-8 0 -8 -8 v-76 q0 -12 6 -22 z" fill="rgba(79,195,247,.55)" stroke="#fff" strokeWidth="3" />
    <rect x="12" y="50" width="36" height="26" fill="#fff" opacity="0.85" />
  </svg>
);

const Gota: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 22 * s, height: 30 * s, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: P.agua, boxShadow: "inset -4px -4px 0 rgba(0,0,0,.08)" }} />
);

// Cápsula urticante (cnidocito) con el arpón enrollado; hincha 0..1, dispara 0..1
const Capsula: React.FC<{ size?: number; hincha?: number; dispara?: number; brillo?: number }> = ({ size = 360, hincha = 0, dispara = 0, brillo = 0 }) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 100 130" style={{ overflow: "visible", filter: brillo ? `drop-shadow(0 0 ${20 * brillo}px ${P.amarillo})` : "none" }}>
    <g transform={`translate(50 80) scale(${1 + hincha * 0.25}) translate(-50 -80)`}>
      <ellipse cx="50" cy="80" rx="34" ry="44" fill="#FFE1EC" stroke="#E07AA6" strokeWidth="4" />
      <path d="M50 40 L 50 30" stroke="#E07AA6" strokeWidth="5" />
      {dispara < 0.3 ? (
        <path d="M50 110 C 30 104, 30 90, 50 88 C 70 86, 70 72, 50 70 C 30 68, 30 56, 50 54 C 64 52, 66 46, 50 44" stroke="#8A3D6B" strokeWidth="4" fill="none" />
      ) : null}
      <circle cx="44" cy="96" r="5" fill="#9BE36B" opacity="0.8" />
      <circle cx="58" cy="74" r="4" fill="#9BE36B" opacity="0.8" />
    </g>
    {dispara > 0 ? (
      <g>
        <line x1="50" y1="36" x2="50" y2={36 - dispara * 110} stroke="#8A3D6B" strokeWidth="5" strokeLinecap="round" />
        <path d={`M44 ${46 - dispara * 110} L 50 ${30 - dispara * 110} L 56 ${46 - dispara * 110}`} fill="#8A3D6B" />
        <circle cx="50" cy={30 - dispara * 110} r="6" fill="#9BE36B" />
      </g>
    ) : null}
  </svg>
);

const Piel: React.FC<{ t: number; tentaculo?: number; capsulas?: number }> = ({ t, tentaculo = 1, capsulas = 0 }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: "linear-gradient(to bottom, #F7C9A8, #EDB28C)" }} />
    {new Array(30).fill(0).map((_, i) => (
      <div key={i} style={{ position: "absolute", left: random(`px${i}`) * 1080, top: 300 + random(`py${i}`) * 1200, width: 6, height: 6, borderRadius: 3, background: "rgba(150,80,50,.25)" }} />
    ))}
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <path d={`M -40 900 C 200 ${780 + Math.sin(t / 12) * 10}, 360 1060, 560 920 S 900 820, 1120 960`} stroke="rgba(230,120,170,.55)" strokeWidth="46" fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${tentaculo} 1`} />
      {new Array(28).fill(0).map((_, i) => {
        const x = -20 + i * 42;
        const y = 900 + Math.sin(i / 2.2) * 70;
        const v = interpolate(capsulas, [i / 28, i / 28 + 0.1], [0, 1], cl);
        return v > 0 ? <ellipse key={i} cx={x} cy={y} rx={12 * v} ry={16 * v} fill="#FFE1EC" stroke="#E07AA6" strokeWidth="3" /> : null;
      })}
    </svg>
  </AbsoluteFill>
);

const Vinagre: React.FC<{ size?: number }> = ({ size = 240 }) => (
  <svg width={size} height={size * 2} viewBox="0 0 60 120">
    <rect x="23" y="0" width="14" height="14" rx="3" fill="#5a3a1c" />
    <path d="M20 14 h20 v14 q10 8 10 22 v62 q0 8 -8 8 h-24 q-8 0 -8 -8 v-62 q0 -14 10 -22 z" fill="rgba(240,220,170,.8)" stroke="#fff" strokeWidth="3" />
    <rect x="12" y="60" width="36" height="30" fill="#fff" />
    <text x="30" y="80" textAnchor="middle" fontFamily={FT} fontSize="9" fill={P.tinta}>VINAGRE</text>
  </svg>
);

const Paso: React.FC<{ n: number; icono: React.ReactNode; texto: string; sub?: string; color?: string }> = ({ n, icono, texto, sub, color = P.turquesa }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 26, width: 900, background: "#fff", borderRadius: 34, padding: "22px 30px", boxShadow: `0 10px 0 ${color}, 0 20px 30px rgba(30,42,58,.15)` }}>
    <div style={{ width: 88, height: 88, borderRadius: 44, background: color, color: "#fff", fontFamily: FT, fontSize: 52, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{n}</div>
    <div style={{ width: 120, display: "flex", justifyContent: "center", flexShrink: 0 }}>{icono}</div>
    <div>
      <div style={{ fontFamily: FB, fontWeight: 800, fontSize: 50, color: P.tinta, lineHeight: 1.1 }}>{texto}</div>
      {sub ? <div style={{ fontFamily: FB, fontWeight: 800, fontSize: 34, color: P.coral, marginTop: 4 }}>{sub}</div> : null}
    </div>
  </div>
);

// ---------------------------------------------------------------- escenas
const Gancho: React.FC<EP> = ({ t, mk }) => {
  const inclina = interpolate(t, [mk("botella") - 14, mk("botella")], [0, 110], cl);
  return (
    <AbsoluteFill>
      <Playa t={t} />
      <Centro top={560} style={{ transform: `scale(${interpolate(t, [0, 120], [1, 1.08], cl)})`, transformOrigin: "50% 40%" }}>
        <div style={{ position: "relative" }}>
          <Persona look={NICO_PLAYA} size={400} marcaBrazo={interpolate(t, [0, mk("medusa")], [0.3, 1], cl)} g={{ expr: t < mk("error") ? "dolor" : "sorpresa", brazoI: -30, codoI: -70, brazoD: -100, codoD: -40, cabeza: -6 }} />
          <div style={{ position: "absolute", left: 270, top: 190 }}><Botella size={110} inclina={inclina} /></div>
          {t > mk("botella")
            ? new Array(6).fill(0).map((_, i) => {
                const p = ((t - mk("botella")) * 0.06 + i / 6) % 1;
                return <Gota key={i} x={150 - p * 60} y={300 + p * 120} s={0.9} />;
              })
            : null}
        </div>
      </Centro>
      <Etiqueta t={t} desde={mk("botella") - 4} texto="¿Agua de la botella?" icono="💧" />
      <XRoja t={t} desde={mk("error")} size={640} />
    </AbsoluteFill>
  );
};

const Intro: React.FC<EP> = ({ t, mk }) => (
  <AbsoluteFill>
    <Playa t={t} />
    {[120, 420, 720].map((x, i) => (
      <div key={x} style={{ position: "absolute", left: x - 30, top: 820 + (i % 2) * 40, transform: `scale(${spring({ frame: t - i * 6, fps: 30, config: { damping: 12 } })})` }}>
        <Persona look={{ ...NICO_PLAYA, arriba: ["#FF8A3D", "#7E57C2", "#26A69A"][i], piel: ["#F2C29B", "#C98E6A", "#E8B48C"][i], pelo: ["#3B2A20", "#111", "#A0522D"][i] }} size={260} g={{ expr: t > mk("duela") ? "dolor" : "neutro", brazoD: -100, codoD: -40, brazoI: -30, codoI: -70 }} manoD={<g transform="rotate(100)"><rect x="-10" y="-34" width="20" height="44" rx="6" fill={P.agua} /></g>} />
      </div>
    ))}
    <Etiqueta t={t} desde={mk("playa") - 20} texto="Lo hace casi todo el mundo" icono="🏖" />
    <Etiqueta t={t} desde={mk("duela")} texto="¡Puede doler más!" icono="⚠" color={P.coral} top={470} />
  </AbsoluteFill>
);

const Capsulas: React.FC<EP> = ({ t, dur, mk }) => {
  const caps = interpolate(t, [mk("miles") - 6, mk("miles") + 24], [0, 1], cl);
  return (
    <AbsoluteFill>
      <Escaner t={t} desde={mk("tentaculo") - 10} dur={22} fuera={<Piel t={t} tentaculo={interpolate(t, [0, 30], [0, 1], cl)} />}>
        <Piel t={t} capsulas={caps} />
        <AbsoluteFill style={{ background: `${P.turquesa}22` }} />
      </Escaner>
      <Etiqueta t={t} desde={mk("muerde")} texto="No muerde" icono="🪼" color={P.coral} />
      <Etiqueta t={t} desde={mk("miles")} texto="Miles de cápsulas" color={P.turquesa} top={470} />
      <Lupa t={t} desde={mk("arpon") - 8} top={260} size={560}>
        <Centro top={40} style={{ transform: `scale(${interpolate(t, [mk("arpon"), dur], [1, 1.1], cl)})` }}>
          <Capsula size={360} brillo={t > mk("veneno") ? 0.6 : 0} />
        </Centro>
      </Lupa>
      {t > mk("veneno") ? <Etiqueta t={t} desde={mk("veneno")} texto="Arpón + veneno" icono="☠" color={P.coral} top={880} /> : null}
    </AbsoluteFill>
  );
};

const Cargadas: React.FC<EP> = ({ t }) => {
  const pulso = 0.5 + 0.5 * Math.abs(Math.sin(t / 5));
  return (
    <AbsoluteFill>
      <Fondo color="#FFE9F1" color2="#F7C9DA" />
      {[[140, 620], [560, 520], [360, 860], [720, 900], [200, 1100], [640, 1150]].map(([x, y], i) => (
        <div key={i} style={{ position: "absolute", left: x, top: y + Math.sin(t / 6 + i) * 8 }}>
          <Capsula size={170} brillo={pulso} />
        </div>
      ))}
      <Etiqueta t={t} desde={6} texto="Aún cargadas" icono="⚡" color={P.amarillo} />
    </AbsoluteFill>
  );
};

const Dulce: React.FC<EP> = ({ t, mk }) => {
  const entra = interpolate(t, [mk("dulce"), mk("hincha")], [0, 1], cl);
  const hincha = interpolate(t, [mk("hincha") - 4, mk("sale") - 2], [0, 1], cl);
  const dispara = interpolate(t, [mk("sale") - 2, mk("sale") + 6], [0, 1], cl);
  const { fps } = useVideoConfig();
  const pum = spring({ frame: t - mk("sale"), fps, config: { damping: 8 } });
  return (
    <AbsoluteFill>
      <Fondo color="#EAF8FF" color2="#C9ECF7" />
      <Centro top={620}>
        <Capsula size={440} hincha={hincha} dispara={dispara} />
      </Centro>
      {entra > 0 && entra < 1
        ? new Array(8).fill(0).map((_, i) => {
            const p = (entra * 2 + i / 8) % 1;
            return <Gota key={i} x={540 + Math.cos(i) * (300 - p * 220) - 11} y={980 + Math.sin(i) * (300 - p * 220)} s={1.3} />;
          })
        : null}
      <Etiqueta t={t} desde={mk("dulce")} texto="Agua dulce" icono="💧" color={P.agua} />
      {t > mk("sale") ? (
        <Centro top={470} style={{ transform: `scale(${pum}) rotate(-8deg)` }}>
          <div style={{ fontFamily: FT, fontSize: 130, color: P.coral, WebkitTextStroke: `8px ${P.tinta}`, paintOrder: "stroke fill" }}>¡PUM!</div>
        </Centro>
      ) : null}
    </AbsoluteFill>
  );
};

const VinagreEsc: React.FC<EP> = ({ t, mk }) => (
  <AbsoluteFill>
    <Fondo />
    <Pop t={t} desde={2} top={560}><Vinagre size={260} /></Pop>
    {new Array(5).fill(0).map((_, i) => (
      <div key={i} style={{ position: "absolute", left: 180 + i * 170, top: 520 - ((t * 2 + i * 40) % 160), fontFamily: FT, fontSize: 90, color: P.turquesa, opacity: 0.35 }}>?</div>
    ))}
    <Etiqueta t={t} desde={mk("vinagre") - 6} texto="¿Vinagre?" color={P.amarillo} />
  </AbsoluteFill>
);

const Receta: React.FC<EP> = ({ t, mk }) => {
  const fase2 = t >= mk("mar") - 8;
  return (
    <AbsoluteFill>
      <Fondo />
      {!fase2 ? (
        <>
          <Centro top={560}><Vinagre size={260} /></Centro>
          <XRoja t={t} desde={mk("tampoco")} size={560} />
          <Etiqueta t={t} desde={mk("tampoco")} texto="Mediterráneo: NO" icono="🌊" color={P.coral} />
        </>
      ) : (
        <>
          <Etiqueta t={t} desde={mk("mar") - 8} texto="Lo que SÍ sirve" color={P.turquesa} top={300} grande />
          <Pop t={t} desde={mk("mar")} top={500}>
            <Paso n={1} texto="Agua del mar" sub="sin frotar" icono={<svg width={110} height={90} viewBox="0 0 110 90"><path d="M5 50 Q 30 30 55 50 T 105 50 V90 H5Z" fill={P.agua} /><path d="M5 40 Q 30 20 55 40 T 105 40" stroke="#fff" strokeWidth="5" fill="none" /></svg>} />
          </Pop>
          <Pop t={t} desde={mk("pinzas")} top={720}>
            <Paso n={2} texto="Quita los restos" sub="con pinzas" icono={<svg width={110} height={100} viewBox="0 0 110 100"><path d="M10 90 L 60 10 L 70 14 L 24 92 Z" fill="#9AA6B5" /><path d="M30 92 L 100 20 L 106 28 L 40 96 Z" fill="#7d8896" /></svg>} />
          </Pop>
          <Pop t={t} desde={mk("frio")} top={940}>
            <Paso n={3} texto="Frío en un paño" sub={t >= mk("hielo") ? "nunca hielo directo" : undefined} icono={<svg width={110} height={100} viewBox="0 0 110 100"><rect x="10" y="20" width="90" height="70" rx="14" fill="#E3F2FD" stroke={P.agua} strokeWidth="5" /><path d="M30 40 l 10 10 l -10 10 M60 40 l 10 10 l -10 10" stroke={P.agua} strokeWidth="5" fill="none" /></svg>} />
          </Pop>
          {t >= mk("frio") + 20 ? <Pop t={t} desde={mk("frio") + 20} left={880} top={540}><Check size={110} /></Pop> : null}
        </>
      )}
    </AbsoluteFill>
  );
};

const Cta: React.FC<EP> = ({ t, mk }) => (
  <AbsoluteFill>
    <Playa t={t} />
    <Centro top={620}>
      <div style={{ position: "relative" }}>
        <Persona look={{ ...VERA, arriba: "#E53935", abajo: "#B71C1C" }} size={380} g={{ expr: "feliz", brazoD: -150, codoD: -20, brazoI: 10 }} />
        <div style={{ position: "absolute", left: 300, top: 60, transform: `scale(${spring({ frame: t - mk("socorrista"), fps: 30, config: { damping: 10 } })})` }}>
          <div style={{ background: "#fff", borderRadius: 30, padding: "16px 26px", border: `6px solid ${P.coral}`, fontFamily: FT, fontSize: 80, color: P.coral }}>112</div>
        </div>
      </div>
    </Centro>
    <Etiqueta t={t} desde={mk("respirar") - 6} texto="¿Le cuesta respirar?" icono="🚨" color={P.coral} />
    <Etiqueta t={t} desde={mk("socorrista")} texto="Socorrista o 112" color={P.coral} top={470} />
    <Cierre t={t} desde={mk("playa2") + 14} />
  </AbsoluteFill>
);

export const ESCENAS: Record<string, React.FC<EP>> = {
  m_gancho: Gancho, m_intro: Intro, m_capsulas: Capsulas, m_cargadas: Cargadas, m_dulce: Dulce, m_vinagre: VinagreEsc, m_receta: Receta, m_cta: Cta,
};
