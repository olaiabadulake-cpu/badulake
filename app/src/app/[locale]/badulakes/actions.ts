"use server";

import { redirect } from "@/i18n/navigation";
import { languages, type Locale } from "@/i18n/languages";
import { accountsOpen, createSupabase } from "@/lib/supabase/server";
import { tooManyAttempts } from "@/lib/rate-limit";
import { reportReasons } from "@/lib/report";

export type NewBadulakeState = {
  status: "idle" | "error";
  errors?: Partial<
    Record<"neighborhood" | "city" | "province" | "description" | "date" | "address" | "seats" | "notYet" | "generic", true>
  >;
  // Lo que se había escrito, para no perderlo si hay un error.
  values?: Record<string, string>;
};

const DATETIME = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;

function readLocale(formData: FormData): Locale {
  const requested = String(formData.get("locale") ?? "");
  return Object.hasOwn(languages, requested) ? (requested as Locale) : "es";
}

const text = (formData: FormData, name: string) => String(formData.get(name) ?? "").trim();

// Crear un badulake: publicado de una vez o guardado como borrador. Todo se comprueba aquí, en el servidor, y la base de
// datos lo vuelve a comprobar (supabase/badulakes.sql).
export async function createBadulake(
  _prev: NewBadulakeState,
  formData: FormData,
): Promise<NewBadulakeState> {
  if (!accountsOpen) return { status: "error", errors: { generic: true } };

  const locale = readLocale(formData);
  const values = Object.fromEntries(
    ["neighborhood", "city", "province", "description", "date", "address", "seats"].map((k) => [k, text(formData, k)]),
  );
  const { neighborhood, city, province, description, date, address } = values;
  const seats = Number(values.seats);

  const errors: NonNullable<NewBadulakeState["errors"]> = {};
  // El título lo forma la base de datos con el lugar (Tarea 5.1, D-037): barrio, ciudad y provincia.
  if (neighborhood.length < 2 || neighborhood.length > 40) errors.neighborhood = true;
  if (city.length < 2 || city.length > 40) errors.city = true;
  if (province.length < 2 || province.length > 30) errors.province = true;
  if (description.length < 1 || description.length > 500) errors.description = true;
  if (address.length < 3 || address.length > 200) errors.address = true;
  if (!Number.isInteger(seats) || seats < 5 || seats > 10) errors.seats = true;
  const match = DATETIME.exec(date);
  const asUtc = match ? Date.UTC(+match[1], +match[2] - 1, +match[3], +match[4], +match[5]) : NaN;
  // La hora es de Madrid; esto es una comprobación aproximada, la exacta la hace la base de datos.
  // Al menos 48 horas de margen para juntar a 5 personas (Tarea 20, D-032).
  if (Number.isNaN(asUtc) || asUtc < Date.now() + 46 * 3600_000) errors.date = true;
  if (Object.keys(errors).length > 0) return { status: "error", errors, values };

  const supabase = await createSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect({ href: "/entrar?aviso=cuenta", locale });

  const { data, error } = await supabase.rpc("crear_badulake", {
    p_barrio: neighborhood,
    p_ciudad: city,
    p_provincia: province,
    p_descripcion: description,
    p_fecha_hora: date,
    p_direccion: address,
    p_plazas: seats,
  });
  if (error || !data) {
    console.error("[nuevo badulake]", error?.code, error?.message);
    if (/aun_no_puedes_organizar/.test(error?.message ?? "")) {
      return { status: "error", errors: { notYet: true }, values };
    }
    if (error?.code === "23514" && /fecha/.test(error.message)) {
      return { status: "error", errors: { date: true }, values };
    }
    return { status: "error", errors: { generic: true }, values };
  }

  // Botón principal «Publicar»: se publica de una vez (antes eran dos pasos). La base de datos
  // crea siempre en borrador; aquí se publica justo después. Si eso falla, queda en borrador con
  // su botón «Publicar» a la vista y se dice por qué (Tarea 5.3).
  let aviso = "";
  if (formData.get("intent") === "publish") aviso = await publishOrWhy(supabase, data);
  redirect({ href: `/badulakes/${data}${aviso}`, locale });
  return { status: "idle" };
}

// Pasar un borrador a publicado. La base de datos solo lo permite a su organizadora.
export async function publishBadulake(formData: FormData): Promise<void> {
  const locale = readLocale(formData);
  const id = text(formData, "id");
  let aviso = "";
  if (accountsOpen && /^[0-9a-f-]{36}$/.test(id)) {
    aviso = await publishOrWhy(await createSupabase(), id);
  }
  redirect({ href: `/badulakes/${id}${aviso}`, locale });
}

// Publica un borrador y devuelve el aviso que hay que enseñar ("" si ha ido bien).
async function publishOrWhy(supabase: Awaited<ReturnType<typeof createSupabase>>, id: string): Promise<string> {
  // Si falta menos de 48 horas (D-032) o aún no puede organizar (D-038), la base de datos no lo
  // publica: responde con un error de permiso (42501) o sin cambiar nada. Cualquier otro fallo
  // (conexión, etc.) se avisa aparte.
  const { data, error } = await supabase.from("badulakes").update({ estado: "publicado" }).eq("id", id).select("id");
  if (error && error.code !== "42501") {
    console.error("[publicar]", error.code, error.message);
    return "?aviso=no_publicado";
  }
  if (!error && data?.length) return "";
  // Si falta por haber ido antes (Tarea 5.2), se dice; si no, es el margen de 48 horas.
  const { data: puedo } = await supabase.rpc("puedo_organizar");
  return puedo === false ? "?aviso=aun_no_puedes" : "?aviso=no_publicable";
}

