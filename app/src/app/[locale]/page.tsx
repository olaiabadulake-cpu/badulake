import { getLocale, getTranslations } from "next-intl/server";
import { waitlistOpen } from "@/lib/waitlist";
import { Suspense } from "react";
import { accountsOpen, getCurrentUser } from "@/lib/supabase/server";
import { contentLang } from "@/i18n/content-lang";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/languages";
import { Pegatina, Wordmark } from "./logo";
import { WaitlistForm } from "./waitlist-form";
import { WhatIs } from "./what-is";
import { getImpacto } from "@/lib/impacto";

export default async function Home({ searchParams }: PageProps<"/[locale]">) {
  const t = await getTranslations("Home");
  const locale = await getLocale();

  return (
    <>
    <div className="pagina relative !gap-8 !pb-10">
      {/* Pegatinas de fondo: solo decoración, detrás del texto y ocultas en móvil estrecho. */}
      <Pegatina name="tote" className="hidden w-28 -rotate-12 sm:block" style={{ right: "4%", top: "5.5rem" }} />
      <Pegatina name="mug" className="hidden w-32 rotate-12 sm:block" style={{ right: "-4%", top: "13rem" }} />
      <Pegatina name="shoe" className="hidden w-32 -rotate-6 sm:block" style={{ right: "12%", top: "21rem" }} />
      <Pegatina name="star" className="hidden w-14 rotate-12 sm:block" style={{ right: "6%", top: "1.5rem" }} />

      {accountsOpen && (
        <Suspense fallback={null}>
          <Notice searchParams={searchParams} />
        </Suspense>
      )}

      <header className="relative z-[1] flex flex-col gap-6 pt-4">
        <h1 className="text-3xl min-[400px]:text-4xl sm:text-6xl"><Wordmark /></h1>
        <p className="titulo-2 max-w-[22ch] !hyphens-none !text-[1.375rem] !leading-[1.2] !normal-case sm:!text-[1.875rem]">
          {t("tagline")}
        </p>
      </header>

      {/* Cuentas: solo en el Mac hasta que exista el aviso de privacidad (D-019). */}
      {accountsOpen && (
        <Suspense fallback={null}>
          <Start />
        </Suspense>
      )}
    </div>

    {/* Cinta con las ideas clave (decoración: el texto de verdad está debajo, en «Qué es un badulake»). */}
    <Tape />

    <div className="pagina !gap-10 sm:!pb-16">
      <Suspense fallback={null}>
        <Impact />
      </Suspense>

      <WhatIs />

      <section className="sobre-papel rounded-3xl border-4 border-white bg-lima p-5 sm:p-8">
        <p className="text-lg font-medium">{waitlistOpen ? t("coming") : t("comingSoon")}</p>
        {waitlistOpen && (
          <div className="mt-6">
            <WaitlistForm defaultLanguage={locale as Locale} />
          </div>
        )}
      </section>
    </div>
    </>
  );
}

// Cinta rosa con «Gratis · Sin dinero · De 5 a 10 personas · Solo mayores de 18», con los textos que ya existen.
async function Tape() {
  const t = await getTranslations("WhatIs");
  const items = (["free", "noMoney", "people", "adults"] as const).map((k) => t(k));
  const row = [...items, ...items].map((x, i) => <span key={i}>{x} ★</span>);
  return (
    <div aria-hidden lang={await contentLang()} className="overflow-hidden py-3">
      <div className="cinta"><div>{row}{row}</div></div>
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
