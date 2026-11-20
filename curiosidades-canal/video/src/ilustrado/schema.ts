import { z } from "zod";

export const ilustracionSchema = z.object({
  escenario: z.enum(["habitacion", "habitacion_noche", "ciudad", "espacio", "plano", "sabana", "sala_control", "lanzamiento", "luna"]).default("habitacion"),
  color: z.string().optional(),
  personaje: z
    .object({
      pose: z.enum(["de_pie", "sentado", "tumbado", "brazos_arriba"]).default("de_pie"),
      x: z.number().default(540),
      y: z.number().default(1420),
      escala: z.number().default(1),
      ojos: z.enum(["abiertos", "cerrados", "sorpresa"]).default("abiertos"),
      boca: z.enum(["sonrisa", "neutra", "o"]).default("sonrisa"),
      look: z.number().nullable().optional(),
    })
    .optional(),
  cama: z.boolean().optional(),
  calendario: z.array(z.string()).optional(),
  medidor: z.object({ desde: z.number(), hasta: z.number() }).optional(),
  bocadillos: z.array(z.string()).optional(),
  lupa: z.object({ x: z.number(), y: z.number(), icono: z.string(), color: z.string().optional(), texto: z.string().optional() }).optional(),
  multitud: z.object({ total: z.number(), destacados: z.number().default(1), todos: z.boolean().optional() }).optional(),
  cifra: z.object({ texto: z.string(), sub: z.string().optional() }).optional(),
  objeto: z.object({ icono: z.string(), color: z.string().optional() }).optional(),
  zzz: z.boolean().optional(),
  alarma: z.boolean().optional(),
  rayos: z.array(z.number()).optional(),
  avestruz: z.object({ x: z.number().default(600), y: z.number().default(1500), escala: z.number().default(1), pose: z.enum(["de_pie", "cabeza_en_hoyo", "tumbado"]).default("de_pie") }).optional(),
  nido: z.object({ x: z.number().default(320), y: z.number().default(1500), girando: z.boolean().optional() }).optional(),
  camara: z.object({ zoom: z.tuple([z.number(), z.number()]).optional(), foco: z.tuple([z.number(), z.number()]).optional() }).optional(),
});
export type Ilustracion = z.infer<typeof ilustracionSchema>;
