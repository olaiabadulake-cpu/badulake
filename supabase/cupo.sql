-- Cupo, lista de espera del badulake y cancelación automática (Tarea 20, D-032).
-- Detalle en docs/decisiones.md (D-032), docs/seguridad.md y docs/privacidad.md.
-- Ojo: «lista_espera» (supabase/lista_espera.sql) es la lista de antes del lanzamiento, con correos.
-- La de cada badulake es otra tabla: «espera».

-- 1. Estados. Se guardan «borrador», «publicado» y «cancelado». «Confirmado» NO se guarda: es un
-- badulake publicado con 5 personas apuntadas o más, y se calcula al enseñarlo. Así nunca puede
-- quedarse desfasado si alguien se borra.
alter table public.badulakes drop constraint badulakes_estado_check;
alter table public.badulakes add constraint badulakes_estado_check
  check (estado in ('borrador', 'publicado', 'cancelado'));
alter table public.badulakes
  add column cancelado_en timestamptz,
  add column cancelado_por text check (cancelado_por in ('automatica', 'organizadora'));
grant select (cancelado_en, cancelado_por) on public.badulakes to authenticated;

-- Un badulake cancelado lo siguen viendo quienes lo conocían (para ver el aviso); su dirección se borra.
drop policy "leer_badulakes_publicados" on public.badulakes;
create policy "leer_badulakes_publicados" on public.badulakes
  for select to authenticated using (estado in ('publicado', 'cancelado') and not oculto);

-- 2. Hace falta tiempo para juntar a 5 personas: se crea y se publica con 48 horas de margen como
-- mínimo (si no, la cancelación automática de 24 horas antes lo cancelaría casi en el acto).
create or replace function public.exigir_fecha_futura() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.fecha_hora <= now() + interval '48 hours' then
    raise exception 'Badulake: la fecha debe ser al menos 48 horas después' using errcode = 'check_violation';
  end if;
  return new;
end;
$$;
drop policy "publicar_mi_borrador" on public.badulakes;
create policy "publicar_mi_borrador" on public.badulakes
  for update to authenticated
  using ((select auth.uid()) = organizadora and estado = 'borrador' and not oculto)
  with check (
    (select auth.uid()) = organizadora and estado = 'publicado'
    and fecha_hora > now() + interval '48 hours'
    and not public.estoy_suspendida()
  );

-- 3. Inscripciones: se marca quién ha entrado desde la lista de espera (para su aviso).
alter table public.inscripciones add column desde_espera boolean not null default false;

-- 4. Lista de espera de cada badulake. Cada persona solo ve y borra las suyas; nadie inserta
-- directamente (se entra con apuntarme()). La organizadora no ve quién espera.
create table public.espera (
  badulake_id uuid not null references public.badulakes (id) on delete cascade,
  persona uuid not null references auth.users (id) on delete cascade default auth.uid(),
  creada_en timestamptz not null default clock_timestamp(),
  primary key (badulake_id, persona)
);
create index espera_orden on public.espera (badulake_id, creada_en);
alter table public.espera enable row level security;
revoke all on public.espera from anon, authenticated;
grant select (badulake_id, creada_en), delete on public.espera to authenticated;
create policy "leer_mi_espera" on public.espera
  for select to authenticated using ((select auth.uid()) = persona);
create policy "salir_de_la_espera" on public.espera
  for delete to authenticated using ((select auth.uid()) = persona);

-- Mi puesto en cada lista en la que estoy (1 = la primera). Solo los míos; no dice nada de nadie.
-- Las cuentas suspendidas no cuentan: nunca van a entrar.
create function public.mi_espera(p_ids uuid[])
returns table (badulake_id uuid, puesto int)
language sql stable security definer set search_path = '' as $$
  select m.badulake_id,
         (select count(*)::int from public.espera e
            where e.badulake_id = m.badulake_id
              and (e.creada_en, e.persona) <= (m.creada_en, m.persona)
              and not exists (select 1 from public.suspendidas s where s.persona = e.persona))
  from public.espera m
  where auth.uid() is not null and m.persona = auth.uid() and m.badulake_id = any (p_ids);
$$;
revoke execute on function public.mi_espera(uuid[]) from public, anon;
grant execute on function public.mi_espera(uuid[]) to authenticated;

-- 5. Rellenar las plazas libres con las primeras de la lista. Solo la usan las funciones de abajo,
-- siempre con el badulake ya bloqueado (for update): mientras tanto nadie más puede apuntarse.
create function public.rellenar_desde_espera(p_badulake uuid) returns void
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
  libres := b.plazas - (select count(*) from public.inscripciones where badulake_id = b.id);
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

-- Cuando alguien se borra (o se borra su cuenta), entra la primera de la lista, en la misma operación.
create function public.al_borrarse() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  perform public.rellenar_desde_espera(old.badulake_id);
  return null;
