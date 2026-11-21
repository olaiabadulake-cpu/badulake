-- Avisos en el móvil (Tarea 16.1, D-050). SOLO EN LA COPIA DE PRUEBAS hasta que la Asesoría lo vea
-- (docs/privacidad.md §2.8 y §9). En la web real NO se ejecuta.
-- Tres avisos: el día antes de un badulake, al entrar desde la lista de espera y cuando se cancela.
-- Quien los quiere los activa en «Tu cuenta», en cada móvil. Nadie ve las suscripciones de nadie.

create extension if not exists pg_net;

-- 1. Suscripciones: una por móvil (lo que da el navegador para poder enviarle avisos).
create table public.push_suscripciones (
  id uuid primary key default gen_random_uuid(),
  persona uuid not null default auth.uid() references auth.users (id) on delete cascade,
  endpoint text not null unique check (endpoint ~ '^https://' and char_length(endpoint) < 1000),
  p256dh text not null check (char_length(p256dh) < 200),
  auth text not null check (char_length(auth) < 100),
  creada_en timestamptz not null default now()
);
alter table public.push_suscripciones enable row level security;
revoke all on public.push_suscripciones from anon, authenticated;
grant select (id, endpoint, creada_en), insert (endpoint, p256dh, auth), delete on public.push_suscripciones to authenticated;
create policy "ver_mis_suscripciones" on public.push_suscripciones
  for select to authenticated using ((select auth.uid()) = persona);
create policy "crear_mi_suscripcion" on public.push_suscripciones
  for insert to authenticated with check ((select auth.uid()) = persona and not public.estoy_suspendida());
create policy "borrar_mi_suscripcion" on public.push_suscripciones
  for delete to authenticated using ((select auth.uid()) = persona);

-- 2. Cola de avisos por enviar. Nadie la lee desde fuera; se vacía al enviar.
create table public.avisos_cola (
  id bigserial primary key,
  persona uuid not null references auth.users (id) on delete cascade,
  tipo text not null check (tipo in ('recordatorio', 'desde_espera', 'cancelado')),
  badulake_id uuid not null,
  creado_en timestamptz not null default now(),
  unique (persona, tipo, badulake_id)
);
alter table public.avisos_cola enable row level security;
revoke all on public.avisos_cola from anon, authenticated;

create function public.avisos_encolar(p_persona uuid, p_tipo text, p_badulake uuid) returns void
language sql security definer set search_path = '' as $$
  insert into public.avisos_cola (persona, tipo, badulake_id)
  select p_persona, p_tipo, p_badulake
  where exists (select 1 from public.push_suscripciones s where s.persona = p_persona)
  on conflict do nothing;
$$;
revoke execute on function public.avisos_encolar(uuid, text, uuid) from public, anon, authenticated;

-- Entra desde la lista de espera.
create function public.avisos_al_entrar() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.desde_espera then perform public.avisos_encolar(new.persona, 'desde_espera', new.badulake_id); end if;
  return null;
end;
$$;
revoke execute on function public.avisos_al_entrar() from public, anon, authenticated;
create trigger avisos_al_entrar after insert on public.inscripciones
  for each row execute function public.avisos_al_entrar();

-- Se cancela: a las apuntadas y a quien estaba en la lista de espera.
create function public.avisos_al_cancelar() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if old.estado = 'publicado' and new.estado = 'cancelado' then
    perform public.avisos_encolar(i.persona, 'cancelado', new.id) from public.inscripciones i where i.badulake_id = new.id;
    perform public.avisos_encolar(e.persona, 'cancelado', new.id) from public.espera e where e.badulake_id = new.id;
  end if;
  return null;
end;
$$;
revoke execute on function public.avisos_al_cancelar() from public, anon, authenticated;
create trigger avisos_al_cancelar after update of estado on public.badulakes
  for each row execute function public.avisos_al_cancelar();

-- El día antes (entre 23 y 25 horas antes): a las apuntadas y a la organizadora. Cada hora.
create function public.avisos_recordatorios() returns void
language plpgsql security definer set search_path = '' as $$
declare
  b public.badulakes;
