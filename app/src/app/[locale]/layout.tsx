import type { Metadata } from "next";
import { Raleway, Roboto } from "next/font/google";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { LanguageSwitch } from "./language-switch";
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

  return (
    <html lang={locale} className={`${roboto.variable} ${raleway.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <NextIntlClientProvider>
          <div className="mx-auto flex w-full max-w-2xl justify-end px-4 pt-4 sm:px-8">
            <LanguageSwitch label={t("language")} />
          </div>
          <main className="flex-1">{children}</main>
          <footer className="flex flex-col gap-1 border-t border-noche/15 px-4 py-4 text-sm sm:px-8">
            <p>{t("project")}</p>
            {/* Todo se escribe en castellano; las demás lenguas son traducciones pendientes de revisar. */}
            {locale !== "es" && <p className="text-noche/70">{t("machine")}</p>}
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
