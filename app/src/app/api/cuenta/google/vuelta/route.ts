import { type NextRequest, NextResponse } from "next/server";
import { languages } from "@/i18n/languages";
import { accountsOpen, createSupabase } from "@/lib/supabase/server";

// Vuelta de Google (Tarea 4.1, D-039). Con el `code` se abre la sesión. Si la cuenta es nueva,
// todavía no ha confirmado los 18 años: se la manda a /confirmar-edad antes de nada.
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const requested = params.get("locale") ?? "es";
  const locale = Object.hasOwn(languages, requested) ? requested : "es";
  const to = (path: string) => NextResponse.redirect(new URL(`/${locale}${path}`, request.url));

  if (!accountsOpen) return to("");

  // Ha cancelado en Google, la cuenta no se ha podido crear o el enlace está manipulado.
  const code = params.get("code");
  if (params.get("error") || !code) {
    if (params.get("error")) console.error("[google-vuelta]", params.get("error_code"), params.get("error_description"));
    return to("/entrar?aviso=google");
  }

  const supabase = await createSupabase();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("[google-vuelta]", error.code, error.message);
    return to("/entrar?aviso=google");
  }

  const { data: pending } = await supabase.rpc("edad_pendiente");
  return to(pending === true ? "/confirmar-edad" : "/badulakes");
}
