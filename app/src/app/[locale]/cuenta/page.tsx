import type { Metadata } from "next";
import { contentLang } from "@/i18n/content-lang";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { accountsOpen, getCurrentUser } from "@/lib/supabase/server";
import { signOut } from "./actions";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Account");
  return { title: `${t("accountTitle")} · Badulake` };
}

export default async function AccountPage() {
  // Cerrado en producción hasta que exista el aviso de privacidad (D-019).
  if (!accountsOpen) notFound();
  const t = await getTranslations("Account");

  return (
    <div lang={await contentLang()} className="mx-auto flex max-w-2xl flex-col gap-6 px-4 pt-6 pb-12 sm:px-8">
      <h1 className="font-display text-3xl font-bold">{t("accountTitle")}</h1>
      <Suspense fallback={<p>{t("loading")}</p>}>
        <Account />
      </Suspense>
    </div>
  );
}

// Lee la sesión en cada visita (no se guarda en caché).
async function Account() {
  const locale = await getLocale();
  const user = await getCurrentUser();
  if (!user) redirect({ href: "/entrar?aviso=cuenta", locale });

  const t = await getTranslations("Account");
  return (
    <>
      <p className="text-lg">{t("signedInAs", { email: user!.email })}</p>
      <form action={signOut}>
        <input type="hidden" name="locale" value={locale} />
        <button
          type="submit"
          className="rounded-full border-2 border-noche px-6 py-2.5 font-semibold hover:bg-noche/5"
        >
          {t("signOut")}
        </button>
      </form>
    </>
  );
}
