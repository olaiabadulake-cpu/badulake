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
  if (!user) redirect({ href: "/entrar", locale });

  const t = await getTranslations("Badulake");
  const supabase = await createSupabase();
  // RLS: solo salen los publicados (y mis borradores, que se filtran aquí).
  const { data: rows } = await supabase
    .from("badulakes")
    .select("id, titulo, fecha_hora, zona, plazas")
    .eq("estado", "publicado")
    .gt("fecha_hora", new Date().toISOString())
    .order("fecha_hora", { ascending: true });
  const ids = (rows ?? []).map((r) => r.id);
  const { data: counts } = ids.length
    ? await supabase.from("badulakes_ocupadas").select("badulake_id, ocupadas").in("badulake_id", ids)
    : { data: [] };
  const taken = new Map((counts ?? []).map((c) => [c.badulake_id, c.ocupadas ?? 0]));
  const fmt = new Intl.DateTimeFormat(locale, {
    dateStyle: "full", timeStyle: "short", timeZone: "Europe/Madrid",
  });

  if (!rows || rows.length === 0) return <p className="text-lg">{t("listEmpty")}</p>;

  return (
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
  );
}
