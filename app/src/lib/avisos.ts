import "server-only";
import { copiaDePruebas } from "@/lib/pruebas";

// Avisos en el móvil (Tarea 16.1, D-050). SOLO en la copia de pruebas hasta que lo vea la Asesoría:
// hace falta AVISOS_PUSH=1, las claves VAPID (solo en Vercel de la copia y en app/.env.pruebas) y
// ser la copia (pruebas.ts). En la web real no se enciende aunque alguien ponga las variables.
export const avisosActivos =
  copiaDePruebas &&
  process.env.AVISOS_PUSH === "1" &&
  Boolean(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);

// La clave pública se puede enseñar (el navegador la necesita); la privada nunca sale del servidor.
export const vapidPublicKey = avisosActivos ? process.env.VAPID_PUBLIC_KEY! : null;
