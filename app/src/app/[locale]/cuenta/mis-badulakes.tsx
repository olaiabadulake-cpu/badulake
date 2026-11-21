import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { contentLang } from "@/i18n/content-lang";
import { createSupabase, idsOf } from "@/lib/supabase/server";
import { isFinished } from "@/lib/badulake-estado";

type B = { id: string; titulo: string; fecha_hora: string; estado: string };
type Role = "mine" | "joined" | "waiting";
type Row = B & { role: Role; position?: number };

// «Mis badulakes» (Tarea 6.1): los que organizo, a los que me he apuntado y en los que espero,
// separados en próximos y pasados. RLS: solo se leen mis inscripciones, mis esperas y mis badulakes.
// Los pasados duran lo que dura el badulake en la base de datos (30 días, D-024).
export async function MisBadulakes() {
  const supabase = await createSupabase();
  const cols = "id, titulo, fecha_hora, estado";
  const [{ data: mine }, { data: waits }, { data: ownIds }] = await Promise.all([
    supabase.from("inscripciones").select(`badulakes(${cols})`),
    supabase.from("espera").select(`badulakes(${cols})`),
    supabase.rpc("mis_badulakes"),
  ]);
  const own = idsOf(ownIds);
  const { data: owned } = own.length
    ? await supabase.from("badulakes").select(cols).in("id", own)
    : { data: [] as B[] };
  const one = (x: unknown) => (Array.isArray(x) ? x[0] : x) as B | null;

  const rows = new Map<string, Row>();
  for (const b of (owned ?? []) as B[]) rows.set(b.id, { ...b, role: "mine" });
  for (const m of mine ?? []) {
    const b = one(m.badulakes);
    if (b && !rows.has(b.id)) rows.set(b.id, { ...b, role: "joined" });
  }
  const waiting: B[] = [];
  for (const w of waits ?? []) {
    const b = one(w.badulakes);
    if (b && !rows.has(b.id)) {
      rows.set(b.id, { ...b, role: "waiting" });
      waiting.push(b);
    }
  }
  if (waiting.length) {
    const { data: positions } = await supabase.rpc("mi_espera", { p_ids: waiting.map((b) => b.id) });
    for (const p of (positions ?? []) as { badulake_id: string; puesto: number }[]) {
      const r = rows.get(p.badulake_id);
      if (r) r.position = p.puesto;
    }
  }

  const now = new Date();
  const all = [...rows.values()];
  const upcoming = all
    .filter((r) => new Date(r.fecha_hora) > now)
    .sort((a, b) => a.fecha_hora.localeCompare(b.fecha_hora));
  // En los pasados no tiene sentido la lista de espera (se borra al empezar).
  const past = all
    .filter((r) => new Date(r.fecha_hora) <= now && r.role !== "waiting")
    .sort((a, b) => b.fecha_hora.localeCompare(a.fecha_hora));

  const t = await getTranslations("Account");
  const tb = await getTranslations("Badulake");
  const fmt = new Intl.DateTimeFormat(await contentLang(), {
    dateStyle: "full", timeStyle: "short", timeZone: "Europe/Madrid",
  });

  const list = (items: Row[]) => (
    <ul className="flex flex-col gap-3">
      {items.map((r) => (
        <li key={r.id}>
          <Link href={`/badulakes/${r.id}`} className="tarjeta">
            <span className="titulo-3">{r.titulo}</span>
            <span className="flex flex-wrap gap-2">
              {r.estado === "cancelado" ? (
                <span className="etiqueta-pildora contorno">{tb("cancelledTag")}</span>
              ) : isFinished(r.fecha_hora, now) && r.estado === "publicado" ? (
                <span className="etiqueta-pildora contorno">{tb("finishedTag")}</span>
              ) : null}
              {r.role === "mine" && <span className="etiqueta-pildora">{tb("mine")}</span>}
              {r.role === "mine" && r.estado === "borrador" && (
                <span className="etiqueta-pildora contorno">{tb("draft")}</span>
              )}
              {r.role === "joined" && r.estado !== "cancelado" && (
                <span className="etiqueta-pildora">{tb("joinedTag")}</span>
              )}
              {r.role === "waiting" && r.position && r.estado !== "cancelado" && (
                <span className="etiqueta-pildora contorno">{tb("waitingTag", { position: r.position })}</span>
              )}
            </span>
            <span>{fmt.format(new Date(r.fecha_hora))}</span>
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-labelledby="mis-badulakes" className="flex flex-col gap-4">
      <h2 id="mis-badulakes" className="titulo-2">{t("myTitle")}</h2>
      {all.length === 0 || (upcoming.length === 0 && past.length === 0) ? (
        <>
          <p>{t("myEmpty")}</p>
          <Link href="/badulakes" className="boton sm:self-start">{t("myBrowse")}</Link>
        </>
      ) : (
        <>
          <h3 className="titulo-3">{t("myUpcoming")}</h3>
          {upcoming.length ? list(upcoming) : <p className="ayuda">{t("myNoUpcoming")}</p>}
          {past.length > 0 && (
            <>
              <h3 className="titulo-3">{t("myPast")}</h3>
              {list(past)}
            </>
          )}
        </>
      )}
    </section>
  );
}
