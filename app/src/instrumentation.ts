import * as Sentry from "@sentry/nextjs";
import { opciones } from "@/lib/sentry-opciones";

// Errores del servidor a Sentry (Tarea 8.4, D-051). Solo si existe SENTRY_DSN.
export async function register() {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;
  if (process.env.NEXT_RUNTIME === "nodejs" || process.env.NEXT_RUNTIME === "edge") Sentry.init(opciones(dsn));
}

export const onRequestError: typeof Sentry.captureRequestError = (...args) => {
  if (process.env.SENTRY_DSN) Sentry.captureRequestError(...args);
};
