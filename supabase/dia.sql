-- Herramientas del día del badulake (Tarea 24).
-- Detalle en docs/decisiones.md, docs/seguridad.md, docs/privacidad.md y docs/recorridos.md.
-- Solo la organizadora escribe, y solo el día del evento (desde 2 horas antes hasta 1 día después),
-- con el badulake publicado y confirmado (5 apuntadas o más al abrir el modo). Todo pasa por
-- funciones: las tablas no se pueden leer ni escribir directamente (salvo cada persona su propia fila).

-- 1. Estado del día de cada badulake: cuándo se hicieron los sorteos (quedan registrados y no se
-- pueden repetir) y de quién es el turno.
create table public.dia_estado (
  badulake_id uuid primary key references public.badulakes (id) on delete cascade,
  sorteo_orden_en timestamptz,
  elegir_desde timestamptz,
  turno_actual int not null default 0,
  creado_en timestamptz not null default now()
);

-- 2. Una fila por persona presente ese día (las apuntadas y la organizadora). La «etiqueta» es el
-- nombre que la organizadora escribe a mano para reconocerla (las cuentas no tienen nombre).
create table public.dia_personas (
  id uuid primary key default gen_random_uuid(),
  badulake_id uuid not null references public.badulakes (id) on delete cascade,
  persona uuid not null references auth.users (id) on delete cascade,
  num smallint not null,
  etiqueta text check (etiqueta is null or char_length(btrim(etiqueta)) between 1 and 30),
  presente boolean not null default true,
  ropa smallint not null default 0 check (ropa between 0 and 99),
  calzado smallint not null default 0 check (calzado between 0 and 99),
  accesorios smallint not null default 0 check (accesorios between 0 and 99),
  otros smallint not null default 0 check (otros between 0 and 99),
  orden_exponer int,
  azar double precision,
  orden_elegir int,
  unique (badulake_id, persona),
  unique (badulake_id, num)
);

alter table public.dia_estado enable row level security;
alter table public.dia_personas enable row level security;
revoke all on public.dia_estado, public.dia_personas from anon, authenticated;
-- Cada persona puede leer SU fila (turnos), sin etiqueta ni aportes de nadie más.
grant select (id, badulake_id, presente, orden_exponer, orden_elegir) on public.dia_personas to authenticated;
create policy "leer_mi_fila_del_dia" on public.dia_personas
  for select to authenticated using ((select auth.uid()) = persona);
-- Sin más políticas: nadie escribe ni lee el resto desde fuera; solo las funciones de abajo.

-- 3. ¿Puede la organizadora usar el modo ahora? Devuelve 'ok' o el motivo.
create function public.dia_permitido(b public.badulakes) returns text
language sql stable security definer set search_path = '' as $$
  select case
    when auth.uid() is null then 'sin_sesion'
    when b.id is null then 'no_existe'
    when b.organizadora <> auth.uid() then 'no_organizadora'
    when public.estoy_suspendida() then 'suspendida'
    when b.estado <> 'publicado' or b.oculto then 'no_disponible'
    when now() < b.fecha_hora - interval '2 hours' or now() > b.fecha_hora + interval '1 day'
      then 'fuera_de_hora'
    when not exists (select 1 from public.dia_estado d where d.badulake_id = b.id)
      and (select count(*) from public.inscripciones i where i.badulake_id = b.id) < 5
      then 'no_confirmado'
    else 'ok'
  end;
$$;
revoke execute on function public.dia_permitido(public.badulakes) from public, anon, authenticated;

-- 4. Poner al día la lista de personas con las apuntadas (y la organizadora, que también intercambia).
create function public.dia_sincronizar(p_badulake uuid, p_organizadora uuid) returns void
language plpgsql security definer set search_path = '' as $$
declare
  quien uuid;
begin
  insert into public.dia_estado (badulake_id) values (p_badulake) on conflict do nothing;
  for quien in
    select p_organizadora
    union
    select i.persona from public.inscripciones i where i.badulake_id = p_badulake
  loop
    insert into public.dia_personas (badulake_id, persona, num)
    select p_badulake, quien,
           coalesce((select max(num) from public.dia_personas where badulake_id = p_badulake), 0) + 1
    on conflict (badulake_id, persona) do nothing;
  end loop;
  delete from public.dia_personas d
    where d.badulake_id = p_badulake and d.persona <> p_organizadora
      and not exists (select 1 from public.inscripciones i
                      where i.badulake_id = p_badulake and i.persona = d.persona);
