import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Ilustracion } from "./schema";
import { Cama, Ciudad, Espacio, Habitacion, MantaEncima, Plano } from "./Escenarios";
import { Avestruz, Lanzamiento, Luna, Nido, Sabana, SalaControl } from "./Escenarios2";
import { Bocadillos, Cifra, Lupa, MarcaAltura, Multitud, ObjetoGrande, Zzz } from "./Capas";
import { Personaje, PROTA, lookN } from "./Personaje";
import { P } from "./paleta";


// Monta una escena ilustrada: escenario + personaje + capas, con cámara en movimiento.
export const EscenaIlustrada: React.FC<{ il: Ilustracion; durationInFrames: number }> = ({ il, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [z0, z1] = il.camara?.zoom ?? [1.12, 1.22];
  const [fx, fy] = il.camara?.foco ?? [540, 900];
  const zoom = interpolate(frame, [0, durationInFrames], [z0, z1], { extrapolateRight: "clamp" });
  const entrada = interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" });
  // valores por defecto aplicados aquí también (por si las props no pasan por el esquema)
  const p0 = il.personaje;
  const per = p0
    ? { ...p0, pose: p0.pose ?? "de_pie", x: p0.x ?? 540, y: p0.y ?? 1420, escala: p0.escala ?? 1, ojos: p0.ojos ?? "abiertos", boca: p0.boca ?? "sonrisa" }
    : undefined;
  const look = per?.look == null ? PROTA : lookN(per.look);
  const tumbado = per?.pose === "tumbado";

  return (
    <AbsoluteFill style={{ opacity: entrada }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" className="ilu-suave">
        {/* estilo sin contorno: se ocultan los trazos de contorno, quedan formas planas con sombra */}
        <style>{`.ilu-suave [stroke="${P.contorno}"] { stroke-opacity: 0; }`}</style>
        <g transform={`translate(${fx} ${fy}) scale(${zoom}) translate(${-fx} ${-fy})`}>
          {il.escenario === "habitacion" && <Habitacion frame={frame} calendario={il.calendario} medidor={!!il.medidor} />}
          {il.escenario === "habitacion_noche" && <Habitacion noche frame={frame} calendario={il.calendario} medidor={!!il.medidor} />}
          {il.escenario === "ciudad" && <Ciudad frame={frame} />}
          {il.escenario === "espacio" && <Espacio frame={frame} />}
          {il.escenario === "plano" && <Plano color={il.color ?? P.violeta} frame={frame} />}
          {il.escenario === "sabana" && <Sabana frame={frame} />}
          {il.escenario === "sala_control" && <SalaControl frame={frame} alarma={il.alarma} />}
          {il.escenario === "lanzamiento" && <Lanzamiento frame={frame} rayos={il.rayos} />}
          {il.escenario === "luna" && <Luna frame={frame} />}
          {il.nido && <Nido x={il.nido.x ?? 320} y={il.nido.y ?? 1500} girando={il.nido.girando} frame={frame} />}
          {il.avestruz && <Avestruz x={il.avestruz.x ?? 600} y={il.avestruz.y ?? 1500} escala={il.avestruz.escala ?? 1} pose={il.avestruz.pose ?? "de_pie"} frame={frame} />}

          {il.medidor && <MarcaAltura frame={frame} desde={il.medidor.desde} hasta={il.medidor.hasta} />}
          {il.cama && <Cama />}
          {per && (
            <g transform={`translate(${per.x} ${per.y}) scale(${per.escala})`}>
              <Personaje look={look} pose={per.pose} frame={frame} ojos={per.ojos} boca={per.boca} />
            </g>
          )}
          {il.cama && tumbado && <MantaEncima />}
          {il.zzz && <Zzz x={per ? per.x - 40 : 300} y={per ? per.y - 260 : 900} frame={frame} />}
          {il.multitud && <Multitud total={il.multitud.total} destacados={il.multitud.destacados ?? 1} todos={il.multitud.todos} frame={frame} fps={fps} />}
          {il.objeto && <ObjetoGrande icono={il.objeto.icono} color={il.objeto.color ?? P.chispa} frame={frame} fps={fps} />}
        </g>
        {/* capas fijas (no se mueven con la cámara) */}
        {il.lupa && <Lupa {...il.lupa} frame={frame} fps={fps} />}
        {il.bocadillos && <Bocadillos textos={il.bocadillos} frame={frame} fps={fps} />}
        {il.cifra && <Cifra texto={il.cifra.texto} sub={il.cifra.sub} frame={frame} fps={fps} />}
        {/* viñeta y grano suave para unificar el estilo */}
        <defs>
          <radialGradient id="vineta" cx="50%" cy="45%" r="75%">
            <stop offset="0.6" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.45" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="1080" height="1920" fill="url(#vineta)" />
      </svg>
    </AbsoluteFill>
  );
};
