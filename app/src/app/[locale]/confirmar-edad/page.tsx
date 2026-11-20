import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { contentLang } from "@/i18n/content-lang";
import { getLocale, getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { accountsOpen, ageIsPending, getCurrentUser } from "@/lib/supabase/server";
import { AgeForm } from "./age-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Account");
  return { title: `${t("ageTitle")} · Badulake` };
}

// Primera vez con Google (Tarea 4.1, D-039): confirmar los 18 años antes de poder usar nada.
export default async function ConfirmAge() {
  if (!accountsOpen) notFound();
  const t = await getTranslations("Account");

  return (
    <div lang={await contentLang()} className="pagina">
      <h1 className="titulo-1">{t("ageTitle")}</h1>
      <Suspense fallback={<p>{t("loading")}</p>}>
        <Gate />
      </Suspense>
    </div>
  );
}

// Lee la sesión en cada visita: sin sesión, a entrar; con la edad ya confirmada, a los badulakes.
async function Gate() {
  const locale = await getLocale();
  if (!(await ageIsPending())) {
    redirect({ href: (await getCurrentUser()) ? "/badulakes" : "/entrar?aviso=cuenta", locale });
  }
  const t = await getTranslations("Account");
  return (
    <>
      <p className="text-lg">{t("ageIntro")}</p>
      <AgeForm />
    </>
  );
}
