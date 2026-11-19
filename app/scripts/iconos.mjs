// Genera los iconos de la app instalable (Tarea 16) a partir del símbolo de src/app/icon.svg.
// Uso: node scripts/iconos.mjs   (usa sharp, que ya viene con Next.js)
import sharp from "sharp";

const AMARILLO = "#FEDB75";
const NOCHE = "#161944";
// El símbolo «ë» en un lienzo de 64x64; `escala` lo encoge hacia el centro (zona segura de los iconos «maskable»).
const simbolo = (escala) => `<g transform="translate(32 32) scale(${escala}) translate(-32 -32)" fill="${NOCHE}">
  <circle cx="24.5" cy="19" r="3.6"/><circle cx="39.5" cy="19" r="3.6"/>
  <path d="M17 37.5H47A15 15 0 1 0 42.6 48.1" fill="none" stroke="${NOCHE}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></g>`;
// Cuadrado amarillo sin esquinas redondeadas ni transparencia: el sistema (iOS, Android) pone la forma.
const cuadrado = (escala) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="${AMARILLO}"/>${simbolo(escala)}</svg>`;
// «Any»: círculo amarillo como el icono de la web, con fondo transparente.
const circulo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="${AMARILLO}"/>${simbolo(1)}</svg>`;

const hacer = (svg, px, archivo) =>
  sharp(Buffer.from(svg), { density: 576 }).resize(px, px).png().toFile(`public/iconos/${archivo}`);

await Promise.all([
  hacer(circulo, 192, "icono-192.png"),
  hacer(circulo, 512, "icono-512.png"),
  // «Maskable»: el símbolo ocupa el 62 % central para que ninguna máscara lo corte.
  hacer(cuadrado(0.62), 192, "maskable-192.png"),
  hacer(cuadrado(0.62), 512, "maskable-512.png"),
  // iPhone: cuadrado de 180 px, el símbolo algo más grande porque iOS solo redondea las esquinas.
  hacer(cuadrado(0.8), 180, "apple-touch-icon.png"),
]);
console.log("Iconos listos en public/iconos");
