import { createClient } from "@supabase/supabase-js";

// Prueba de la "pila": pregunta la hora a la base de datos (Supabase, UE).
// Las claves vienen de variables de entorno, nunca del código.
export async function GET() {
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
