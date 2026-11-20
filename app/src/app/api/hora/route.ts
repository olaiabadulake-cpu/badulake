import { createClient } from "@supabase/supabase-js";
import { tooManyAttempts } from "@/lib/rate-limit";
import { copiaDePruebas } from "@/lib/pruebas";

// Prueba de la "pila": pregunta la hora a la base de datos (Supabase, UE).
// Las claves vienen de variables de entorno, nunca del código.
// Tarea 8.3: en la web real está cerrada (404); en el Mac, las vistas previas y la copia de
// pruebas sigue abierta, con un límite de 10 preguntas por minuto desde la misma conexión.
export async function GET() {
  if (process.env.VERCEL_ENV === "production" && !copiaDePruebas) {
    return new Response(null, { status: 404, headers: { "Cache-Control": "no-store" } });
  }
  if (await tooManyAttempts("hora", 10, 1)) {
    return Response.json({ ok: false, error: "demasiadas peticiones" }, { status: 429, headers: { "Retry-After": "60" } });
  }
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    return Response.json({ ok: false, error: "faltan claves" }, { status: 500 });
  }

  const supabase = createClient(url, key);
  const { data, error } = await supabase.rpc("hora_actual");
  if (error) {
    return Response.json({ ok: false, error: "base de datos no disponible" }, { status: 502 });
  }
  return Response.json({ ok: true, hora: data }, { headers: { "Cache-Control": "no-store" } });
}
