"use server";

import { createSupabase, getCurrentUser } from "@/lib/supabase/server";

import { interestOptions } from "./interes-config";

export type InterestState = { status: "idle" | "error" };

// Marca o quita el interés de la persona en una opción. Solo guarda la intención (D-030):
// no hay nada que comprar ni activar.
export async function setInterest(_prev: InterestState, formData: FormData): Promise<InterestState> {
  const option = String(formData.get("option") ?? "");
  const on = formData.get("on") === "1";
  if (!(interestOptions as readonly string[]).includes(option)) return { status: "error" };

  const user = await getCurrentUser();
  if (!user) return { status: "error" };

  const supabase = await createSupabase();
  const { error } = on
    ? await supabase.from("interes").upsert(
        { persona: user.id, opcion: option },
        { onConflict: "persona,opcion", ignoreDuplicates: true },
      )
    : await supabase.from("interes").delete().eq("persona", user.id).eq("opcion", option);
  return error ? { status: "error" } : { status: "idle" };
}
