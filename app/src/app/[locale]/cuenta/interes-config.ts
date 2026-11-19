// Opciones de la lista de interés (Tarea 17, D-030). Hoy no existen ni cuestan nada.
export const interestOptions = ["vip", "baducoins"] as const;
export type InterestOption = (typeof interestOptions)[number];
