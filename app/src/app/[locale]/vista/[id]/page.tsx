import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { contentLang } from "@/i18n/content-lang";
import { Link } from "@/i18n/navigation";
import { accountsOpen } from "@/lib/supabase/server";
import { getVista } from "@/lib/vista";
import { isFinished } from "@/lib/badulake-estado";

// Vista previa pública de un badulake compartido (Tarea 6.3, D-042). La enseña proxy.ts a quien
// abre /badulakes/<id> sin sesión: lugar, fecha y plazas, nunca la dirección. Al entrar o crear la
// cuenta, proxy.ts la devuelve a ese badulake.
export async function generateMetadata({ params }: PageProps<"/[locale]/vista/[id]">): Promise<Metadata> {
  const { id } = await params;
  const b = accountsOpen ? await getVista(id) : null;
  if (!b) return { title: "Badulake", robots: { index: false } };
  const t = await getTranslations("Badulake");
  const description = t("shareText");
  return {
    title: `${b.titulo} · Badulake`,
    description,
    robots: { index: false },
    openGraph: { title: b.titulo, description, type: "website", siteName: "Badulake" },
    twitter: { card: "summary_large_image", title: b.titulo, description },
  };
}

export default async function VistaPage({ params }: PageProps<"/[locale]/vista/[id]">) {
  if (!accountsOpen) notFound();
  const t = await getTranslations("Badulake");
  return (
    <div lang={await contentLang()} className="pagina">
      <Suspense fallback={<p>{t("loading")}</p>}>
        <Contenido params={params} />
      </Suspense>
    </div>
  );
}

async function Contenido({ params }: Pick<PageProps<"/[locale]/vista/[id]">, "params">) {
  const { id } = await params;
  const b = await getVista(id);
  if (!b) notFound();
  const t = await getTranslations("Badulake");
  const nav = await getTranslations("Nav");
  const what = await getTranslations("WhatIs");
  const now = new Date();
  const when = new Intl.DateTimeFormat(await contentLang(), {
    dateStyle: "full", timeStyle: "short", timeZone: "Europe/Madrid",
  }).format(new Date(b.fecha_hora));
  const cancelled = b.estado === "cancelado";
  const finished = !cancelled && isFinished(b.fecha_hora, now);
  const open = !cancelled && new Date(b.fecha_hora) > now;

  return (
    <>
      <h1 className="titulo-1">{b.titulo}</h1>
      {cancelled && <p role="status" className="aviso-error">{t("statusCancelled")}</p>}
      {finished && <p role="status" className="aviso">{t("statusFinished")}</p>}
      <dl className="flex flex-col gap-3">
        <div><dt className="ayuda font-medium">{t("date")}</dt><dd className="text-lg">{when}</dd></div>
        <div><dt className="ayuda font-medium">{t("zone")}</dt><dd className="text-lg">{b.zona}</dd></div>
        {open && (
          <div>
            <dt className="ayuda font-medium">{t("seats")}</dt>
            <dd className="text-lg">{b.plazas_libres > 0 ? t("freeSeats", { count: b.plazas_libres }) : t("full")}</dd>
          </div>
        )}
      </dl>
      <p className="text-lg">{what("intro")}</p>
      {open && (
        <>
          <p className="aviso">{t("previewJoin")}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/entrar" className="boton">{nav("signIn")}</Link>
            <Link href="/registro" className="boton-2">{nav("signUp")}</Link>
          </div>
        </>
      )}
      <Link href="/que-es" className="enlace sm:self-start">{nav("whatIs")}</Link>
    </>
  );
}
