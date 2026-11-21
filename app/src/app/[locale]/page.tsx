import { getLocale, getTranslations } from "next-intl/server";
import { waitlistOpen } from "@/lib/waitlist";
import { Suspense } from "react";
import { accountsOpen, getCurrentUser } from "@/lib/supabase/server";
import { contentLang } from "@/i18n/content-lang";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/languages";
import { Symbol, Wordmark } from "./logo";
import { WaitlistForm } from "./waitlist-form";
import { WhatIs } from "./what-is";
import { getImpacto } from "@/lib/impacto";

export default async function Home({ searchParams }: PageProps<"/[locale]">) {
  const t = await getTranslations("Home");
  const locale = await getLocale();

  return (
    <div className="pagina !gap-10 sm:!pb-16">
      {accountsOpen && (
        <Suspense fallback={null}>
          <Notice searchParams={searchParams} />
        </Suspense>
      )}

      <header className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <Symbol className="size-14" />
          <h1 className="text-4xl sm:text-5xl"><Wordmark /></h1>
        </div>
        <p className="font-display text-2xl leading-snug font-bold sm:text-3xl">
          {t("tagline")}
        </p>
      </header>

      {/* Cuentas: solo en el Mac hasta que exista el aviso de privacidad (D-019). */}
      {accountsOpen && (
        <Suspense fallback={null}>
          <Start />
        </Suspense>
      )}

      <Suspense fallback={null}>
        <Impact />
      </Suspense>

      <WhatIs />

      <section className="rounded-3xl border-2 border-noche bg-amarillo p-5 sm:p-8">
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
  if (aviso !== "salida" && aviso !== "borrada") return null;
  const t = await getTranslations("Account.notices");
  return <p role="status" lang={await contentLang()} className="aviso">{t(aviso)}</p>;
}

// Botón principal: sin sesión, crear cuenta; con sesión, ir a los badulakes.
async function Start() {
  const t = await getTranslations("Nav");
  const user = await getCurrentUser();
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {user ? (
        <Link href="/badulakes" className="boton">{t("badulakes")}</Link>
      ) : (
        <Link href="/registro" className="boton">{t("signUp")}</Link>
      )}
    </div>
  );
}

// Contador de impacto (Tarea 15.1, D-047): solo sale cuando ya hay algo que contar.
async function Impact() {
  const data = await getImpacto();
  if (!data || data.objetos === 0) return null;
  const t = await getTranslations("Home");
  const fmt = new Intl.NumberFormat(await contentLang());
  return (
    <section aria-labelledby="impacto" lang={await contentLang()} className="flex flex-col gap-3">
      <h2 id="impacto" className="titulo-3">{t("impactTitle")}</h2>
      <dl className="grid grid-cols-2 gap-3">
        <div className="tarjeta !gap-1">
          <dt className="ayuda">{t("impactObjects")}</dt>
          <dd className="font-display text-4xl font-bold">{fmt.format(data.objetos)}</dd>
        </div>
        <div className="tarjeta !gap-1">
          <dt className="ayuda">{t("impactBadulakes")}</dt>
          <dd className="font-display text-4xl font-bold">{fmt.format(data.badulakes)}</dd>
        </div>
      </dl>
    </section>
  );
}
