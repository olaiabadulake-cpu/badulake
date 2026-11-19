"use server";

import { accountsOpen, createSupabase } from "@/lib/supabase/server";
import { ITEM_TYPES, MAX_ITEMS, UUID, type DiaPanel } from "@/lib/dia";

// Todo el día del badulake pasa por funciones de la base de datos (supabase/dia.sql): ellas
// comprueban que quien llama es la organizadora y que es el día del evento (D-036).
export type DiaResult = { code: string; panel?: DiaPanel };

async function panelOf(supabase: Awaited<ReturnType<typeof createSupabase>>, id: string): Promise<DiaResult> {
  const { data, error } = await supabase.rpc("dia_panel", { p_badulake: id });
  if (error || !data) return { code: "error" };
  const d = data as DiaPanel & { error?: string };
  if (d.error) return { code: d.error };
  return { code: "ok", panel: d };
}

export async function diaCargar(id: string): Promise<DiaResult> {
  if (!accountsOpen || !UUID.test(id)) return { code: "error" };
  return panelOf(await createSupabase(), id);
}

type Fn = "dia_sortear_orden" | "dia_empezar_elegir" | "dia_siguiente";

async function simple(fn: Fn, id: string): Promise<DiaResult> {
  if (!accountsOpen || !UUID.test(id)) return { code: "error" };
  const supabase = await createSupabase();
  const { data, error } = await supabase.rpc(fn, { p_badulake: id });
  if (error) {
    console.error("[dia]", fn, error.code, error.message);
    return { code: "error" };
  }
  const panel = await panelOf(supabase, id);
  // «ya_sorteado» y «ya_empezado» no son fallos: el sorteo ya estaba hecho y no se repite.
  return { ...panel, code: panel.code === "ok" ? String(data) : panel.code };
}

export async function diaSortear(id: string): Promise<DiaResult> {
  return simple("dia_sortear_orden", id);
}
export async function diaEmpezar(id: string): Promise<DiaResult> {
  return simple("dia_empezar_elegir", id);
}
export async function diaSiguiente(id: string): Promise<DiaResult> {
  return simple("dia_siguiente", id);
}

// Se mandan los valores completos, no «+1»: si la señal falla y se reenvía, no se cuenta dos veces.
export async function diaFijar(
  fila: string,
  counts: Record<(typeof ITEM_TYPES)[number], number>,
): Promise<string> {
  if (!accountsOpen || !UUID.test(fila)) return "error";
  const v = ITEM_TYPES.map((k) => counts[k]);
  if (!v.every((n) => Number.isInteger(n) && n >= 0 && n <= MAX_ITEMS)) return "invalido";
  const supabase = await createSupabase();
  const { data, error } = await supabase.rpc("dia_fijar", {
    p_fila: fila, p_ropa: v[0], p_calzado: v[1], p_accesorios: v[2], p_otros: v[3],
  });
  if (error) return "error";
  return String(data);
}

export async function diaEtiqueta(fila: string, texto: string): Promise<string> {
  if (!accountsOpen || !UUID.test(fila)) return "error";
  const supabase = await createSupabase();
  const { data, error } = await supabase.rpc("dia_etiqueta", { p_fila: fila, p_texto: texto.slice(0, 40) });
  if (error) return "error";
  return String(data);
}

export async function diaPresente(id: string, fila: string, presente: boolean): Promise<DiaResult> {
  if (!accountsOpen || !UUID.test(fila) || !UUID.test(id)) return { code: "error" };
  const supabase = await createSupabase();
  const { data, error } = await supabase.rpc("dia_presente", { p_fila: fila, p_presente: presente });
  if (error) return { code: "error" };
  const panel = await panelOf(supabase, id);
  return { ...panel, code: panel.code === "ok" ? String(data) : panel.code };
}
