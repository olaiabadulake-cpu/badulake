import { getLocale, getTranslations } from "next-intl/server";
import { waitlistOpen } from "@/lib/waitlist";
import { Suspense } from "react";
import { accountsOpen, getCurrentUser } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/languages";
import { WaitlistForm } from "./waitlist-form";

export default async function Home() {
  const t = await getTranslations("Home");
  const locale = await getLocale();

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-10 px-4 pt-6 pb-12 sm:px-8 sm:pb-16">
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

      <ul className="flex flex-col gap-3 text-lg">
        {(["point1", "point2", "point3"] as const).map((key) => (
          <li key={key} className="flex gap-3">
            <span aria-hidden className="mt-2.5 size-2 shrink-0 rounded-full bg-noche" />
            {t(key)}
          </li>
        ))}
      </ul>

      <section className="rounded-2xl bg-amarillo p-5 sm:p-8">
        <p className="text-lg font-medium">{waitlistOpen ? t("coming") : t("comingSoon")}</p>
        {waitlistOpen && (
          <div className="mt-6">
            <WaitlistForm defaultLanguage={locale as Locale} />
          </div>
        )}
      </section>

      {/* Cuentas: solo en el Mac hasta que exista el aviso de privacidad (D-019). */}
      {accountsOpen && (
        <Suspense fallback={null}>
          <AccountLinks />
        </Suspense>
      )}
    </div>
  );
}

// Con sesión: enlace a los badulakes. Sin sesión: entrar o crear cuenta.
async function AccountLinks() {
  const t = await getTranslations("Home");
  const user = await getCurrentUser();
  return (
    <nav className="flex gap-4 text-lg font-medium">
      {user ? (
        <Link href="/badulakes" className="underline underline-offset-4">{t("seeBadulakes")}</Link>
      ) : (
        <>
          <Link href="/entrar" className="underline underline-offset-4">{t("signIn")}</Link>
          <Link href="/registro" className="underline underline-offset-4">{t("signUp")}</Link>
        </>
      )}
    </nav>
  );
}
