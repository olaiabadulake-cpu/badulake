import "server-only";
import { cacheLife } from "next/cache";
import { createClient } from "@supabase/supabase-js";

// Contador de impacto de la portada (Tarea 15.1, D-047): solo dos números, sin datos de nadie.
// Se guarda en caché una hora: la portada sigue igual de rápida.
export async function getImpacto(): Promise<{ objetos: number; badulakes: number } | null> {
  "use cache";
  cacheLife("hours");
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { data, error } = await supabase.rpc("impacto_total").maybeSingle<{ objetos: number; badulakes: number }>();
  if (error || !data) return null;
  return { objetos: Number(data.objetos), badulakes: Number(data.badulakes) };
}
