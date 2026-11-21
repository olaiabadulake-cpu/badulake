import type { Metadata } from "next";
import { contentLang } from "@/i18n/content-lang";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Link, redirect } from "@/i18n/navigation";
import { accountsOpen, createSupabase, getCurrentUser, idsOf } from "@/lib/supabase/server";
import { PROVINCIAS, normalize } from "@/lib/provincias";
import { NearMe } from "./near-me";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Badulake");
  return { title: `${t("listTitle")} · Badulake` };
}

export default async function BadulakesList({ searchParams }: PageProps<"/[locale]/badulakes">) {
  // Cerrado en producción hasta que exista el aviso de privacidad (D-019, D-021).
  if (!accountsOpen) notFound();
  const t = await getTranslations("Badulake");

  return (
    <div lang={await contentLang()} className="pagina">
      <h1 className="titulo-1">{t("listTitle")}</h1>
      <Suspense fallback={<p>{t("loading")}</p>}>
        <List searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function List({ searchParams }: Pick<PageProps<"/[locale]/badulakes">, "searchParams">) {
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
  // Mi puesto en las listas de espera (solo los míos, Tarea 20).
  type Wait = { badulake_id: string; puesto: number };
  const waits: Wait[] = ids.length
    ? ((await supabase.rpc("mi_espera", { p_ids: ids })).data as Wait[] | null) ?? []
    : [];
  const waiting = new Map(waits.map((w) => [w.badulake_id, w.puesto]));
  // Los cancelados solo se enseñan a quien tenía que ver con ellos (para que vea el aviso).
  const visible = (rows ?? []).filter(
    (b) => b.estado !== "cancelado" || own.has(b.id) || joined.has(b.id) || waiting.has(b.id),
  );
  // Buscar por zona (Tarea 6.2, D-043): ciudad, pueblo, barrio o provincia, sin tildes ni
  // mayúsculas, sobre el título (que es el lugar, D-037) y el barrio. «Cerca de mí» llega como
  // código de provincia y busca cualquiera de sus nombres (Bizkaia o Vizcaya…).
  const { donde, prov } = await searchParams;
  const query = typeof donde === "string" ? donde.trim().slice(0, 60) : "";
  const province = typeof prov === "string" ? PROVINCIAS.find((p) => p.code === prov) : undefined;
  const words = province ? province.names.map(normalize) : query ? [normalize(query)] : [];
  const place = province ? province.names[0] : query;
  const shown = words.length
    ? visible.filter((b) => {
        const hay = normalize(`${b.titulo} ${b.zona}`);
        return words.some((w) => hay.includes(w));
      })
    : visible;
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

  const search = (
    <section role="search" aria-label={t("searchLabel")} className="tarjeta flex flex-col gap-3">
      <form method="get" className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="donde" className="etiqueta">{t("searchLabel")}</label>
          <input id="donde" name="donde" type="search" defaultValue={query} maxLength={60} className="campo" autoComplete="address-level2" />
        </div>
        <button type="submit" className="boton">{t("searchButton")}</button>
      </form>
      <NearMe label={t("nearMe")} hint={t("nearMeHint")} error={t("nearMeError")} />
    </section>
  );

  if (visible.length === 0) {
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
    {search}
    {words.length > 0 && (
      <div className="flex flex-wrap items-center gap-3">
        <p role="status" className="text-lg">{t("searchResults", { count: shown.length, place })}</p>
        <Link href="/badulakes" className="enlace">{t("clearSearch")}</Link>
      </div>
    )}
    <ul className="flex flex-col gap-4">
      {shown.map((b) => {
        const count = taken.get(b.id) ?? 0;
        // La organizadora cuenta como una persona más (Tarea 20.1, D-040).
        const free = Math.max(0, b.plazas - 1 - count);
        const cancelled = b.estado === "cancelado";
        const confirmed = b.estado === "publicado" && count + 1 >= 5;
        const position = waiting.get(b.id);
        return (
          <li key={b.id}>
            <Link
              href={`/badulakes/${b.id}`}
              className="tarjeta"
            >
              <span className="titulo-3">{b.titulo}</span>
              {(own.has(b.id) || joined.has(b.id) || position || cancelled || confirmed) && (
                <span className="flex flex-wrap gap-2">
                  {cancelled && <span className="etiqueta-pildora contorno">{t("cancelledTag")}</span>}
                  {confirmed && <span className="etiqueta-pildora">{t("confirmedTag")}</span>}
                  {own.has(b.id) && <span className="etiqueta-pildora">{t("mine")}</span>}
                  {b.estado === "borrador" && <span className="etiqueta-pildora contorno">{t("draft")}</span>}
                  {joined.has(b.id) && !cancelled && <span className="etiqueta-pildora">{t("joinedTag")}</span>}
                  {position && !cancelled && (
                    <span className="etiqueta-pildora contorno">{t("waitingTag", { position })}</span>
                  )}
                </span>
              )}
              <span>{fmt.format(new Date(b.fecha_hora))}</span>
              <span>{b.zona}</span>
              <span className="etiqueta">
                {cancelled ? t("statusCancelled") : free === 0 ? t("full") : t("freeSeats", { count: free })}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
    </>
  );
}
