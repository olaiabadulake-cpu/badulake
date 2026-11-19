import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { contentLang } from "@/i18n/content-lang";
import { getLocale, getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { accountsOpen, getCurrentUser } from "@/lib/supabase/server";
import { NewPasswordForm } from "./new-password-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Account");
  return { title: `${t("newPasswordTitle")} · Badulake` };
}

export default async function NewPassword() {
  // Cerrado en producción hasta el lanzamiento (D-019).
  if (!accountsOpen) notFound();
  const t = await getTranslations("Account");
  return (
    <div lang={await contentLang()} className="pagina">
      <h1 className="titulo-1">{t("newPasswordTitle")}</h1>
      <Suspense fallback={<p>{t("loading")}</p>}>
        <Form />
      </Suspense>
    </div>
  );
}

// Solo se llega con el enlace del correo (que abre una sesión): sin sesión, a «enlace caducado».
async function Form() {
  const locale = await getLocale();
  if (!(await getCurrentUser())) redirect({ href: "/entrar?aviso=enlace", locale });
  return <NewPasswordForm />;
}
