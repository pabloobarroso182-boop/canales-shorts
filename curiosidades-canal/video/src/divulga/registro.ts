// Registro de escenas del estilo «divulga». Cada Short nuevo añade su archivo de escenas
// (video/src/divulga/<tema>.tsx, que exporta un Record<string, React.FC<EP>>) y lo suma aquí.
// Las claves deben ser únicas: usa un prefijo por Short (p. ej. «c_» para el de coches).
import type React from "react";
import type { EP } from "./comunes";
import { ESCENAS_COCHES } from "./coches";
import { ESCENAS_ORNITORRINCO } from "./ornitorrinco";
import { ESCENAS_ESTOMAGO } from "./estomago";
import { ESCENAS_SATURNO } from "./saturno";
import { ESCENAS_VIKINGOS } from "./vikingos";
import { ESCENAS_BALLENAS } from "./ballenas";
import { ESCENAS_MIEL } from "./miel";

export const ESCENAS: Record<string, React.FC<EP>> = {
  ...ESCENAS_COCHES,
  ...ESCENAS_ORNITORRINCO,
  ...ESCENAS_ESTOMAGO,
  ...ESCENAS_SATURNO,
  ...ESCENAS_VIKINGOS,
  ...ESCENAS_BALLENAS,
  ...ESCENAS_MIEL,
};
