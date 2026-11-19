import { getTranslations } from "next-intl/server";
import { createSupabase, getCurrentUser } from "@/lib/supabase/server";
import { interestOptions, type InterestOption } from "./interes-config";
import { InterestRow } from "./interest-row";

// Sección «Ideas que estamos valorando» (Tarea 17, D-030). Lee desde la base de datos lo que ya está marcado.
export async function Interest() {
  const t = await getTranslations("Account");
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = await createSupabase();
  const { data } = await supabase.from("interes").select("opcion").eq("persona", user.id);
  const marked = new Set((data ?? []).map((r) => r.opcion as InterestOption));
  return (
    <section aria-labelledby="interes-titulo" className="tarjeta gap-4 mt-4">
      <h2 id="interes-titulo" className="titulo-2">{t("interestTitle")}</h2>
      <p className="ayuda">{t("interestIntro")}</p>
      {interestOptions.map((option) => (
        <InterestRow key={option} option={option} initialOn={marked.has(option)} />
      ))}
    </section>
  );
}
