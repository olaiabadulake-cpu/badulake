import type { Metadata } from "next";
import { contentLang } from "@/i18n/content-lang";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Link, redirect } from "@/i18n/navigation";
import { accountsOpen, createSupabase, getCurrentUser } from "@/lib/supabase/server";
import { NewBadulakeForm } from "./new-form";
import { wantToOrganize } from "../actions";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Badulake");
  return { title: `${t("newTitle")} · Badulake` };
}

export default async function NewBadulake({ searchParams }: PageProps<"/[locale]/badulakes/nuevo">) {
  // Cerrado en producción hasta que exista el aviso de privacidad (D-019, D-020).
  if (!accountsOpen) notFound();
  const t = await getTranslations("Badulake");

  return (
    <div lang={await contentLang()} className="pagina">
      <h1 className="titulo-1">{t("newTitle")}</h1>
      <Suspense fallback={<p>{t("loading")}</p>}>
        <Form searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

// Sin sesión, a /entrar.
async function Form({ searchParams }: Pick<PageProps<"/[locale]/badulakes/nuevo">, "searchParams">) {
  const locale = await getLocale();
  const user = await getCurrentUser();
  if (!user) redirect({ href: "/entrar?aviso=cuenta", locale });
  // Para organizar hay que haber ido antes a un badulake (Tarea 5.2, D-038): lo decide la base de datos.
  const supabase = await createSupabase();
  const { data: puedo } = await supabase.rpc("puedo_organizar");
  if (puedo === false) {
    const t = await getTranslations("Badulake");
    // Cómo se consigue y «Quiero organizar» para pedírselo al equipo (Tarea 5.4, D-045).
    const { aviso } = await searchParams;
    const { data: asked } = await supabase.rpc("he_pedido_organizar");
    const steps = ["how1", "how2", "how3"] as const;
    return (
      <>
        <section aria-labelledby="aun-no" className="tarjeta gap-3">
          <h2 id="aun-no" className="titulo-2">{t("notYetTitle")}</h2>
          <p role="status">{t("notYetBody")}</p>
          <h3 className="titulo-3">{t("howTitle")}</h3>
          <ol className="flex list-decimal flex-col gap-1 pl-6">
            {steps.map((k) => <li key={k}>{t(k)}</li>)}
          </ol>
          <Link href="/badulakes" className="boton sm:self-start">{t("notYetLink")}</Link>
        </section>
        <section aria-labelledby="quiero" className="tarjeta gap-3">
          <h2 id="quiero" className="titulo-3">{t("wantTitle")}</h2>
          {aviso === "error" && <p role="alert" className="aviso-error">{t("notices.error")}</p>}
          {asked === true || aviso === "pedido" ? (
            <p role="status" className="aviso">{t("wantDone")}</p>
          ) : (
            <form action={wantToOrganize} className="flex flex-col gap-3">
              <input type="hidden" name="locale" value={locale} />
              <p>{t("wantText")}</p>
              <button type="submit" className="boton-2 sm:self-start">{t("wantButton")}</button>
            </form>
          )}
        </section>
      </>
    );
  }
  return <NewBadulakeForm />;
}
