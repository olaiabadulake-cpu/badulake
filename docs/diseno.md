# Diseño de Badulake: «Careta»

Tarea 14.1 · decisión [D-052](decisiones.md) (sustituye a «Luz de barrio», [D-028](decisiones.md)). Sale de la careta de Badulake que LIN3S entregó a Miren Sanz. Es **provisional** hasta que LIN3S y Miren Sanz (EITB) lo validen. Todo el aspecto sale de `app/src/app/globals.css` y `app/src/app/[locale]/logo.tsx`; cambiar la marca es tocar esos dos archivos. Las propuestas enseñadas a OlaIA están en [diseno/](diseno/) (`propuestas.html`: «Luz de barrio»; `propuesta-home-moderna.html`; `propuesta-home-careta.html`: la elegida).

**Sensación:** de programa de televisión, alegre y atrevida, pensada para mujeres pero abierta a todas; sin infantilizar. Trato de «tú», frases cortas.

## Colores

| Nombre | Valor | Para qué |
|---|---|---|
| `indigo` | #2F2FD1 | fondo (parte de arriba del degradado) |
| `noche` | #15135C | tinta: texto sobre blanco o lima, pie y fondo (parte de abajo) |
| `rosa` | #FF3FA4 | logo, cinta y detalles grandes. Nunca texto pequeño sobre índigo |
| `lima` | #C8FF2E | acción principal, avisos buenos y etiquetas |
| `naranja`, `sol` | #FF8A2B, #FFC83D | números de pasos y pegatinas |
| `papel` | #FFFFFF | campos y tarjetas |
| `suave` | #46467A | texto secundario sobre blanco |
| `error` | #A3141D | errores sobre blanco; sobre el índigo, `error-claro` #FFC2D4 |

Contrastes: blanco sobre índigo 8,6 · blanco sobre noche 16,4 · noche sobre lima 13,9 · noche sobre rosa 5,1 · suave sobre blanco 8,7 · error sobre blanco 7,9 · rosa sobre índigo claro 2,7 (solo logo y detalle). Mínimo AA: 4,5 (3 para letra grande y bordes). En el degradado axe no puede calcular el contraste solo: se comprueba con el color más claro del fondo.

## Letras

Unbounded (títulos, ancha, en mayúsculas) y Roboto (texto; cubre latino, cirílico y griego), ambas libres (licencia OFL) y alojadas en la propia web con `next/font`. Texto base de 17 px; ayudas de 15 px. Los títulos usan `overflow-wrap: break-word` y letra algo menor en móvil para llegar a 320 px.

## Piezas (clases en `globals.css`)

- `pagina`: columna centrada de 42 rem, mismo margen en todas.
- `titulo-1`, `titulo-2`, `titulo-3`: títulos (Unbounded).
- `boton` (principal: lima con sombra rosa) y `boton-2` (con borde); mínimo 44 px de alto. `enlace` para enlaces.
- `campo`, `etiqueta`, `ayuda`, `error-texto`: formularios (campos blancos con borde blanco; azul noche sobre blanco).
- `aviso` (lima) y `aviso-error` (blanco con borde rosa y texto rojo).
- `tarjeta`: pegatina blanca con borde blanco y sombra; en enlaces se «levanta» al pasar el ratón.
- `sobre-papel`: pone colores de tinta dentro de un bloque blanco o lima (paneles, avisos, formularios sobre lima).
- `etiqueta-pildora` (y `contorno`): «Lo organizas tú», «Borrador», «Te has apuntado».
- `logo-pastilla`, `pegatina`, `cinta`: logotipo, dibujos de fondo y tira rosa de la portada.

## Logo e icono

Logotipo: «BADULAKE» en Unbounded 900 dentro de una pastilla rosa, girada 3° (como en la careta). Símbolo: la «ë» en rosa con dos puntos lima sobre índigo; es el icono de la app (`app/src/app/icon.svg` y los PNG de `public/iconos/`, generados con ese dibujo). Las pegatinas de la portada son dibujos propios sencillos, no las ilustraciones originales de la careta.

## Reglas

- Foco visible: aro lima de 3 px por fuera y tinta por dentro; se ve sobre índigo y sobre blanco.
- Se respeta «reducir movimiento» (la cinta se queda quieta).
- A 320 px de ancho no hay desplazamiento lateral.
- Las pegatinas y la cinta son decoración (`aria-hidden`), no se pueden pulsar y se ocultan en móvil estrecho.
- Página 404 con marca (`not-found.tsx`) y otra global para direcciones sin idioma (`global-not-found.tsx`, bilingüe castellano-euskera).
