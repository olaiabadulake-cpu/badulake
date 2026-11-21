import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { contentLang } from "@/i18n/content-lang";
import { Link } from "@/i18n/navigation";
import { accountsOpen, getCurrentUser } from "@/lib/supabase/server";
import { LanguageSwitch, LanguageSwitchFallback } from "./language-switch";
import { Logo } from "./logo";
import { NavLink, PlainNavLink } from "./nav-link";

// El mismo menú en todas las páginas (docs/recorridos.md). Solo cambia según haya o no sesión.
// Mientras las cuentas estén cerradas en producción, solo enseña «Qué es un badulake» (D-019).
export async function SiteHeader() {
  const t = await getTranslations("Nav");
  const f = await getTranslations("Footer");
  const whatIs = <li key="que-es"><NavLink href="/que-es">{t("whatIs")}</NavLink></li>;
  // Mientras se prepara la página: el mismo enlace, sin marcar en qué página estás.
  // Selector de lengua con buscador y aviso de la lengua del móvil (Tarea 11.1, D-049).
  const languageLabels = {
    label: f("language"), search: f("languageSearch"), none: f("languageNone"),
    suggest: f("languageSuggest"), dismiss: f("languageDismiss"),
  };
  const whatIsPlain = <li key="que-es"><PlainNavLink href="/que-es">{t("whatIs")}</PlainNavLink></li>;

  return (
    <header lang={await contentLang()} className="border-b-2 border-noche bg-amarillo">
      <div className="mx-auto flex max-w-2xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-8">
        <Link
          href="/"
          aria-label={t("home")}
          className="rounded text-xl"
        >
          <Logo symbolClass="size-9" />
        </Link>
        <nav aria-label={t("label")} className="flex-1">
          <ul className="flex flex-wrap gap-x-5 gap-y-1 font-semibold">
            <Suspense fallback={whatIsPlain}>
              {accountsOpen ? <SessionLinks whatIs={whatIs} /> : whatIs}
            </Suspense>
          </ul>
        </nav>
        <Suspense fallback={<LanguageSwitchFallback labels={languageLabels} />}>
          <LanguageSwitch labels={languageLabels} />
        </Suspense>
      </div>
    </header>
  );
}

async function SessionLinks({ whatIs }: { whatIs: React.ReactNode }) {
  const t = await getTranslations("Nav");
  const user = await getCurrentUser();
  if (!user) {
    return (
      <>
        {whatIs}
        <li><NavLink href="/entrar">{t("signIn")}</NavLink></li>
        <li><NavLink href="/registro">{t("signUp")}</NavLink></li>
      </>
    );
  }
  return (
    <>
      <li><NavLink href="/badulakes">{t("badulakes")}</NavLink></li>
      <li><NavLink href="/badulakes/nuevo">{t("create")}</NavLink></li>
      {whatIs}
      <li><NavLink href="/cuenta">{t("account")}</NavLink></li>
    </>
  );
}
