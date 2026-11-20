import React from "react";
import { interpolate, spring } from "remotion";
import { Icon } from "../short/Icons";
import { countUp } from "../short/SceneCard";
import { P, TEXTO_BORDE } from "./paleta";
import { Personaje, lookN } from "./Personaje";

const OUT = { stroke: P.contorno, strokeWidth: 6, strokeLinejoin: "round" as const };
const FONT = "Montserrat";

// Bocadillos que aparecen escalonados alrededor del personaje.
export const Bocadillos: React.FC<{ textos: string[]; frame: number; fps: number }> = ({ textos, frame, fps }) => {
  const sitios = [
    [40, 980, -4], [620, 1040, 3], [60, 1130, 2], [600, 1180, -3], [120, 300, -2], [600, 330, 4],
  ];
  return (
    <g>
      {textos.slice(0, 6).map((t, i) => {
        const s = spring({ frame: frame - 6 - i * 7, fps, config: { damping: 11, mass: 0.6 } });
        const [x, y, rot] = sitios[i];
        const w = Math.max(220, t.length * 27 + 70);
        return (
          <g key={i} transform={`translate(${x + w / 2} ${y + 50}) rotate(${rot}) scale(${s}) translate(${-w / 2} -50)`} opacity={s}>
            <rect x="4" y="12" width={w} height="100" rx="34" fill="#000" opacity="0.28" />
            <rect x="0" y="0" width={w} height="100" rx="34" fill="#F3EBDD" {...OUT} />
            <path d={`M${i % 2 ? w - 70 : 50} 96 l${i % 2 ? 26 : -6} 34 l${i % 2 ? -2 : 34} -34`} fill="#F3EBDD" {...OUT} />
            
            <text x={w / 2} y="66" textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize="44" fill={P.contorno}>{t}</text>
          </g>
        );
      })}
    </g>
  );
};

// Lupa: un círculo que se abre sobre un punto y muestra un detalle ampliado.
export const Lupa: React.FC<{ x: number; y: number; icono: string; color?: string; frame: number; fps: number; texto?: string }> = ({
  x, y, icono, color = P.cian, frame, fps, texto,
}) => {
  const s = spring({ frame: frame - 4, fps, config: { damping: 13, mass: 0.9 } });
  const r = interpolate(s, [0, 1], [10, 300]);
  const cx = interpolate(s, [0, 1], [x, 540]);
  const cy = interpolate(s, [0, 1], [y, 660]);
  const pulso = 1 + Math.sin(frame / 8) * 0.03;
  return (
    <g>
      <rect x="0" y="0" width="1080" height="1920" fill="#0B0E2A" opacity={0.45 * s} />
      <path d={`M${x} ${y} L${cx} ${cy}`} stroke="#fff" strokeWidth="6" strokeDasharray="14 12" opacity={0.6 * s} />
      <circle cx={x} cy={y} r={18} fill={P.chispa} opacity={s} />
      <circle cx={cx} cy={cy} r={r + 22} fill={P.contorno} />
      <circle cx={cx} cy={cy} r={r + 14} fill="#fff" />
      <circle cx={cx} cy={cy} r={r} fill={color} />
      <circle cx={cx - r * 0.35} cy={cy - r * 0.4} r={r * 0.25} fill="#fff" opacity="0.18" />
      <g transform={`translate(${cx - r * 0.62 * pulso} ${cy - r * 0.62 * pulso}) scale(${(r * 1.24 * pulso) / 100})`}>
        <g opacity={interpolate(s, [0.6, 1], [0, 1], { extrapolateLeft: "clamp" })}>
          <Icon name={icono} size={100} color={P.contorno} />
        </g>
      </g>
      {texto && (
        <text x={cx} y={cy - r - 50} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize="54" fill="#fff"
          stroke={TEXTO_BORDE} strokeWidth="10" paintOrder="stroke" opacity={s}>{texto}</text>
      )}
    </g>
  );
};

