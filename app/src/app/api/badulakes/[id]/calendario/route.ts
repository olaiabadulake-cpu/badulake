import { type NextRequest, NextResponse } from "next/server";
import { accountsOpen, createSupabase, idsOf } from "@/lib/supabase/server";
import { siteOrigin } from "@/lib/site-origin";
import { languages } from "@/i18n/languages";
import { DURATION_MS } from "@/lib/badulake-estado";

const escape = (s: string) =>
  s.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
const stamp = (d: Date) => d.toISOString().replace(/[-:]|\.\d{3}/g, "");

// Las líneas de un .ics no pueden pasar de 75 bytes: se parten y la continuación empieza con un
// espacio (RFC 5545, 3.1). Se cortan por caracteres enteros, sin partir una letra con tilde.
function fold(line: string): string {
  const enc = new TextEncoder();
  const out: string[] = [];
  let cur = "";
  let size = 0;
  for (const ch of line) {
    const n = enc.encode(ch).length;
    const max = out.length === 0 ? 75 : 74; // las siguientes llevan el espacio delante
    if (size + n > max) {
      out.push(cur);
      cur = "";
      size = 0;
    }
    cur += ch;
    size += n;
  }
  out.push(cur);
  return out.join("\r\n ");
}

// Archivo .ics para el calendario (Tarea 6.4, D-044): para la organizadora, las apuntadas y quien
// está en la lista de espera; para el resto, 404 como si no existiera. No lleva la dirección
// escrita (un calendario se sincroniza y se comparte): lleva el barrio y el enlace a la ficha,
// donde la dirección solo la ve quien puede verla.
export async function GET(request: NextRequest, ctx: RouteContext<"/api/badulakes/[id]/calendario">) {
  const { id } = await ctx.params;
  if (!accountsOpen || !/^[0-9a-f-]{36}$/.test(id)) return new NextResponse(null, { status: 404 });

  const supabase = await createSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return new NextResponse(null, { status: 404 });

  // RLS: cada consulta solo devuelve filas de esta persona.
  const [{ data: mine }, { data: wait }, { data: ownIds }] = await Promise.all([
    supabase.from("inscripciones").select("badulake_id").eq("badulake_id", id).maybeSingle(),
    supabase.from("espera").select("badulake_id").eq("badulake_id", id).maybeSingle(),
    supabase.rpc("mis_badulakes"),
  ]);
  if (!mine && !wait && !idsOf(ownIds).includes(id)) return new NextResponse(null, { status: 404 });

  const { data: b } = await supabase
    .from("badulakes")
    .select("titulo, descripcion, fecha_hora, zona, estado")
    .eq("id", id)
    .maybeSingle();
  if (!b || b.estado !== "publicado") return new NextResponse(null, { status: 404 });

  const requested = request.nextUrl.searchParams.get("locale") ?? "";
  const locale = Object.hasOwn(languages, requested) ? requested : "es";
  const link = `${siteOrigin()}/${locale}/badulakes/${id}`;
  const start = new Date(b.fecha_hora);
  const end = new Date(start.getTime() + DURATION_MS); // duración orientativa: 2 horas
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Badulake//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${id}@badulake.app`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${escape(b.titulo)}`,
    `DESCRIPTION:${escape(`${b.descripcion}\n\n${link}`)}`,
    `LOCATION:${escape(b.zona)}`,
    `URL:${link}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].map(fold);
  return new NextResponse(lines.join("\r\n") + "\r\n", {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="badulake.ics"',
      "Cache-Control": "private, no-store",
    },
  });
}
