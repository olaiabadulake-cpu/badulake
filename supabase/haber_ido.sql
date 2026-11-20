-- Haber ido a un badulake antes de poder organizar uno (Tarea 5.2, D-038). Ejecutado el 20/11/2026.
-- Para conocer las reglas, solo puede crear o publicar un badulake quien ya ha ido a uno.
-- «Haber ido» (lo decide OlaIA): estar apuntada a un badulake ya celebrado (publicado, no
-- cancelado ni oculto) y que la organizadora no la marcara «No ha venido» en el Modo badulake
-- (Tarea 24). También cuenta haber organizado uno celebrado. Excepciones: el equipo (Tarea 13)
-- organiza siempre y puede dar o quitar permiso a una persona desde el panel /equipo.
-- Todo lo decide la base de datos: crear (crear_badulake) y publicar (política) la comprueban.

-- 1. Quién ya puede organizar. Una fila por persona, sin enlace a ningún badulake: solo «cuándo» y
-- «por qué» ('asistencia' o 'equipo'). Se borra sola con la cuenta. Nadie la lee ni la escribe
-- desde fuera: sin permisos, solo las funciones de abajo.
create table public.permiso_organizar (
  persona uuid primary key references auth.users (id) on delete cascade,
  origen text not null check (origen in ('asistencia', 'equipo')),
  desde timestamptz not null default now()
);
alter table public.permiso_organizar enable row level security;
revoke all on public.permiso_organizar from anon, authenticated;

-- 2. ¿Ha ido esta persona a un badulake? Mira el registro y, además, lo que ya se pueda ver en las
-- inscripciones (así no hay que esperar al apunte de la noche). Interna: nadie la llama desde fuera.
create function public.persona_ha_ido(p uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.permiso_organizar o where o.persona = p)
    or exists (
      select 1 from public.inscripciones i
      join public.badulakes b on b.id = i.badulake_id
      where i.persona = p and b.estado = 'publicado' and not b.oculto and b.fecha_hora < now()
        and not exists (select 1 from public.dia_personas d
                        where d.badulake_id = b.id and d.persona = p and not d.presente)
    )
    or exists (
      select 1 from public.badulakes b
      where b.organizadora = p and b.estado = 'publicado' and not b.oculto and b.fecha_hora < now()
    );
$$;
revoke execute on function public.persona_ha_ido(uuid) from public, anon, authenticated;

-- 3. ¿Puedo organizar yo? Equipo, permiso del equipo o haber ido. (Una cuenta suspendida se
-- comprueba aparte.) La web la usa para avisar antes de enseñar el formulario.
create function public.puedo_organizar() returns boolean
language sql stable security definer set search_path = '' as $$
  select auth.uid() is not null
    and (public.soy_equipo() or public.persona_ha_ido(auth.uid()));
$$;
revoke execute on function public.puedo_organizar() from public, anon;
grant execute on function public.puedo_organizar() to authenticated;

-- 4. Apuntar a quien ha ido, cada 10 minutos: las inscripciones se borran a los 30 días del
-- badulake y la marca «No ha venido» al día siguiente, así que el hecho de haber ido se guarda aquí.
create function public.registrar_asistencias() returns void
language sql security definer set search_path = '' as $$
  insert into public.permiso_organizar (persona, origen)
  select distinct q.p, 'asistencia' from (
    select i.persona as p from public.inscripciones i
      join public.badulakes b on b.id = i.badulake_id
      where b.estado = 'publicado' and not b.oculto and b.fecha_hora < now()
        and not exists (select 1 from public.dia_personas d
                        where d.badulake_id = b.id and d.persona = i.persona and not d.presente)
    union
    select b.organizadora from public.badulakes b
      where b.estado = 'publicado' and not b.oculto and b.fecha_hora < now()
  ) q
  where q.p is not null
  on conflict (persona) do nothing;
$$;
revoke execute on function public.registrar_asistencias() from public, anon, authenticated;
select cron.schedule('registrar-asistencias', '*/10 * * * *', 'select public.registrar_asistencias()');

-- 5. El equipo da o quita permiso a una persona, por su correo (el correo no se guarda ni se
-- devuelve). Devuelve 'ok', 'no_existe' (no hay cuenta con ese correo) o 'ya_tenia'/'no_tenia'.
-- Quitar el permiso solo quita el dado por el equipo, nunca el de haber ido.
create function public.equipo_permiso_organizar(p_correo text, p_dar boolean) returns text
language plpgsql security definer set search_path = '' as $$
declare
  quien uuid;
begin
  if not public.soy_equipo() then
    raise exception 'Badulake: solo el equipo' using errcode = 'insufficient_privilege';
  end if;
  select id into quien from auth.users where lower(email) = lower(btrim(p_correo));
  if quien is null then return 'no_existe'; end if;
  if p_dar then
    insert into public.permiso_organizar (persona, origen) values (quien, 'equipo')
      on conflict (persona) do nothing;
    return case when found then 'ok' else 'ya_tenia' end;
  end if;
  delete from public.permiso_organizar where persona = quien and origen = 'equipo';
  return case when found then 'ok' else 'no_tenia' end;
end;
$$;
revoke execute on function public.equipo_permiso_organizar(text, boolean) from public, anon;
grant execute on function public.equipo_permiso_organizar(text, boolean) to authenticated;

-- 6. Crear: la función de D-037 con la comprobación nueva.
create or replace function public.crear_badulake(
  p_barrio text, p_ciudad text, p_provincia text, p_descripcion text,
  p_fecha_hora timestamp, p_direccion text, p_plazas smallint
) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  yo uuid := auth.uid();
  nuevo uuid;
  barrio text := btrim(coalesce(p_barrio, ''));
  ciudad text := btrim(coalesce(p_ciudad, ''));
  provincia text := btrim(coalesce(p_provincia, ''));
  titulo text;
begin
  if yo is null then
    raise exception 'Badulake: hace falta iniciar sesión' using errcode = 'insufficient_privilege';
  end if;
  if public.estoy_suspendida() then
    raise exception 'Badulake: cuenta suspendida' using errcode = 'insufficient_privilege';
  end if;
  if not public.puedo_organizar() then
    raise exception 'Badulake: aun_no_puedes_organizar' using errcode = 'insufficient_privilege';
  end if;
  if char_length(barrio) not between 2 and 40 or char_length(ciudad) not between 2 and 40
     or char_length(provincia) not between 2 and 30 then
    raise exception 'Badulake: barrio, ciudad y provincia son obligatorios' using errcode = 'check_violation';
  end if;
  titulo := 'Badulake de ' || barrio || ', ' || ciudad
    || case when lower(provincia) = lower(ciudad) then '' else ' (' || provincia || ')' end;
  insert into public.badulakes (organizadora, titulo, descripcion, fecha_hora, zona, plazas)
  values (yo, titulo, btrim(p_descripcion), p_fecha_hora at time zone 'Europe/Madrid', barrio, p_plazas)
  returning id into nuevo;
  insert into public.badulakes_direccion (badulake_id, organizadora, direccion)
  values (nuevo, yo, btrim(p_direccion));
  return nuevo;
end;
$$;

-- 7. Publicar un borrador: la política de D-032 con la comprobación nueva.
drop policy "publicar_mi_borrador" on public.badulakes;
create policy "publicar_mi_borrador" on public.badulakes
  for update to authenticated
  using ((select auth.uid()) = organizadora and estado = 'borrador' and not oculto)
  with check (
    (select auth.uid()) = organizadora and estado = 'publicado'
    and fecha_hora > now() + interval '48 hours'
    and not public.estoy_suspendida()
    and public.puedo_organizar()
  );
