-- Entrar con Google (Tarea 4.1, D-039). Detalle en docs/decisiones.md, docs/seguridad.md y docs/privacidad.md.
-- Google no dice la edad. Una cuenta nueva que llega desde Google nace «pendiente» (sin la fecha de
-- mayoría de edad comprobada) y la base de datos no le deja hacer nada hasta que confirme su fecha de
-- nacimiento en la web. La fecha, igual que en el registro con correo, no se guarda.
-- Además, de lo que manda Google solo se queda lo imprescindible para entrar: ni nombre ni foto.

-- 1. La fecha de mayoría de edad puede estar vacía (cuenta de Google pendiente).
alter table public.perfiles alter column mayoria_edad_comprobada_en drop not null;

-- 2. Antes de crear una cuenta: con correo y contraseña hace falta la fecha (como hasta ahora);
-- desde Google se deja crear, pero pendiente. Cualquier otra forma de entrar se rechaza.
create or replace function public.comprobar_mayoria_edad() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  nacimiento date;
begin
  if new.raw_user_meta_data ? 'fecha_nacimiento' then
    begin
      nacimiento := (new.raw_user_meta_data ->> 'fecha_nacimiento')::date;
    exception when others then
      nacimiento := null;
    end;
    if nacimiento is null or nacimiento > (current_date - interval '18 years')::date then
      raise exception 'Badulake: solo mayores de 18 años' using errcode = 'check_violation';
    end if;
    new.raw_user_meta_data := new.raw_user_meta_data - 'fecha_nacimiento';
  elsif coalesce(new.raw_app_meta_data ->> 'provider', '') <> 'google' then
    raise exception 'Badulake: solo mayores de 18 años' using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

-- 3. Después de crear la cuenta: su perfil. Si viene de Google, sin la fecha de mayoría de edad.
create or replace function public.crear_perfil() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  lengua text := coalesce(new.raw_user_meta_data ->> 'idioma', 'es');
  de_google boolean := coalesce(new.raw_app_meta_data ->> 'provider', '') = 'google';
begin
  if char_length(lengua) not between 2 and 12 then
    lengua := 'es';
  end if;
  insert into public.perfiles (id, idioma, mayoria_edad_comprobada_en)
  values (new.id, lengua, case when de_google then null else now() end);
  return new;
end;
$$;

-- 4. ¿Tengo la edad sin confirmar? (solo una cuenta de Google que aún no ha dado su fecha)
create function public.edad_pendiente() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.perfiles where id = auth.uid() and mayoria_edad_comprobada_en is null
  );
$$;
revoke execute on function public.edad_pendiente() from public, anon;
grant execute on function public.edad_pendiente() to authenticated;

-- 5. Una cuenta pendiente cuenta como suspendida: así la frenan, sin cambiar nada más, todos los
-- sitios que ya frenan a las suspendidas (crear y publicar badulakes, apuntarse, denunciar, el día
-- del badulake…).
create or replace function public.estoy_suspendida() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.suspendidas where persona = auth.uid())
      or public.edad_pendiente();
$$;

-- 6. Y además no puede ver badulakes ni marcar «Me interesa» (reglas que se suman a las de siempre).
create policy "edad_confirmada" on public.badulakes as restrictive
  for all to authenticated using (not (select public.edad_pendiente())) with check (not (select public.edad_pendiente()));
create policy "edad_confirmada" on public.interes as restrictive
  for all to authenticated using (not (select public.edad_pendiente())) with check (not (select public.edad_pendiente()));
create policy "edad_confirmada" on public.badulakes_direccion as restrictive
  for all to authenticated using (not (select public.edad_pendiente()));

-- 7. Confirmar la edad (la llama la web con la fecha que escribe la persona). Devuelve:
--   'ok'    → mayor de 18: la cuenta queda lista (la fecha no se guarda, solo cuándo se comprobó);
--   'fecha' → la fecha no es válida;
--   'menor' → menor de 18: se borra la cuenta en el acto.
create function public.confirmar_mayoria_edad(p_fecha date, p_idioma text) returns text
language plpgsql security definer set search_path = '' as $$
declare
  yo uuid := auth.uid();
begin
  if yo is null then
    raise exception 'Badulake: hace falta iniciar sesión' using errcode = 'insufficient_privilege';
  end if;
  if not exists (select 1 from public.perfiles where id = yo and mayoria_edad_comprobada_en is null) then
    return 'ok';
  end if;
  if p_fecha is null or p_fecha < date '1900-01-01' or p_fecha > current_date then
    return 'fecha';
  end if;
  if p_fecha > (current_date - interval '18 years')::date then
    delete from auth.users where id = yo;
    return 'menor';
  end if;
  update public.perfiles
     set mayoria_edad_comprobada_en = now(),
         idioma = case when char_length(coalesce(p_idioma, '')) between 2 and 12 then p_idioma else idioma end
   where id = yo;
  return 'ok';
end;
$$;
revoke execute on function public.confirmar_mayoria_edad(date, text) from public, anon;
grant execute on function public.confirmar_mayoria_edad(date, text) to authenticated;

-- 8. Una cuenta de Google que no termina (no da su fecha) se borra sola a las 24 horas.
create function public.borrar_cuentas_sin_edad() returns void
language sql security definer set search_path = '' as $$
  delete from auth.users u
   using public.perfiles p
   where p.id = u.id
     and p.mayoria_edad_comprobada_en is null
     and p.creado_en < now() - interval '24 hours';
$$;
revoke execute on function public.borrar_cuentas_sin_edad() from public, anon, authenticated;
select cron.schedule('borrar-cuentas-sin-edad', '40 * * * *', 'select public.borrar_cuentas_sin_edad()');

-- 9. Datos mínimos: de lo que manda Google solo se guarda lo necesario para entrar (su código de
-- cuenta y el correo). El nombre y la foto se tiran antes de guardar, también cada vez que se entra.
create function public.solo_datos_minimos() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if tg_table_name = 'users' then
    new.raw_user_meta_data := coalesce((
      select jsonb_object_agg(k, v) from jsonb_each(coalesce(new.raw_user_meta_data, '{}'::jsonb)) as e(k, v)
       where k in ('idioma', 'fecha_nacimiento', 'sub', 'email', 'email_verified', 'phone_verified')
    ), '{}'::jsonb);
  else
    new.identity_data := coalesce((
      select jsonb_object_agg(k, v) from jsonb_each(coalesce(new.identity_data, '{}'::jsonb)) as e(k, v)
       where k in ('sub', 'email', 'email_verified', 'phone_verified', 'iss', 'provider_id')
    ), '{}'::jsonb);
  end if;
  return new;
end;
$$;
revoke execute on function public.solo_datos_minimos() from public, anon, authenticated;
create trigger guardar_solo_datos_minimos
  before insert or update on auth.users
  for each row execute function public.solo_datos_minimos();
create trigger guardar_solo_datos_minimos
  before insert or update on auth.identities
  for each row execute function public.solo_datos_minimos();
