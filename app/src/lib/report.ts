// Motivos para denunciar un badulake (Tarea 13, D-026). Los mismos que comprueba la base de datos
// (supabase/denuncias.sql). Los textos están en messages/*.json, clave Report.reasons.
export const reportReasons = ["estafa", "ofensivo", "datos", "peligroso", "spam", "otro"] as const;
export type ReportReason = (typeof reportReasons)[number];
