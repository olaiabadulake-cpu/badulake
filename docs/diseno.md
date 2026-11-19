# Diseño de Badulake: «Luz de barrio»

Tarea 14 · decisión [D-028](decisiones.md). Dirección elegida por OlaIA entre dos propuestas (vista en [diseno/propuestas.html](diseno/propuestas.html)). Parte de la marca que ya existe (badulake.org) y es **provisional** hasta que LIN3S entregue la identidad y Miren Sanz (EITB) le dé el visto bueno. Todo el aspecto sale de `app/src/app/globals.css` y `app/src/app/[locale]/logo.tsx`; cambiar la marca es tocar esos dos archivos.

**Sensación:** cálida, clara y cercana, como una tienda de barrio; pensada para mujeres pero abierta a todas; sin infantilizar. Trato de «tú», frases cortas.

## Colores

| Nombre | Valor | Para qué |
|---|---|---|
| `amarillo` | #FEDB75 | cabecera, avisos buenos, etiquetas, sombra de las tarjetas |
| `amarillo-claro` | #FFF6DC | fondo de las páginas |
| `noche` | #161944 | texto, botones, bordes, pie |
| `suave` | #4A4D73 | ayudas y texto secundario |
| `papel` | #FFFFFF | campos y tarjetas |
| `error` | #A3141D | errores (siempre con texto, nunca solo color) |

Contrastes: noche sobre crema 15,5 · noche sobre amarillo 12,4 · blanco sobre noche 16,7 · suave sobre crema 7,5 · error sobre blanco 7,9 (mínimo AA: 4,5; bordes de campos: 3).

## Letras

Raleway (títulos, logotipo) y Roboto (texto), ya cargadas desde `next/font` (alojadas en la propia web, libres, licencia OFL; sin coste). Texto base de 17 px; ayudas de 15 px.

## Piezas (clases en `globals.css`)

- `pagina`: columna centrada de 42 rem, mismo margen en todas.
- `titulo-1`, `titulo-2`, `titulo-3`: títulos.
- `boton` (principal, azul noche; al pasar, amarillo) y `boton-2` (con borde); mínimo 44 px de alto. `enlace` para enlaces.
- `campo`, `etiqueta`, `ayuda`, `error-texto`: formularios.
- `aviso` (amarillo) y `aviso-error` (borde y texto rojo): mensajes de estado y de error.
- `tarjeta`: badulake y recuadros; borde azul y sombra amarilla; en enlaces se «levanta» al pasar el ratón.
- `etiqueta-pildora` (y `contorno`): «Lo organizas tú», «Borrador», «Te has apuntado».
- `sobre-noche`: pone el foco amarillo sobre fondos oscuros (pie).

## Logo e icono

Símbolo: la «ë» en amarillo dentro de un círculo azul noche (en la web) o en azul sobre amarillo (icono de la app, `app/src/app/icon.svg`; los iconos instalables salen de él con `app/scripts/iconos.mjs`, Tarea 16). Logotipo: «badulakë» en Raleway extranegrita con la «a» subrayada, como el original. Todo dibujado en SVG y texto, sin imágenes.

## Reglas

- Foco visible: trazo azul noche de 3 px en todo; amarillo sobre fondos oscuros.
- Se respeta «reducir movimiento».
- A 320 px de ancho no hay desplazamiento lateral.
- Página 404 con marca (`not-found.tsx`) y una global para direcciones sin idioma (`global-not-found.tsx`, bilingüe castellano-euskera; función experimental de Next.js activada en `next.config.ts`).
