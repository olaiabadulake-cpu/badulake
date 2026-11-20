"use server";

import { getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { languages, type Locale } from "@/i18n/languages";
import { accountsOpen, createSupabase } from "@/lib/supabase/server";
import { tooManyAttempts } from "@/lib/rate-limit";

export type SignUpState = {
  status: "idle" | "check-email" | "error";
  errors?: Partial<Record<"email" | "password" | "birthdate" | "underage" | "generic" | "tooMany", true>>;
};

export type SignInState = {
  status: "idle" | "error";
  errors?: Partial<Record<"credentials" | "unconfirmed" | "generic" | "tooMany", true>>;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Dirección de la web para el enlace del correo de verificación. Es fija: no se toma de la
// petición, para que nadie pueda hacer que el enlace lleve a otra web (D-023).
function siteOrigin(): string {
  if (process.env.SITE_URL) return process.env.SITE_URL;
  if (process.env.VERCEL_ENV === "production" && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

function readLocale(formData: FormData): Locale {
  const requested = String(formData.get("locale") ?? "");
  return Object.hasOwn(languages, requested) ? (requested as Locale) : "es";
}

// Edad cumplida hoy a partir de AAAA-MM-DD. null si la fecha no es válida.
function ageFrom(value: string): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [y, m, d] = match.slice(1).map(Number);
  const birth = new Date(Date.UTC(y, m - 1, d));
  if (birth.getUTCMonth() !== m - 1 || birth.getUTCDate() !== d) return null; // p. ej. 31/02
  const now = new Date();
  if (y < 1900 || birth > now) return null;
  let age = now.getUTCFullYear() - y;
  if (now.getUTCMonth() < m - 1 || (now.getUTCMonth() === m - 1 && now.getUTCDate() < d)) age--;
  return age;
}

// Registro. Todo se comprueba aquí, en el servidor, aunque el navegador también valide.
// La fecha de nacimiento solo sirve para comprobar los 18 años: la base de datos la vuelve
// a comprobar y la borra antes de guardar la cuenta (supabase/perfiles.sql).
export async function signUp(_prev: SignUpState, formData: FormData): Promise<SignUpState> {
  if (!accountsOpen) return { status: "error", errors: { generic: true } };

  const locale = readLocale(formData);
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const birthdate = String(formData.get("birthdate") ?? "");

  const errors: SignUpState["errors"] = {};
  if (!EMAIL.test(email) || email.length > 254) errors.email = true;
  if (password.length < 8 || new TextEncoder().encode(password).length > 72) errors.password = true;
  const age = ageFrom(birthdate);
  if (age === null) errors.birthdate = true;
  else if (age < 18) errors.underage = true;
  if (Object.keys(errors).length > 0) return { status: "error", errors };

  // Límite de intentos (D-023): 5 cuentas por hora desde la misma conexión o con el mismo correo.
  if (await tooManyAttempts("registro", 5, 60, email)) {
    return { status: "error", errors: { tooMany: true } };
  }

  const origin = siteOrigin();
  const supabase = await createSupabase();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/api/cuenta/confirmar?locale=${locale}`,
      data: { fecha_nacimiento: birthdate, idioma: locale },
    },
  });

  if (error) {
    console.error("[registro]", error.code, error.message);
    if (error.code === "weak_password") return { status: "error", errors: { password: true } };
    if (error.code === "email_address_invalid") return { status: "error", errors: { email: true } };
    return { status: "error", errors: { generic: true } };
  }

  // Si la verificación por correo estuviera desactivada, ya hay sesión.
  if (data.session) redirect({ href: "/badulakes", locale });

  // Mismo mensaje aunque el correo ya tuviera cuenta: no se dice quién está registrado.
  return { status: "check-email" };
}

export async function signIn(_prev: SignInState, formData: FormData): Promise<SignInState> {
  if (!accountsOpen) return { status: "error", errors: { generic: true } };

  const locale = readLocale(formData);
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { status: "error", errors: { credentials: true } };

  // Límite de intentos (D-023): 10 cada 15 minutos desde la misma conexión o para el mismo correo,
  // para que nadie pueda probar contraseñas sin fin.
  if (await tooManyAttempts("entrar", 10, 15, email)) {
    return { status: "error", errors: { tooMany: true } };
  }

  const supabase = await createSupabase();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.code === "email_not_confirmed") return { status: "error", errors: { unconfirmed: true } };
    if (error.code === "invalid_credentials") return { status: "error", errors: { credentials: true } };
    console.error("[entrar]", error.code, error.message);
    return { status: "error", errors: { generic: true } };
  }

  // Lo primero que se quiere ver al entrar son los badulakes (docs/recorridos.md).
  redirect({ href: "/badulakes", locale });
  return { status: "idle" };
}

export async function signOut(formData: FormData): Promise<void> {
  const locale = readLocale(formData);
  if (accountsOpen) {
    const supabase = await createSupabase();
    await supabase.auth.signOut();
  }
  redirect({ href: "/?aviso=salida", locale });
}

// ---- Contraseñas y borrado de cuenta (Tarea 21, D-034) ----

export type SimpleState = {
  status: "idle" | "done" | "error";
  errors?: Partial<Record<"password" | "current" | "confirm" | "generic" | "tooMany" | "email", true>>;
};

// «He olvidado mi contraseña». Siempre responde lo mismo, exista o no el correo (no se dice
// quién está registrado). Supabase envía el correo (de momento solo al equipo: Tarea 10).
export async function requestReset(_prev: SimpleState, formData: FormData): Promise<SimpleState> {
  if (!accountsOpen) return { status: "error", errors: { generic: true } };
  const locale = readLocale(formData);
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!EMAIL.test(email) || email.length > 254) return { status: "error", errors: { email: true } };
  if (await tooManyAttempts("olvidada", 5, 60, email)) return { status: "error", errors: { tooMany: true } };

  const supabase = await createSupabase();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteOrigin()}/api/cuenta/confirmar?locale=${locale}&next=nueva-contrasena`,
  });
  if (error) console.error("[olvidada]", error.code, error.message);
  return { status: "done" };
}

// Poner una contraseña nueva (tras el enlace del correo, con la sesión de recuperación).
export async function setNewPassword(_prev: SimpleState, formData: FormData): Promise<SimpleState> {
  if (!accountsOpen) return { status: "error", errors: { generic: true } };
  const locale = readLocale(formData);
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (password.length < 8 || new TextEncoder().encode(password).length > 72) return { status: "error", errors: { password: true } };
  if (password !== confirm) return { status: "error", errors: { confirm: true } };
  if (await tooManyAttempts("nueva", 10, 15)) return { status: "error", errors: { tooMany: true } };

  const supabase = await createSupabase();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    console.error("[nueva]", error.code, error.message);
    if (error.code === "weak_password" || error.code === "same_password") return { status: "error", errors: { password: true } };
    return { status: "error", errors: { generic: true } };
  }
  redirect({ href: "/cuenta?aviso=contrasena", locale });
  return { status: "done" };
}

