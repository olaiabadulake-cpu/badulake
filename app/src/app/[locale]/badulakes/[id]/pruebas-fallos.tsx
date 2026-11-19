import { createSupabase } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";
import { fallos } from "@/lib/pruebas";
import { joinBadulake } from "../actions";

// Fallos del guion que SOLO existen en la copia de pruebas (Tarea 22, D-035, docs/copia-pruebas.md).
// Sin PRUEBAS_COPIA + PRUEBAS_SUPABASE_REF correcto, `fallos` está todo apagado y no se pinta nada.

// Fallo «todos los datos a la vista»: llama a una función que solo existe en la base de datos de la copia.
export async function AsistentesAlaVista({ id }: { id: string }) {
  if (!fallos.datosALaVista) return null;
  const supabase = await createSupabase();
  const { data } = await supabase.rpc("pruebas_asistentes", { p_badulake: id });
  const rows = (Array.isArray(data) ? data : []) as { correo: string; idioma: string; desde: string }[];
  return (
    <section className="tarjeta" lang="es">
      <h2 className="titulo-2">Personas apuntadas</h2>
      <ul className="mt-2 flex flex-col gap-1">
        {rows.map((r) => (
          <li key={r.correo}>{r.correo} · idioma {r.idioma} · desde {new Date(r.desde).toLocaleDateString("es-ES")}</li>
        ))}
      </ul>
    </section>
  );
}

// Fallo «botones confusos y pasos de más»: apuntarse en tres pasos con nombres que no dicen qué hacen.
export function ApuntarseConfuso({ id, locale, paso }: { id: string; locale: string; paso: string | undefined }) {
  const button = "boton sm:self-start";
  if (paso === "2") {
    return (
      <div lang="es" className="flex flex-col gap-3">
        <p className="ayuda">Revisa que todo esté correcto antes de continuar.</p>
        <Link href={`/badulakes/${id}?paso=3`} className={button}>Aceptar</Link>
      </div>
    );
  }
  if (paso === "3") {
    return (
      <form action={joinBadulake} lang="es" className="flex flex-col gap-3">
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="id" value={id} />
        <p className="ayuda">Último paso. Pulsa para terminar.</p>
        <button type="submit" className={button}>Continuar</button>
      </form>
    );
  }
  return (
    <Link href={`/badulakes/${id}?paso=2`} lang="es" className={button}>Siguiente</Link>
  );
}