end;
$$;
revoke execute on function public.dia_sincronizar(uuid, uuid) from public, anon, authenticated;

-- 5. ¿Aparece el botón «Modo badulake»? Solo para la organizadora y solo en horas.
create function public.dia_activo(p_badulake uuid) returns boolean
language plpgsql stable security definer set search_path = '' as $$
declare
  b public.badulakes;
begin
  select * into b from public.badulakes where id = p_badulake;
  return found and public.dia_permitido(b) = 'ok';
end;
$$;
revoke execute on function public.dia_activo(uuid) from public, anon;
grant execute on function public.dia_activo(uuid) to authenticated;

-- 6. El panel de la organizadora: estado y personas, con la cola de turnos.
-- Antes de empezar a elegir, «elegir» es una vista previa (más objetos primero; los empates se
-- sortean al empezar). Devuelve {"error": motivo} si no puede.
create function public.dia_panel(p_badulake uuid) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  b public.badulakes;
  codigo text;
  e public.dia_estado;
  actual int;
  resultado jsonb;
begin
  select * into b from public.badulakes where id = p_badulake for update;
  codigo := public.dia_permitido(b);
  if codigo <> 'ok' then
    return jsonb_build_object('error', codigo);
  end if;
  perform public.dia_sincronizar(b.id, b.organizadora);
  select * into e from public.dia_estado where badulake_id = b.id;
  select min(orden_elegir) into actual from public.dia_personas
    where badulake_id = b.id and presente and orden_elegir >= e.turno_actual;
  select jsonb_build_object(
    'orden_sorteado', e.sorteo_orden_en is not null,
    'elegir_empezado', e.elegir_desde is not null,
    'turno', actual,
    'personas', coalesce(jsonb_agg(jsonb_build_object(
      'id', p.id, 'num', p.num, 'etiqueta', p.etiqueta, 'presente', p.presente,
      'ropa', p.ropa, 'calzado', p.calzado, 'accesorios', p.accesorios, 'otros', p.otros,
      'orden_exponer', p.orden_exponer,
      'orden_elegir', case when e.elegir_desde is not null then p.orden_elegir
        when p.presente then (select count(*) + 1 from public.dia_personas q
          where q.badulake_id = b.id and q.presente
            and (q.ropa + q.calzado + q.accesorios + q.otros > p.ropa + p.calzado + p.accesorios + p.otros
                 or (q.ropa + q.calzado + q.accesorios + q.otros = p.ropa + p.calzado + p.accesorios + p.otros
                     and q.num < p.num)))
        end
    ) order by p.num), '[]'::jsonb)
  ) into resultado
  from public.dia_personas p where p.badulake_id = b.id;
  return resultado;
end;
$$;
revoke execute on function public.dia_panel(uuid) from public, anon;
grant execute on function public.dia_panel(uuid) to authenticated;

-- 7. Fijar lo contado de una persona. Se mandan los valores completos (no «+1»), así que repetir
-- el envío tras una mala cobertura no cuenta dos veces.
create function public.dia_fijar(p_fila uuid, p_ropa int, p_calzado int, p_accesorios int, p_otros int)
returns text
language plpgsql security definer set search_path = '' as $$
declare
  b public.badulakes;
  codigo text;
begin
  select bb.* into b from public.badulakes bb
    join public.dia_personas p on p.badulake_id = bb.id where p.id = p_fila for update of bb;
  codigo := public.dia_permitido(b);
  if codigo <> 'ok' then return codigo; end if;
  if least(p_ropa, p_calzado, p_accesorios, p_otros) < 0
     or greatest(p_ropa, p_calzado, p_accesorios, p_otros) > 99 then
    return 'invalido';
  end if;
  update public.dia_personas set ropa = p_ropa, calzado = p_calzado,
    accesorios = p_accesorios, otros = p_otros where id = p_fila;
  return 'ok';
end;
$$;
revoke execute on function public.dia_fijar(uuid, int, int, int, int) from public, anon;
grant execute on function public.dia_fijar(uuid, int, int, int, int) to authenticated;