// Cambiar la contraseña estando dentro: pide la actual (Supabase lo exige, Tarea 8).
export async function changePassword(_prev: SimpleState, formData: FormData): Promise<SimpleState> {
  if (!accountsOpen) return { status: "error", errors: { generic: true } };
  const current = String(formData.get("current") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (!current) return { status: "error", errors: { current: true } };
  if (password.length < 8 || new TextEncoder().encode(password).length > 72) return { status: "error", errors: { password: true } };
  if (password !== confirm) return { status: "error", errors: { confirm: true } };
  if (await tooManyAttempts("cambiar", 10, 15)) return { status: "error", errors: { tooMany: true } };

  const supabase = await createSupabase();
  const { error } = await supabase.auth.updateUser({ password, current_password: current });
  if (error) {
    console.error("[cambiar]", error.code, error.message);
    if (error.code === "weak_password" || error.code === "same_password") return { status: "error", errors: { password: true } };
    if (error.code === "invalid_credentials" || error.code === "reauthentication_not_valid" || error.code === "reauthentication_needed") {
      return { status: "error", errors: { current: true } };
    }
    return { status: "error", errors: { generic: true } };
  }
  return { status: "done" };
}

// Borrar mi cuenta. Hay que escribir la palabra de confirmación de su lengua (BORRAR, EZABATU,
// DELETE…), la misma que enseña la página: sale de Account.deleteWord en messages/<lengua>.json.
// La función de la base de datos solo borra la cuenta de quien llama (supabase/borrar_cuenta.sql).
export async function deleteAccount(_prev: SimpleState, formData: FormData): Promise<SimpleState> {
  if (!accountsOpen) return { status: "error", errors: { generic: true } };
  const locale = readLocale(formData);
  const t = await getTranslations({ locale, namespace: "Account" });
  const word = t("deleteWord").toLocaleUpperCase(locale);
  if (String(formData.get("confirm") ?? "").trim().toLocaleUpperCase(locale) !== word) {
    return { status: "error", errors: { confirm: true } };
  }
  if (await tooManyAttempts("borrar", 5, 15)) return { status: "error", errors: { tooMany: true } };

  const supabase = await createSupabase();
  const { error } = await supabase.rpc("borrar_mi_cuenta");
  if (error) {
    console.error("[borrar]", error.code, error.message);
    return { status: "error", errors: { generic: true } };
  }
  await supabase.auth.signOut({ scope: "local" });
  redirect({ href: "/?aviso=borrada", locale });
  return { status: "done" };
}
