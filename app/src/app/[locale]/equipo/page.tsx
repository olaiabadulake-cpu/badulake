import type { Metadata } from "next";
import { contentLang } from "@/i18n/content-lang";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { accountsOpen, createSupabase, getCurrentUser } from "@/lib/supabase/server";
import { reportReasons } from "@/lib/report";
import { teamAction } from "./actions";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Team");
  return { title: `${t("title")} · Badulake` };
}

// Panel del equipo (Tarea 13, D-026). Cerrado con CUENTAS_ABIERTAS y solo para las cuentas de la
// tabla `equipo`; para el resto de la gente la página no existe (404).
export default async function TeamPage({ searchParams }: PageProps<"/[locale]/equipo">) {
  if (!accountsOpen) notFound();
  const t = await getTranslations("Team");
  return (
    <div lang={await contentLang()} className="pagina">
      <h1 className="titulo-1">{t("title")}</h1>
      <Suspense fallback={<p>{t("loading")}</p>}>
        <Reports searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

type Report = {
  id: string; creada_en: string; motivo: string; texto: string | null; badulake_id: string;
  titulo: string; descripcion: string; zona: string; fecha_hora: string; oculto: boolean;
  suspendida: boolean; denuncias_del_badulake: number;
};

async function Reports({ searchParams }: Pick<PageProps<"/[locale]/equipo">, "searchParams">) {
  const { aviso } = await searchParams;
  const locale = await getLocale();
  const user = await getCurrentUser();
  if (!user) redirect({ href: "/entrar?aviso=cuenta", locale });
  const supabase = await createSupabase();
  const { data: isTeam } = await supabase.rpc("soy_equipo");
  if (isTeam !== true) notFound();

  const t = await getTranslations("Team");
  const tr = await getTranslations("Report");
  const { data, error } = await supabase.rpc("equipo_denuncias");
  if (error) console.error("[equipo]", error.code, error.message);
  const reports = (data ?? []) as Report[];

  const notices = ["ocultar", "mostrar", "suspender", "resolver", "error"] as const;
  const notice = notices.find((n) => n === aviso) ?? null;
  const date = new Intl.DateTimeFormat(await contentLang(), {
    dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Madrid",
  });
  const solid = "boton !text-base";
  const outline = "boton-2 !text-base";
  const danger = "boton-2 !border-error !text-base !text-error";

  const button = (r: Report, kind: string, label: string, cls: string) => (
    <form action={teamAction}>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="id" value={r.id} />
      <input type="hidden" name="kind" value={kind} />
      <button type="submit" className={cls}>{label}</button>
    </form>
  );

  return (
    <>
      <p className="ayuda">{t("intro")}</p>
      {notice && (
        <p
          role={notice === "error" ? "alert" : "status"}
          className={notice === "error" ? "aviso-error" : "aviso"}
        >
          {t(`notices.${notice}`)}
        </p>
      )}
      {reports.length === 0 ? (
        <p className="text-lg">{t("empty")}</p>
      ) : (
        <>
          <p className="etiqueta">{t("count", { count: reports.length })}</p>
          <ul className="flex flex-col gap-5">
            {reports.map((r) => {
              const reason = (reportReasons as readonly string[]).includes(r.motivo) ? r.motivo : "otro";
              return (
                <li key={r.id} className="tarjeta gap-3">
                  <h2 className="titulo-3">{r.titulo}</h2>
                  <p role="group" className="flex flex-wrap gap-2">
                    {r.oculto && <span className="etiqueta-pildora">{t("hidden")}</span>}
                    {r.suspendida && <span className="etiqueta-pildora">{t("suspended")}</span>}
                  </p>
                  <dl className="flex flex-col gap-2">
                    <div>
                      <dt className="ayuda font-medium">{t("reason")}</dt>
                      <dd>{tr(`reasons.${reason}`)}</dd>
                    </div>
                    {r.texto && (
                      <div>
                        <dt className="ayuda font-medium">{t("note")}</dt>
                        <dd className="whitespace-pre-line">{r.texto}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="ayuda font-medium">{t("reportedOn")}</dt>
                      <dd>
                        {date.format(new Date(r.creada_en))} · {t("reportsOfThis", { count: r.denuncias_del_badulake })}
                      </dd>
                    </div>
                    <div>
                      <dt className="ayuda font-medium">{t("badulake")}</dt>
                      <dd className="whitespace-pre-line">{r.descripcion}</dd>
                      <dd className="ayuda">
                        {r.zona} · {date.format(new Date(r.fecha_hora))}
                      </dd>
                    </div>
                  </dl>
                  <div className="flex flex-wrap gap-3">
                    {r.oculto ? button(r, "mostrar", t("show"), outline) : button(r, "ocultar", t("hide"), outline)}
                    {!r.suspendida && button(r, "suspender", t("suspend"), danger)}
                    {button(r, "resolver", t("resolve"), solid)}
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </>
  );
}
