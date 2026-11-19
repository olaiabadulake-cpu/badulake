-- Denunciar, suspender y panel del equipo (Tarea 13, D-026). Detalle en docs/seguridad.md y docs/privacidad.md.
-- Todo lo que decide el equipo vive en tablas que la app NO puede leer ni escribir: solo se toca
-- desde el panel de Supabase (equipo, suspendidas) o con las funciones equipo_*, que comprueban
-- primero que quien llama está en la tabla `equipo`.

-- 1. Equipo: qué cuentas son del equipo. Sin permisos para nadie: solo se rellena desde el panel
-- de Supabase (SQL Editor o Table Editor), nunca desde la app. Ningún dato que la persona pueda cambiar.
create table public.equipo (
  persona uuid primary key references auth.users (id) on delete cascade,
  creado_en timestamptz not null default now()
);
alter table public.equipo enable row level security;
revoke all on public.equipo from anon, authenticated;

create function public.soy_equipo() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.equipo where persona = auth.uid());
$$;
revoke execute on function public.soy_equipo() from public, anon;
grant execute on function public.soy_equipo() to authenticated;

-- 2. Cuentas suspendidas. Solo las rellena equipo_suspender() (o el panel de Supabase).
create table public.suspendidas (
  persona uuid primary key references auth.users (id) on delete cascade,
  desde timestamptz not null default now()
);
alter table public.suspendidas enable row level security;
revoke all on public.suspendidas from anon, authenticated;

create function public.estoy_suspendida() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.suspendidas where persona = auth.uid());
$$;
revoke execute on function public.estoy_suspendida() from public, anon;
grant execute on function public.estoy_suspendida() to authenticated;

-- 3. Ocultar un badulake: nadie lo ve salvo su organizadora (que ve el aviso) y el equipo.
alter table public.badulakes add column oculto boolean not null default false;
grant select (oculto) on public.badulakes to authenticated;

drop policy "leer_badulakes_publicados" on public.badulakes;
create policy "leer_badulakes_publicados" on public.badulakes
  for select to authenticated using (estado = 'publicado' and not oculto);

-- Una organizadora suspendida u oculta no puede publicar.
drop policy "publicar_mi_borrador" on public.badulakes;
create policy "publicar_mi_borrador" on public.badulakes
  for update to authenticated
  using ((select auth.uid()) = organizadora and estado = 'borrador' and not oculto)
  with check (
    (select auth.uid()) = organizadora and estado = 'publicado' and fecha_hora > now()
    and not public.estoy_suspendida()
  );

