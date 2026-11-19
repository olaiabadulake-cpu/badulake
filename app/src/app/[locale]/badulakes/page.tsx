import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Link, redirect } from "@/i18n/navigation";
import { accountsOpen, createSupabase, getCurrentUser } from "@/lib/supabase/server";

export default async function BadulakesList() {
  // Cerrado en producción hasta que exista el aviso de privacidad (D-019, D-021).
  if (!accountsOpen) notFound();
  const t = await getTranslations("Badulake");

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 pt-6 pb-12 sm:px-8">
      <h1 className="font-display text-3xl font-bold">{t("listTitle")}</h1>
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
  // RLS: se ven los publicados y mis borradores. Salen los publicados y, además, los míos
  // aunque sean borradores, para poder encontrarlos (docs/recorridos.md).
  const { data: rows } = await supabase
    .from("badulakes")
    .select("id, organizadora, titulo, fecha_hora, zona, plazas, estado")
    .or(`estado.eq.publicado,organizadora.eq.${user!.id}`)
    .gt("fecha_hora", new Date().toISOString())
    .order("fecha_hora", { ascending: true });
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
  const fmt = new Intl.DateTimeFormat(locale, {
    dateStyle: "full", timeStyle: "short", timeZone: "Europe/Madrid",
  });

  const create = (
    <Link
      href="/badulakes/nuevo"
      className="rounded-full bg-noche px-6 py-3 text-center text-lg font-semibold text-white hover:bg-noche/90 sm:self-start"
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
              className="flex flex-col gap-1 rounded-2xl border-2 border-noche/30 p-4 hover:border-noche focus-visible:border-noche"
            >
              <span className="font-display text-xl font-bold">{b.titulo}</span>
              {(b.organizadora === user!.id || joined.has(b.id)) && (
                <span className="flex flex-wrap gap-2 text-sm font-semibold">
                  {b.organizadora === user!.id && <span className="rounded-full bg-amarillo px-3 py-0.5">{t("mine")}</span>}
                  {b.estado === "borrador" && <span className="rounded-full border-2 border-noche px-3 py-0.5">{t("draft")}</span>}
                  {joined.has(b.id) && <span className="rounded-full bg-amarillo px-3 py-0.5">{t("joinedTag")}</span>}
                </span>
              )}
              <span>{fmt.format(new Date(b.fecha_hora))}</span>
              <span>{b.zona}</span>
              <span className="font-medium">
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
