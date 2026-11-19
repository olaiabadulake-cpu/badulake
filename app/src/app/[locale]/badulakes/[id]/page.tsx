import type { Metadata } from "next";
import { contentLang } from "@/i18n/content-lang";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Link, redirect } from "@/i18n/navigation";
import { accountsOpen, createSupabase, getCurrentUser, idsOf } from "@/lib/supabase/server";
import { reportReasons } from "@/lib/report";
import { joinBadulake, leaveBadulake, publishBadulake, reportBadulake } from "../actions";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Badulake");
  return { title: `${t("detailTitle")} · Badulake` };
}

export default async function BadulakePage({ params, searchParams }: PageProps<"/[locale]/badulakes/[id]">) {
  // Cerrado en producción hasta que exista el aviso de privacidad (D-019, D-020).
  if (!accountsOpen) notFound();
  const t = await getTranslations("Badulake");

  return (
    <div lang={await contentLang()} className="mx-auto flex max-w-2xl flex-col gap-6 px-4 pt-6 pb-12 sm:px-8">
      <Suspense fallback={<p>{t("loading")}</p>}>
        <Details params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Details({
  params,
  searchParams,
}: Pick<PageProps<"/[locale]/badulakes/[id]">, "params" | "searchParams">) {
  const { id } = await params;
  const { aviso } = await searchParams;
  const locale = await getLocale();
  const user = await getCurrentUser();
  if (!user) redirect({ href: "/entrar?aviso=cuenta", locale });
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();

  // RLS: cualquier persona con sesión ve los publicados; los borradores solo su organizadora.
  // La dirección exacta solo la organizadora y quien esté apuntada.
  const supabase = await createSupabase();
  // Quién organiza no se puede leer (D-024): mis_badulakes() solo da los míos.
  const [{ data: b }, { data: ownIds }] = await Promise.all([
    supabase
      .from("badulakes")
      .select("id, titulo, descripcion, fecha_hora, zona, plazas, estado, oculto")
      .eq("id", id)
      .maybeSingle(),
    supabase.rpc("mis_badulakes"),
  ]);
  if (!b) notFound();
  const isOrganizer = idsOf(ownIds).includes(b.id);

  const [{ data: a }, { data: mine }, { data: count }] = await Promise.all([
    supabase.from("badulakes_direccion").select("direccion").eq("badulake_id", id).maybeSingle(),
    supabase.from("inscripciones").select("badulake_id").eq("badulake_id", id).maybeSingle(),
    supabase.rpc("plazas_ocupadas", { p_ids: [id] }).maybeSingle<{ ocupadas: number }>(),
  ]);
  const joined = Boolean(mine);
  const taken = count?.ocupadas ?? 0;
  const free = Math.max(0, b.plazas - taken);
  const upcoming = new Date(b.fecha_hora) > new Date();

  const t = await getTranslations("Badulake");
  const when = new Intl.DateTimeFormat(await contentLang(), {
    dateStyle: "full", timeStyle: "short", timeZone: "Europe/Madrid",
  }).format(new Date(b.fecha_hora));
  const rows: [string, string][] = [
    [t("date"), when],
    [t("zone"), b.zona],
    ...(a ? ([[t("address"), a.direccion]] as [string, string][]) : []),
    [t("seats"), isOrganizer ? t("seatsTaken", { taken, total: b.plazas }) : t("freeSeats", { count: free })],
  ];
  const notices = ["apuntada", "borrada", "lleno", "error", "no_disponible", "denunciado", "denuncia_repetida", "denuncia_error"] as const;
  const notice = notices.find((n) => n === aviso) ?? null;
  const good = notice === "apuntada" || notice === "borrada" || notice === "denunciado";
  const tr = await getTranslations("Report");
  const button =
    "rounded-full bg-noche px-6 py-3 text-center text-lg font-semibold text-white hover:bg-noche/90 sm:self-start";

  return (
    <>
      <Link href="/badulakes" className="font-medium underline underline-offset-4 sm:self-start">
        ← {t("back")}
      </Link>
      <h1 className="font-display text-3xl font-bold">{isOrganizer ? t("yourTitle") : b.titulo}</h1>
      {isOrganizer && (
        <>
          <p role="status" className="rounded-lg bg-amarillo p-4 font-medium">
            {b.estado === "publicado" ? t("statusPublished") : t("statusDraft")}
          </p>
          <h2 className="font-display text-2xl font-bold">{b.titulo}</h2>
        </>
      )}
      {isOrganizer && b.oculto && (
        <p role="status" className="rounded-lg border-2 border-error bg-white p-4 font-medium text-error">
          {tr("hiddenByTeam")}
        </p>
      )}
      {notice && (
        <p
          role={good ? "status" : "alert"}
          className={`rounded-lg p-4 font-medium ${good ? "bg-amarillo" : "border-2 border-error bg-white text-error"}`}
        >
          {t(`notices.${notice}`)}
        </p>
      )}
      <p className="whitespace-pre-line text-lg">{b.descripcion}</p>
      <dl className="flex flex-col gap-3">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="text-sm font-medium text-noche/70">{k}</dt>
            <dd className="text-lg">{v}</dd>
          </div>
        ))}
      </dl>
      {isOrganizer && <p className="text-sm text-noche/70">{t("addressPrivate")}</p>}
      {isOrganizer && b.estado === "borrador" && (
        <form action={publishBadulake}>
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="id" value={b.id} />
          <button type="submit" className={button}>{t("publish")}</button>
        </form>
      )}
      {!isOrganizer && joined && (
        <>
          {notice !== "apuntada" && (
            <p role="status" className="rounded-lg bg-amarillo p-4 font-medium">{t("youAreIn")}</p>
          )}
          <a href={`/api/badulakes/${b.id}/calendario`} download className={button}>
            {t("addToCalendar")}
          </a>
          <form action={leaveBadulake}>
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="id" value={b.id} />
            <button
              type="submit"
              className="rounded-full border-2 border-noche px-6 py-2.5 font-semibold hover:bg-noche/5"
            >
              {t("leave")}
            </button>
          </form>
        </>
      )}
      {!isOrganizer && !joined && b.estado === "publicado" && upcoming && (
        free > 0 ? (
          <>
            <p className="text-sm text-noche/70">{t("addressAfterJoin")}</p>
            <form action={joinBadulake}>
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="id" value={b.id} />
              <button type="submit" className={button}>{t("join")}</button>
            </form>
          </>
        ) : (
          <p role="status" className="font-medium">{t("full")}</p>
        )
      )}
      {!isOrganizer && (
        <details className="rounded-lg border-2 border-noche/30 p-4">
          <summary className="cursor-pointer font-semibold">{tr("button")}</summary>
          <form action={reportBadulake} className="mt-4 flex flex-col gap-4">
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="id" value={b.id} />
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-1 font-medium">{tr("reasonLegend")}</legend>
              {reportReasons.map((r) => (
                <label key={r} className="flex items-start gap-2">
                  <input type="radio" name="reason" value={r} required className="mt-1.5 size-4" />
                  <span>{tr(`reasons.${r}`)}</span>
                </label>
              ))}
            </fieldset>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="note" className="font-medium">{tr("noteLabel")}</label>
              <textarea
                id="note" name="note" rows={3} maxLength={300} aria-describedby="note-hint"
                className="w-full rounded-lg border-2 border-noche/60 bg-white px-3 py-2.5 text-base focus:border-noche"
              />
              <p id="note-hint" className="text-sm text-noche/70">{tr("noteHint")}</p>
            </div>
            <button
              type="submit"
              className="rounded-full border-2 border-noche px-6 py-2.5 font-semibold hover:bg-noche/5 sm:self-start"
            >
              {tr("send")}
            </button>
          </form>
        </details>
      )}
    </>
  );
}
