import type { ErrorEvent } from "@sentry/nextjs";

// Aviso automático de errores con Sentry (Tarea 8.4, D-051). APAGADO mientras no exista SENTRY_DSN
// (servidor) / NEXT_PUBLIC_SENTRY_DSN (navegador): no se manda nada a nadie.
// Privacidad: región de la UE (la elige OlaIA al crear la cuenta), sin IP, sin cookies, sin
// cabeceras, sin la parte «?…» de las direcciones, sin seguimiento de rendimiento ni grabaciones,
// y cualquier correo que aparezca en un mensaje se tapa.
const CORREO = /[^\s@<>"']+@[^\s@<>"']+\.[a-z]{2,}/gi;
const tapa = (s?: string) => (s ? s.replace(CORREO, "[correo]") : s);

export function limpiar(event: ErrorEvent): ErrorEvent | null {
  delete event.user;
  if (event.request) {
    delete event.request.cookies;
    delete event.request.headers;
    delete event.request.data;
    delete event.request.query_string;
    if (event.request.url) event.request.url = event.request.url.split("?")[0];
  }
  event.message = tapa(event.message);
  for (const ex of event.exception?.values ?? []) ex.value = tapa(ex.value);
  event.breadcrumbs = [];
  return event;
}

export function opciones(dsn: string) {
  return {
    dsn,
    environment: process.env.PRUEBAS_COPIA === "1" || process.env.NEXT_PUBLIC_PRUEBAS_COPIA === "1" ? "copia" : "real",
    sendDefaultPii: false,
    tracesSampleRate: 0,
    maxBreadcrumbs: 0,
    beforeSend: limpiar,
  };
}
