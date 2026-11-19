import { defineRouting } from "next-intl/routing";

// Euskera y castellano desde el día 1. Para añadir una lengua:
// añadirla aquí y crear messages/<lengua>.json.
export const routing = defineRouting({
  locales: ["eu", "es"],
  defaultLocale: "es",
});

export type Locale = (typeof routing.locales)[number];
