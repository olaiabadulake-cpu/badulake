"use server";

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
