import type React from "react";
import { z } from "zod";
import { ilustracionSchema } from "../ilustrado/schema";

export const sceneSchema = z.object({
  startMs: z.number(),
  endMs: z.number(),
  // Fondo de vídeo generado (Higgsfield). Si no hay, se usa el fondo animado.
  clip: z.string().nullable().optional(),
  icon: z.string(),
  big: z.string(),
  small: z.string().nullable().optional(),
  accent: z.string().nullable().optional(),
  kind: z.enum(["hook", "fact", "cta"]).default("fact"),
  ilustracion: ilustracionSchema.nullable().optional(),
});

export const captionSchema = z.object({
  text: z.string(),
  startMs: z.number(),
  endMs: z.number(),
  timestampMs: z.number().nullable(),
  confidence: z.number().nullable(),
});

export const shortSchema = z.object({
  id: z.string(),
  durationMs: z.number(),
  audio: z.string(),
  scenes: z.array(sceneSchema),
  captions: z.array(captionSchema),
  estilo: z.enum(["tarjetas", "ilustrado"]).default("tarjetas"),
});

export type ShortProps = z.infer<typeof shortSchema>;
export type Scene = z.infer<typeof sceneSchema>;

export const BRAND = {
  noche: "#0A0E27",
  indigo: "#1B1F4B",
  chispa: "#FFD23F",
  coral: "#FF4D8D",
  violeta: "#7B5CFF",
  cian: "#2BD9FE",
  blanco: "#FFFFFF",
};

// Firma discreta en los vídeos (no es marca de agua grande). Cambiar aquí si cambia el identificador del canal.
export const HANDLE = "@datoscuriososs.1";

export const firmaStyle: React.CSSProperties = {
  position: "absolute",
  top: 150,
  left: 56,
  fontFamily: "Montserrat",
  fontWeight: 800,
  fontSize: 30,
  color: "rgba(255,255,255,.5)",
  textShadow: "0 2px 8px rgba(0,0,0,.6)",
  letterSpacing: 0.5,
};
