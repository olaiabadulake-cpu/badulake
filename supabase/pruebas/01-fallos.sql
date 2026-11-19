-- COPIA DE PRUEBAS (Tarea 22, D-035). Ejecutar SOLO en el proyecto de Supabase «badulake-pruebas»,
-- NUNCA en el real. Se ejecuta después del esquema (juntar-esquema.sh).
-- Crea la marca «esto es la copia» (el script de datos se niega a correr sin ella) y la función
-- del fallo «todos los datos a la vista al apuntarse», que en la base de datos real no existe.

create table if not exists public.es_copia_de_pruebas (una_fila boolean primary key default true check (una_fila));
insert into public.es_copia_de_pruebas default values on conflict do nothing;
alter table public.es_copia_de_pruebas enable row level security;
revoke all on public.es_copia_de_pruebas from anon, authenticated;

-- Fallo del guion: quien está apuntada ve el correo, el idioma y la fecha de las demás personas apuntadas.
-- (El diseño correcto es que nadie vea datos de otras: ver docs/seguridad.md.) Solo con sesión y estando apuntada.
create or replace function public.pruebas_asistentes(p_badulake uuid)
returns table (correo text, idioma text, desde timestamptz)
language sql stable security definer set search_path = '' as $$
  select u.email::text, p.idioma, i.creada_en
  from public.inscripciones i
  join auth.users u on u.id = i.persona
  left join public.perfiles p on p.id = i.persona
  where i.badulake_id = p_badulake
    and auth.uid() is not null
    and exists (select 1 from public.inscripciones m where m.badulake_id = p_badulake and m.persona = auth.uid())
  order by i.creada_en;
$$;
revoke execute on function public.pruebas_asistentes(uuid) from public, anon;
grant execute on function public.pruebas_asistentes(uuid) to authenticated;
