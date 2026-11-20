import "server-only";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Las claves vienen de variables de entorno (nunca del código ni NEXT_PUBLIC_*).
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_PUBLISHABLE_KEY;

// Las cuentas solo se abren con CUENTAS_ABIERTAS=1 (hoy, solo en el Mac: app/.env.local).
// En producción está apagado hasta que exista el aviso de privacidad definitivo (D-019).
export const accountsOpen = Boolean(url && key) && process.env.CUENTAS_ABIERTAS === "1";

// «Continuar con Google» (Tarea 4.1, D-039) solo sale con GOOGLE_ACTIVADO=1, es decir, cuando el
// proveedor Google ya está configurado en ese Supabase. Sin ella, el botón no aparece.
export const googleOn = accountsOpen && process.env.GOOGLE_ACTIVADO === "1";

// Cliente de Supabase con la sesión de la persona (guardada en cookies).
// Hay que crear uno nuevo en cada petición.
export async function createSupabase() {
  if (!url || !key) throw new Error("Supabase no está configurado.");
  // Lo que depende de la sesión se calcula siempre en el momento de la visita, nunca al
  // preparar la página de antemano (Supabase mira la hora para saber si la sesión ha caducado).
  await connection();
  const store = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll: () => store.getAll(),
      setAll(list) {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Desde una página no se pueden escribir cookies; ya lo hace proxy.ts.
        }
      },
    },
  });
}

export type CurrentUser = { id: string; email: string; language: string };

// Devuelve la persona que ha iniciado sesión (o null). getUser() pregunta a Supabase,
// así que una sesión falsificada o cerrada no pasa.
export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (!accountsOpen) return null;
  const supabase = await createSupabase();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;

  // RLS: con esta sesión solo se puede leer la fila propia de `perfiles`.
  const { data: profile } = await supabase
    .from("perfiles")
    .select("idioma, mayoria_edad_comprobada_en")
    .eq("id", data.user.id)
    .maybeSingle();

  // Cuenta de Google que aún no ha confirmado su edad (D-039): para la web es como si no hubiera
  // entrado. La base de datos tampoco le deja hacer nada. /entrar la manda a /confirmar-edad.
  if (!profile || !profile.mayoria_edad_comprobada_en) return null;

  return { id: data.user.id, email: data.user.email ?? "", language: profile?.idioma ?? "es" };
}

// Lo que devuelve mis_badulakes() (los identificadores de mis propios badulakes, D-024).
// Supabase da una lista de valores sueltos; se aceptan también filas por si cambia el formato.
export function idsOf(data: unknown): string[] {
  if (!Array.isArray(data)) return [];
  return data
    .map((x) => (typeof x === "string" ? x : (x as Record<string, unknown>)?.mis_badulakes))
    .filter((x): x is string => typeof x === "string");
}

// ¿Hay una sesión de Google con la edad todavía sin confirmar? (D-039)
export async function ageIsPending(): Promise<boolean> {
  if (!accountsOpen) return false;
  const supabase = await createSupabase();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return false;
  const { data: pending } = await supabase.rpc("edad_pendiente");
  return pending === true;
}
