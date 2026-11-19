import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { accountsOpen, createSupabase, getCurrentUser } from "@/lib/supabase/server";
import { publishBadulake } from "../actions";

export default async function YourBadulake({ params }: PageProps<"/[locale]/badulakes/[id]">) {
  // Cerrado en producción hasta que exista el aviso de privacidad (D-019, D-020).
  if (!accountsOpen) notFound();
  const t = await getTranslations("Badulake");

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 pt-6 pb-12 sm:px-8">
      <h1 className="font-display text-3xl font-bold">{t("yourTitle")}</h1>
      <Suspense fallback={<p>{t("loading")}</p>}>
        <Details params={params} />
      </Suspense>
    </div>
  );
}

async function Details({ params }: Pick<PageProps<"/[locale]/badulakes/[id]">, "params">) {
  const { id } = await params;
  const locale = await getLocale();
  const user = await getCurrentUser();
  if (!user) redirect({ href: "/entrar", locale });
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();

  // RLS: la dirección exacta solo la puede leer su organizadora. El listado y el detalle para
  // el resto de personas llegan en la Tarea 6.
  const supabase = await createSupabase();
  const { data: b } = await supabase
    .from("badulakes")
    .select("id, organizadora, titulo, descripcion, fecha_hora, zona, plazas, estado")
    .eq("id", id)
    .maybeSingle();
  if (!b || b.organizadora !== user!.id) notFound();
  const { data: a } = await supabase
    .from("badulakes_direccion")
    .select("direccion")
    .eq("badulake_id", id)
    .maybeSingle();

  const t = await getTranslations("Badulake");
  const when = new Intl.DateTimeFormat(locale, {
    dateStyle: "full", timeStyle: "short", timeZone: "Europe/Madrid",
  }).format(new Date(b.fecha_hora));
  const rows: [string, string][] = [
    [t("date"), when],
    [t("zone"), b.zona],
    [t("address"), a?.direccion ?? ""],
    [t("seats"), String(b.plazas)],
  ];

  return (
    <>
      <p role="status" className="rounded-lg bg-amarillo p-4 font-medium">
        {b.estado === "publicado" ? t("statusPublished") : t("statusDraft")}
      </p>
      <h2 className="font-display text-2xl font-bold">{b.titulo}</h2>
      <p className="whitespace-pre-line text-lg">{b.descripcion}</p>
      <dl className="flex flex-col gap-3">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="text-sm font-medium text-noche/70">{k}</dt>
            <dd className="text-lg">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="text-sm text-noche/70">{t("addressPrivate")}</p>
      {b.estado === "borrador" && (
        <form action={publishBadulake}>
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="id" value={b.id} />
          <button
            type="submit"
            className="rounded-full bg-noche px-6 py-3 text-lg font-semibold text-white hover:bg-noche/90"
          >
            {t("publish")}
          </button>
        </form>
      )}
    </>
  );
}
