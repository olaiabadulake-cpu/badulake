import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { contentLang } from "@/i18n/content-lang";
import { getLocale, getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { accountsOpen, ageIsPending } from "@/lib/supabase/server";
import { GoogleButton } from "../google-button";
import { SignInForm } from "./signin-form";

const notices = ["salida", "enlace", "verificada", "cuenta", "google"] as const;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Account");
  return { title: `${t("signInTitle")} · Badulake` };
}

export default async function SignIn({ searchParams }: PageProps<"/[locale]/entrar">) {
  // Cerrado en producción hasta que exista el aviso de privacidad (D-019).
  if (!accountsOpen) notFound();
  const t = await getTranslations("Account");

  return (
    <div lang={await contentLang()} className="pagina">
      <h1 className="titulo-1">{t("signInTitle")}</h1>
      <Suspense>
        <Notice searchParams={searchParams} />
      </Suspense>
      <GoogleButton />
      <SignInForm />
    </div>
  );
}

// Aviso según de dónde venga: ha salido, enlace caducado, correo verificado, necesita entrar o
// no ha funcionado Google.
async function Notice({ searchParams }: Pick<PageProps<"/[locale]/entrar">, "searchParams">) {
  // Quien entró con Google y aún no ha confirmado su edad, a terminar ese paso (D-039).
  if (await ageIsPending()) redirect({ href: "/confirmar-edad", locale: await getLocale() });
  const { aviso } = await searchParams;
  const notice = notices.find((n) => n === aviso);
  if (!notice) return null;
  const t = await getTranslations("Account.notices");
  return <p role="status" className="aviso">{t(notice)}</p>;
}
