-- Lista de espera de Badulake (Supabase, Frankfurt). Ejecutado el 19/11/2026.
-- Seguridad: RLS activada; desde el navegador/servidor con la clave pública solo se puede INSERTAR.
-- Nadie puede leer, cambiar ni borrar filas con esa clave (se consulta desde el panel de Supabase).
create table public.lista_espera (
  id uuid primary key default gen_random_uuid(),
  email text not null check (char_length(email) <= 254),
  zona text not null check (char_length(zona) between 2 and 80),
  idioma text not null check (char_length(idioma) <= 12),
  consentimiento_en timestamptz not null,
  creado_en timestamptz not null default now()
);
create unique index lista_espera_email_unico on public.lista_espera (lower(email));
alter table public.lista_espera enable row level security;
revoke all on public.lista_espera from anon, authenticated;
grant insert on public.lista_espera to anon;
create policy "solo_alta_anonima" on public.lista_espera for insert to anon with check (true);
