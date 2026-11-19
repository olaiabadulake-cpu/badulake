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
    <div lang={await contentLang()} className="mx-auto flex max-w-2xl flex-col gap-6 px-4 pt-6 pb-12 sm:px-8">
      <h1 className="font-display text-3xl font-bold">{t("title")}</h1>
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
  const solid = "rounded-full bg-noche px-5 py-2.5 font-semibold text-white hover:bg-noche/90";
  const outline = "rounded-full border-2 border-noche px-5 py-2 font-semibold hover:bg-noche/5";
  const danger = "rounded-full border-2 border-error px-5 py-2 font-semibold text-error hover:bg-error/5";

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
      <p className="text-noche/70">{t("intro")}</p>
      {notice && (
        <p
          role={notice === "error" ? "alert" : "status"}
          className={`rounded-lg p-4 font-medium ${notice === "error" ? "border-2 border-error bg-white text-error" : "bg-amarillo"}`}
        >
          {t(`notices.${notice}`)}
        </p>
      )}
      {reports.length === 0 ? (
        <p className="text-lg">{t("empty")}</p>
      ) : (
        <>
          <p className="font-medium">{t("count", { count: reports.length })}</p>
          <ul className="flex flex-col gap-5">
            {reports.map((r) => {
              const reason = (reportReasons as readonly string[]).includes(r.motivo) ? r.motivo : "otro";
              return (
                <li key={r.id} className="flex flex-col gap-3 rounded-xl border-2 border-noche/30 p-4">
                  <h2 className="font-display text-xl font-bold">{r.titulo}</h2>
                  <p role="group" className="flex flex-wrap gap-2 text-sm font-medium">
                    {r.oculto && <span className="rounded-full bg-amarillo px-3 py-1">{t("hidden")}</span>}
                    {r.suspendida && <span className="rounded-full bg-amarillo px-3 py-1">{t("suspended")}</span>}
                  </p>
                  <dl className="flex flex-col gap-2">
                    <div>
                      <dt className="text-sm font-medium text-noche/70">{t("reason")}</dt>
                      <dd>{tr(`reasons.${reason}`)}</dd>
                    </div>
                    {r.texto && (
                      <div>
                        <dt className="text-sm font-medium text-noche/70">{t("note")}</dt>
                        <dd className="whitespace-pre-line">{r.texto}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-sm font-medium text-noche/70">{t("reportedOn")}</dt>
                      <dd>
                        {date.format(new Date(r.creada_en))} · {t("reportsOfThis", { count: r.denuncias_del_badulake })}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-noche/70">{t("badulake")}</dt>
                      <dd className="whitespace-pre-line">{r.descripcion}</dd>
                      <dd className="text-noche/70">
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
