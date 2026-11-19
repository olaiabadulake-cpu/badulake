import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Locale } from "@/i18n/languages";

export type WaitlistEntry = {
  email: string;
  zone: string;
  language: Locale;
  consentAt: string;
};

// Las claves vienen de variables de entorno (nunca del código ni NEXT_PUBLIC_*).
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_PUBLISHABLE_KEY;

// En producción (badulake.vercel.app) la lista sigue cerrada hasta que esté publicado el aviso de
// privacidad definitivo (D-018). Para abrirla: variable PRIVACY_NOTICE_READY=true en Vercel.
// En local y en las vistas previas sí se puede probar.
const isProduction = process.env.VERCEL_ENV === "production";
const privacyNoticeReady = process.env.PRIVACY_NOTICE_READY === "true";

// El formulario solo se enseña si hay base de datos conectada y, en producción, aviso de privacidad.
export const waitlistOpen = Boolean(url && key) && (!isProduction || privacyNoticeReady);

// Con la clave pública y la seguridad por filas (RLS) solo se puede INSERTAR en `lista_espera`:
// nadie puede leer la tabla desde fuera. Ver supabase/lista_espera.sql.
export async function saveWaitlistEntry(entry: WaitlistEntry): Promise<void> {
  // También se bloquea aquí, por si alguien intenta enviar el formulario aunque esté oculto.
  if (!waitlistOpen || !url || !key) throw new Error("La lista de espera está cerrada.");

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { error } = await supabase.from("lista_espera").insert({
    email: entry.email,
    zona: entry.zone,
    idioma: entry.language,
    consentimiento_en: entry.consentAt,
  });

  // 23505 = el correo ya estaba apuntado: no se duplica y no se le dice a nadie.
  if (error && error.code !== "23505") throw new Error(`${error.code}: ${error.message}`);
}
