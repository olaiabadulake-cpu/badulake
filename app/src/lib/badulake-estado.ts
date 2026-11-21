// Estado «terminado» (Tarea 6.1): no se guarda, se calcula, igual que «confirmado» (D-032).
// Un badulake publicado está terminado 2 horas después de empezar (lo que dura en el calendario).
export const DURATION_MS = 2 * 3600_000;

export function isFinished(fechaHora: string, now: Date): boolean {
  return new Date(fechaHora).getTime() + DURATION_MS <= now.getTime();
}
