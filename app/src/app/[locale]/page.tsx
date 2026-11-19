import { getLocale, getTranslations } from "next-intl/server";
import { waitlistOpen } from "@/lib/waitlist";
import { Suspense } from "react";
import { accountsOpen, getCurrentUser } from "@/lib/supabase/server";
import { contentLang } from "@/i18n/content-lang";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/languages";
import { WaitlistForm } from "./waitlist-form";
import { WhatIs } from "./what-is";

const button =
  "rounded-full bg-noche px-6 py-3 text-center text-lg font-semibold text-white hover:bg-noche/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-noche";

export default async function Home({ searchParams }: PageProps<"/[locale]">) {
  const t = await getTranslations("Home");
  const locale = await getLocale();

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-10 px-4 pt-6 pb-12 sm:px-8 sm:pb-16">
      {accountsOpen && (
        <Suspense fallback={null}>
          <Notice searchParams={searchParams} />
        </Suspense>
      )}

      <header className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="flex size-12 items-center justify-center rounded-full bg-amarillo font-display text-2xl font-bold"
          >
            ë
          </span>
          <h1 className="font-display text-4xl font-bold tracking-tight">badulakë</h1>
        </div>
        <p className="font-display text-2xl leading-snug font-semibold sm:text-3xl">
          {t("tagline")}
        </p>
      </header>

      {/* Cuentas: solo en el Mac hasta que exista el aviso de privacidad (D-019). */}
      {accountsOpen && (
        <Suspense fallback={null}>
          <Start />
        </Suspense>
      )}

      <WhatIs />

      <section className="rounded-2xl bg-amarillo p-5 sm:p-8">
        <p className="text-lg font-medium">{waitlistOpen ? t("coming") : t("comingSoon")}</p>
        {waitlistOpen && (
          <div className="mt-6">
            <WaitlistForm defaultLanguage={locale as Locale} />
          </div>
        )}
      </section>
    </div>
  );
}

// Aviso al volver a la portada (por ahora, solo al salir de la cuenta).
async function Notice({ searchParams }: Pick<PageProps<"/[locale]">, "searchParams">) {
  const { aviso } = await searchParams;
  if (aviso !== "salida") return null;
  const t = await getTranslations("Account.notices");
  return <p role="status" lang={await contentLang()} className="rounded-lg bg-amarillo p-4 font-medium">{t("salida")}</p>;
}

// Botón principal: sin sesión, crear cuenta; con sesión, ir a los badulakes.
async function Start() {
  const t = await getTranslations("Nav");
  const user = await getCurrentUser();
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {user ? (
        <Link href="/badulakes" className={button}>{t("badulakes")}</Link>
      ) : (
        <Link href="/registro" className={button}>{t("signUp")}</Link>
      )}
    </div>
  );
}
