-- Crear un badulake (Tarea 5, D-020). Ejecutado el 19/11/2026.
-- Dos tablas: la dirección exacta va aparte para que ninguna política pública pueda enseñarla.

-- 1. Datos del badulake. La zona o barrio es pública; la dirección exacta NO está aquí.
create table public.badulakes (
  id uuid primary key default gen_random_uuid(),
  organizadora uuid not null references auth.users (id) on delete cascade default auth.uid(),
  titulo text not null check (char_length(btrim(titulo)) between 3 and 80),
  descripcion text not null check (char_length(btrim(descripcion)) between 1 and 500),
  fecha_hora timestamptz not null,
  zona text not null check (char_length(btrim(zona)) between 2 and 80),
  plazas smallint not null default 10 check (plazas between 5 and 10),
  estado text not null default 'borrador' check (estado in ('borrador', 'publicado')),
  creado_en timestamptz not null default now()
);

-- 2. Dirección exacta: una fila por badulake. Solo la organizadora puede leerla (la Tarea 6
-- enseñará la dirección a quien se apunte con una política nueva).
create table public.badulakes_direccion (
  badulake_id uuid primary key references public.badulakes (id) on delete cascade,
  organizadora uuid not null references auth.users (id) on delete cascade,
  direccion text not null check (char_length(btrim(direccion)) between 3 and 200)
);

-- 3. La fecha tiene que ser futura al crear el badulake.
create function public.exigir_fecha_futura() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.fecha_hora <= now() then
    raise exception 'Badulake: la fecha debe ser futura' using errcode = 'check_violation';
  end if;
  return new;
end;
$$;
create trigger antes_de_crear_badulake
  before insert on public.badulakes
  for each row execute function public.exigir_fecha_futura();

-- 4. Seguridad por filas (RLS). Nadie puede insertar directamente: se crea con crear_badulake().
alter table public.badulakes enable row level security;
alter table public.badulakes_direccion enable row level security;
revoke all on public.badulakes, public.badulakes_direccion from anon, authenticated;
grant select on public.badulakes to authenticated;
grant update (estado) on public.badulakes to authenticated;
grant select on public.badulakes_direccion to authenticated;

-- La organizadora ve todos los suyos; cualquier persona con sesión ve los publicados (sin dirección).
create policy "leer_mis_badulakes" on public.badulakes
  for select to authenticated using ((select auth.uid()) = organizadora);
create policy "leer_badulakes_publicados" on public.badulakes
  for select to authenticated using (estado = 'publicado');
-- Solo la organizadora, y solo para pasar de borrador a publicado.
create policy "publicar_mi_borrador" on public.badulakes
  for update to authenticated
  using ((select auth.uid()) = organizadora and estado = 'borrador')
  with check ((select auth.uid()) = organizadora and estado = 'publicado');
-- La dirección exacta: solo la organizadora.
create policy "leer_mi_direccion" on public.badulakes_direccion
  for select to authenticated using ((select auth.uid()) = organizadora);

-- 5. Crear un badulake y su dirección de golpe (o las dos cosas o ninguna).
-- p_fecha_hora llega como hora de Madrid, sin zona (p. ej. 2026-12-05 18:00).
create function public.crear_badulake(
  p_titulo text, p_descripcion text, p_fecha_hora timestamp, p_zona text,
  p_direccion text, p_plazas smallint
) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  yo uuid := auth.uid();
  nuevo uuid;
begin
  if yo is null then
    raise exception 'Badulake: hace falta iniciar sesión' using errcode = 'insufficient_privilege';
  end if;
  insert into public.badulakes (organizadora, titulo, descripcion, fecha_hora, zona, plazas)
  values (yo, btrim(p_titulo), btrim(p_descripcion), p_fecha_hora at time zone 'Europe/Madrid',
          btrim(p_zona), p_plazas)
  returning id into nuevo;
  insert into public.badulakes_direccion (badulake_id, organizadora, direccion)
  values (nuevo, yo, btrim(p_direccion));
  return nuevo;
end;
$$;
revoke execute on function public.crear_badulake(text, text, timestamp, text, text, smallint)
  from public, anon;
grant execute on function public.crear_badulake(text, text, timestamp, text, text, smallint)
  to authenticated;
revoke execute on function public.exigir_fecha_futura() from public, anon, authenticated;
