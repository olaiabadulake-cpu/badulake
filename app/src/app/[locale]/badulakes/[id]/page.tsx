import type { Metadata } from "next";
import { contentLang } from "@/i18n/content-lang";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Link, redirect } from "@/i18n/navigation";
import { accountsOpen, createSupabase, getCurrentUser, idsOf } from "@/lib/supabase/server";
import { reportReasons } from "@/lib/report";
import type { DiaMiTurno } from "@/lib/dia";
import {
  cancelBadulake, joinBadulake, leaveBadulake, leaveWaitlist, publishBadulake, reportBadulake,
} from "../actions";
import { fallos } from "@/lib/pruebas";
import { ApuntarseConfuso, AsistentesAlaVista } from "./pruebas-fallos";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Badulake");
  return { title: `${t("detailTitle")} · Badulake` };
}

export default async function BadulakePage({ params, searchParams }: PageProps<"/[locale]/badulakes/[id]">) {
  // Cerrado en producción hasta que exista el aviso de privacidad (D-019, D-020).
  if (!accountsOpen) notFound();
  const t = await getTranslations("Badulake");

  return (
    <div lang={await contentLang()} className="pagina">
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
  const { aviso, paso } = await searchParams;
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
      .select("id, titulo, descripcion, fecha_hora, zona, plazas, estado, oculto, cancelado_por")
      .eq("id", id)
      .maybeSingle(),
    supabase.rpc("mis_badulakes"),
  ]);
  if (!b) notFound();
  const isOrganizer = idsOf(ownIds).includes(b.id);

  const [{ data: a }, { data: mine }, { data: count }, { data: wait }] = await Promise.all([
    supabase.from("badulakes_direccion").select("direccion").eq("badulake_id", id).maybeSingle(),
    supabase.from("inscripciones").select("badulake_id, desde_espera").eq("badulake_id", id).maybeSingle(),
    supabase.rpc("plazas_ocupadas", { p_ids: [id] }).maybeSingle<{ ocupadas: number }>(),
    // Mi puesto en la lista de espera (solo el mío, Tarea 20).
    supabase.rpc("mi_espera", { p_ids: [id] }).maybeSingle<{ puesto: number }>(),
  ]);
  // Día del badulake (Tarea 24): el botón solo para la organizadora y solo ese día; las
  // apuntadas ven su turno. Las dos comprobaciones las hace la base de datos.
  const [{ data: dayOn }, { data: myTurn }] = await Promise.all([
    isOrganizer ? supabase.rpc("dia_activo", { p_badulake: id }) : Promise.resolve({ data: false }),
    isOrganizer ? Promise.resolve({ data: null }) : supabase.rpc("dia_mi_turno", { p_badulake: id }),
  ]);
  const turn = (myTurn ?? null) as DiaMiTurno | null;
  const joined = Boolean(mine);
  const position = wait?.puesto ?? null;
  const taken = count?.ocupadas ?? 0;
  const free = Math.max(0, b.plazas - taken);
  const upcoming = new Date(b.fecha_hora) > new Date();
  const cancelled = b.estado === "cancelado";
  // «Confirmado» no se guarda: es publicado con 5 apuntadas o más (D-032).
  const confirmed = b.estado === "publicado" && taken >= 5;

  const t = await getTranslations("Badulake");
  const when = new Intl.DateTimeFormat(await contentLang(), {
    dateStyle: "full", timeStyle: "short", timeZone: "Europe/Madrid",
  }).format(new Date(b.fecha_hora));
  const rows: [string, string][] = [
    [t("date"), when],
    [t("zone"), b.zona],
    ...(a ? ([[t("address"), a.direccion]] as [string, string][]) : []),
    ...(cancelled ? [] : ([[t("seats"), isOrganizer ? t("seatsTaken", { taken, total: b.plazas }) : t("freeSeats", { count: free })]] as [string, string][])),
  ];
  const notices = [
    "apuntada", "borrada", "lleno", "error", "no_disponible", "denunciado", "denuncia_repetida",
    "denuncia_error", "en_espera", "espera_salida", "cancelado", "no_publicable",
  ] as const;
  const notice = notices.find((n) => n === aviso) ?? null;
  const good = (["apuntada", "borrada", "denunciado", "en_espera", "espera_salida", "cancelado"] as const)
    .some((n) => n === notice);
  const tr = await getTranslations("Report");
  const button = "boton sm:self-start";

  return (
    <>
      <Link href="/badulakes" className="enlace sm:self-start">
        ← {t("back")}
      </Link>
      <h1 className="titulo-1">{isOrganizer ? t("yourTitle") : b.titulo}</h1>
      {isOrganizer && (
        <>
          {!cancelled && (
            <p role="status" className="aviso">
              {b.estado === "publicado" ? t("statusPublished") : t("statusDraft")}
            </p>
          )}
          <h2 className="titulo-2">{b.titulo}</h2>
        </>
      )}
      {isOrganizer && b.oculto && (
        <p role="status" className="aviso-error">
          {tr("hiddenByTeam")}
        </p>
      )}
      {notice && (
        <p
          role={good ? "status" : "alert"}
          className={good ? "aviso" : "aviso-error"}
        >
          {t(`notices.${notice}`)}
        </p>
      )}
      {cancelled && (
        <div role="status" className="aviso-error">
          <p className="font-semibold">{t("statusCancelled")}</p>
          <p>{b.cancelado_por === "automatica" ? t("cancelledAuto") : isOrganizer ? t("cancelledByYou") : t("cancelledByOrganizer")}</p>
        </div>
      )}
      {!cancelled && b.estado === "publicado" && upcoming && (
        <p className={confirmed ? "aviso" : "ayuda"}>
          {confirmed ? t("statusConfirmed") : t("statusNeeds", { count: 5 - taken })}
        </p>
      )}
      <p className="whitespace-pre-line text-lg">{b.descripcion}</p>
      <dl className="flex flex-col gap-3">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="ayuda font-medium">{k}</dt>
            <dd className="text-lg">{v}</dd>
          </div>
        ))}
      </dl>
      {joined && <AsistentesAlaVista id={b.id} />}
      {isOrganizer && !cancelled && <p className="ayuda">{t("addressPrivate")}</p>}
      {isOrganizer && dayOn === true && (
        <Link href={`/badulakes/${b.id}/dia`} className="boton sm:self-start">{t("dayMode")}</Link>
      )}
      {!isOrganizer && turn?.presente && (
        <div role="status" className="aviso">
          {turn.elegir_empezado && turn.orden_elegir !== null ? (
            <>
              <p className="text-xl font-bold">{t("myTurn", { n: turn.orden_elegir })}</p>
              <p>{turn.turno === null ? t("turnsDone") : turn.turno === turn.orden_elegir ? t("itsYourTurn") : t("nowTurn", { n: turn.turno })}</p>
            </>
          ) : turn.orden_exponer !== null ? (
            <p className="text-xl font-bold">{t("myExpose", { n: turn.orden_exponer })}</p>
          ) : (
            <p>{t("dayNoDraw")}</p>
          )}
        </div>
      )}
      {isOrganizer && b.estado === "borrador" && (
        <form action={publishBadulake}>
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="id" value={b.id} />
          <button type="submit" className={button}>{t("publish")}</button>
        </form>
      )}
      {isOrganizer && b.estado === "publicado" && upcoming && (
        <details className="tarjeta">
          <summary className="cursor-pointer font-semibold">{t("cancelSummary")}</summary>
          <form action={cancelBadulake} className="mt-4 flex flex-col gap-4">
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="id" value={b.id} />
            <p>{t("cancelExplain")}</p>
            <button type="submit" className="boton-2 sm:self-start">{t("cancelConfirm")}</button>
          </form>
        </details>
      )}
      {!isOrganizer && joined && !cancelled && (
        <>
          {notice !== "apuntada" && (
            <p role="status" className="aviso">
              {mine?.desde_espera ? t("fromWaitlist") : t("youAreIn")}
            </p>
          )}
          <a href={`/api/badulakes/${b.id}/calendario`} download className={button}>
            {t("addToCalendar")}
          </a>
          <form action={leaveBadulake}>
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="id" value={b.id} />
            <button
              type="submit"
              className="boton-2"
            >
              {fallos.botonesConfusos ? "Aceptar" : t("leave")}
            </button>
          </form>
        </>
      )}
      {!isOrganizer && position !== null && !cancelled && (
        <>
          <p role="status" className="aviso">{t("waitingPosition", { position })}</p>
          <p className="ayuda">{t("waitlistExplain")}</p>
          <form action={leaveWaitlist}>
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="id" value={b.id} />
            <button type="submit" className="boton-2">{t("leaveWaitlist")}</button>
          </form>
        </>
      )}
      {!isOrganizer && !joined && position === null && b.estado === "publicado" && upcoming && (
        free > 0 ? (
          <>
            <p className="ayuda">{t("addressAfterJoin")}</p>
            {fallos.botonesConfusos ? (
              <ApuntarseConfuso id={b.id} locale={locale} paso={typeof paso === "string" ? paso : undefined} />
            ) : (
              <form action={joinBadulake}>
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="id" value={b.id} />
                <button type="submit" className={button}>{t("join")}</button>
              </form>
            )}
          </>
        ) : (
          <>
            <p className="aviso">{t("full")}</p>
            <p className="ayuda">{t("waitlistExplain")}</p>
            <form action={joinBadulake}>
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="id" value={b.id} />
              <button type="submit" className={button}>{t("joinWaitlist")}</button>
            </form>
          </>
        )
      )}
      {!isOrganizer && (
        <details className="tarjeta">
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
              <label htmlFor="note" className="etiqueta">{tr("noteLabel")}</label>
              <textarea
                id="note" name="note" rows={3} maxLength={300} aria-describedby="note-hint"
                className="campo"
              />
              <p id="note-hint" className="ayuda">{tr("noteHint")}</p>
            </div>
            <button
              type="submit"
              className="boton-2 sm:self-start"
            >
              {tr("send")}
            </button>
          </form>
        </details>
      )}
    </>
  );
}
