"use server";

import { languages, type Locale } from "@/i18n/languages";
import { saveWaitlistEntry } from "@/lib/waitlist";
import { tooManyAttempts } from "@/lib/rate-limit";

export type WaitlistState = {
  status: "idle" | "success" | "error";
  errors?: Partial<Record<"email" | "zone" | "consent" | "generic" | "tooMany", true>>;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// La validación se hace siempre aquí, en el servidor, aunque el navegador también valide.
export async function joinWaitlist(
  _prev: WaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const zone = String(formData.get("zone") ?? "").trim();
  const requested = String(formData.get("language") ?? "");
  const language: Locale = Object.hasOwn(languages, requested) ? (requested as Locale) : "es";
  const consent = formData.get("consent") === "on";

  const errors: WaitlistState["errors"] = {};
  if (!EMAIL.test(email) || email.length > 254) errors.email = true;
  if (zone.length < 2 || zone.length > 80) errors.zone = true;
  if (!consent) errors.consent = true;
  if (Object.keys(errors).length > 0) return { status: "error", errors };

  // Límite de intentos (D-023): 5 altas por hora desde la misma conexión.
  if (await tooManyAttempts("lista", 5, 60)) return { status: "error", errors: { tooMany: true } };

  try {
    await saveWaitlistEntry({
      email,
      zone,
      language,
      consentAt: new Date().toISOString(),
    });
    return { status: "success" };
  } catch (error) {
    console.error("[waitlist]", error);
    return { status: "error", errors: { generic: true } };
  }
}
