import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";
import { getTranslations } from "next-intl/server";
import { avisosActivos } from "@/lib/avisos";
import { languages, type Locale } from "@/i18n/languages";

type Fila = {
  suscripcion: string; endpoint: string; p256dh: string; auth: string;
  tipo: "recordatorio" | "desde_espera" | "cancelado"; badulake_id: string; titulo: string | null; idioma: string;
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

// Envío de los avisos (Tarea 16.1, D-050). La llama la base de datos (pg_net) cada 2 minutos con una
// ficha de un solo uso; sin ficha válida no devuelve nada. Solo en la copia de pruebas.
export async function POST(request: Request) {
  if (!avisosActivos) return new Response(null, { status: 404 });
  const body = (await request.json().catch(() => null)) as { ficha?: string } | null;
  const ficha = body?.ficha ?? "";
  if (!UUID.test(ficha)) return new Response(null, { status: 400 });

  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    auth: { persistSession: false },
  });
  const { data, error } = await supabase.rpc("avisos_tomar", { p_ficha: ficha });
  if (error) {
    console.error("[avisos]", error.code, error.message);
    return new Response(null, { status: 502 });
  }
  const filas = (data ?? []) as Fila[];
  if (filas.length === 0) return Response.json({ enviados: 0 });

  // El «contacto» de las claves tiene que ser una dirección https (no hace falta correo).
  webpush.setVapidDetails(process.env.VAPID_SUBJECT ?? "https://badulake-pruebas.vercel.app",
    process.env.VAPID_PUBLIC_KEY!, process.env.VAPID_PRIVATE_KEY!);
  const gone: string[] = [];
  let sent = 0;
  for (const f of filas) {
    const locale: Locale = Object.hasOwn(languages, f.idioma) ? (f.idioma as Locale) : "es";
    const t = await getTranslations({ locale, namespace: "Push" });
    const title = f.titulo ?? "Badulake";
    const key = f.tipo === "recordatorio" ? "reminder" : f.tipo === "desde_espera" ? "waitlist" : "cancelled";
    const payload = JSON.stringify({
      title: t(`${key}Title`),
      body: t(`${key}Body`, { title }),
      url: `/${locale}/badulakes/${f.badulake_id}`,
    });
    try {
      await webpush.sendNotification({ endpoint: f.endpoint, keys: { p256dh: f.p256dh, auth: f.auth } }, payload, {
        TTL: 24 * 3600,
        urgency: f.tipo === "recordatorio" ? "normal" : "high",
      });
      sent++;
    } catch (e) {
      const status = (e as { statusCode?: number }).statusCode;
      if (status === 404 || status === 410) gone.push(f.suscripcion);
      else console.error("[avisos] envío", status);
    }
  }
  if (gone.length) await supabase.rpc("avisos_quitar", { p_ficha: ficha, p_ids: gone });
  return Response.json({ enviados: sent, quitados: gone.length });
}
