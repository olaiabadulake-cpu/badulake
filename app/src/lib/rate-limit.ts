import "server-only";
import { headers } from "next/headers";

// Límite sencillo de intentos (Tarea 8, D-023). Cuenta los intentos de cada acción por
// dirección IP (y, si se da, por correo) durante un rato, en la memoria del servidor.
// No se guarda nada en ningún sitio: al pasar el rato, el contador se olvida.
// Es una primera barrera; Supabase Auth tiene además sus propios límites.
type Counter = { count: number; resetAt: number };
const counters = new Map<string, Counter>();

// IP de quien llama. En Vercel la pone Vercel y no se puede falsificar desde fuera.
async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
}

function hit(key: string, max: number, windowMs: number, now: number): boolean {
  const current = counters.get(key);
  if (!current || current.resetAt <= now) {
    counters.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  current.count++;
  return current.count > max;
}

// Devuelve true si se ha pasado del límite: `max` intentos cada `minutes` minutos.
export async function tooManyAttempts(
  action: string,
  max: number,
  minutes: number,
  extraKey?: string,
): Promise<boolean> {
  const now = Date.now();
  // Limpieza para que la memoria no crezca sin fin.
  if (counters.size > 5000) {
    for (const [key, c] of counters) if (c.resetAt <= now) counters.delete(key);
  }
  const windowMs = minutes * 60_000;
  const byIp = hit(`${action}:ip:${await clientIp()}`, max, windowMs, now);
  const byKey = extraKey ? hit(`${action}:key:${extraKey}`, max, windowMs, now) : false;
  return byIp || byKey;
}
