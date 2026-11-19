import { type NextRequest, NextResponse } from "next/server";
import { languages } from "@/i18n/languages";
import { accountsOpen, createSupabase } from "@/lib/supabase/server";

// Aquí llega el enlace del correo de verificación. Supabase ya ha marcado el correo como
// verificado antes de redirigir aquí con un `code`; con él se abre la sesión.
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const requested = params.get("locale") ?? "es";
  const locale = Object.hasOwn(languages, requested) ? requested : "es";
  const to = (path: string) => NextResponse.redirect(new URL(`/${locale}${path}`, request.url));

  if (!accountsOpen) return to("");

  // Enlace caducado, ya usado o manipulado.
  const code = params.get("code");
  if (params.get("error") || !code) return to("/entrar?aviso=enlace");

  const supabase = await createSupabase();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  // Si el enlace se abre en otro navegador no se puede abrir sesión, pero el correo ya está
  // verificado: se pide entrar con la contraseña.
  if (params.get("next") === "nueva-contrasena") {
    // Recuperar contraseña: con el enlace del correo se abre una sesión solo para poner la nueva.
    return error ? to("/entrar?aviso=enlace") : to("/nueva-contrasena");
  }
  return error ? to("/entrar?aviso=verificada") : to("/cuenta");
}
