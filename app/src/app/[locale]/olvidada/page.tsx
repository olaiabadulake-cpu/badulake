import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { contentLang } from "@/i18n/content-lang";
import { getTranslations } from "next-intl/server";
import { accountsOpen } from "@/lib/supabase/server";
import { ForgotForm } from "./forgot-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Account");
  return { title: `${t("forgotTitle")} · Badulake` };
}

export default async function Forgot() {
  // Cerrado en producción hasta el lanzamiento (D-019).
  if (!accountsOpen) notFound();
  const t = await getTranslations("Account");
  return (
    <div lang={await contentLang()} className="pagina">
      <h1 className="titulo-1">{t("forgotTitle")}</h1>
      <p>{t("forgotIntro")}</p>
      <ForgotForm />
    </div>
  );
}
