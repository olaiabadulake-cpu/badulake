-- Apuntarse a un badulake (Tarea 6, D-021).
-- Cada persona ve solo sus inscripciones. Nadie inserta directamente: se entra con apuntarme(),
-- que cierra el badulake con un bloqueo para que dos personas a la vez no cojan la última plaza.

-- 1. Inscripciones: quién (persona) está en qué badulake, y desde cuándo.
create table public.inscripciones (
  badulake_id uuid not null references public.badulakes (id) on delete cascade,
  persona uuid not null references auth.users (id) on delete cascade default auth.uid(),
  creada_en timestamptz not null default now(),
  primary key (badulake_id, persona)
);

alter table public.inscripciones enable row level security;
revoke all on public.inscripciones from anon, authenticated;
grant select, delete on public.inscripciones to authenticated;

create policy "leer_mis_inscripciones" on public.inscripciones
  for select to authenticated using ((select auth.uid()) = persona);
create policy "borrarme" on public.inscripciones
  for delete to authenticated using ((select auth.uid()) = persona);
-- No hay política de insertar: solo se puede con apuntarme().

-- 2. Cuántas plazas hay ocupadas. Solo un número por badulake: ningún dato de nadie.
-- Se ve en los badulakes publicados y en los propios. (Vista con los permisos de su dueño.)
create view public.badulakes_ocupadas as
  select i.badulake_id, count(*)::int as ocupadas
  from public.inscripciones i
  join public.badulakes b on b.id = i.badulake_id
  where b.estado = 'publicado' or b.organizadora = auth.uid()
  group by i.badulake_id;
revoke all on public.badulakes_ocupadas from anon, authenticated;
grant select on public.badulakes_ocupadas to authenticated;

-- 3. Apuntarme. Devuelve: 'ok', 'lleno', 'organizadora' o 'no_disponible'.
create function public.apuntarme(p_badulake uuid) returns text
language plpgsql security definer set search_path = '' as $$
declare
  yo uuid := auth.uid();
  b public.badulakes;
  ocupadas int;
begin
  if yo is null then
    raise exception 'Badulake: hace falta iniciar sesión' using errcode = 'insufficient_privilege';
  end if;
  -- for update: quien llegue después espera a que acabe esta operación y ya ve la plaza ocupada.
  select * into b from public.badulakes
    where id = p_badulake and estado = 'publicado' for update;
  if not found or b.fecha_hora <= now() then
    return 'no_disponible';
  end if;
  if b.organizadora = yo then
    return 'organizadora';
  end if;
  if exists (select 1 from public.inscripciones where badulake_id = b.id and persona = yo) then
    return 'ok';
  end if;
  select count(*) into ocupadas from public.inscripciones where badulake_id = b.id;
  if ocupadas >= b.plazas then
    return 'lleno';
  end if;
  insert into public.inscripciones (badulake_id, persona) values (b.id, yo);
  return 'ok';
end;
$$;
revoke execute on function public.apuntarme(uuid) from public, anon;
grant execute on function public.apuntarme(uuid) to authenticated;

-- 4. La dirección exacta la ve también quien esté apuntada (además de la organizadora).
create policy "leer_direccion_si_apuntada" on public.badulakes_direccion
  for select to authenticated using (
    exists (
      select 1 from public.inscripciones i
      where i.badulake_id = badulakes_direccion.badulake_id and i.persona = (select auth.uid())
    )
  );
