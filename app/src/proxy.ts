import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { routing } from "./i18n/routing";

// Envía a /eu o /es según el idioma del navegador.
const intl = createMiddleware(routing);

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_PUBLISHABLE_KEY;
const accountsOpen = Boolean(url && key) && process.env.CUENTAS_ABIERTAS === "1";

// Páginas que solo existen con sesión (Tarea 8.3). Las páginas también lo comprueban, pero dentro
// de la parte que se envía poco a poco: para entonces la respuesta ya ha salido con «200», el
// título de la página y una redirección de 1 segundo. Aquí, antes de enviar nada, se da una
// redirección de verdad (307) o un 404 de verdad, sin título ni nada de la página.
const UUID = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";
const PRIVATE = /^\/([a-z]{2,3}(?:-[a-z]+)?)\/(cuenta|equipo|badulakes)(?:\/([^/]+)(?:\/(dia))?)?\/?$/;

type Guard = { locale: string; section: string; id?: string; day: boolean };
function guardOf(pathname: string): Guard | null {
  const m = PRIVATE.exec(pathname);
  if (!m || !(routing.locales as readonly string[]).includes(m[1])) return null;
  if (m[2] !== "badulakes" && m[3]) return null; // /cuenta/x o /equipo/x: ya no existen (404 normal)
  return { locale: m[1], section: m[2], id: m[3] === "nuevo" && !m[4] ? undefined : m[3], day: Boolean(m[4]) };
}

export default async function proxy(request: NextRequest) {
  const response = intl(request);
  if (!accountsOpen || !(response instanceof NextResponse)) return response;
  // Si next-intl redirige (por ejemplo, a la dirección con la lengua), se deja pasar.
  if (response.status >= 300 && response.status < 400) return response;

  const guard = guardOf(request.nextUrl.pathname);
  // Si hay sesión de Badulake, se renueva aquí (las páginas no pueden escribir cookies).
  // Sin sesión no se pregunta nada a Supabase: la web sigue igual de rápida.
  const hasSession = request.cookies.getAll().some((c) => c.name.startsWith("sb-"));
  if (!hasSession) return guard ? await anonymous(request, response, guard) : response;

  const supabase = createServerClient(url!, key!, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(list, headers) {
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers).forEach(([name, value]) => response.headers.set(name, value));
      },
    },
  });
  const { data } = await supabase.auth.getClaims();
  if (!guard) return response;
  if (!data?.claims) return await anonymous(request, response, guard);

  // Recién entrada (o con la cuenta recién creada): si venía de un enlace a un badulake, vuelve
  // a él en vez de a la lista (Tarea 6.3, D-042). Entrar, crear cuenta y Google acaban en la lista.
  const back = request.cookies.get(BACK)?.value;
  if (back && guard.section === "badulakes" && !guard.id && !request.nextUrl.pathname.endsWith("/nuevo")) {
    const target = guardOf(back);
    const out = NextResponse.redirect(new URL(target ? back : request.nextUrl.pathname, request.url), 307);
    response.cookies.getAll().forEach((c) => out.cookies.set(c));
    out.cookies.delete(BACK);
    out.headers.set("Cache-Control", "private, no-store");
    return out;
  }

  // Con sesión: lo que no existe para esta persona da 404 de verdad.
  if (guard.section === "equipo") {
    const { data: isTeam } = await supabase.rpc("soy_equipo");
    if (isTeam !== true) return deny(request, response, guard);
  } else if (guard.id) {
    if (!new RegExp(`^${UUID}$`).test(guard.id)) return deny(request, response, guard);
    if (guard.day) {
      // El Modo badulake solo existe para su organizadora (D-036).
      const { data: own } = await supabase.rpc("mis_badulakes");
      const ids = Array.isArray(own) ? own.map((x) => (typeof x === "string" ? x : x?.mis_badulakes)) : [];
      if (!ids.includes(guard.id)) return deny(request, response, guard);
    } else {
      // RLS: solo se lee si esta persona puede verlo (publicado, cancelado o suyo).
      const { data: b } = await supabase.from("badulakes").select("id").eq("id", guard.id).maybeSingle();
      if (!b) return deny(request, response, guard);
    }
  }
  return response;
}

// Adónde volver después de entrar (Tarea 6.3): solo direcciones privadas de esta web (guardOf), nunca
// otra web. Dura un día, por si hay que verificar el correo antes de entrar.
const BACK = "badulake-volver";

// Sin sesión. Un badulake compartido (/badulakes/<id>) enseña su vista previa pública, con lo
// mínimo y sin dirección; si no existe o no es público, 404. El resto de páginas privadas, a entrar.
// En los dos casos se recuerda la página para volver a ella al entrar.
async function anonymous(request: NextRequest, from: NextResponse, guard: Guard) {
  let out: NextResponse;
  if (guard.section === "badulakes" && guard.id && !guard.day) {
    if (!new RegExp(`^${UUID}$`).test(guard.id)) return deny(request, from, guard);
    const anon = createServerClient(url!, key!, { cookies: { getAll: () => [], setAll() {} } });
    const { data } = await anon.rpc("badulake_vista", { p_id: guard.id });
    if (!Array.isArray(data) || data.length === 0) return deny(request, from, guard);
    out = NextResponse.rewrite(new URL(`/${guard.locale}/vista/${guard.id}`, request.url));
  } else if (guard.section === "equipo") {
    return deny(request, from, guard);
  } else {
    out = NextResponse.redirect(new URL(`/${guard.locale}/entrar?aviso=cuenta`, request.url), 307);
  }
  from.cookies.getAll().forEach((c) => out.cookies.set(c));
  out.cookies.set(BACK, request.nextUrl.pathname, {
    httpOnly: true, sameSite: "lax", secure: request.nextUrl.protocol === "https:", path: "/", maxAge: 86400,
  });
  out.headers.set("Cache-Control", "private, no-store");
  return out;
}

// Lo que no existe (o esta persona no puede ver): 404 de verdad, sin título ni nada de la página.
function deny(request: NextRequest, from: NextResponse, guard: Guard) {
  const out = NextResponse.rewrite(new URL(`/${guard.locale}/_no-existe`, request.url), { status: 404 });
  from.cookies.getAll().forEach((c) => out.cookies.set(c));
  out.headers.set("Cache-Control", "private, no-store");
  return out;
}

export const config = {
  // Todo menos archivos internos, la API y archivos con extensión (favicon.ico…)
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