-- 8. Escribir el nombre de una persona (solo para reconocerla ese día).
create function public.dia_etiqueta(p_fila uuid, p_texto text) returns text
language plpgsql security definer set search_path = '' as $$
declare
  b public.badulakes;
  codigo text;
  limpio text := nullif(btrim(coalesce(p_texto, '')), '');
begin
  select bb.* into b from public.badulakes bb
    join public.dia_personas p on p.badulake_id = bb.id where p.id = p_fila for update of bb;
  codigo := public.dia_permitido(b);
  if codigo <> 'ok' then return codigo; end if;
  if limpio is not null and char_length(limpio) > 30 then return 'invalido'; end if;
  update public.dia_personas set etiqueta = limpio where id = p_fila;
  return 'ok';
end;
$$;
revoke execute on function public.dia_etiqueta(uuid, text) from public, anon;
grant execute on function public.dia_etiqueta(uuid, text) to authenticated;

-- 9. «No ha venido» / «Ha llegado». Se puede deshacer. Quien no ha venido sale de los sorteos y de
-- la cola; si llega después, entra desde ese momento: la última para exponer y la última para elegir
-- (con su propio número de sorteo para los empates).
create function public.dia_presente(p_fila uuid, p_presente boolean) returns text
language plpgsql security definer set search_path = '' as $$
declare
  b public.badulakes;
  codigo text;
  e public.dia_estado;
begin
  select bb.* into b from public.badulakes bb
    join public.dia_personas p on p.badulake_id = bb.id where p.id = p_fila for update of bb;
  codigo := public.dia_permitido(b);
  if codigo <> 'ok' then return codigo; end if;
  select * into e from public.dia_estado where badulake_id = b.id;
  if not p_presente then
    update public.dia_personas set presente = false, orden_exponer = null, azar = null,
      orden_elegir = null where id = p_fila;
  else
    update public.dia_personas set presente = true where id = p_fila and not presente;
    if found then
      if e.sorteo_orden_en is not null then
        update public.dia_personas set orden_exponer =
          coalesce((select max(orden_exponer) from public.dia_personas where badulake_id = b.id), 0) + 1
          where id = p_fila;
      end if;
      if e.elegir_desde is not null then
        update public.dia_personas set azar = random(), orden_elegir =
          greatest(coalesce((select max(orden_elegir) from public.dia_personas where badulake_id = b.id), 0),
                   e.turno_actual - 1) + 1
          where id = p_fila;
      end if;
    end if;
  end if;
  return 'ok';
end;
$$;
revoke execute on function public.dia_presente(uuid, boolean) from public, anon;
grant execute on function public.dia_presente(uuid, boolean) to authenticated;

-- 10. Sortear el orden de exponer. Se hace en el servidor y UNA sola vez: queda guardada la hora.
create function public.dia_sortear_orden(p_badulake uuid) returns text
language plpgsql security definer set search_path = '' as $$
declare
  b public.badulakes;
  codigo text;
  e public.dia_estado;
begin
  select * into b from public.badulakes where id = p_badulake for update;
  codigo := public.dia_permitido(b);
  if codigo <> 'ok' then return codigo; end if;
  perform public.dia_sincronizar(b.id, b.organizadora);
  select * into e from public.dia_estado where badulake_id = b.id for update;
  if e.sorteo_orden_en is not null then return 'ya_sorteado'; end if;
  update public.dia_personas p set orden_exponer = r.n
    from (select id, row_number() over (order by random())::int as n
          from public.dia_personas where badulake_id = b.id and presente) r
    where p.id = r.id;
  update public.dia_estado set sorteo_orden_en = now() where badulake_id = b.id;
  return 'ok';
end;
$$;
revoke execute on function public.dia_sortear_orden(uuid) from public, anon;
grant execute on function public.dia_sortear_orden(uuid) to authenticated;

-- 11. Empezar a elegir: se congela la cola (más objetos primero; si empatan, sorteo). Una sola vez.
create function public.dia_empezar_elegir(p_badulake uuid) returns text
language plpgsql security definer set search_path = '' as $$
declare
  b public.badulakes;
  codigo text;
  e public.dia_estado;
