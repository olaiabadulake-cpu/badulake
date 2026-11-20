import { getLocale } from "next-intl/server";

// Solo el castellano y el euskera tienen todos los textos traducidos. En las demás lenguas, lo que
// aún no está traducido se enseña en castellano (docs/traducciones.md), y para que los lectores de
// pantalla lo lean con la voz correcta ese texto se marca con lang="es" (WCAG 3.1.2).
const complete = new Set(["es", "eu", "bg", "uk", "el", "mk", "sr", "rue", "pl", "cs", "sk", "sl", "hu", "ro"]);

export async function contentLang(): Promise<string> {
  const locale = await getLocale();
  return complete.has(locale) ? locale : "es";
}
