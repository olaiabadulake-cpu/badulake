import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/languages";
import { accountsOpen } from "@/lib/supabase/server";
import { waitlistOpen } from "@/lib/waitlist";
import { Symbol, Wordmark } from "../logo";
import { WaitlistForm } from "../waitlist-form";

// Página de llegada del código QR (Tarea 18). Pública, corta y casi sin peso, para que cargue
// aunque haya mala cobertura. Los QR llevan ?utm_source=qr&utm_campaign=santboi
// (docs/qr/README.md); la analítica (D-029) lee la dirección en el navegador, así que esta página
// no necesita leer nada y se sirve ya preparada.
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Hola");
  return { title: `${t("title")} · Badulake`, robots: { index: false } };
}

// Castellano, euskera y catalán tienen estos textos propios; el resto, el castellano (D-025).
const own = new Set(["es", "eu", "ca"]);

export default async function HolaPage() {
  const t = await getTranslations("Hola");
  const locale = await getLocale();
  const lang = own.has(locale) ? locale : "es";
  const steps = ["step1", "step2", "step3"] as const;

  return (
    <div lang={lang} className="pagina !gap-8">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Symbol className="size-14" />
          <p className="text-4xl font-bold sm:text-5xl"><Wordmark /></p>
        </div>
        <h1 className="font-display text-3xl leading-snug font-bold sm:text-4xl">{t("title")}</h1>
        <p className="text-lg">{t("intro")}</p>
      </header>

      <ol className="flex flex-col gap-3 text-lg">
        {steps.map((k, i) => (
          <li key={k} className="flex gap-3">
            <span aria-hidden className="flex size-8 shrink-0 items-center justify-center rounded-full bg-noche font-bold text-white">
              {i + 1}
            </span>
            <span className="pt-0.5">{t(k)}</span>
          </li>
        ))}
      </ol>
      <p className="text-base">{t("rules")}</p>

      <section className="rounded-3xl border-2 border-noche bg-amarillo p-5 sm:p-8">
        {accountsOpen ? (
          <div className="flex flex-col gap-4">
            <p className="text-lg font-medium">{t("accounts")}</p>
            <Link href="/registro" className="boton">{t("signUp")}</Link>
          </div>
        ) : (
          <>
            <p className="text-lg font-medium">{waitlistOpen ? t("waitlist") : t("soon")}</p>
            {waitlistOpen && (
              <div className="mt-6">
                <WaitlistForm defaultLanguage={locale as Locale} />
              </div>
            )}
          </>
        )}
      </section>

      <p>
        <Link href="/que-es" className="boton-2">{t("more")}</Link>
      </p>
    </div>
  );
}
