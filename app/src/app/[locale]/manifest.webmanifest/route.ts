import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

// Manifiesto de la app instalable (Tarea 16, D-030). Hay uno por idioma para que, al instalarla,
// la app se abra en el idioma desde el que se instaló (`start_url`). Colores de «Luz de barrio» (D-028).
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return new Response("Not found", { status: 404 });
  const t = await getTranslations({ locale, namespace: "Meta" });

  const manifest = {
    id: `/${locale}`,
    name: "Badulake",
    short_name: "Badulake",
    description: t("description"),
    lang: locale,
    start_url: `/${locale}`,
    scope: "/",
    display: "standalone",
    background_color: "#FFF6DC",
    theme_color: "#FEDB75",
    icons: [
      { src: "/iconos/icono-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/iconos/icono-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/iconos/maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/iconos/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };

  return new Response(JSON.stringify(manifest), {
    headers: {
      "Content-Type": "application/manifest+json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
