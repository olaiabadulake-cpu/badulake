import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { contentLang } from "@/i18n/content-lang";
import { getTranslations } from "next-intl/server";
import { accountsOpen } from "@/lib/supabase/server";
import { SignUpForm } from "./signup-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Account");
  return { title: `${t("signUpTitle")} · Badulake` };
}

export default async function SignUp() {
  // Cerrado en producción hasta que exista el aviso de privacidad (D-019).
  if (!accountsOpen) notFound();
  const t = await getTranslations("Account");

  return (
    <div lang={await contentLang()} className="pagina">
      <h1 className="titulo-1">{t("signUpTitle")}</h1>
      <p className="text-lg">{t("signUpIntro")}</p>
      <SignUpForm />
    </div>
  );
}