// Apuntarme: la base de datos comprueba plazas, fecha y que no seas la organizadora. Si no quedan
// plazas, te pone en la lista de espera ('en_espera').
export async function joinBadulake(formData: FormData): Promise<void> {
  const locale = readLocale(formData);
  const id = text(formData, "id");
  let aviso = "";
  // Límite de intentos (D-023): 30 cada 10 minutos desde la misma conexión.
  if (accountsOpen && (await tooManyAttempts("apuntarme", 30, 10))) aviso = "?aviso=error";
  else if (accountsOpen && /^[0-9a-f-]{36}$/.test(id)) {
    const supabase = await createSupabase();
    const { data, error } = await supabase.rpc("apuntarme", { p_badulake: id });
    if (error) console.error("[apuntarme]", error.code, error.message);
    aviso = `?aviso=${error || data === "suspendida" ? "error" : data === "ok" ? "apuntada" : data}`;
  }
  redirect({ href: `/badulakes/${id}${aviso}`, locale });
}

// Salir de la lista de espera (Tarea 20): RLS solo deja borrar mis propias filas.
export async function leaveWaitlist(formData: FormData): Promise<void> {
  const locale = readLocale(formData);
  const id = text(formData, "id");
  let aviso = "";
  if (accountsOpen && /^[0-9a-f-]{36}$/.test(id)) {
    const supabase = await createSupabase();
    const { error } = await supabase.from("espera").delete().eq("badulake_id", id);
    if (error) console.error("[salir de la espera]", error.code, error.message);
    aviso = `?aviso=${error ? "error" : "espera_salida"}`;
  }
  redirect({ href: `/badulakes/${id}${aviso}`, locale });
}

// Cancelar mi badulake (Tarea 20): la base de datos comprueba que soy la organizadora y que no ha
// empezado, y borra la dirección exacta.
export async function cancelBadulake(formData: FormData): Promise<void> {
  const locale = readLocale(formData);
  const id = text(formData, "id");
  let aviso = "";
  if (accountsOpen && /^[0-9a-f-]{36}$/.test(id)) {
    const supabase = await createSupabase();
    const { data, error } = await supabase.rpc("cancelar_mi_badulake", { p_badulake: id });
    if (error) console.error("[cancelar]", error.code, error.message);
    aviso = `?aviso=${error ? "error" : data === "ok" ? "cancelado" : "no_disponible"}`;
  }
  redirect({ href: `/badulakes/${id}${aviso}`, locale });
}

// Borrarme: RLS solo deja borrar mis propias inscripciones. Si hay lista de espera, la base de
// datos hace entrar a la primera en la misma operación (supabase/cupo.sql).
export async function leaveBadulake(formData: FormData): Promise<void> {
  const locale = readLocale(formData);
  const id = text(formData, "id");
  if (accountsOpen && /^[0-9a-f-]{36}$/.test(id)) {
    const supabase = await createSupabase();
    const { error } = await supabase.from("inscripciones").delete().eq("badulake_id", id);
    if (error) console.error("[borrarme]", error.code, error.message);
    redirect({ href: `/badulakes/${id}?aviso=${error ? "error" : "borrada"}`, locale });
  }
  redirect({ href: `/badulakes/${id}`, locale });
}

// Denunciar un badulake (Tarea 13, D-026). La base de datos deja crear solo denuncias propias, de
// badulakes que la persona puede ver, y nadie puede leerlas desde la web (supabase/denuncias.sql).
export async function reportBadulake(formData: FormData): Promise<void> {
  const locale = readLocale(formData);
  const id = text(formData, "id");
  const reason = text(formData, "reason");
  const note = text(formData, "note");
  let aviso = "denuncia_error";
  if (
    accountsOpen && /^[0-9a-f-]{36}$/.test(id) &&
    (reportReasons as readonly string[]).includes(reason) && note.length <= 300
  ) {
    // Límite de intentos (D-023): 5 denuncias por hora desde la misma conexión.
    if (!(await tooManyAttempts("denunciar", 5, 60))) {
      const supabase = await createSupabase();
      const { error } = await supabase
        .from("denuncias")
        .insert({ badulake_id: id, motivo: reason, texto: note || null });
      if (!error) aviso = "denunciado";
      else if (error.code === "23505") aviso = "denuncia_repetida";
      else console.error("[denunciar]", error.code, error.message);
    }
  }
  redirect({ href: `/badulakes/${id}?aviso=${aviso}`, locale });
}

// «Quiero organizar» (Tarea 5.4, D-045): quien aún no puede organizar se lo pide al equipo. La base de
// datos guarda solo quién y cuándo; el equipo lo ve sin correo en /equipo.
export async function wantToOrganize(formData: FormData): Promise<void> {
  const locale = readLocale(formData);
  let aviso = "error";
  // Límite de intentos (D-023): 5 cada hora desde la misma conexión.
  if (accountsOpen && !(await tooManyAttempts("quiero_organizar", 5, 60))) {
    const supabase = await createSupabase();
    const { data, error } = await supabase.rpc("quiero_organizar");
    if (error) console.error("[quiero organizar]", error.code, error.message);
    else if (data === "ok" || data === "ya_pedido") aviso = "pedido";
    else if (data === "ya_puedes") aviso = "";
  }
  redirect({ href: `/badulakes/nuevo${aviso ? `?aviso=${aviso}` : ""}`, locale });
}
