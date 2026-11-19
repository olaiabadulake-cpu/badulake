-- Contador para el equipo (Tarea 15, D-029). Solo números agregados: ningún dato personal.
-- La función comprueba soy_equipo() antes de contar; el resto de la gente recibe un error.
create function public.equipo_contador()
returns table (
  cuentas int, activas_30d int, badulakes_publicados int, inscripciones int, lista_espera int
)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.soy_equipo() then
    raise exception 'Badulake: solo el equipo' using errcode = 'insufficient_privilege';
  end if;
  return query select
    (select count(*)::int from auth.users),
    -- «Activa» = ha entrado o ha usado su sesión en los últimos 30 días.
    (select count(*)::int from auth.users u
       where u.last_sign_in_at >= now() - interval '30 days'
          or exists (select 1 from auth.sessions s
                       where s.user_id = u.id and coalesce(s.refreshed_at, s.updated_at, s.created_at) >= now() - interval '30 days')),
    (select count(*)::int from public.badulakes where estado = 'publicado' and not oculto),
    (select count(*)::int from public.inscripciones),
    (select count(*)::int from public.lista_espera);
end $$;
revoke execute on function public.equipo_contador() from public, anon;
grant execute on function public.equipo_contador() to authenticated;
