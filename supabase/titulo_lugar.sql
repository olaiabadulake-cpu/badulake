-- El título de un badulake es el lugar (Tarea 5.1, D-037). Ejecutado el 20/11/2026.
-- Nadie escribe el título: la base de datos lo forma con barrio, ciudad y provincia, así que
-- ningún badulake puede titularse por un tema («ropa infantil», «plantas»…).
--   «Badulake de Gràcia, Barcelona»  (si la provincia es igual que la ciudad, no se repite)
--   «Badulake de Deusto, Bilbao (Bizkaia)»
-- `zona` sigue siendo el barrio (lo usan el listado, las denuncias y la lista de espera).

-- 1. El título formado cabe hasta 12 + 40 + 2 + 40 + 3 + 30 + 1 = 128 caracteres.
alter table public.badulakes drop constraint badulakes_titulo_check;
alter table public.badulakes add constraint badulakes_titulo_check
  check (char_length(btrim(titulo)) between 3 and 130);

-- 2. Crear un badulake con el lugar en vez del título libre. Se sustituye la función de D-020
-- (con la comprobación de cuenta suspendida de D-027).
drop function public.crear_badulake(text, text, timestamp, text, text, smallint);
create function public.crear_badulake(
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
revoke execute on function public.crear_badulake(text, text, text, text, timestamp, text, smallint)
  from public, anon;
grant execute on function public.crear_badulake(text, text, text, text, timestamp, text, smallint)
  to authenticated;
