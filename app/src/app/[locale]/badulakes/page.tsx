import type { Metadata } from "next";
import { contentLang } from "@/i18n/content-lang";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Link, redirect } from "@/i18n/navigation";
import { accountsOpen, createSupabase, getCurrentUser, idsOf } from "@/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Badulake");
  return { title: `${t("listTitle")} · Badulake` };
}

export default async function BadulakesList() {
  // Cerrado en producción hasta que exista el aviso de privacidad (D-019, D-021).
  if (!accountsOpen) notFound();
  const t = await getTranslations("Badulake");

  return (
    <div lang={await contentLang()} className="pagina">
      <h1 className="titulo-1">{t("listTitle")}</h1>
      <Suspense fallback={<p>{t("loading")}</p>}>
        <List />
      </Suspense>
    </div>
  );
}

async function List() {
  const locale = await getLocale();
  const user = await getCurrentUser();
  if (!user) redirect({ href: "/entrar?aviso=cuenta", locale });

  const t = await getTranslations("Badulake");
  const nav = await getTranslations("Nav");
  const supabase = await createSupabase();
  // RLS: se ven los publicados y mis borradores (para poder encontrarlos, docs/recorridos.md).
  // Quién organiza cada uno no se puede leer (D-024): solo sé cuáles son míos.
  const [{ data: rows }, { data: ownIds }] = await Promise.all([
    supabase
      .from("badulakes")
      .select("id, titulo, fecha_hora, zona, plazas, estado")
      .gt("fecha_hora", new Date().toISOString())
      .order("fecha_hora", { ascending: true }),
    supabase.rpc("mis_badulakes"),
  ]);
  const own = new Set(idsOf(ownIds));
  const ids = (rows ?? []).map((r) => r.id);
  // Solo el número de plazas ocupadas de cada badulake (supabase/seguridad.sql).
  type Count = { badulake_id: string; ocupadas: number };
  const counts: Count[] = ids.length
    ? ((await supabase.rpc("plazas_ocupadas", { p_ids: ids })).data as Count[] | null) ?? []
    : [];
  const taken = new Map((counts ?? []).map((c) => [c.badulake_id, c.ocupadas ?? 0]));
  // RLS: solo se leen mis propias inscripciones.
  const { data: mine } = ids.length
    ? await supabase.from("inscripciones").select("badulake_id").in("badulake_id", ids)
    : { data: [] };
  const joined = new Set((mine ?? []).map((m) => m.badulake_id));
  const fmt = new Intl.DateTimeFormat(await contentLang(), {
    dateStyle: "full", timeStyle: "short", timeZone: "Europe/Madrid",
  });

  const create = (
    <Link
      href="/badulakes/nuevo"
      className="boton sm:self-start"
    >
      {nav("create")}
    </Link>
  );

  if (!rows || rows.length === 0) {
    return (
      <>
        <p role="status" className="text-lg">{t("listEmpty")}</p>
        {create}
      </>
    );
  }

  return (
    <>
    {create}
    <ul className="flex flex-col gap-4">
      {rows.map((b) => {
        const free = Math.max(0, b.plazas - (taken.get(b.id) ?? 0));
        return (
          <li key={b.id}>
            <Link
              href={`/badulakes/${b.id}`}
              className="tarjeta"
            >
              <span className="titulo-3">{b.titulo}</span>
              {(own.has(b.id) || joined.has(b.id)) && (
                <span className="flex flex-wrap gap-2">
                  {own.has(b.id) && <span className="etiqueta-pildora">{t("mine")}</span>}
                  {b.estado === "borrador" && <span className="etiqueta-pildora contorno">{t("draft")}</span>}
                  {joined.has(b.id) && <span className="etiqueta-pildora">{t("joinedTag")}</span>}
                </span>
              )}
              <span>{fmt.format(new Date(b.fecha_hora))}</span>
              <span>{b.zona}</span>
              <span className="etiqueta">
                {free === 0 ? t("full") : t("freeSeats", { count: free })}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
    </>
  );
}
