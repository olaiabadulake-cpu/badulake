"use server";

import { createSupabase, getCurrentUser } from "@/lib/supabase/server";
import { avisosActivos } from "@/lib/avisos";
import { tooManyAttempts } from "@/lib/rate-limit";

type Sub = { endpoint: string; keys: { p256dh: string; auth: string } };

// Guardar o quitar la suscripción de este móvil (Tarea 16.1, D-050). RLS: solo las mías.
export async function savePush(sub: Sub): Promise<boolean> {
  if (!avisosActivos || (await tooManyAttempts("avisos", 10, 10))) return false;
  if (!(await getCurrentUser())) return false;
  if (!/^https:\/\//.test(sub?.endpoint ?? "") || !sub.keys?.p256dh || !sub.keys?.auth) return false;
  const supabase = await createSupabase();
  await supabase.from("push_suscripciones").delete().eq("endpoint", sub.endpoint);
  const { error } = await supabase
    .from("push_suscripciones")
    .insert({ endpoint: sub.endpoint, p256dh: sub.keys.p256dh, auth: sub.keys.auth });
  if (error) console.error("[avisos] guardar", error.code, error.message);
  return !error;
}

export async function removePush(endpoint: string): Promise<boolean> {
  if (!avisosActivos) return false;
  if (!(await getCurrentUser())) return false;
  const supabase = await createSupabase();
  const { error } = await supabase.from("push_suscripciones").delete().eq("endpoint", endpoint);
  return !error;
}
