import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { accountsOpen } from "@/lib/supabase/server";
import { SignUpForm } from "./signup-form";

export default async function SignUp() {
  // Cerrado en producción hasta que exista el aviso de privacidad (D-019).
  if (!accountsOpen) notFound();
  const t = await getTranslations("Account");

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 pt-6 pb-12 sm:px-8">
      <h1 className="font-display text-3xl font-bold">{t("signUpTitle")}</h1>
      <p className="text-lg">{t("signUpIntro")}</p>
      <SignUpForm />
    </div>
  );
}
