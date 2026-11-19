import { defineRouting } from "next-intl/routing";

// Euskera y castellano desde el día 1. Para añadir una lengua:
// añadirla aquí y crear messages/<lengua>.json.
export const routing = defineRouting({
  locales: ["eu", "es"],
  // PENDIENTE (D-007): EITB decide si el idioma por defecto pasa a ser "eu".
  defaultLocale: "es",
  // Recordar el idioma elegido durante un año (si no, se borra al cerrar el navegador).
  localeCookie: { maxAge: 60 * 60 * 24 * 365 },
});

export type Locale = (typeof routing.locales)[number];
