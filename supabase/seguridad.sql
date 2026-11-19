-- Seguridad (Tarea 8, D-023). Ejecutado el 19/11/2026. Detalle en docs/seguridad.md.

-- 1. La función de la hora (Tarea 2) no tenía fijada la ruta de búsqueda (aviso del Security Advisor).
alter function public.hora_actual() set search_path = '';

-- 2. La vista de plazas ocupadas funcionaba con los permisos de su dueño (aviso del Security
-- Advisor). Se cambia por una función que devuelve lo mismo: solo un número por badulake,
-- de los publicados o de los propios, y solo con sesión.
drop view public.badulakes_ocupadas;
create function public.plazas_ocupadas(p_ids uuid[])
returns table (badulake_id uuid, ocupadas int)
language sql stable security definer set search_path = '' as $$
  select i.badulake_id, count(*)::int
  from public.inscripciones i
  join public.badulakes b on b.id = i.badulake_id
  where auth.uid() is not null
    and i.badulake_id = any (p_ids)
    and (b.estado = 'publicado' or b.organizadora = auth.uid())
  group by i.badulake_id;
$$;
revoke execute on function public.plazas_ocupadas(uuid[]) from public, anon;
grant execute on function public.plazas_ocupadas(uuid[]) to authenticated;

-- 3. Un borrador con fecha ya pasada no se puede publicar.
drop policy "publicar_mi_borrador" on public.badulakes;
create policy "publicar_mi_borrador" on public.badulakes
  for update to authenticated
  using ((select auth.uid()) = organizadora and estado = 'borrador')
  with check ((select auth.uid()) = organizadora and estado = 'publicado' and fecha_hora > now());

-- 4. Lo que se cree en el futuro empieza cerrado: sin permisos para la clave pública ni para
-- las sesiones hasta que un script los dé expresamente (como hacen todos los de supabase/).
alter default privileges for role postgres in schema public
  revoke all on tables from anon, authenticated;
alter default privileges for role postgres in schema public
  revoke all on sequences from anon, authenticated;
alter default privileges for role postgres in schema public
  revoke execute on functions from public, anon, authenticated;

-- 5. La regla de la lista de espera aceptaba cualquier cosa (aviso «RLS Policy Always True»).
-- Ahora la base de datos también comprueba que el correo tenga forma de correo y que la fecha
-- del consentimiento sea de ahora mismo.
drop policy "solo_alta_anonima" on public.lista_espera;
create policy "solo_alta_anonima" on public.lista_espera for insert to anon
  with check (
    email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]{2,}$'
    and consentimiento_en between now() - interval '1 hour' and now() + interval '5 minutes'
  );

-- 6. Supabase crea por su cuenta la función rls_auto_enable (activa RLS en las tablas nuevas).
-- Solo la usa la base de datos: nadie tiene por qué poder llamarla desde fuera.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
