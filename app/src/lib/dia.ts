// Día del badulake (Tarea 24): tipos compartidos entre la página, las acciones y el panel.
export const ITEM_TYPES = ["ropa", "calzado", "accesorios", "otros"] as const;
export type ItemType = (typeof ITEM_TYPES)[number];

export type DiaPersona = {
  id: string;
  num: number;
  etiqueta: string | null;
  presente: boolean;
  ropa: number;
  calzado: number;
  accesorios: number;
  otros: number;
  orden_exponer: number | null;
  orden_elegir: number | null;
};

export type DiaPanel = {
  orden_sorteado: boolean;
  elegir_empezado: boolean;
  turno: number | null;
  personas: DiaPersona[];
};

export type DiaMiTurno = {
  presente: boolean;
  orden_exponer: number | null;
  orden_elegir: number | null;
  turno: number | null;
  elegir_empezado: boolean;
};

export const MAX_ITEMS = 99;
export const UUID = /^[0-9a-f-]{36}$/;