// Multitud que se va llenando; `destacados` personas resaltadas (p. ej. 1 de cada 10).
export const Multitud: React.FC<{ total: number; destacados: number; frame: number; fps: number; todos?: boolean }> = ({
  total, destacados, frame, fps, todos,
}) => {
  const filas = total > 12 ? 3 : 2;
  const porFila = Math.ceil(total / filas);
  const marcados = new Set(Array.from({ length: destacados }).map((_, i) => Math.floor(((i + 0.5) * total) / destacados)));
  const items = Array.from({ length: total }).map((_, i) => {
    const fila = Math.floor(i / porFila);
    const col = i % porFila;
    const escala = 0.36 + fila * 0.08;
    const x = 540 + (col - (porFila - 1) / 2) * (1000 / porFila) + (fila % 2) * 30;
    const y = 900 + fila * 230;
    return { i, fila, x, y, escala };
  });
  return (
    <g>
      {items.map(({ i, x, y, escala }) => {
        const s = spring({ frame: frame - 3 - i * 1.6, fps, config: { damping: 12 } });
        const destacado = todos || marcados.has(i);
        const iluminar = interpolate(frame, [24 + total * 1.6, 34 + total * 1.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <g key={i} transform={`translate(${x} ${y + (1 - s) * 200}) scale(${escala})`} opacity={s}>
            {destacado && !todos && <ellipse cx="0" cy="-380" rx="150" ry="440" fill={P.chispa} opacity={0.3 * iluminar} />}
            <g opacity={destacado ? 1 : 1 - 0.5 * iluminar}>
              <Personaje look={lookN(i + 3)} frame={frame + i * 9} />
            </g>
          </g>
        );
      })}
    </g>
  );
};

// Cifra grande arriba (cuenta hasta su valor).
export const Cifra: React.FC<{ texto: string; sub?: string; frame: number; fps: number; color?: string }> = ({ texto, sub, frame, fps, color = P.chispa }) => {
  const s = spring({ frame, fps, config: { damping: 12 } });
  return (
    <g transform={`translate(540 420) scale(${interpolate(s, [0, 1], [0.6, 1])})`} opacity={s}>
      <text x="0" y="0" textAnchor="middle" fontFamily="Archivo Black" fontSize={texto.length > 9 ? 120 : 150} fill={color}
        stroke={TEXTO_BORDE} strokeWidth="14" paintOrder="stroke">{countUp(texto, frame)}</text>
      {sub && (
        <text x="0" y="80" textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize="46" fill="#fff"
          stroke={TEXTO_BORDE} strokeWidth="10" paintOrder="stroke">{sub}</text>
      )}
    </g>
  );
};

// Marca de altura que baja en el medidor de la pared.
export const MarcaAltura: React.FC<{ frame: number; desde: number; hasta: number }> = ({ frame, desde, hasta }) => {
  const y = interpolate(frame, [10, 40], [desde, hasta], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <g>
      <path d={`M90 ${desde} H330`} stroke={P.cian} strokeWidth="8" strokeDasharray="16 10" opacity="0.8" />
      <path d={`M90 ${y} H330`} stroke={P.coral} strokeWidth="10" />
      <circle cx="330" cy={y} r="14" fill={P.coral} {...OUT} />
    </g>
  );
};

export const Zzz: React.FC<{ x: number; y: number; frame: number }> = ({ x, y, frame }) => (
  <g>
    {[0, 1, 2].map((i) => {
      const t = ((frame + i * 20) % 60) / 60;
      return (
        <text key={i} x={x + t * 80 + i * 10} y={y - t * 160} fontFamily="Archivo Black" fontSize={50 + i * 14} fill="#fff"
          opacity={1 - t} stroke={TEXTO_BORDE} strokeWidth="8" paintOrder="stroke">Z</text>
      );
    })}
  </g>
);

// Objeto ilustrado grande (icono del kit sobre un disco), para temas sin escenario.
export const ObjetoGrande: React.FC<{ icono: string; color: string; frame: number; fps: number }> = ({ icono, color, frame, fps }) => {
  const s = spring({ frame, fps, config: { damping: 12 } });
  const flota = Math.sin(frame / 16) * 16;
  return (
    <g transform={`translate(540 ${760 + flota}) scale(${s})`}>
      <ellipse cx="0" cy="420" rx="260" ry="40" fill="#000" opacity="0.25" />
      <circle cx="0" cy="0" r="330" fill={color} {...OUT} strokeWidth={10} />
      <circle cx="-110" cy="-130" r="80" fill="#fff" opacity="0.18" />
      <g transform="translate(-230 -230)">
        <Icon name={icono} size={460} color={P.contorno} />
      </g>
    </g>
  );
};
