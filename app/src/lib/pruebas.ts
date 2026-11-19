import "server-only";

// COPIA DE PRUEBAS (Tarea 22, D-035). Solo existe en el proyecto de Vercel «badulake-pruebas».
// Aquí se decide si esta web es la copia y qué fallos del guion están encendidos.
//
// Para ser la copia hacen falta DOS variables a la vez, que solo se ponen en esa copia:
//   PRUEBAS_COPIA=1                  → «esta web es la copia»
//   PRUEBAS_SUPABASE_REF=<referencia> → la referencia del proyecto de Supabase de la copia
// y además esa referencia tiene que ser la de SUPABASE_URL. Así, aunque alguien pusiera
// PRUEBAS_COPIA=1 por error en la web real, no se activaría nada: su base de datos no
// coincide con la referencia anotada (y la función que enseña datos ajenos no existe allí).
function isCopy(): boolean {
  if (process.env.PRUEBAS_COPIA !== "1") return false;
  const ref = process.env.PRUEBAS_SUPABASE_REF;
  const url = process.env.SUPABASE_URL ?? "";
  if (!ref || !/^[a-z0-9]{10,}$/.test(ref)) return false;
  try {
    return new URL(url).hostname === `${ref}.supabase.co`;
  } catch {
    return false;
  }
}

export const copiaDePruebas = isCopy();

// Cada fallo, además, necesita su propio interruptor encendido (=1).
const on = (name: string) => copiaDePruebas && process.env[name] === "1";

export const fallos = {
  // Se enseñan los datos de las demás personas apuntadas (correo, idioma, desde cuándo).
  datosALaVista: on("PRUEBAS_DATOS_A_LA_VISTA"),
  // Apuntarse lleva tres pasos y los botones tienen nombres que confunden.
  botonesConfusos: on("PRUEBAS_BOTONES_CONFUSOS"),
};
