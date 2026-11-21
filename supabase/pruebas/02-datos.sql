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
  (1, 1, 'Badulake de Barrio del Olmo, Sant Boi de Llobregat (Barcelona)',     'Trae ropa y objetos que ya no uses y llévate otros. Sin dinero.', 5, 'Barrio del Olmo',          'Calle del Naranjo 12, 2.º (inventada)',  8),
  (2, 2, 'Badulake de Colina del Tejo, Sant Boi de Llobregat (Barcelona)',     'Traemos lo que nos sobra y nos llevamos lo que nos gusta. Merienda compartida.', 6, 'Colina del Tejo',        'Plaza del Reloj Viejo 3 (inventada)',     6),
  (3, 3, 'Badulake de Barrio de las Gaviotas, Cornellà de Llobregat (Barcelona)', 'Un rato entre vecinas para intercambiar sin dinero.',          8, 'Barrio de las Gaviotas', 'Calle de la Fuente Azul 7 (inventada)',   6),
  (4, 4, 'Badulake de Barrio del Roble, Bilbao (Bizkaia)',                     'Un rato para intercambiar lo que ya no usas. Cada quien trae lo que quiere.',   9, 'Barrio del Roble',       'Paseo de los Almendros 1 (inventado)',   10);

insert into public.badulakes (id, organizadora, titulo, descripcion, fecha_hora, zona, plazas, estado)
select b.id, v.id, b.titulo, b.descr, now() + make_interval(days => b.dias), b.zona, b.plazas, 'publicado'
from _b b join _vecinas v on v.n = b.org;

insert into public.badulakes_direccion (badulake_id, organizadora, direccion)
select b.id, v.id, b.calle from _b b join _vecinas v on v.n = b.org;

-- 4. Inscripciones (la organizadora cuenta como una persona más, D-040): el 1 casi sin gente, el 2 lleno
-- (5 apuntadas + la organizadora = 6 de 6) con 2 en lista de espera, el 3 lleno y confirmado (5 + 1 = 6 de 6).
insert into public.inscripciones (badulake_id, persona)
select b.id, v.id from _b b join _vecinas v on
  (b.n = 1 and v.n in (2, 5)) or
  (b.n = 2 and v.n in (1, 3, 4, 5, 6)) or
  (b.n = 3 and v.n in (1, 2, 5, 6, 7));

insert into public.espera (badulake_id, persona, creada_en)
select b.id, v.id, now() + make_interval(secs => v.n) from _b b join _vecinas v on b.n = 2 and v.n in (7, 8);

-- 5. Una cuenta del equipo para enseñar el panel /equipo.
insert into public.equipo (persona) select id from _vecinas where n = 9;

-- 6. Quién puede organizar (Tarea 5.2, D-038): las vecinas 1 a 7 ya han ido a algún badulake;
-- Unai (8) todavía no, para enseñar el aviso «aún no puedes organizar». El equipo organiza siempre.
insert into public.permiso_organizar (persona, origen) select id, 'asistencia' from _vecinas where n between 1 and 7;

-- 7. Un badulake ya celebrado (Tarea 6.1): para ver «Mis badulakes → Pasados», el estado «Terminado» y
-- el «gracias». Lo organizó Ane (1) y fueron Mikel (2), Nerea (5), Iker (6) y Maialen (7). Se crea con
-- fecha futura (la base de datos no deja crearlo en el pasado) y después se mueve a hace 3 días.
-- Ojo: la limpieza nocturna lo borra a los 30 días; volver a ejecutar este archivo lo recrea.
with nuevo as (
  insert into public.badulakes (organizadora, titulo, descripcion, fecha_hora, zona, plazas, estado)
  select id, 'Badulake de Barrio del Sauce, Sant Boi de Llobregat (Barcelona)',
         'El primero del barrio: ropa de invierno y libros.', now() + interval '3 days', 'Barrio del Sauce', 8, 'publicado'
  from _vecinas where n = 1
  returning id
)
insert into _b (n, org, titulo, descr, dias, zona, calle, plazas, id)
select 5, 1, 'pasado', '', -3, 'Barrio del Sauce', 'Calle del Sauce 4 (inventada)', 8, id from nuevo;
update public.badulakes set fecha_hora = now() - interval '3 days' where id = (select id from _b where n = 5);
insert into public.badulakes_direccion (badulake_id, organizadora, direccion)
select b.id, v.id, b.calle from _b b join _vecinas v on v.n = b.org where b.n = 5;
insert into public.inscripciones (badulake_id, persona)
select b.id, v.id from _b b join _vecinas v on b.n = 5 and v.n in (2, 5, 6, 7);
