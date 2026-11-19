import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { accountsOpen, getCurrentUser } from "@/lib/supabase/server";
import { LanguageSwitch } from "./language-switch";
import { NavLink } from "./nav-link";

// El mismo menú en todas las páginas (docs/recorridos.md). Solo cambia según haya o no sesión.
// Mientras las cuentas estén cerradas en producción, solo enseña «Qué es un badulake» (D-019).
export async function SiteHeader() {
  const t = await getTranslations("Nav");
  const f = await getTranslations("Footer");
  const whatIs = <li key="que-es"><NavLink href="/que-es">{t("whatIs")}</NavLink></li>;

  return (
    <header className="border-b border-noche/15">
      <div className="mx-auto flex max-w-2xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-8">
        <Link
          href="/"
          aria-label={t("home")}
          className="rounded font-display text-xl font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-noche"
        >
          badulakë
        </Link>
        <nav aria-label={t("label")} className="flex-1">
          <ul className="flex flex-wrap gap-x-4 gap-y-2 font-medium">
            {accountsOpen ? (
              <Suspense fallback={whatIs}>
                <SessionLinks whatIs={whatIs} />
              </Suspense>
            ) : (
              whatIs
            )}
          </ul>
        </nav>
        <LanguageSwitch label={f("language")} />
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
