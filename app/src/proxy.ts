import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { routing } from "./i18n/routing";

// Envía a /eu o /es según el idioma del navegador.
const intl = createMiddleware(routing);

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_PUBLISHABLE_KEY;
const accountsOpen = Boolean(url && key) && process.env.CUENTAS_ABIERTAS === "1";

export default async function proxy(request: NextRequest) {
  const response = intl(request);

  // Si hay sesión de Badulake, se renueva aquí (las páginas no pueden escribir cookies).
  // Sin sesión no se pregunta nada a Supabase: la web sigue igual de rápida.
  const hasSession = request.cookies.getAll().some((c) => c.name.startsWith("sb-"));
  if (!accountsOpen || !hasSession || !(response instanceof NextResponse)) return response;

  const supabase = createServerClient(url!, key!, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(list, headers) {
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers).forEach(([name, value]) => response.headers.set(name, value));
      },
    },
  });
  await supabase.auth.getClaims();
  return response;
}

export const config = {
  // Todo menos archivos internos, la API y archivos con extensión (favicon.ico…)
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
