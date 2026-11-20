import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { contentLang } from "@/i18n/content-lang";
import { Link, redirect } from "@/i18n/navigation";
import { accountsOpen, createSupabase, getCurrentUser, idsOf } from "@/lib/supabase/server";
import { UUID } from "@/lib/dia";
import { DiaPanelView } from "./dia-panel";
import { diaCargar } from "./actions";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Dia");
  return { title: `${t("title")} · Badulake`, robots: { index: false } };
}

export default async function DiaPage({ params }: PageProps<"/[locale]/badulakes/[id]/dia">) {
  // Cerrado en producción igual que el resto de las cuentas (D-019).
  if (!accountsOpen) notFound();
  const t = await getTranslations("Dia");
  return (
    <div lang={await contentLang()} className="pagina">
      <Suspense fallback={<p>{t("loading")}</p>}>
        <Contenido params={params} />
      </Suspense>
    </div>
  );
}

async function Contenido({ params }: Pick<PageProps<"/[locale]/badulakes/[id]/dia">, "params">) {
  const { id } = await params;
  const locale = await getLocale();
  const user = await getCurrentUser();
  if (!user) redirect({ href: "/entrar?aviso=cuenta", locale });
  if (!UUID.test(id)) notFound();

  // Solo la organizadora: para el resto, la página no existe (404).
  const supabase = await createSupabase();
  const { data: ownIds } = await supabase.rpc("mis_badulakes");
  if (!idsOf(ownIds).includes(id)) notFound();

  const t = await getTranslations("Dia");
  const result = await diaCargar(id);
  const closedKey =
    result.code === "fuera_de_hora" ? "notOpen"
    : result.code === "no_confirmado" ? "notConfirmed"
    : result.code === "ok" ? null : "closed";

  return (
    <>
      <Link href={`/badulakes/${id}`} className="enlace sm:self-start">
        ← {t("back")}
      </Link>
      <h1 className="titulo-1">{t("title")}</h1>
      {closedKey || !result.panel ? (
        <p role="status" className="aviso">{t(closedKey ?? "closed")}</p>
      ) : (
        <DiaPanelView id={id} initial={result.panel} />
      )}
    </>
  );
}
