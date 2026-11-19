import type { Metadata } from "next";
import { contentLang } from "@/i18n/content-lang";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { accountsOpen, getCurrentUser } from "@/lib/supabase/server";
import { NewBadulakeForm } from "./new-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Badulake");
  return { title: `${t("newTitle")} · Badulake` };
}

export default async function NewBadulake() {
  // Cerrado en producción hasta que exista el aviso de privacidad (D-019, D-020).
  if (!accountsOpen) notFound();
  const t = await getTranslations("Badulake");

  return (
    <div lang={await contentLang()} className="pagina">
      <h1 className="titulo-1">{t("newTitle")}</h1>
      <Suspense fallback={<p>{t("loading")}</p>}>
        <Form />
      </Suspense>
    </div>
  );
}

// Sin sesión, a /entrar.
async function Form() {
  const locale = await getLocale();
  const user = await getCurrentUser();
  if (!user) redirect({ href: "/entrar?aviso=cuenta", locale });
  return <NewBadulakeForm />;
}
