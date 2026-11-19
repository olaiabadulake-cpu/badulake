import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { accountsOpen, getCurrentUser } from "@/lib/supabase/server";
import { NewBadulakeForm } from "./new-form";

export default async function NewBadulake() {
  // Cerrado en producción hasta que exista el aviso de privacidad (D-019, D-020).
  if (!accountsOpen) notFound();
  const t = await getTranslations("Badulake");

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 pt-6 pb-12 sm:px-8">
      <h1 className="font-display text-3xl font-bold">{t("newTitle")}</h1>
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
