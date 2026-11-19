-- Cuentas de Badulake (Tarea 4): perfiles y comprobación de los 18 años. Ejecutado el 19/11/2026.
-- Las cuentas (correo y contraseña) las guarda Supabase Auth en auth.users.
-- Aquí solo se guarda lo imprescindible de cada persona; la fecha de nacimiento NO se guarda.

-- 1. Perfil: una fila por cuenta. Se borra sola si se borra la cuenta.
create table public.perfiles (
  id uuid primary key references auth.users (id) on delete cascade,
  idioma text not null default 'es' check (char_length(idioma) between 2 and 12),
  mayoria_edad_comprobada_en timestamptz not null default now(),
  creado_en timestamptz not null default now()
);

-- Seguridad por filas (RLS): cada persona solo puede leer y cambiar SU fila.
-- Sin sesión (anon) no se puede nada. Nadie puede crear ni borrar filas desde fuera.
alter table public.perfiles enable row level security;
revoke all on public.perfiles from anon, authenticated;
grant select on public.perfiles to authenticated;
grant update (idioma) on public.perfiles to authenticated;
create policy "leer_mi_perfil" on public.perfiles
  for select to authenticated using ((select auth.uid()) = id);
create policy "cambiar_mi_perfil" on public.perfiles
  for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- 2. Antes de crear una cuenta: comprobar 18 años y borrar la fecha de nacimiento.
-- Así se cumple aunque alguien se salte la web y llame a Supabase directamente.
create function public.comprobar_mayoria_edad() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  nacimiento date;
begin
  begin
    nacimiento := (new.raw_user_meta_data ->> 'fecha_nacimiento')::date;
  exception when others then
    nacimiento := null;
  end;
  if nacimiento is null or nacimiento > (current_date - interval '18 years')::date then
    raise exception 'Badulake: solo mayores de 18 años' using errcode = 'check_violation';
  end if;
  new.raw_user_meta_data := new.raw_user_meta_data - 'fecha_nacimiento';
  return new;
end;
$$;
create trigger antes_de_crear_cuenta
  before insert on auth.users
  for each row execute function public.comprobar_mayoria_edad();

-- 3. Después de crear una cuenta: crear su perfil con el idioma elegido.
create function public.crear_perfil() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  lengua text := coalesce(new.raw_user_meta_data ->> 'idioma', 'es');
begin
  if char_length(lengua) not between 2 and 12 then
    lengua := 'es';
  end if;
  insert into public.perfiles (id, idioma) values (new.id, lengua);
  return new;
end;
$$;
create trigger despues_de_crear_cuenta
  after insert on auth.users
  for each row execute function public.crear_perfil();

-- Las dos funciones solo las usa la base de datos, nadie puede llamarlas desde fuera.
revoke execute on function public.comprobar_mayoria_edad() from public, anon, authenticated;
revoke execute on function public.crear_perfil() from public, anon, authenticated;
