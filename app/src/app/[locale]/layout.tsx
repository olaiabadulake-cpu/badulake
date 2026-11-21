import type { Metadata, Viewport } from "next";
import { Roboto, Unbounded } from "next/font/google";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { contentLang } from "@/i18n/content-lang";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { PegatinaDefs } from "./logo";
import { InstallHint } from "./install-hint";
import { PruebasAviso } from "./pruebas-aviso";
import { copiaDePruebas } from "@/lib/pruebas";
import { RegisterSW } from "./register-sw";
import { SiteHeader } from "./site-header";
import "../globals.css";

// Alfabetos: latino ampliado (č, ő, ș…), cirílico (búlgaro, serbio, ucraniano…) y griego.
// Unbounded no tiene griego: los títulos en griego usan la letra del sistema.
const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext", "greek"],
});
const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Meta");
  const locale = await rootLocale();
  return {
    title: t("title"),
    description: t("description"),
    // App instalable (Tarea 16, D-030): manifiesto del idioma, icono de iPhone y nombre al añadir a la pantalla de inicio.
    // La copia de pruebas nunca sale en buscadores (Tarea 22, D-035).
    ...(copiaDePruebas ? { robots: { index: false, follow: false } } : {}),
    manifest: `/${locale}/manifest.webmanifest`,
    icons: { apple: "/iconos/apple-touch-icon.png" },
    appleWebApp: { capable: true, title: "Badulake", statusBarStyle: "default" },
  };
}

export const viewport: Viewport = { themeColor: "#2f2fd1" };

export default async function RootLayout({ children }: LayoutProps<"/[locale]">) {
  const locale = await rootLocale();
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations("Footer");
  const nav = await getTranslations("Nav");
  const privacy = await getTranslations("Privacy");

  return (
    <html lang={locale} className={`${roboto.variable} ${unbounded.variable} h-full overflow-x-clip antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <PruebasAviso />
        <NextIntlClientProvider>
          <PegatinaDefs />
          <a
            href="#contenido"
            className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-10 focus:rounded focus:bg-papel focus:p-3 focus:font-semibold focus:text-noche"
          >
            {nav("skip")}
          </a>
          <SiteHeader />
          <main id="contenido" tabIndex={-1} className="flex-1 focus:outline-none">{children}</main>
          <footer className="bg-noche text-white">
            <div className="mx-auto flex max-w-2xl flex-col gap-2 px-4 py-6 text-[0.9375rem] sm:px-8">
            <p className="font-display font-bold">{t("project")}</p>
            <InstallHint lang={await contentLang()} />
            <nav aria-label={t("legalNav")} lang={await contentLang()}>
              <ul className="flex flex-wrap gap-x-4 gap-y-1">
                <li><Link href="/aviso-legal" className="enlace !font-normal">{t("legalLink")}</Link></li>
                <li><Link href="/privacidad" className="enlace !font-normal">{privacy("footerLink")}</Link></li>
                <li><Link href="/condiciones" className="enlace !font-normal">{t("termsLink")}</Link></li>
                <li><Link href="/cookies" className="enlace !font-normal">{t("cookiesLink")}</Link></li>
              </ul>
            </nav>
            {/* Todo se escribe en castellano; las demás lenguas son traducciones pendientes de revisar. */}
            {locale !== "es" && <p>{t("machine")}</p>}
            </div>
          </footer>
        </NextIntlClientProvider>
        <RegisterSW />
        {/* Visitas sin cookies ni seguimiento entre webs (Tarea 15, D-029). Solo existe en producción. */}
        {!copiaDePruebas && <Suspense fallback={null}><Analytics /></Suspense>}
      </body>
    </html>
  );
}
