import { getLocale } from "next-intl/server";

// Lenguas con todos los textos de la web traducidos (salvo el cuerpo de los textos legales, que va
// siempre marcado con lang="es"). Desde la tarea 23.1 lo están las 44. Si en el futuro se añade un
// texto nuevo y una lengua se queda sin él, se enseña en castellano (docs/traducciones.md); para que
// los lectores de pantalla lo lean con la voz correcta, quita esa lengua de aquí hasta traducirlo,
// y así el texto se marca con lang="es" (WCAG 3.1.2).
const complete = new Set([
  "es", "eu", "en", "fr", "de", "it", "pt", "nl", "da", "sv", "nb", "nn", "fi", "se", "pl", "cs", "sk",
  "sl", "hu", "ro", "bg", "uk", "el", "mk", "sr", "rue", "hr", "bs", "cnr", "sq", "gl", "ast", "ca",
  "ca-valencia", "oc", "oc-aranes", "co", "lld", "ga", "gd", "cy", "br", "fy", "gsw",
]);

export async function contentLang(): Promise<string> {
  const locale = await getLocale();
  return complete.has(locale) ? locale : "es";
}

// El panel interno del equipo (Team) solo está en castellano y euskera, a propósito: en las demás
// lenguas se ve en castellano y se marca como tal.
export async function teamLang(): Promise<string> {
  const locale = await getLocale();
  return locale === "eu" ? "eu" : "es";
}
