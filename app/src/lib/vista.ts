import "server-only";
import { cacheLife } from "next/cache";
import { createClient } from "@supabase/supabase-js";

// Vista previa pública de un badulake para compartir (Tarea 6.3, D-042). Sin sesión: solo lugar,
// fecha, si está lleno y si se canceló (función badulake_vista). Nunca la dirección ni quién va.
export type Vista = { titulo: string; fecha_hora: string; zona: string; estado: string; plazas_libres: number };

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export async function getVista(id: string): Promise<Vista | null> {
  "use cache";
  // Pocos minutos: lo justo para que una vista previa compartida mucho no pregunte cada vez.
  cacheLife("minutes");
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key || !UUID_RE.test(id)) return null;
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { data, error } = await supabase.rpc("badulake_vista", { p_id: id }).maybeSingle<Vista>();
  if (error) console.error("[vista]", error.code, error.message);
  return data ?? null;
}
