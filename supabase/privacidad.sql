-- Privacidad (Tarea 9, D-024). Ejecutado el 19/11/2026. Detalle en docs/privacidad.md.

-- 1. Minimización: nadie más ve QUIÉN organiza un badulake ni a quién pertenece una dirección.
-- Antes, cualquier persona con sesión podía leer el identificador de la organizadora de los
-- badulakes publicados (y quien se apuntaba, el de la dirección): con él se podía saber qué
-- badulakes organiza la misma persona. Ahora se leen todas las columnas menos esa.
-- Las reglas (RLS) siguen usando la columna por dentro, así que todo funciona igual.
revoke select on public.badulakes from authenticated;
grant select (id, titulo, descripcion, fecha_hora, zona, plazas, estado, creado_en)
  on public.badulakes to authenticated;
revoke select on public.badulakes_direccion from authenticated;
grant select (badulake_id, direccion) on public.badulakes_direccion to authenticated;

-- Para que la web sepa cuáles son los tuyos (y te enseñe «Lo organizas tú» y el botón de
-- publicar) sin ver la organizadora de los demás: devuelve solo tus propios badulakes.
create function public.mis_badulakes()
returns setof uuid
language sql stable security definer set search_path = '' as $$
  select id from public.badulakes where organizadora = auth.uid();
$$;
revoke execute on function public.mis_badulakes() from public, anon;
grant execute on function public.mis_badulakes() to authenticated;

-- 2. Plazos de conservación (decididos por OlaIA el 19/11/2026). Se borran solos cada noche:
--    · dirección exacta de un badulake: 1 día después de celebrarse;
--    · el badulake y sus inscripciones (quién se apuntó): 30 días después de celebrarse;
--    · lista de espera: 12 meses desde el alta como máximo;
--    · sesiones abandonadas (sin usarse en 90 días) y el registro de accesos de Supabase Auth
--      (guarda la dirección IP), a los 30 días.
create function public.borrar_datos_caducados() returns void
language plpgsql security definer set search_path = '' as $$
begin
  delete from public.badulakes_direccion d
    using public.badulakes b
    where b.id = d.badulake_id and b.fecha_hora < now() - interval '1 day';
  -- Las inscripciones se borran con su badulake (on delete cascade).
  delete from public.badulakes where fecha_hora < now() - interval '30 days';
  delete from public.lista_espera where creado_en < now() - interval '12 months';
  delete from auth.sessions where coalesce(updated_at, created_at) < now() - interval '90 days';
  delete from auth.audit_log_entries where created_at < now() - interval '30 days';
end;
$$;
revoke execute on function public.borrar_datos_caducados() from public, anon, authenticated;

-- Tarea programada (Supabase Cron, incluido en el plan gratuito): cada noche a las 03:15 UTC.
create extension if not exists pg_cron with schema pg_catalog;
select cron.schedule('borrar-datos-caducados', '15 3 * * *', 'select public.borrar_datos_caducados()');
