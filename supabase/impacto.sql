-- Contador de impacto en la portada (Tarea 15.1, D-047): cuántos objetos han tenido una segunda
-- vida y en cuántos badulakes. Sale de los objetos contados en el Modo badulake (D-036).
-- Solo números por badulake, sin personas, sin nombres y sin enlace a nadie: se guardan aparte
-- porque lo del día se borra al día siguiente (D-024). Se puede leer sin cuenta (solo los totales).

create table public.impacto (
  badulake_id uuid primary key,          -- sin referencia: el número sigue aunque el badulake se borre
  objetos int not null check (objetos >= 0),
  personas int not null check (personas >= 0),
  registrado_en timestamptz not null default now()
);
alter table public.impacto enable row level security;
revoke all on public.impacto from anon, authenticated;

-- Apunta (o actualiza) los totales de los badulakes que ya han terminado (2 horas después de
-- empezar) y usaron el Modo badulake: objetos aportados por las personas que vinieron.
create function public.registrar_impacto() returns void
language sql security definer set search_path = '' as $$
  insert into public.impacto (badulake_id, objetos, personas)
  select b.id,
         coalesce(sum(p.ropa + p.calzado + p.accesorios + p.otros) filter (where p.presente), 0),
         count(*) filter (where p.presente)
  from public.badulakes b
  join public.dia_personas p on p.badulake_id = b.id
  where b.estado = 'publicado' and not b.oculto and b.fecha_hora + interval '2 hours' <= now()
  group by b.id
  on conflict (badulake_id) do update
    set objetos = excluded.objetos, personas = excluded.personas, registrado_en = now();
$$;
revoke execute on function public.registrar_impacto() from public, anon, authenticated;
select cron.schedule('registrar-impacto', '5,35 * * * *', 'select public.registrar_impacto()');

-- Antes de borrar lo del día, se apunta por última vez (misma función de dia.sql, con esa línea más).
create or replace function public.borrar_dia_caducado() returns void
language plpgsql security definer set search_path = '' as $$
begin
  perform public.registrar_impacto();
  delete from public.dia_personas d using public.badulakes b
    where b.id = d.badulake_id and b.fecha_hora < now() - interval '1 day';
  delete from public.dia_estado d using public.badulakes b
    where b.id = d.badulake_id and b.fecha_hora < now() - interval '1 day';
end;
$$;
revoke execute on function public.borrar_dia_caducado() from public, anon, authenticated;

-- Los totales, para la portada. Solo dos números; cualquiera puede leerlos.
create function public.impacto_total()
returns table (objetos bigint, badulakes bigint)
language sql stable security definer set search_path = '' as $$
  select coalesce(sum(objetos), 0)::bigint, count(*) filter (where objetos > 0)::bigint from public.impacto;
$$;
revoke execute on function public.impacto_total() from public;
grant execute on function public.impacto_total() to anon, authenticated;
