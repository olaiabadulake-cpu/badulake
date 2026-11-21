import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Cabeceras de seguridad (Tarea 8, D-023). Detalle en docs/seguridad.md.
// La ubicación solo la puede pedir la propia web, para «Cerca de mí» (Tarea 6.2, D-043).
const isDev = process.env.NODE_ENV !== "production";
// La barra de comentarios de Vercel solo existe en las vistas previas.
const vercelLive = process.env.VERCEL_ENV === "preview" ? " https://vercel.live" : "";

// Política de contenido: la web solo carga cosas de sí misma. Supabase se llama desde el
// servidor, nunca desde el navegador. Next.js necesita 'unsafe-inline' para sus scripts.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}${vercelLive}`,
  `style-src 'self' 'unsafe-inline'${vercelLive}`,
  `img-src 'self' data: blob:${vercelLive}`,
  `font-src 'self' data:${vercelLive}`,
  `connect-src 'self'${isDev ? " ws:" : ""}${vercelLive}`,
  `frame-src 'none'${vercelLive}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Solo por https durante dos años.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Nadie puede meter Badulake dentro de otra web (para engañar con clics).
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self), browsing-topics=()" },
];

// Copia de pruebas (Tarea 22, D-035): además de la etiqueta, la cabecera pide a los buscadores que la ignoren.
const isTestCopy =
  process.env.PRUEBAS_COPIA === "1" && Boolean(process.env.PRUEBAS_SUPABASE_REF);
if (isTestCopy) securityHeaders.push({ key: "X-Robots-Tag", value: "noindex, nofollow" });

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  // 404 propia, con la marca, para direcciones que no existen en ninguna lengua (Tarea 14).
  experimental: { globalNotFound: true },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // El service worker nunca se guarda en la caché del navegador, para que los cambios lleguen siempre (Tarea 16).
      { source: "/sw.js", headers: [{ key: "Cache-Control", value: "no-cache, max-age=0" }, { key: "Content-Type", value: "text/javascript; charset=utf-8" }] },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