begin
  select * into b from public.badulakes where id = p_badulake for update;
  codigo := public.dia_permitido(b);
  if codigo <> 'ok' then return codigo; end if;
  perform public.dia_sincronizar(b.id, b.organizadora);
  select * into e from public.dia_estado where badulake_id = b.id for update;
  if e.elegir_desde is not null then return 'ya_empezado'; end if;
  update public.dia_personas set azar = random() where badulake_id = b.id and presente;
  update public.dia_personas p set orden_elegir = r.n
    from (select id, row_number() over (
            order by (ropa + calzado + accesorios + otros) desc, azar)::int as n
          from public.dia_personas where badulake_id = b.id and presente) r
    where p.id = r.id;
  update public.dia_estado set elegir_desde = now(), turno_actual = 1 where badulake_id = b.id;
  return 'ok';
end;
$$;
revoke execute on function public.dia_empezar_elegir(uuid) from public, anon;
grant execute on function public.dia_empezar_elegir(uuid) to authenticated;

-- 12. Siguiente turno: pasa a quien va después (se salta a quien no ha venido).
create function public.dia_siguiente(p_badulake uuid) returns text
language plpgsql security definer set search_path = '' as $$
declare
  b public.badulakes;
  codigo text;
  e public.dia_estado;
  actual int;
begin
  select * into b from public.badulakes where id = p_badulake for update;
  codigo := public.dia_permitido(b);
  if codigo <> 'ok' then return codigo; end if;
  select * into e from public.dia_estado where badulake_id = b.id for update;
  if e.elegir_desde is null then return 'no_empezado'; end if;
  select min(orden_elegir) into actual from public.dia_personas
    where badulake_id = b.id and presente and orden_elegir >= e.turno_actual;
  if actual is null then return 'terminado'; end if;
  update public.dia_estado set turno_actual = actual + 1 where badulake_id = b.id;
  return 'ok';
end;
$$;
revoke execute on function public.dia_siguiente(uuid) from public, anon;
grant execute on function public.dia_siguiente(uuid) to authenticated;

-- 13. «Tu turno es el 3.º»: lo que ve cada persona apuntada (o la organizadora) de SÍ misma.
create function public.dia_mi_turno(p_badulake uuid) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare
  b public.badulakes;
  yo public.dia_personas;
  e public.dia_estado;
  actual int;
begin
  if auth.uid() is null then return null; end if;
  select * into b from public.badulakes where id = p_badulake;
  if not found or b.estado <> 'publicado' or b.oculto
     or now() < b.fecha_hora - interval '2 hours' or now() > b.fecha_hora + interval '1 day' then
    return null;
  end if;
  select * into yo from public.dia_personas where badulake_id = b.id and persona = auth.uid();
  if not found then return null; end if;
  select * into e from public.dia_estado where badulake_id = b.id;
  select min(orden_elegir) into actual from public.dia_personas
    where badulake_id = b.id and presente and orden_elegir >= e.turno_actual;
  return jsonb_build_object(
    'presente', yo.presente,
    'orden_exponer', yo.orden_exponer,
    'orden_elegir', yo.orden_elegir,
    'turno', case when e.elegir_desde is not null then actual end,
    'elegir_empezado', e.elegir_desde is not null);
end;
$$;
revoke execute on function public.dia_mi_turno(uuid) from public, anon;
grant execute on function public.dia_mi_turno(uuid) to authenticated;

-- 14. Plazo de conservación: todo lo del día (nombres escritos, objetos contados y turnos) se borra
-- 1 día después del badulake, igual que la dirección exacta (D-024). Cron propio, cada noche.
create function public.borrar_dia_caducado() returns void
language plpgsql security definer set search_path = '' as $$
begin
  delete from public.dia_personas d using public.badulakes b
    where b.id = d.badulake_id and b.fecha_hora < now() - interval '1 day';
  delete from public.dia_estado d using public.badulakes b
    where b.id = d.badulake_id and b.fecha_hora < now() - interval '1 day';
end;
$$;
revoke execute on function public.borrar_dia_caducado() from public, anon, authenticated;
select cron.schedule('borrar-dia-caducado', '20 3 * * *', 'select public.borrar_dia_caducado()');