end;
$$;
revoke execute on function public.al_borrarse() from public, anon, authenticated;
create trigger al_borrarse
  after delete on public.inscripciones
  for each row execute function public.al_borrarse();

-- 6. Apuntarme. Devuelve: 'ok', 'en_espera' (no quedaban plazas: estás en la lista),
-- 'organizadora', 'no_disponible' (pasado, cancelado u oculto) o 'suspendida'.
-- Una cuenta suspendida no puede apuntarse ni ponerse en la lista de espera.
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
  if ocupadas >= b.plazas then
    insert into public.espera (badulake_id, persona) values (b.id, yo);
    return 'en_espera';
  end if;
  insert into public.inscripciones (badulake_id, persona) values (b.id, yo);
  return 'ok';
end;
$$;

-- 7. Cancelar. La dirección exacta se borra en el acto: ya no sirve para nada (D-024).
create function public.cancelar(p_badulake uuid, p_por text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  update public.badulakes
    set estado = 'cancelado', cancelado_en = now(), cancelado_por = p_por
    where id = p_badulake and estado = 'publicado';
  if found then
    delete from public.badulakes_direccion where badulake_id = p_badulake;
  end if;
end;
$$;
revoke execute on function public.cancelar(uuid, text) from public, anon, authenticated;

-- La organizadora cancela el suyo (publicado y aún no empezado). Devuelve 'ok' o 'no_disponible'.
create function public.cancelar_mi_badulake(p_badulake uuid) returns text
language plpgsql security definer set search_path = '' as $$
declare
  b public.badulakes;
begin
  if auth.uid() is null then
    raise exception 'Badulake: hace falta iniciar sesión' using errcode = 'insufficient_privilege';
  end if;
  select * into b from public.badulakes where id = p_badulake for update;
  if not found or b.organizadora <> auth.uid() or b.estado <> 'publicado' or b.fecha_hora <= now() then
    return 'no_disponible';
  end if;
  perform public.cancelar(b.id, 'organizadora');
  return 'ok';
end;
$$;
revoke execute on function public.cancelar_mi_badulake(uuid) from public, anon;
grant execute on function public.cancelar_mi_badulake(uuid) to authenticated;

-- Cancelación automática: a 24 horas o menos del inicio, si hay menos de 5 apuntadas.
create function public.cancelar_sin_minimo() returns int
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
    if (select count(*) from public.inscripciones where badulake_id = b.id) < 5 then
      perform public.cancelar(b.id, 'automatica');
      total := total + 1;
    end if;
  end loop;
  return total;
end;
$$;
revoke execute on function public.cancelar_sin_minimo() from public, anon, authenticated;

-- Tarea programada (Supabase Cron, plan gratuito): cada 10 minutos.
select cron.schedule('cancelar-sin-minimo', '*/10 * * * *', 'select public.cancelar_sin_minimo()');

-- 8. La dirección exacta: solo la organizadora y quien esté apuntada (no quien esté en espera).
-- La de un cancelado ya está borrada; se comprueba también por si acaso.
create or replace function public.badulake_oculto(p_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce((select oculto or estado = 'cancelado' from public.badulakes where id = p_id), false);
$$;

-- 9. Plazas ocupadas: también de los cancelados (para sus avisos).
create or replace function public.plazas_ocupadas(p_ids uuid[])
returns table (badulake_id uuid, ocupadas int)
language sql stable security definer set search_path = '' as $$
  select i.badulake_id, count(*)::int
  from public.inscripciones i
  join public.badulakes b on b.id = i.badulake_id
  where auth.uid() is not null
    and i.badulake_id = any (p_ids)
    and ((b.estado in ('publicado', 'cancelado') and not b.oculto) or b.organizadora = auth.uid())
  group by i.badulake_id;
$$;

-- 10. Plazos: la lista de espera de un badulake se borra en cuanto empieza (ya no sirve).
create or replace function public.borrar_datos_caducados() returns void
language plpgsql security definer set search_path = '' as $$
begin
  delete from public.badulakes_direccion d
    using public.badulakes b
    where b.id = d.badulake_id and b.fecha_hora < now() - interval '1 day';
  delete from public.espera e
    using public.badulakes b
    where b.id = e.badulake_id and b.fecha_hora < now();
  -- Las inscripciones (y lo que quede en espera) se borran con su badulake (on delete cascade).
  delete from public.badulakes where fecha_hora < now() - interval '30 days';
  delete from public.lista_espera where creado_en < now() - interval '12 months';
  delete from auth.sessions where coalesce(updated_at, created_at) < now() - interval '90 days';
  delete from auth.audit_log_entries where created_at < now() - interval '30 days';
end;
$$;
