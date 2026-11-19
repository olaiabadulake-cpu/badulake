import type { Metadata } from "next";
import { Raleway, Roboto } from "next/font/google";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { contentLang } from "@/i18n/content-lang";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { SiteHeader } from "./site-header";
import "../globals.css";

// Alfabetos: latino ampliado (č, ő, ș…), cirílico (búlgaro, serbio, ucraniano…) y griego.
// Raleway no tiene griego: los títulos en griego usan la letra del sistema.
const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext", "greek"],
});
const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Meta");
  return { title: t("title"), description: t("description") };
}

export default async function RootLayout({ children }: LayoutProps<"/[locale]">) {
  const locale = await rootLocale();
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations("Footer");
  const nav = await getTranslations("Nav");
  const privacy = await getTranslations("Privacy");

  return (
    <html lang={locale} className={`${roboto.variable} ${raleway.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <NextIntlClientProvider>
          <a
            href="#contenido"
            className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-10 focus:rounded focus:bg-papel focus:p-3 focus:font-semibold"
          >
            {nav("skip")}
          </a>
          <SiteHeader />
          <main id="contenido" tabIndex={-1} className="flex-1 focus:outline-none">{children}</main>
          <footer className="sobre-noche bg-noche text-white">
            <div className="mx-auto flex max-w-2xl flex-col gap-2 px-4 py-6 text-[0.9375rem] sm:px-8">
            <p className="font-display font-bold">{t("project")}</p>
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
        {/* Visitas sin cookies ni seguimiento entre webs (Tarea 15, D-029). Solo existe en producción. */}
        <Suspense fallback={null}><Analytics /></Suspense>
      </body>
    </html>
  );
}