-- La dirección exacta deja de verse en un badulake oculto, también para quien se había apuntado.
create function public.badulake_oculto(p_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce((select oculto from public.badulakes where id = p_id), false);
$$;
revoke execute on function public.badulake_oculto(uuid) from public, anon;
grant execute on function public.badulake_oculto(uuid) to authenticated;

drop policy "leer_direccion_si_apuntada" on public.badulakes_direccion;
create policy "leer_direccion_si_apuntada" on public.badulakes_direccion
  for select to authenticated using (
    not public.badulake_oculto(badulake_id)
    and exists (
      select 1 from public.inscripciones i
      where i.badulake_id = badulakes_direccion.badulake_id and i.persona = (select auth.uid())
    )
  );

-- Las plazas ocupadas tampoco se cuentan en un badulake oculto.
create or replace function public.plazas_ocupadas(p_ids uuid[])
returns table (badulake_id uuid, ocupadas int)
language sql stable security definer set search_path = '' as $$
  select i.badulake_id, count(*)::int
  from public.inscripciones i
  join public.badulakes b on b.id = i.badulake_id
  where auth.uid() is not null
    and i.badulake_id = any (p_ids)
    and ((b.estado = 'publicado' and not b.oculto) or b.organizadora = auth.uid())
  group by i.badulake_id;
$$;

-- 4. Una cuenta suspendida no puede crear ni apuntarse (aunque su sesión siga abierta un rato).
create or replace function public.crear_badulake(
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
  if public.estoy_suspendida() then
    raise exception 'Badulake: cuenta suspendida' using errcode = 'insufficient_privilege';
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

create or replace function public.apuntarme(p_badulake uuid) returns text
language plpgsql security definer set search_path = '' as $$
declare
  yo uuid := auth.uid();
  b public.badulakes;
  ocupadas int;
begin
  if yo is null then
    raise exception 'Badulake: hace falta iniciar sesión' using errcode = 'insufficient_privilege';
  end if;
  if public.estoy_suspendida() then
    return 'suspendida';
  end if;
  select * into b from public.badulakes
    where id = p_badulake and estado = 'publicado' and not oculto for update;
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

-- 5. Denuncias. Cada persona crea las suyas y no puede leer ninguna (ni las suyas): no hay política
-- de lectura. Solo se denuncian badulakes que la persona puede ver. Una abierta por persona y badulake.
create table public.denuncias (
  id uuid primary key default gen_random_uuid(),
  badulake_id uuid not null references public.badulakes (id) on delete cascade,
  denunciante uuid references auth.users (id) on delete set null default auth.uid(),
  motivo text not null check (motivo in ('estafa', 'ofensivo', 'datos', 'peligroso', 'spam', 'otro')),
  texto text check (texto is null or char_length(btrim(texto)) between 1 and 300),
  estado text not null default 'abierta' check (estado in ('abierta', 'resuelta')),
  creada_en timestamptz not null default now(),
  resuelta_en timestamptz
);
create unique index denuncias_una_abierta on public.denuncias (badulake_id, denunciante)
  where estado = 'abierta';
create index denuncias_abiertas on public.denuncias (creada_en) where estado = 'abierta';

alter table public.denuncias enable row level security;
revoke all on public.denuncias from anon, authenticated;
grant insert (badulake_id, motivo, texto) on public.denuncias to authenticated;
create policy "denunciar" on public.denuncias
  for insert to authenticated with check (
    denunciante = (select auth.uid())
    and estado = 'abierta'
    and not public.estoy_suspendida()
    and exists (select 1 from public.badulakes b where b.id = badulake_id)
  );

-- 6. Funciones del equipo. Todas comprueban soy_equipo() y no enseñan datos personales: ni el
-- correo, ni quién denuncia, ni quién organiza, ni la dirección exacta.
create function public.equipo_denuncias()
returns table (
  id uuid, creada_en timestamptz, motivo text, texto text, badulake_id uuid, titulo text,
  descripcion text, zona text, fecha_hora timestamptz, oculto boolean, suspendida boolean,
  denuncias_del_badulake int
)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.soy_equipo() then
    raise exception 'Badulake: solo el equipo' using errcode = 'insufficient_privilege';
  end if;
  return query
    select d.id, d.creada_en, d.motivo, d.texto, d.badulake_id, b.titulo, b.descripcion, b.zona,
           b.fecha_hora, b.oculto,
           exists (select 1 from public.suspendidas s where s.persona = b.organizadora),
           (select count(*)::int from public.denuncias x
              where x.badulake_id = d.badulake_id and x.estado = 'abierta')
    from public.denuncias d
    join public.badulakes b on b.id = d.badulake_id
    where d.estado = 'abierta'
    order by d.creada_en;
end;
$$;

create function public.equipo_ocultar(p_denuncia uuid, p_ocultar boolean) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.soy_equipo() then
    raise exception 'Badulake: solo el equipo' using errcode = 'insufficient_privilege';
  end if;
  update public.badulakes set oculto = p_ocultar
    where id = (select badulake_id from public.denuncias where id = p_denuncia);
end;
$$;

-- Suspender: la cuenta no puede crear, apuntarse ni denunciar, no puede entrar (Supabase Auth la
-- bloquea y se cierran sus sesiones) y sus badulakes se ocultan. Para levantarla, desde el panel
-- de Supabase: ver docs/seguridad.md.
create function public.equipo_suspender(p_denuncia uuid) returns void
language plpgsql security definer set search_path = '' as $$
declare
  quien uuid;
begin
  if not public.soy_equipo() then
    raise exception 'Badulake: solo el equipo' using errcode = 'insufficient_privilege';
  end if;
  select b.organizadora into quien
    from public.denuncias d join public.badulakes b on b.id = d.badulake_id
    where d.id = p_denuncia;
  if quien is null then
    raise exception 'Badulake: denuncia no encontrada' using errcode = 'no_data_found';
  end if;
  if exists (select 1 from public.equipo where persona = quien) then
    raise exception 'Badulake: no se suspende al equipo' using errcode = 'insufficient_privilege';
  end if;
  insert into public.suspendidas (persona) values (quien) on conflict do nothing;
  update public.badulakes set oculto = true where organizadora = quien;
  update auth.users set banned_until = 'infinity' where id = quien;
  delete from auth.sessions where user_id = quien;
end;
$$;

create function public.equipo_resolver(p_denuncia uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.soy_equipo() then
    raise exception 'Badulake: solo el equipo' using errcode = 'insufficient_privilege';
  end if;
  -- Se resuelven todas las abiertas de ese badulake: es el mismo asunto.
  update public.denuncias set estado = 'resuelta', resuelta_en = now()
    where estado = 'abierta'
      and badulake_id = (select badulake_id from public.denuncias where id = p_denuncia);
end;
$$;

revoke execute on function
  public.equipo_denuncias(), public.equipo_ocultar(uuid, boolean),
  public.equipo_suspender(uuid), public.equipo_resolver(uuid)
  from public, anon;
grant execute on function
  public.equipo_denuncias(), public.equipo_ocultar(uuid, boolean),
  public.equipo_suspender(uuid), public.equipo_resolver(uuid)
  to authenticated;

-- 7. Soy del equipo o no: un badulake oculto sigue visible para su organizadora (con aviso).
-- (Sin cambios: leer_mis_badulakes ya la deja verlo.)
