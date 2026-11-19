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

// El formulario solo se enseña si hay base de datos conectada.
export const waitlistOpen = Boolean(url && key);

// Con la clave pública y la seguridad por filas (RLS) solo se puede INSERTAR en `lista_espera`:
// nadie puede leer la tabla desde fuera. Ver supabase/lista_espera.sql.
export async function saveWaitlistEntry(entry: WaitlistEntry): Promise<void> {
  if (!url || !key) throw new Error("Supabase no está configurado.");

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
