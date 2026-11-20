import React from "react";

// Iconos de línea para las tarjetas 3D. viewBox 0 0 100 100, color = currentColor.
const S = { fill: "none", stroke: "currentColor", strokeWidth: 5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

const paths: Record<string, React.ReactNode> = {
  banana: (<g {...S}><path d="M20 30 C18 66 44 88 84 78 C88 76 88 72 84 70 C54 72 36 56 32 28 Z" /><path d="M20 30 L16 18 L28 16 L32 28" /></g>),
  atom: (<g {...S}><ellipse cx="50" cy="50" rx="42" ry="15" /><ellipse cx="50" cy="50" rx="42" ry="15" transform="rotate(60 50 50)" /><ellipse cx="50" cy="50" rx="42" ry="15" transform="rotate(-60 50 50)" /><circle cx="50" cy="50" r="7" fill="currentColor" /></g>),
  globe: (<g {...S}><circle cx="50" cy="50" r="38" /><ellipse cx="50" cy="50" rx="16" ry="38" /><path d="M12 50 H88 M18 30 H82 M18 70 H82" /></g>),
  bolt: (<g {...S}><path d="M58 8 L26 54 H48 L40 92 L74 42 H52 Z" /></g>),
  alert: (<g {...S}><path d="M50 10 L92 86 H8 Z" /><path d="M50 38 V60" /><circle cx="50" cy="73" r="4" fill="currentColor" /></g>),
  spine: (<g {...S}>{[0, 1, 2, 3, 4].map((i) => <rect key={i} x="32" y={10 + i * 17} width="36" height="11" rx="5" />)}</g>),
  clock: (<g {...S}><circle cx="50" cy="50" r="38" /><path d="M50 26 V50 L66 60" /></g>),
  moon: (<g {...S}><path d="M66 14 C40 18 28 46 40 68 C50 84 70 88 86 78 C60 80 44 56 52 36 C55 26 60 19 66 14 Z" /><path d="M24 22 L24 30 M20 26 L28 26" /></g>),
  egg: (<g {...S}><path d="M50 12 C68 12 80 42 80 60 C80 78 66 90 50 90 C34 90 20 78 20 60 C20 42 32 12 50 12 Z" /><path d="M10 88 H90" /></g>),
  eye: (<g {...S}><path d="M8 50 C24 24 76 24 92 50 C76 76 24 76 8 50 Z" /><circle cx="50" cy="50" r="12" /></g>),
  rocket: (<g {...S}><path d="M50 8 C66 22 70 44 64 66 H36 C30 44 34 22 50 8 Z" /><circle cx="50" cy="38" r="7" /><path d="M36 58 L22 74 L36 72 M64 58 L78 74 L64 72 M42 74 L50 92 L58 74" /></g>),
  planet: (<g {...S}><circle cx="50" cy="50" r="24" /><ellipse cx="50" cy="50" rx="45" ry="13" transform="rotate(-20 50 50)" /></g>),
  sun: (<g {...S}><circle cx="50" cy="50" r="18" />{Array.from({ length: 8 }).map((_, i) => { const a = (i * Math.PI) / 4; return <path key={i} d={`M${50 + Math.cos(a) * 28} ${50 + Math.sin(a) * 28} L${50 + Math.cos(a) * 42} ${50 + Math.sin(a) * 42}`} />; })}</g>),
  spin: (<g {...S}><path d="M78 40 A30 30 0 1 0 80 58" /><path d="M78 22 L78 40 L60 40" /></g>),
  orbit: (<g {...S}><circle cx="50" cy="50" r="15" /><path d="M24 74 A34 34 0 1 1 76 74" /><path d="M24 74 L14 62 M24 74 L38 72" /></g>),
  calendar: (<g {...S}><rect x="14" y="20" width="72" height="66" rx="10" /><path d="M14 38 H86 M32 12 V26 M68 12 V26" /></g>),
  octopus: (<g {...S}><path d="M26 52 C24 20 76 20 74 52" /><path d="M26 52 C20 66 10 70 8 84" /><path d="M38 54 C36 72 30 80 32 92" /><path d="M50 55 C50 72 48 82 50 92" /><path d="M62 54 C64 72 70 80 68 92" /><path d="M74 52 C80 66 90 70 92 84" /><circle cx="40" cy="40" r="3" fill="currentColor" /><circle cx="60" cy="40" r="3" fill="currentColor" /></g>),
  heart: (<g {...S}><path d="M50 84 C20 62 12 46 12 34 C12 22 22 14 32 14 C40 14 46 18 50 26 C54 18 60 14 68 14 C78 14 88 22 88 34 C88 46 80 62 50 84 Z" /></g>),
  drop: (<g {...S}><path d="M50 10 C64 32 78 46 78 62 C78 78 66 90 50 90 C34 90 22 78 22 62 C22 46 36 32 50 10 Z" /><path d="M36 64 C36 72 42 78 50 78" /></g>),
  tower: (<g {...S}><path d="M50 8 L50 18 M44 18 H56 L60 44 H40 Z M36 44 H64 M40 44 L30 90 M60 44 L70 90 M33 72 H67 M42 90 C42 78 58 78 58 90" /></g>),
  thermometer: (<g {...S}><path d="M42 62 V18 C42 8 58 8 58 18 V62 C68 68 68 86 50 88 C32 86 32 68 42 62 Z" /><path d="M50 30 V70" /><circle cx="50" cy="74" r="6" fill="currentColor" /></g>),
  circle: (<g {...S}><circle cx="50" cy="50" r="34" strokeDasharray="10 9" /><circle cx="84" cy="50" r="7" fill="currentColor" /><path d="M50 50 L50 50" /></g>),
  question: (<g {...S}><path d="M32 34 C32 18 44 10 54 10 C66 10 74 18 74 30 C74 42 62 46 56 52 C52 56 52 60 52 66" /><circle cx="52" cy="84" r="5" fill="currentColor" /></g>),
  myth: (<g {...S}><circle cx="50" cy="50" r="38" /><path d="M34 34 L66 66 M66 34 L34 66" /></g>),
  check: (<g {...S}><circle cx="50" cy="50" r="38" /><path d="M32 52 L45 64 L70 38" /></g>),
  copper: (<g {...S}><rect x="14" y="14" width="72" height="72" rx="12" /><text x="50" y="64" textAnchor="middle" fontSize="40" fontFamily="Archivo Black, sans-serif" fill="currentColor" stroke="none">Cu</text></g>),
  gills: (<g {...S}><path d="M30 20 C14 40 14 60 30 80 M46 24 C34 40 34 60 46 76 M62 28 C54 40 54 60 62 72" /><path d="M70 50 H90 M82 42 L90 50 L82 58" /></g>),
  body: (<g {...S}><circle cx="50" cy="18" r="10" /><path d="M50 30 V62 M28 42 H72 M50 62 L34 90 M50 62 L66 90" /></g>),
  bulb: (<g {...S}><path d="M34 60 C24 52 20 42 20 36 C20 20 34 10 50 10 C66 10 80 20 80 36 C80 42 76 52 66 60 V72 H34 Z" /><path d="M38 82 H62 M42 92 H58" /></g>),
};

export const Icon: React.FC<{ name: string; size: number; color: string }> = ({ name, size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ color, overflow: "visible" }}>
    {paths[name] ?? paths.question}
  </svg>
);
