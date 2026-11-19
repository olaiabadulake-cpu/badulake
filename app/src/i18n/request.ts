import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { routing } from "./routing";

type Messages = { [key: string]: string | Messages };

// Si a una lengua le falta un texto nuevo (aún sin traducir), se usa el castellano.
function withFallback(base: Messages, own: Messages): Messages {
  const merged: Messages = { ...base };
  for (const [key, value] of Object.entries(own)) {
    const fallback = base[key];
    merged[key] =
      typeof value === "object" && typeof fallback === "object" ? withFallback(fallback, value) : value;
  }
  return merged;
}

export default getRequestConfig(async ({ locale }) => {
  const requested = locale ?? (await rootLocale());
  const current = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const own = (await import(`../../messages/${current}.json`)).default;
  const messages =
    current === "es" ? own : withFallback((await import("../../messages/es.json")).default, own);

  return { locale: current, messages };
});
