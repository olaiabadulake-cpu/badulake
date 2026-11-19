-- COPIA DE PRUEBAS (Tarea 22, D-035): datos inventados que se pueden volver a cargar.
-- Ejecutar SOLO en «badulake-pruebas» (se niega a correr si no existe la marca de 01-fallos.sql).
-- Borra TODAS las cuentas y badulakes de la copia y deja el escenario como al principio:
-- vecinas ficticias de barrios inventados, badulakes con fechas relativas a hoy, uno lleno con
-- lista de espera y uno con pocas personas. Contraseña de todas las cuentas inventadas: Pruebas-Badulake-1
-- (no es de nadie real; la copia no contiene ningún dato personal).

do $$
begin
  if to_regclass('public.es_copia_de_pruebas') is null then
    raise exception 'Esto no es la copia de pruebas: no se hace nada.';
  end if;
end $$;

-- 1. Limpiar (borrar las cuentas arrastra perfiles, badulakes, direcciones, inscripciones y esperas).
delete from auth.users;

-- 2. Cuentas inventadas (nombre.demo@pruebas.badulake.app). Se crean ya verificadas.
create temp table _vecinas (n int, nombre text, correo text, id uuid default gen_random_uuid());
insert into _vecinas (n, nombre, correo) values
  (1, 'Ane',     'ane.demo@pruebas.badulake.app'),
  (2, 'Mikel',   'mikel.demo@pruebas.badulake.app'),
  (3, 'Leire',   'leire.demo@pruebas.badulake.app'),
  (4, 'Jon',     'jon.demo@pruebas.badulake.app'),
  (5, 'Nerea',   'nerea.demo@pruebas.badulake.app'),
  (6, 'Iker',    'iker.demo@pruebas.badulake.app'),
  (7, 'Maialen', 'maialen.demo@pruebas.badulake.app'),
  (8, 'Unai',    'unai.demo@pruebas.badulake.app'),
  (9, 'Equipo',  'equipo.demo@pruebas.badulake.app');

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change,
  email_change_token_current, phone_change, phone_change_token, reauthentication_token
)
select '00000000-0000-0000-0000-000000000000', id, 'authenticated', 'authenticated', correo,
  extensions.crypt('Pruebas-Badulake-1', extensions.gen_salt('bf')), now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('fecha_nacimiento', '1990-01-01', 'idioma', case when n % 2 = 0 then 'eu' else 'es' end),
  now(), now(), '', '', '', '', '', '', '', ''
from _vecinas;

insert into auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
select id::text, id, jsonb_build_object('sub', id::text, 'email', correo, 'email_verified', true), 'email', now(), now(), now()
from _vecinas;

-- 3. Badulakes inventados (barrios y calles que no existen).
create temp table _b (n int, org int, titulo text, descr text, dias int, zona text, calle text, plazas int, id uuid default gen_random_uuid());
insert into _b (n, org, titulo, descr, dias, zona, calle, plazas) values
  (1, 1, 'Ropa de entretiempo', 'Trae ropa que ya no uses y llévate algo nuevo. Chaquetas, jerséis y bufandas.', 5, 'Barrio del Olmo',      'Calle del Naranjo 12, 2.º (inventada)', 8),
  (2, 2, 'Libros y juegos de mesa', 'Cambiamos libros y juegos de mesa. Merienda compartida.',                  6, 'Colina del Tejo',    'Plaza del Reloj Viejo 3 (inventada)',    5),
  (3, 3, 'Ropa infantil',          'Ropa y zapatos de 0 a 8 años. Sin dinero, solo intercambio.',               8, 'Barrio de las Gaviotas', 'Calle de la Fuente Azul 7 (inventada)',  6),
  (4, 4, 'Plantas y macetas',      'Esquejes, macetas y semillas. Trae lo que te sobre.',                        9, 'Barrio del Olmo',      'Paseo de los Almendros 1 (inventado)',  10);

insert into public.badulakes (id, organizadora, titulo, descripcion, fecha_hora, zona, plazas, estado)
select b.id, v.id, b.titulo, b.descr, now() + make_interval(days => b.dias), b.zona, b.plazas, 'publicado'
from _b b join _vecinas v on v.n = b.org;

insert into public.badulakes_direccion (badulake_id, organizadora, direccion)
select b.id, v.id, b.calle from _b b join _vecinas v on v.n = b.org;

-- 4. Inscripciones: el 1 casi sin gente, el 2 lleno (5 de 5) con 2 en lista de espera, el 3 con 5 (confirmado).
insert into public.inscripciones (badulake_id, persona)
select b.id, v.id from _b b join _vecinas v on
  (b.n = 1 and v.n in (2, 5)) or
  (b.n = 2 and v.n in (1, 3, 4, 5, 6)) or
  (b.n = 3 and v.n in (1, 2, 5, 6, 7));

insert into public.espera (badulake_id, persona, creada_en)
select b.id, v.id, now() + make_interval(secs => v.n) from _b b join _vecinas v on b.n = 2 and v.n in (7, 8);

-- 5. Una cuenta del equipo para enseñar el panel /equipo.
insert into public.equipo (persona) select id from _vecinas where n = 9;
