-- La organizadora cuenta como una persona más (Tarea 20.1) y el Modo badulake se abre siempre
-- (Tarea 24.1). Detalle en docs/decisiones.md (D-040) y docs/auditoria.md.
-- Se ejecuta DESPUÉS de cupo.sql y dia.sql: cambia sus funciones con «create or replace».
--
-- Regla nueva (decisión de OlaIA, 21/11/2026): un badulake es de 5 a 10 personas EN TOTAL,
-- contándola a ella. La columna «plazas» (de 5 a 10) pasa a ser ese total: para apuntarse quedan
-- plazas - 1. «Confirmado» es tener 4 apuntadas o más (4 + la organizadora = 5).

-- 1. Badulakes que ya existen: nadie pierde su plaza. Si con la regla nueva hay más personas
-- (apuntadas + organizadora) que plazas, el total sube hasta caber, con 10 como máximo. Un
-- badulake de 10 con 10 apuntadas se queda como está (11 personas): no entra nadie más de la
-- lista de espera hasta que bajen de 9.
update public.badulakes b
  set plazas = least(10, (select count(*) from public.inscripciones i where i.badulake_id = b.id) + 1)
  where b.estado = 'publicado' and b.fecha_hora > now()
    and (select count(*) from public.inscripciones i where i.badulake_id = b.id) + 1 > b.plazas
    and b.plazas < 10;

-- 2. Rellenar desde la lista de espera: plazas libres = plazas - 1 (la organizadora) - apuntadas.
create or replace function public.rellenar_desde_espera(p_badulake uuid) returns void
language plpgsql security definer set search_path = '' as $$
declare
  b public.badulakes;
  libres int;
  siguiente uuid;
begin
  select * into b from public.badulakes where id = p_badulake for update;
  if not found or b.estado <> 'publicado' or b.oculto or b.fecha_hora <= now() then
    return;
  end if;
  libres := b.plazas - 1 - (select count(*) from public.inscripciones where badulake_id = b.id);
  while libres > 0 loop
    select e.persona into siguiente from public.espera e
      where e.badulake_id = b.id
        and not exists (select 1 from public.suspendidas s where s.persona = e.persona)
      order by e.creada_en, e.persona
      limit 1;
    exit when siguiente is null;
    delete from public.espera where badulake_id = b.id and persona = siguiente;
    insert into public.inscripciones (badulake_id, persona, desde_espera)
      values (b.id, siguiente, true) on conflict do nothing;
    libres := libres - 1;
  end loop;
end;
$$;
revoke execute on function public.rellenar_desde_espera(uuid) from public, anon, authenticated;

-- 3. Apuntarme: hay sitio si las apuntadas son menos de plazas - 1. El resto, igual que en cupo.sql.
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
  -- for update: quien llegue después espera a que acabe esta operación y ya ve la plaza ocupada.
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
  if exists (select 1 from public.espera where badulake_id = b.id and persona = yo) then
    return 'en_espera';
  end if;
  select count(*) into ocupadas from public.inscripciones where badulake_id = b.id;
  if ocupadas >= b.plazas - 1 then
    insert into public.espera (badulake_id, persona) values (b.id, yo);
    return 'en_espera';
  end if;
  insert into public.inscripciones (badulake_id, persona) values (b.id, yo);
  return 'ok';
end;
$$;
revoke execute on function public.apuntarme(uuid) from public, anon;
grant execute on function public.apuntarme(uuid) to authenticated;

-- 4. Cancelación automática: a 24 horas o menos, si no llegan a 5 personas contando a la
-- organizadora (menos de 4 apuntadas).
create or replace function public.cancelar_sin_minimo() returns int
language plpgsql security definer set search_path = '' as $$
declare
  b public.badulakes;
  total int := 0;
begin
  for b in
    select * from public.badulakes
      where estado = 'publicado' and fecha_hora > now() and fecha_hora <= now() + interval '24 hours'
      for update skip locked
  loop
    if (select count(*) from public.inscripciones where badulake_id = b.id) + 1 < 5 then
      perform public.cancelar(b.id, 'automatica');
      total := total + 1;
    end if;
  end loop;
  return total;
end;
$$;
revoke execute on function public.cancelar_sin_minimo() from public, anon, authenticated;

-- 5. Modo badulake (Tarea 24.1): se abre siempre que el badulake esté publicado (no cancelado ni
-- oculto) y en su ventana horaria. Ya no exige 5 apuntadas: si alguien se borra en las últimas
-- 24 horas, la organizadora no se queda sin herramientas el día del badulake.
create or replace function public.dia_permitido(b public.badulakes) returns text
language sql stable security definer set search_path = '' as $$
  select case
    when auth.uid() is null then 'sin_sesion'
    when b.id is null then 'no_existe'
    when b.organizadora <> auth.uid() then 'no_organizadora'
    when public.estoy_suspendida() then 'suspendida'
    when b.estado <> 'publicado' or b.oculto then 'no_disponible'
    when now() < b.fecha_hora - interval '2 hours' or now() > b.fecha_hora + interval '1 day'
      then 'fuera_de_hora'
    else 'ok'
  end;
$$;
revoke execute on function public.dia_permitido(public.badulakes) from public, anon, authenticated;

-- 6. «Me interesa» (Tarea 5.3): la tabla se creó sin permisos para las cuentas (seguridad.sql hace
-- que lo nuevo empiece sin permisos e interes.sql no los daba), así que nunca se podía guardar.
-- Las políticas de interes.sql (cada persona solo lo suyo) y la de google.sql siguen mandando.
grant select, insert, delete on public.interes to authenticated;
