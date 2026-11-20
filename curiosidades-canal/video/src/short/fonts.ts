import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fuentes locales (public/fonts): el render no depende de internet.
// El subconjunto "latin" ya incluye á é í ó ú ü ñ ¿ ¡.
export const titleFont = "Archivo Black";
export const bodyFont = "Montserrat";

loadFont({ family: titleFont, url: staticFile("fonts/archivo-black-latin-400-normal.woff2"), weight: "400" });
for (const w of ["600", "800", "900"]) {
  loadFont({ family: bodyFont, url: staticFile(`fonts/montserrat-latin-${w}-normal.woff2`), weight: w });
}
