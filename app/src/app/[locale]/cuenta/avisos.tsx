import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createSupabase, idsOf } from "@/lib/supabase/server";
import { isFinished } from "@/lib/badulake-estado";

type B = { id: string; titulo: string; fecha_hora: string; estado: string; cancelado_por: string | null };
type Notice = { id: string; title: string; kind: "fromWaitlist" | "cancelled" | "waiting" | "canOrganize"; position?: number };

// Avisos dentro de la app (Tarea 20, D-032): has entrado desde la lista de espera, estás en la
// lista, o un badulake tuyo se ha cancelado. Los correos con estos avisos son de la Tarea 10.
export async function Avisos() {
  const supabase = await createSupabase();
  const cols = "id, titulo, fecha_hora, estado, cancelado_por";
  // RLS: solo mis inscripciones y mis filas de la lista de espera.
  const [{ data: mine }, { data: waits }, { data: ownIds }] = await Promise.all([
    supabase.from("inscripciones").select(`desde_espera, badulakes(${cols})`),
    supabase.from("espera").select(`badulakes(${cols})`),
    supabase.rpc("mis_badulakes"),
  ]);
  const own = idsOf(ownIds);
  const { data: owned } = own.length
    ? await supabase.from("badulakes").select(cols).in("id", own).eq("estado", "cancelado")
    : { data: [] as B[] };

  const now = new Date().getTime();
  const future = (b: B) => new Date(b.fecha_hora).getTime() > now;
  // Un cancelado se avisa hasta una semana después de la fecha que tenía.
  const recent = (b: B) => new Date(b.fecha_hora).getTime() > now - 7 * 86400_000;
  const one = (x: unknown) => (Array.isArray(x) ? x[0] : x) as B | null;

  const waitingIds = (waits ?? []).map((w) => one(w.badulakes)).filter((b): b is B => !!b && future(b) && b.estado === "publicado");
  const { data: positions } = waitingIds.length
    ? await supabase.rpc("mi_espera", { p_ids: waitingIds.map((b) => b.id) })
    : { data: [] };
  const pos = new Map(((positions ?? []) as { badulake_id: string; puesto: number }[]).map((p) => [p.badulake_id, p.puesto]));

  const notices: Notice[] = [];
  for (const m of mine ?? []) {
    const b = one(m.badulakes);
    if (!b) continue;
    if (b.estado === "cancelado" && recent(b)) notices.push({ id: b.id, title: b.titulo, kind: "cancelled" });
    else if (m.desde_espera && b.estado === "publicado" && future(b))
      notices.push({ id: b.id, title: b.titulo, kind: "fromWaitlist" });
  }
  for (const w of waits ?? []) {
    const b = one(w.badulakes);
    if (b?.estado === "cancelado" && recent(b)) notices.push({ id: b.id, title: b.titulo, kind: "cancelled" });
  }
  for (const b of waitingIds) {
    const position = pos.get(b.id);
    if (position) notices.push({ id: b.id, title: b.titulo, kind: "waiting", position });
  }
  for (const b of (owned ?? []) as B[]) {
    if (b.cancelado_por === "automatica" && recent(b)) notices.push({ id: b.id, title: b.titulo, kind: "cancelled" });
  }
  // Ya has ido a un badulake y aún no has organizado ninguno: ya puedes (Tarea 6.1, D-038).
  const attended = (mine ?? []).some((m) => {
    const b = one(m.badulakes);
    return !!b && b.estado === "publicado" && isFinished(b.fecha_hora, new Date(now));
  });
  if (attended && own.length === 0) {
    const { data: puedo } = await supabase.rpc("puedo_organizar");
    if (puedo === true) notices.unshift({ id: "nuevo", title: "", kind: "canOrganize" });
  }
  if (notices.length === 0) return null;

  const t = await getTranslations("Account");
  return (
    <section aria-labelledby="avisos" className="flex flex-col gap-3">
      <h2 id="avisos" className="titulo-2">{t("noticesTitle")}</h2>
      <ul className="flex flex-col gap-3">
        {notices.map((n) => (
          <li key={`${n.kind}-${n.id}`}>
            {n.kind === "canOrganize" ? (
              <Link href="/badulakes/nuevo" className="aviso block">{t("noticeCanOrganize")}</Link>
            ) : (
            <Link href={`/badulakes/${n.id}`} className={n.kind === "cancelled" ? "aviso-error block" : "aviso block"}>
              <span className="font-semibold">{n.title}</span>
              {": "}
              {n.kind === "waiting" ? t("noticeWaiting", { position: n.position! }) : t(n.kind === "cancelled" ? "noticeCancelled" : "noticeFromWaitlist")}
            </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