begin
  for b in select * from public.badulakes
    where estado = 'publicado' and not oculto
      and fecha_hora between now() + interval '23 hours' and now() + interval '25 hours'
  loop
    perform public.avisos_encolar(b.organizadora, 'recordatorio', b.id);
    perform public.avisos_encolar(i.persona, 'recordatorio', b.id) from public.inscripciones i where i.badulake_id = b.id;
  end loop;
end;
$$;
revoke execute on function public.avisos_recordatorios() from public, anon, authenticated;
select cron.schedule('avisos-recordatorios', '10 * * * *', 'select public.avisos_recordatorios()');

-- 3. Envío. Cada 2 minutos, si hay algo en la cola, la base de datos llama a la web con una «ficha»
-- de un solo uso y válida 5 minutos. La web la devuelve para recoger los avisos. Así no hace falta
-- ninguna clave compartida: sin ficha válida, la web no puede leer nada.
create table public.avisos_ajustes (id int primary key default 1 check (id = 1), url text not null);
alter table public.avisos_ajustes enable row level security;
revoke all on public.avisos_ajustes from anon, authenticated;
insert into public.avisos_ajustes (url) values ('https://badulake-pruebas.vercel.app/api/avisos/enviar');

create table public.avisos_fichas (
  ficha uuid primary key default gen_random_uuid(),
  creada_en timestamptz not null default now(),
  usada_en timestamptz
);
alter table public.avisos_fichas enable row level security;
revoke all on public.avisos_fichas from anon, authenticated;

create function public.avisos_despachar() returns void
language plpgsql security definer set search_path = '' as $$
declare
  f uuid;
begin
  delete from public.avisos_fichas where creada_en < now() - interval '1 day';
  delete from public.avisos_cola where creado_en < now() - interval '2 days';
  if not exists (select 1 from public.avisos_cola) then return; end if;
  insert into public.avisos_fichas default values returning ficha into f;
  perform net.http_post(
    url := (select url from public.avisos_ajustes),
    body := jsonb_build_object('ficha', f),
    headers := '{"Content-Type": "application/json"}'::jsonb
  );
end;
$$;
revoke execute on function public.avisos_despachar() from public, anon, authenticated;
select cron.schedule('avisos-despachar', '*/2 * * * *', 'select public.avisos_despachar()');

-- La web recoge los avisos con la ficha (una sola vez). Devuelve a qué móviles, qué y en qué idioma.
create or replace function public.avisos_tomar(p_ficha uuid)
returns table (suscripcion uuid, endpoint text, p256dh text, auth text, tipo text,
               badulake_id uuid, titulo text, idioma text)
language plpgsql security definer set search_path = '' as $$
begin
  update public.avisos_fichas set usada_en = now()
    where ficha = p_ficha and usada_en is null and creada_en > now() - interval '5 minutes';
  if not found then return; end if;
  return query
    with tomados as (delete from public.avisos_cola c where c.id is not null returning c.persona, c.tipo, c.badulake_id)
    select s.id, s.endpoint, s.p256dh, s.auth, t.tipo, t.badulake_id, b.titulo, coalesce(p.idioma, 'es')
    from tomados t
    join public.push_suscripciones s on s.persona = t.persona
    left join public.badulakes b on b.id = t.badulake_id
    left join public.perfiles p on p.id = t.persona;
end;
$$;
revoke execute on function public.avisos_tomar(uuid) from public;
grant execute on function public.avisos_tomar(uuid) to anon, authenticated;

-- Si un móvil ya no existe (el servicio de avisos dice 404/410), se borra su suscripción. Solo con
-- una ficha usada en los últimos 10 minutos.
create function public.avisos_quitar(p_ficha uuid, p_ids uuid[]) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if exists (select 1 from public.avisos_fichas where ficha = p_ficha and usada_en > now() - interval '10 minutes') then
    delete from public.push_suscripciones where id = any (p_ids);
  end if;
end;
$$;
revoke execute on function public.avisos_quitar(uuid, uuid[]) from public;
grant execute on function public.avisos_quitar(uuid, uuid[]) to anon, authenticated;
