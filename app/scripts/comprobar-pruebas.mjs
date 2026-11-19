// Comprueba que los fallos de la copia de pruebas (Tarea 22, D-035) NO se pueden activar fuera de la copia.
// Uso (desde app/):  node --conditions=react-server scripts/comprobar-pruebas.mjs
import { spawnSync } from "node:child_process";

const casos = [
  // [descripción, variables, copia esperada, fallos esperados]
  ["producción normal (sin variables de la copia)", {}, false, false],
  ["interruptores puestos pero sin PRUEBAS_COPIA", { PRUEBAS_DATOS_A_LA_VISTA: "1", PRUEBAS_BOTONES_CONFUSOS: "1" }, false, false],
  ["PRUEBAS_COPIA=1 sin referencia", { PRUEBAS_COPIA: "1", PRUEBAS_DATOS_A_LA_VISTA: "1", PRUEBAS_BOTONES_CONFUSOS: "1", SUPABASE_URL: "https://abcdefghijklmnopqrst.supabase.co" }, false, false],
  ["PRUEBAS_COPIA=1 con la referencia de OTRA base de datos (la real)", { PRUEBAS_COPIA: "1", PRUEBAS_SUPABASE_REF: "zzzzzzzzzzzzzzzzzzzz", PRUEBAS_DATOS_A_LA_VISTA: "1", PRUEBAS_BOTONES_CONFUSOS: "1", SUPABASE_URL: "https://abcdefghijklmnopqrst.supabase.co" }, false, false],
  ["referencia con forma rara", { PRUEBAS_COPIA: "1", PRUEBAS_SUPABASE_REF: "../x", PRUEBAS_DATOS_A_LA_VISTA: "1", SUPABASE_URL: "https://x.supabase.co" }, false, false],
  ["copia correcta, sin interruptores", { PRUEBAS_COPIA: "1", PRUEBAS_SUPABASE_REF: "abcdefghijklmnopqrst", SUPABASE_URL: "https://abcdefghijklmnopqrst.supabase.co" }, true, false],
  ["copia correcta, interruptores encendidos", { PRUEBAS_COPIA: "1", PRUEBAS_SUPABASE_REF: "abcdefghijklmnopqrst", SUPABASE_URL: "https://abcdefghijklmnopqrst.supabase.co", PRUEBAS_DATOS_A_LA_VISTA: "1", PRUEBAS_BOTONES_CONFUSOS: "1" }, true, true],
];

let fallos = 0;
for (const [nombre, env, copia, fallo] of casos) {
  const r = spawnSync(process.execPath, ["--conditions=react-server", "--input-type=module", "-e",
    `const m = await import("./src/lib/pruebas.ts"); console.log(JSON.stringify([m.copiaDePruebas, m.fallos.datosALaVista && m.fallos.botonesConfusos, m.fallos.datosALaVista || m.fallos.botonesConfusos]));`],
    { env: { PATH: process.env.PATH, ...env }, encoding: "utf8" });
  let out; try { out = JSON.parse(r.stdout.trim().split("\n").pop()); } catch { out = null; }
  const ok = out && out[0] === copia && (fallo ? out[1] === true : out[2] === false);
  if (!ok) fallos++;
  console.log(`${ok ? "OK " : "MAL"} · ${nombre}`, ok ? "" : `→ ${r.stdout}${r.stderr}`);
}
process.exit(fallos ? 1 : 0);
