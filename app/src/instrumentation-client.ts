import * as Sentry from "@sentry/nextjs";
import { opciones } from "@/lib/sentry-opciones";

// Errores del navegador a Sentry (Tarea 8.4, D-051). Solo si existe NEXT_PUBLIC_SENTRY_DSN
// (el DSN no es secreto: solo permite mandar errores a ese proyecto).
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
if (dsn) Sentry.init(opciones(dsn));
