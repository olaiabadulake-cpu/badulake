import { type NextRequest, NextResponse } from "next/server";
import { languages } from "@/i18n/languages";
import { createSupabase, googleOn } from "@/lib/supabase/server";
import { tooManyAttempts } from "@/lib/rate-limit";
import { siteOrigin } from "@/lib/site-origin";

// «Continuar con Google» (Tarea 4.1, D-039). El botón es un enlace normal a esta dirección:
// aquí se pide a Supabase la dirección de Google y se manda allí a la persona. Al volver, Google
// (a través de Supabase) la deja en /api/cuenta/google/vuelta.
export async function GET(request: NextRequest) {
  const requested = request.nextUrl.searchParams.get("locale") ?? "es";
  const locale = Object.hasOwn(languages, requested) ? requested : "es";
  const to = (path: string) => NextResponse.redirect(new URL(`/${locale}${path}`, request.url), 303);

  if (!googleOn) return to("");
  // Límite de intentos (D-023): 20 cada 15 minutos desde la misma conexión.
  if (await tooManyAttempts("google", 20, 15)) return to("/entrar?aviso=google");

  const supabase = await createSupabase();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      // Dirección fija (no se toma de la petición), como en el correo de verificación.
      redirectTo: `${siteOrigin()}/api/cuenta/google/vuelta?locale=${locale}`,
      // Que Google deje elegir cuenta aunque ya haya una abierta en el navegador.
      queryParams: { prompt: "select_account" },
    },
  });
  if (error || !data.url) {
    console.error("[google]", error?.code, error?.message);
    return to("/entrar?aviso=google");
  }
  return NextResponse.redirect(data.url, 303);
}
