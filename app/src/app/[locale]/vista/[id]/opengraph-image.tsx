import { ImageResponse } from "next/og";
import { getVista } from "@/lib/vista";
import { accountsOpen } from "@/lib/supabase/server";

// Imagen de la vista previa al compartir (Tarea 6.3, D-042): el lugar y la fecha, con los colores
// de la marca. Nunca la dirección. Si el badulake no existe, una imagen genérica.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Badulake";

export default async function Image({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const b = accountsOpen ? await getVista(id) : null;
  const when = b
    ? new Intl.DateTimeFormat(locale.startsWith("ca") ? "ca" : locale === "oc-aranes" ? "oc" : locale, {
        dateStyle: "full", timeStyle: "short", timeZone: "Europe/Madrid",
      }).format(new Date(b.fecha_hora))
    : "";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, background: "#2f2fd1", color: "#ffffff", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignSelf: "flex-start", fontSize: 40, fontWeight: 900, letterSpacing: 1, color: "#ff3fa4", border: "6px solid #ff3fa4", borderRadius: 999, padding: "10px 34px", background: "#15135c" }}>BADULAKE</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>{b ? b.titulo : "Badulake"}</div>
          {b && <div style={{ display: "flex", fontSize: 38 }}>{when}</div>}
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#c8ff2e", fontWeight: 700 }}>5–10 · 0 €</div>
      </div>
    ),
    size,
  );
}
