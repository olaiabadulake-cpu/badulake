import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { contentLang } from "@/i18n/content-lang";
import { getTranslations } from "next-intl/server";
import { accountsOpen } from "@/lib/supabase/server";
import { SignInForm } from "./signin-form";

const notices = ["salida", "enlace", "verificada", "cuenta"] as const;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Account");
  return { title: `${t("signInTitle")} · Badulake` };
}

export default async function SignIn({ searchParams }: PageProps<"/[locale]/entrar">) {
  // Cerrado en producción hasta que exista el aviso de privacidad (D-019).
  if (!accountsOpen) notFound();
  const t = await getTranslations("Account");

  return (
    <div lang={await contentLang()} className="mx-auto flex max-w-2xl flex-col gap-6 px-4 pt-6 pb-12 sm:px-8">
      <h1 className="font-display text-3xl font-bold">{t("signInTitle")}</h1>
      <Suspense>
        <Notice searchParams={searchParams} />
      </Suspense>
      <SignInForm />
    </div>
  );
}

// Aviso según de dónde venga: ha salido, enlace caducado, correo verificado o necesita entrar.
async function Notice({ searchParams }: Pick<PageProps<"/[locale]/entrar">, "searchParams">) {
  const { aviso } = await searchParams;
  const notice = notices.find((n) => n === aviso);
  if (!notice) return null;
  const t = await getTranslations("Account.notices");
  return <p role="status" className="rounded-lg bg-amarillo p-4 font-medium">{t(notice)}</p>;
}
