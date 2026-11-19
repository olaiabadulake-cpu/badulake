import { type NextRequest, NextResponse } from "next/server";
import { accountsOpen, createSupabase } from "@/lib/supabase/server";

const escape = (s: string) =>
  s.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
const stamp = (d: Date) => d.toISOString().replace(/[-:]|\.\d{3}/g, "");

// Archivo .ics para el calendario. Solo para quien esté apuntada (si no, 404 como si no existiera).
export async function GET(_request: NextRequest, ctx: RouteContext<"/api/badulakes/[id]/calendario">) {
  const { id } = await ctx.params;
  if (!accountsOpen || !/^[0-9a-f-]{36}$/.test(id)) return new NextResponse(null, { status: 404 });

  const supabase = await createSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return new NextResponse(null, { status: 404 });

  // RLS: solo devuelve la fila si esta persona está apuntada.
  const { data: mine } = await supabase
    .from("inscripciones")
    .select("badulake_id")
    .eq("badulake_id", id)
    .maybeSingle();
  if (!mine) return new NextResponse(null, { status: 404 });

  const [{ data: b }, { data: a }] = await Promise.all([
    supabase.from("badulakes").select("titulo, descripcion, fecha_hora, zona").eq("id", id).maybeSingle(),
    supabase.from("badulakes_direccion").select("direccion").eq("badulake_id", id).maybeSingle(),
  ]);
  if (!b || !a) return new NextResponse(null, { status: 404 });

  const start = new Date(b.fecha_hora);
  const end = new Date(start.getTime() + 2 * 3600_000); // duración orientativa: 2 horas
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Badulake//ES",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${id}@badulake.vercel.app`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${escape(`Badulake: ${b.titulo}`)}`,
    `DESCRIPTION:${escape(b.descripcion)}`,
    `LOCATION:${escape(`${a.direccion} (${b.zona})`)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return new NextResponse(lines.join("\r\n") + "\r\n", {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="badulake.ics"',
      "Cache-Control": "private, no-store",
    },
  });
}
