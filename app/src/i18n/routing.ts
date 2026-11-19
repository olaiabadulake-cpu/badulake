import { defineRouting } from "next-intl/routing";
import { locales } from "./languages";

// Las lenguas están en languages.ts.
export const routing = defineRouting({
  locales,
  // Castellano por defecto (D-007).
  defaultLocale: "es",
  // Recordar el idioma elegido durante un año (si no, se borra al cerrar el navegador).
  localeCookie: { maxAge: 60 * 60 * 24 * 365 },
});

export type { Locale } from "./languages";
