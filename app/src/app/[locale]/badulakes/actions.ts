"use server";

import { redirect } from "@/i18n/navigation";
import { languages, type Locale } from "@/i18n/languages";
import { accountsOpen, createSupabase } from "@/lib/supabase/server";

export type NewBadulakeState = {
  status: "idle" | "error";
  errors?: Partial<
    Record<"title" | "description" | "date" | "zone" | "address" | "seats" | "generic", true>
  >;
  // Lo que se había escrito, para no perderlo si hay un error.
  values?: Record<string, string>;
};

const DATETIME = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;

function readLocale(formData: FormData): Locale {
  const requested = String(formData.get("locale") ?? "");
  return requested in languages ? (requested as Locale) : "es";
}

const text = (formData: FormData, name: string) => String(formData.get(name) ?? "").trim();

// Crear un badulake (queda en borrador). Todo se comprueba aquí, en el servidor, y la base de
// datos lo vuelve a comprobar (supabase/badulakes.sql).
export async function createBadulake(
  _prev: NewBadulakeState,
  formData: FormData,
): Promise<NewBadulakeState> {
  if (!accountsOpen) return { status: "error", errors: { generic: true } };

  const locale = readLocale(formData);
  const values = Object.fromEntries(
    ["title", "description", "date", "zone", "address", "seats"].map((k) => [k, text(formData, k)]),
  );
  const { title, description, date, zone, address } = values;
  const seats = Number(values.seats);

  const errors: NonNullable<NewBadulakeState["errors"]> = {};
  if (title.length < 3 || title.length > 80) errors.title = true;
  if (description.length < 1 || description.length > 500) errors.description = true;
  if (zone.length < 2 || zone.length > 80) errors.zone = true;
  if (address.length < 3 || address.length > 200) errors.address = true;
  if (!Number.isInteger(seats) || seats < 5 || seats > 10) errors.seats = true;
  const match = DATETIME.exec(date);
  const asUtc = match ? Date.UTC(+match[1], +match[2] - 1, +match[3], +match[4], +match[5]) : NaN;
  // La hora es de Madrid; esto es una comprobación aproximada, la exacta la hace la base de datos.
  if (Number.isNaN(asUtc) || asUtc < Date.now() - 2 * 3600_000) errors.date = true;
  if (Object.keys(errors).length > 0) return { status: "error", errors, values };

  const supabase = await createSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect({ href: "/entrar", locale });

  const { data, error } = await supabase.rpc("crear_badulake", {
    p_titulo: title,
    p_descripcion: description,
    p_fecha_hora: date,
    p_zona: zone,
    p_direccion: address,
    p_plazas: seats,
  });
  if (error || !data) {
    console.error("[nuevo badulake]", error?.code, error?.message);
    if (error?.code === "23514" && /fecha/.test(error.message)) {
      return { status: "error", errors: { date: true }, values };
    }
    return { status: "error", errors: { generic: true }, values };
  }

  redirect({ href: `/badulakes/${data}`, locale });
  return { status: "idle" };
}

// Pasar un borrador a publicado. La base de datos solo lo permite a su organizadora.
export async function publishBadulake(formData: FormData): Promise<void> {
  const locale = readLocale(formData);
  const id = text(formData, "id");
  if (accountsOpen && /^[0-9a-f-]{36}$/.test(id)) {
    const supabase = await createSupabase();
    await supabase.from("badulakes").update({ estado: "publicado" }).eq("id", id);
  }
  redirect({ href: `/badulakes/${id}`, locale });
}
