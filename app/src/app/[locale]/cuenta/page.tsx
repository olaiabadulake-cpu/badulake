import type { Metadata } from "next";
import { contentLang } from "@/i18n/content-lang";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { accountsOpen, getCurrentUser } from "@/lib/supabase/server";
import { signOut } from "./actions";
import { Interest } from "./interest";
import { ChangePassword, DeleteAccount } from "./security-forms";
import { Avisos } from "./avisos";
import { MisBadulakes } from "./mis-badulakes";
import { PushAvisos } from "./push-avisos";
import { vapidPublicKey } from "@/lib/avisos";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Account");
  return { title: `${t("accountTitle")} · Badulake` };
}

export default async function AccountPage({ searchParams }: PageProps<"/[locale]/cuenta">) {
  // Cerrado en producción hasta que exista el aviso de privacidad (D-019).
  if (!accountsOpen) notFound();
  const t = await getTranslations("Account");

  return (
    <div lang={await contentLang()} className="pagina">
      <h1 className="titulo-1">{t("accountTitle")}</h1>
      <Suspense fallback={<p>{t("loading")}</p>}>
        <Account searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

// Lee la sesión en cada visita (no se guarda en caché).
async function Account({ searchParams }: Pick<PageProps<"/[locale]/cuenta">, "searchParams">) {
  const { aviso } = await searchParams;
  const locale = await getLocale();
  const user = await getCurrentUser();
  if (!user) redirect({ href: "/entrar?aviso=cuenta", locale });

  const t = await getTranslations("Account");
  return (
    <>
      <p className="text-lg">{t("signedInAs", { email: user!.email })}</p>
      {aviso === "contrasena" && <p role="status" className="aviso">{t("passwordChanged")}</p>}
      <Avisos />
      <MisBadulakes />
      <form action={signOut}>
        <input type="hidden" name="locale" value={locale} />
        <button
          type="submit"
          className="boton-2"
        >
          {t("signOut")}
        </button>
      </form>
      {/* Avisos en el móvil: solo en la copia de pruebas (Tarea 16.1, D-050). */}
      {vapidPublicKey && <PushAvisos publicKey={vapidPublicKey} />}
      <Interest />
      <ChangePassword />
      <DeleteAccount />
    </>
  );
}
