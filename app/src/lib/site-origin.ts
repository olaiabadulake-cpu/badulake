import "server-only";

// Dirección de la web para el enlace del correo de verificación. Es fija: no se toma de la
// petición, para que nadie pueda hacer que el enlace lleve a otra web (D-023).
export function siteOrigin(): string {
  if (process.env.SITE_URL) return process.env.SITE_URL;
  if (process.env.VERCEL_ENV === "production" && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
