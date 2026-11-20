"use server";

import { redirect } from "@/i18n/navigation";
import { languages, type Locale } from "@/i18n/languages";
import { accountsOpen, createSupabase } from "@/lib/supabase/server";

// Acciones del panel del equipo (Tarea 13, D-026). Cada función de la base de datos comprueba por su
// cuenta que quien llama está en la tabla `equipo`: aquí no se decide nada.
const KINDS = ["ocultar", "mostrar", "suspender", "resolver"] as const;

export async function teamAction(formData: FormData): Promise<void> {
  const requested = String(formData.get("locale") ?? "");
  const locale: Locale = Object.hasOwn(languages, requested) ? (requested as Locale) : "es";
  const id = String(formData.get("id") ?? "");
  const kind = String(formData.get("kind") ?? "");
  let aviso = "error";
  if (accountsOpen && /^[0-9a-f-]{36}$/.test(id) && (KINDS as readonly string[]).includes(kind)) {
    const supabase = await createSupabase();
    const { error } =
      kind === "suspender" ? await supabase.rpc("equipo_suspender", { p_denuncia: id })
      : kind === "resolver" ? await supabase.rpc("equipo_resolver", { p_denuncia: id })
      : await supabase.rpc("equipo_ocultar", { p_denuncia: id, p_ocultar: kind === "ocultar" });
    if (error) console.error("[equipo]", kind, error.code, error.message);
    else aviso = kind;
  }
  redirect({ href: `/equipo?aviso=${aviso}`, locale });
}

// Dar o quitar el permiso de organizar a una persona, por su correo (Tarea 5.2, D-038). La base de
// datos comprueba que quien llama es del equipo y no guarda ni devuelve el correo.
export async function permissionAction(formData: FormData): Promise<void> {
  const requested = String(formData.get("locale") ?? "");
  const locale: Locale = Object.hasOwn(languages, requested) ? (requested as Locale) : "es";
  const correo = String(formData.get("correo") ?? "").trim();
  const dar = formData.get("kind") === "dar";
  let aviso = "error";
  if (accountsOpen && correo.length > 3 && correo.length <= 254) {
    const supabase = await createSupabase();
    const { data, error } = await supabase.rpc("equipo_permiso_organizar", { p_correo: correo, p_dar: dar });
    if (error) console.error("[equipo]", "permiso", error.code, error.message);
    else if (data === "ok") aviso = dar ? "permiso_dado" : "permiso_quitado";
    else if (data === "no_existe") aviso = "permiso_no_existe";
    else if (data === "ya_tenia") aviso = "permiso_ya_tenia";
    else if (data === "no_tenia") aviso = "permiso_no_tenia";
  }
  redirect({ href: `/equipo?aviso=${aviso}`, locale });
}
