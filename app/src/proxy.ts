import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Envía a /eu o /es según el idioma del navegador.
export default createMiddleware(routing);

export const config = {
  // Todo menos archivos internos, la API y archivos con extensión (favicon.ico…)
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
