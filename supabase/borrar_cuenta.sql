-- Borrar mi cuenta (Tarea 21, D-034). Detalle en docs/decisiones.md, docs/seguridad.md y docs/privacidad.md.
-- Una sola función segura: borra la cuenta de quien la llama y todos sus datos. Nadie puede borrar otra cuenta.

-- 1. Un badulake cancelado con gente apuntada se conserva (con su aviso) pero ya sin organizadora.
alter table public.badulakes alter column organizadora drop not null;
alter table public.badulakes drop constraint badulakes_organizadora_fkey;
alter table public.badulakes add constraint badulakes_organizadora_fkey
  foreign key (organizadora) references auth.users (id) on delete set null;

-- 2. Marca mínima de cuentas suspendidas que se borran (decidido por OlaIA): solo una huella del
-- correo (no se puede leer el correo a partir de ella), sin fechas de suspensión ni motivos.
-- Sin permisos para nadie desde la app. Se borra sola a los 12 meses.
create table public.bloqueados (
  huella text primary key,
  creada_en timestamptz not null default now()
);
alter table public.bloqueados enable row level security;
revoke all on public.bloqueados from anon, authenticated;

create function public.huella_correo(p_correo text) returns text
language sql immutable set search_path = '' as $$
  select encode(sha256(convert_to(lower(btrim(p_correo)), 'UTF8')), 'hex');
$$;
revoke execute on function public.huella_correo(text) from public, anon, authenticated;

-- Antes de crear una cuenta: un correo marcado no puede volver a registrarse.
create function public.comprobar_bloqueado() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if exists (select 1 from public.bloqueados where huella = public.huella_correo(new.email)) then
    raise exception 'Badulake: no se puede crear la cuenta' using errcode = 'insufficient_privilege';
  end if;
  return new;
end;
$$;
revoke execute on function public.comprobar_bloqueado() from public, anon, authenticated;
create trigger antes_de_crear_cuenta_bloqueado
  before insert on auth.users
  for each row execute function public.comprobar_bloqueado();

-- 3. Borrar mi cuenta. Devuelve 'ok'.
create function public.borrar_mi_cuenta() returns text
language plpgsql security definer set search_path = '' as $$
declare
  yo uuid := auth.uid();
  b public.badulakes;
  correo text;
begin
  if yo is null then
    raise exception 'Badulake: hace falta iniciar sesión' using errcode = 'insufficient_privilege';
  end if;

  -- Los badulakes que organizo: si ya están publicados y tienen gente apuntada o esperando, se
  -- cancelan (su dirección se borra en el acto) y se conservan sin organizadora ni descripción
  -- para que esas personas vean el aviso (se borran 30 días después de su fecha). El resto se borra.
  for b in select * from public.badulakes where organizadora = yo for update loop
    if b.estado = 'publicado' and b.fecha_hora > now()
       and (exists (select 1 from public.inscripciones where badulake_id = b.id)
            or exists (select 1 from public.espera where badulake_id = b.id)) then
      perform public.cancelar(b.id, 'organizadora');
      update public.badulakes set descripcion = '-' where id = b.id;
      update public.badulakes set organizadora = null where id = b.id;
    else
      delete from public.badulakes where id = b.id;
    end if;
  end loop;

  -- Mis inscripciones se borran una a una: así entra la primera de la lista de espera (al_borrarse).
  delete from public.inscripciones where persona = yo;
  delete from public.espera where persona = yo;
  delete from public.interes where persona = yo;

  -- Si estaba suspendida: solo se guarda la huella del correo.
  select email into correo from auth.users where id = yo;
  if exists (select 1 from public.suspendidas where persona = yo) and correo is not null then
    insert into public.bloqueados (huella) values (public.huella_correo(correo)) on conflict do nothing;
  end if;

  -- La cuenta: arrastra perfil, equipo, suspensión, sesiones e identidades (on delete cascade);
  -- las denuncias que hizo se quedan sin denunciante (on delete set null).
  delete from auth.users where id = yo;
  return 'ok';
end;
$$;
revoke execute on function public.borrar_mi_cuenta() from public, anon;
grant execute on function public.borrar_mi_cuenta() to authenticated;

-- 4. Plazos: la huella de una cuenta suspendida se borra a los 12 meses.
create or replace function public.borrar_datos_caducados() returns void
language plpgsql security definer set search_path = '' as $$
begin
  delete from public.badulakes_direccion d
    using public.badulakes b
    where b.id = d.badulake_id and b.fecha_hora < now() - interval '1 day';
  delete from public.espera e
    using public.badulakes b
    where b.id = e.badulake_id and b.fecha_hora < now();
  delete from public.badulakes where fecha_hora < now() - interval '30 days';
  delete from public.lista_espera where creado_en < now() - interval '12 months';
  delete from public.bloqueados where creada_en < now() - interval '12 months';
  delete from auth.sessions where coalesce(updated_at, created_at) < now() - interval '90 days';
  delete from auth.audit_log_entries where created_at < now() - interval '30 days';
end;
$$;
