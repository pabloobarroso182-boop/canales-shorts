# Estilo de animación del canal (fijo) · Datos Curiosos

_Decisiones del propietario (19/11/2026):_
- _«Quiero que la animación del canal sea siempre la misma»: hay un **estilo único** del canal, igual en todos los Shorts._
- _«Esa animación no es la definitiva; si se puede hacer otra más atractiva, me vale» y después «quiero que el canal tenga una sola animación»: hay **una sola animación fija**, que solo se sustituye por otra más atractiva si el propietario la aprueba._

**Animación vigente (19/11/2026):** Modelo: `PRODUCCION/2026-11-19/05-bertha-benz-farmacia/` (escenas en `video/src/divulga/coches.tsx`, piezas comunes en `video/src/divulga/comunes.tsx`).

## Una sola animación (regla definitiva del propietario, 19/11)

«Quiero que el canal tenga una sola animación.»

- La animación del canal es **una y fija**. Todos los Shorts la llevan igual.
- **Claude no la cambia por su cuenta**: nada de ajustes nocturnos ni de versiones progresivas.
- Si al analizar el nicho se ve una forma claramente más atractiva, se **propone** al propietario en el `INFORME.md`, con un fotograma de muestra y la técnica general en la que se inspira, sin copiar a nadie. **Solo cambia si el propietario lo aprueba**, y entonces la nueva sustituye a la anterior para todos los Shorts siguientes.

### Permiso del propietario para la producción del 19/11 (Shorts del 20/11; ahora a las 18:00)

«Cuando esta noche mires el nicho y veas los Shorts, si crees que puedes cambiar algo de nuestra animación, lo haces.»

- **En esa producción**, Claude puede mejorar la animación **directamente**, sin propuesta previa, inspirándose en técnicas generales de los Shorts virales del nicho y sin copiar diseños, personajes ni escenas.
- Los cambios se hacen en las piezas comunes (`comunes.tsx`, `Divulga.tsx`) para que **todos los Shorts los lleven por igual**. El resultado pasa a ser **la única animación del canal** desde entonces.
- Se documentan en «Historial» (qué cambió, por qué y en qué técnica se inspira) y en el `INFORME.md`, con fotogramas de antes y después. Si al propietario no le gusta, se vuelve a la anterior.
- Para las noches siguientes vuelve la regla general: proponer y esperar aprobación, salvo que el propietario diga otra cosa.

## Lo que es igual en todos los Shorts (versión vigente)

| Elemento | Regla fija |
|---|---|
| Composición | `Divulga` (Remotion), 1080×1920, 30 fps |
| Dibujo | Ilustración vectorial propia (SVG), de formas limpias, con **degradados suaves, brillo (glow) y sombra proyectada**. Ni fotos, ni 3D realista, ni otros estilos de dibujo |
| Fondos | Azul noche en degradado radial (`C.fondo1` `#0B1230` → `C.fondo2` `#050817`) con partículas de luz (`Bokeh`). Escenas exteriores: paisaje en capas al atardecer o de noche, como en el de coches |
| Paleta | Solo la de `C` en `comunes.tsx`: amarillo `#FFD23F`, cian `#2BD9FE`, naranja `#FF8A1F`, verde `#7CFF6B`, violeta `#8E6BFF`. Rojo `#FF4D5E` solo para alertas. No se añaden colores nuevos sin motivo |
| Luz | Objetos protagonistas con halo del color de acento; rayos giratorios (`Rayos`) en los momentos clave |
| Transiciones | Siempre las mismas: fundido de 12 fotogramas con zoom «atravesando» la cámara (lo hace `Divulga.tsx`). Flash breve solo en la revelación |
| Movimiento | Empuje lento de cámara (zoom del 1,00 al 1,10–1,15) en cada escena; entradas con muelle (`spring`); una escena nueva cada 2–5 s |
| Etiquetas | Componente `Etiqueta`: cápsula oscura con borde y brillo del color de acento, en Montserrat 900, que aparece justo cuando la voz dice la palabra |
| Subtítulos | Arriba (`top` 230), en Montserrat 900 de 70 px, blancos; la palabra que suena va en un recuadro amarillo y las cifras en amarillo |
| Tipografía | Archivo Black (títulos grandes y cifras) y Montserrat (el resto). Ninguna otra |
| Firma | «@datoscuriososs.1» pequeña y semitransparente arriba a la izquierda. Sin marca de agua grande |
| Progreso | Barra fina amarillo→coral arriba del todo |
| Cierre | La misma tarjeta final: fondo oscurecido, logo redondo con brillo violeta, «¡SÍGUENOS!» y «Un dato curioso cada día» |
| Sonido | Sin música; los mismos efectos (`whoosh` en cambios de escena y `ding` en la revelación y el cierre) |

## Lo que cambia en cada Short

Solo **lo que se dibuja**: los objetos, los escenarios y las metáforas de cada tema (un avión, un corazón, una moneda…), siempre con las reglas de arriba.

## Herramientas

- Por defecto, **todo se dibuja en Remotion con SVG**, como el modelo.
- Otras herramientas (3D de Three.js, Lottie, Manim, Blender, Inkscape, Synfig, HyperFrames) **solo si el resultado se ve igual que el resto del canal**: misma paleta, mismo fondo, mismo brillo y mismo acabado ilustrado. Por ejemplo, un objeto 3D de Three.js con materiales planos de la paleta y halo, sí; un render realista de Blender, no.
- Antes de renderizar, la hoja de contactos de fotogramas se compara con la del modelo. Si una escena «no parece del canal», se rehace.

## Historial (solo cambios aprobados por el propietario)

| Versión | Fecha | Cambios | Inspiración (técnica general) |
|---|---|---|---|
| v1 | 19/11/2026 | Estilo inicial (modelo: Bertha Benz) | Los 7 vídeos de referencia del propietario: pantalla completa, fondos oscuros con luz, zoom continuo, etiquetas con cifras |
