// Genera los códigos QR de Sant Boi (Tarea 18) en ../docs/qr/ (SVG y PNG de 3000 px).
// Uso: npm i --no-save qrcode && node scripts/qr.mjs [dirección-base]
//   Por defecto la base es https://badulake.vercel.app; cuando badulake.app funcione:
//   node scripts/qr.mjs https://badulake.app
// Negro sobre blanco, corrección de errores nivel Q (aguanta un 25 % de suciedad o arañazos) y
// margen blanco de 4 módulos alrededor (el mínimo que exige la norma): no cambiar ni colorear.
import QRCode from "qrcode";
import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const base = (process.argv[2] ?? "https://badulake.vercel.app").replace(/\/$/, "");
const idiomas = ["es", "eu", "ca"];
const margen = 4;
const salida = new URL("../../docs/qr/", import.meta.url);
mkdirSync(salida, { recursive: true });

for (const l of idiomas) {
  const url = `${base}/${l}/hola?utm_source=qr&utm_campaign=santboi`;
  const qr = QRCode.create(url, { errorCorrectionLevel: "Q" });
  const n = qr.modules.size;
  const total = n + margen * 2;
  let d = "";
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++)
      if (qr.modules.get(x, y)) d += `M${x + margen} ${y + margen}h1v1h-1z`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" width="${total * 10}" height="${total * 10}" shape-rendering="crispEdges" role="img" aria-label="Código QR de Badulake (${l})"><title>${url.replaceAll("&", "&amp;")}</title><rect width="${total}" height="${total}" fill="#fff"/><path d="${d}" fill="#000"/></svg>\n`;
  writeFileSync(new URL(`badulake-santboi-${l}.svg`, salida), svg);
  // Múltiplo exacto de módulos para que ningún borde salga borroso (unos 3000 px).
  const px = Math.round(3000 / total) * total;
  await sharp(Buffer.from(svg), { density: 72 }).resize(px, px, { kernel: "nearest" }).png().toFile(fileURLToPath(new URL(`badulake-santboi-${l}.png`, salida)));
  console.log(l, `versión ${qr.version}`, `${n}x${n} módulos`, `${px}px`, url);
}
