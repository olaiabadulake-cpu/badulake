-- «Quiero organizar» (Tarea 5.4, D-045). Quien aún no puede organizar (D-038) puede pedirlo al
-- equipo con un botón. El equipo ve las peticiones en /equipo SIN el correo (solo desde cuándo y en
-- qué idioma) y da el permiso o la descarta con un botón. Nadie lee ni escribe la tabla desde fuera.

create table public.solicitudes_organizar (
  id uuid primary key default gen_random_uuid(),
  persona uuid not null unique references auth.users (id) on delete cascade,
  creada_en timestamptz not null default now()
);
alter table public.solicitudes_organizar enable row level security;
revoke all on public.solicitudes_organizar from anon, authenticated;

-- Pedirlo. Devuelve 'ok', 'ya_pedido', 'ya_puedes' o 'suspendida'.
create function public.quiero_organizar() returns text
language plpgsql security definer set search_path = '' as $$
declare
  yo uuid := auth.uid();
begin
  if yo is null then
    raise exception 'Badulake: hace falta iniciar sesión' using errcode = 'insufficient_privilege';
  end if;
  if public.estoy_suspendida() then return 'suspendida'; end if;
  if public.puedo_organizar() then return 'ya_puedes'; end if;
  insert into public.solicitudes_organizar (persona) values (yo) on conflict (persona) do nothing;
  return case when found then 'ok' else 'ya_pedido' end;
end;
$$;
revoke execute on function public.quiero_organizar() from public, anon;
grant execute on function public.quiero_organizar() to authenticated;

-- ¿Ya lo he pedido? Solo lo mío.
create function public.he_pedido_organizar() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.solicitudes_organizar where persona = auth.uid());
$$;
revoke execute on function public.he_pedido_organizar() from public, anon;
grant execute on function public.he_pedido_organizar() to authenticated;

-- Para el equipo: las peticiones abiertas, sin correo ni nombre.
create function public.equipo_solicitudes()
returns table (id uuid, creada_en timestamptz, idioma text)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.soy_equipo() then
    raise exception 'Badulake: solo el equipo' using errcode = 'insufficient_privilege';
  end if;
  return query
    select s.id, s.creada_en, p.idioma
    from public.solicitudes_organizar s
    left join public.perfiles p on p.id = s.persona
    order by s.creada_en;
end;
$$;
revoke execute on function public.equipo_solicitudes() from public, anon;
grant execute on function public.equipo_solicitudes() to authenticated;

-- El equipo da el permiso (como en /equipo con el correo, D-038) o descarta la petición.
-- En los dos casos la petición se borra. Devuelve 'ok' o 'no_existe'.
create function public.equipo_resolver_solicitud(p_id uuid, p_dar boolean) returns text
language plpgsql security definer set search_path = '' as $$
declare
  quien uuid;
begin
  if not public.soy_equipo() then
    raise exception 'Badulake: solo el equipo' using errcode = 'insufficient_privilege';
  end if;
  delete from public.solicitudes_organizar where id = p_id returning persona into quien;
  if quien is null then return 'no_existe'; end if;
  if p_dar then
    insert into public.permiso_organizar (persona, origen) values (quien, 'equipo')
      on conflict (persona) do nothing;
  end if;
  return 'ok';
end;
$$;
revoke execute on function public.equipo_resolver_solicitud(uuid, boolean) from public, anon;
grant execute on function public.equipo_resolver_solicitud(uuid, boolean) to authenticated;

-- Si la persona ya puede organizar (ha ido a un badulake), su petición sobra: se borra sola con la
-- limpieza de cada noche (Supabase Cron, 03:20). También las de más de 6 meses.
create function public.limpiar_solicitudes_organizar() returns void
language sql security definer set search_path = '' as $$
  delete from public.solicitudes_organizar s
  where exists (select 1 from public.permiso_organizar o where o.persona = s.persona)
     or s.creada_en < now() - interval '6 months';
$$;
revoke execute on function public.limpiar_solicitudes_organizar() from public, anon, authenticated;
select cron.schedule('limpiar-solicitudes-organizar', '20 3 * * *', 'select public.limpiar_solicitudes_organizar()');
