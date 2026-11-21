# Seguridad de Badulake

Revisión hecha el 19/11/2026 (Tarea 8 del plan maestro, decisión D-023; privacidad en [privacidad.md](privacidad.md), D-024), antes de abrir la app al público. Repasa todo lo construido en las Tareas 2 a 7. La app sigue **cerrada en la web publicada**: lo que necesita cuenta da 404 y la lista de espera no se enseña (D-018, D-019).

## En pocas palabras

- **Nadie puede ver datos de otra persona.** Se comprobó atacando la base de datos con la clave pública y dos cuentas inventadas: 48 de 48 pruebas superadas.
- **Se arreglaron 4 avisos** del revisor de seguridad de Supabase y **5 puntos** del código de la web.
- **La web tiene ahora escudos en cada página** (cabeceras de seguridad) y un **límite de intentos** para entrar, crear cuenta, apuntarse y la lista de espera.
- **Contraseñas:** mínimo 8 caracteres, también en Supabase (antes Supabase aceptaba 6).
- **No hay ninguna clave** en el repositorio ni en su historial, y las dependencias no tienen fallos conocidos.

## 1. Base de datos (Supabase)

**Qué se revisó:** las 5 tablas (`lista_espera`, `perfiles`, `badulakes`, `badulakes_direccion`, `inscripciones`), sus reglas de acceso (RLS), los permisos de quien no tiene sesión (`anon`) y de quien sí (`authenticated`), y todas las funciones que se saltan las reglas (`security definer`).

**Lo que ya estaba bien:** todas las tablas tienen RLS; cada una da solo los permisos imprescindibles; las funciones especiales tienen la ruta de búsqueda fija; la fecha de nacimiento se borra antes de guardar la cuenta; la verificación por correo es obligatoria.

**Lo que dijo el revisor de seguridad de Supabase (Security Advisor) y qué se hizo** (script `supabase/seguridad.sql`):

| Aviso | Qué era | Qué se hizo |
|---|---|---|
| Error: vista con permisos de su dueño (`badulakes_ocupadas`) | La vista que cuenta las plazas ocupadas se saltaba las reglas. Solo daba números, pero es la clase de cosa que un cambio futuro puede volver peligrosa. | Se cambia por la función `plazas_ocupadas`, que da exactamente lo mismo (un número por badulake) y solo con sesión. |
| Aviso: `hora_actual` sin ruta de búsqueda fija | La función de prueba de la Tarea 2. | Ruta fija. |
| Aviso: la regla de la lista de espera acepta cualquier cosa | Quien tuviera la clave podía guardar basura. | La base de datos comprueba ahora que el correo tenga forma de correo y que la fecha del consentimiento sea de ahora. |
| Aviso: `rls_auto_enable` se puede llamar sin sesión | Una función que crea Supabase por su cuenta. | Nadie puede llamarla desde fuera. |
| Aviso: `apuntarme`, `crear_badulake` y `plazas_ocupadas` se pueden llamar con sesión | Es a propósito: son la única forma de apuntarse, de crear un badulake y de saber cuántas plazas quedan, y comprueban quién llama. | Se deja así. |

**Resultado al volver a pasar el revisor:** de 1 error y 6 avisos a **0 errores y 3 avisos**, los tres a propósito.

**Además:**

- Un borrador con la fecha ya pasada no se puede publicar.
- Lo que se cree en el futuro en la base de datos empieza **cerrado**: sin ningún permiso hasta que un script lo dé expresamente.

**Prueba de ataque** con la clave pública y dos cuentas inventadas (`prueba-seguridad1` y `2`, del dominio badulake.app; borradas al acabar, D-011). Todo correcto:

- Sin sesión no se lee ni se escribe nada (salvo apuntarse a la lista de espera) y no se puede llamar a ninguna función.
- Cada cuenta ve solo su perfil; no puede cambiar el de otra, ni crearse otro, ni tocar la fecha en que se comprobó su edad.
- Un borrador no lo ve nadie más; nadie puede publicar, editar ni borrar el badulake de otra persona.
- La dirección solo la ven la organizadora y quien se apunta, y deja de verse al borrarse.
- Nadie puede apuntar a otra persona ni borrar su inscripción; la organizadora ve cuántas plazas hay ocupadas, no quién.
- Una sesión falsificada no entra; crear una cuenta llamando a Supabase directamente sin fecha de nacimiento no funciona.

## 2. Servidor de la web

**Qué se revisó:** cada acción del servidor (lista de espera, crear cuenta, entrar, salir, crear, publicar, apuntarse y borrarse), las rutas `/api` y las redirecciones.

**Lo que ya estaba bien:** todas validan los datos en el servidor; las que necesitan sesión la piden a Supabase (que comprueba que sea auténtica); los errores internos solo se apuntan en el registro del servidor y la persona ve un mensaje general; todas las páginas con cuenta dan 404 si el interruptor `CUENTAS_ABIERTAS` está apagado; la lista de espera se rechaza en el servidor aunque alguien envíe el formulario oculto.

**Arreglado:**

1. **Enlace del correo de verificación:** se construía con la dirección que mandaba el navegador. Ahora es fija (la de la web), para que nadie pueda hacer que el enlace lleve a otra web.
2. **Idioma recibido de los formularios:** se aceptaban palabras como `constructor` como si fueran un idioma. Ahora solo se aceptan los 44 idiomas de verdad. Así ninguna redirección puede salir de la web.
3. **Archivo de calendario (.ics):** el punto y coma no se escapaba bien. Arreglado.
4. **Límite de intentos** (ver apartado 4).
5. **Cabeceras de seguridad** (ver apartado 3).

## 3. Cabeceras de seguridad

En todas las páginas (`app/next.config.ts`):

- **Política de contenido (CSP):** la web solo carga cosas de sí misma; no puede meterse en otra web; los formularios solo envían a Badulake.
- **HSTS:** el navegador solo usará https durante dos años.
- **X-Content-Type-Options, Referrer-Policy, X-Frame-Options y Permissions-Policy:** el navegador no adivina tipos de archivo, no se manda la dirección completa a otras webs, nadie puede incrustar Badulake para engañar con clics, y la web no puede usar cámara, micrófono ni ubicación.
- Se quita la cabecera que decía con qué está hecha la web.
- **App instalable (Tarea 16, D-031):** el service worker (`sw.js`) solo guarda la página «sin conexión» y un icono; nunca páginas con datos ni respuestas de la API. La CSP no cambia (el service worker y el manifiesto salen del mismo dominio).

Comprobado en el Mac: la portada, «Qué es un badulake», entrar y el selector de idioma funcionan, sin ningún bloqueo en la consola.

**Límite conocido:** Next.js necesita permitir scripts escritos dentro de la página (`'unsafe-inline'`). Quitarlo obliga a generar cada página en el momento y haría la web más lenta; con lo demás cerrado, se deja así.

## 4. Límite de intentos

| Acción | Límite propio de la web | Límite de Supabase |
|---|---|---|
| Entrar | 10 cada 15 minutos por conexión o por correo | 30 cada 5 minutos |
| Crear cuenta | 5 por hora por conexión o por correo | 30 cada 5 minutos; 2 correos por hora |
| Apuntarse | 30 cada 10 minutos por conexión | — (la base de datos ya impide duplicar o pasarse de plazas) |
| Lista de espera | 5 por hora por conexión | — (un correo repetido no se duplica) |

Al pasarse sale «Demasiados intentos. Espera unos minutos y vuelve a probar». Comprobado en el Mac: el intento 11 de entrar se bloquea.

**Cómo funciona y su límite:** el contador vive en la memoria del servidor y se olvida solo; no se guarda ninguna dirección IP. Vercel puede tener varios servidores a la vez, cada uno con su contador, así que es una primera barrera, no una muralla. Los límites de Supabase cuentan por la conexión de Vercel (no la de cada persona), así que funcionan como un tope general. Si hiciera falta más, el siguiente paso sería un contador compartido o un CAPTCHA (no hace falta mientras esté cerrado).

## 5. Claves y dependencias

- **Ninguna clave en el repositorio ni en el historial** (revisado todo el historial de git). Las claves están solo en `app/.env.local` (git lo ignora) y en Vercel.
- La web solo usa la **clave pública** de Supabase, y **solo desde el servidor**: nunca llega al navegador. La clave secreta no se usa.
- Variables: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `CUENTAS_ABIERTAS` (solo en el Mac), `PRIVACY_NOTICE_READY` (apagada en producción) y, opcional, `SITE_URL`.
- `npm audit`: **0 fallos conocidos**. Actualizadas dentro de la misma versión: next-intl 4.15.3, React 19.3.1 y Tailwind 4.3.5. Next.js 16.4.6 ya era la última.

## 6. Contraseñas y correo

- Mínimo **8 caracteres** en la web y ahora también en Supabase (estaba en 6; comprobado que Supabase rechaza una de 7).
- Para cambiar la contraseña hará falta la actual y haber entrado hace poco.
- Apagados los **enlaces mágicos** de Supabase (entrar sin contraseña): la app no los usa.
- **Verificación de correo obligatoria:** comprobado que está encendida.
- **Comprobar contraseñas filtradas** (Have I Been Pwned): Supabase solo lo ofrece en el plan Pro (25 $/mes). No se activa.

## 7. Lo que queda

- ~~**Abrir las cuentas en producción:** con `CUENTAS_ABIERTAS=1`, la compilación fallaba en la página de cada badulake.~~ **Arreglado en la Tarea 8.1:** el menú y el selector de idioma esperan a la página, y lo que depende de la sesión se calcula siempre en el momento de la visita.
- ~~**Quien tenga la clave pública** podría crear una cuenta llamando a Supabase directamente, aunque `CUENTAS_ABIERTAS` esté apagado.~~ **Cerrado:** OlaIA apagó «Allow new users to sign up» en Supabase el 19/11/2026 hasta el lanzamiento. Mientras tanto, las cuentas de prueba se crean directamente en la base de datos (SQL), no con el formulario.
- **Contraseñas filtradas:** solo con el plan Pro de Supabase.
- ~~**Privacidad** (Tarea 9).~~ **Hecha** (D-024, [privacidad.md](privacidad.md)): nadie ve quién organiza un badulake, los datos se borran solos y la web se procesa en Frankfurt.
- **Correo propio** (Tarea 10). ~~**Denuncias** (Tarea 13).~~ **Hechas** (D-027): ver el apartado 9.
- **Copia de la base de datos:** el plan gratuito no guarda copias recuperables; valorar antes de tener datos reales.
- La revisión del experto de seguridad del episodio 4 se hará al final, como todas (no en tiempo real). Los fallos que enseñe el guion solo se reproducirán en una copia con datos inventados (Tarea 22), nunca en la app real.

## 8. Qué hay que hacer el día del lanzamiento

Para abrir las cuentas, todo a la vez:

1. En Supabase (Authentication → Sign In / Providers), volver a encender **«Allow new users to sign up»**.
2. En Vercel, poner **`CUENTAS_ABIERTAS=1`** (y `PRIVACY_NOTICE_READY=true` para la lista de espera) y volver a publicar.
3. Añadir la dirección de la web a las direcciones permitidas de Supabase (URL Configuration) y comprobar que el correo propio (Tarea 10) envía el enlace de verificación.
4. Que estén publicados los textos legales (Tareas 9 y 12: privacidad, aviso legal, condiciones y cookies, borradores en [legal/](legal/README.md)): sustituir el borrador provisional de `/privacidad` (clave `Privacy` de `app/messages/*.json`) por el texto definitivo de la Asesoría Jurídica, con el correo para ejercer los derechos, y quitar el recuadro «Borrador provisional».
5. Comprobar en Supabase (Integrations → Cron) que la tarea `borrar-datos-caducados` sigue activa y se ha ejecutado bien la última noche.
6. Comprobar que la parte del servidor sigue en Frankfurt: la cabecera `x-vercel-id` de `/api/badulakes/x/calendario` debe contener `fra1` (`/api/hora` ya no sirve: en la web real responde 404 desde la Tarea 8.3).
7. Si la Tarea 10 añade un proveedor de correo, sumarlo a [privacidad.md](privacidad.md) (apartado 3) y al aviso.
8. **Dar de alta al equipo (Tarea 13):** el panel `/equipo` no deja entrar a nadie hasta que haya cuentas en la tabla `equipo`. Con la cuenta ya creada: en Supabase (SQL Editor) `insert into public.equipo (persona) select id from auth.users where email = 'correo-de-la-persona';`. Para quitar a alguien: `delete from public.equipo where persona = '…';`. Ninguna cuenta se da de alta desde la app.

9. **Códigos QR de Sant Boi (Tarea 18, D-033):** los QR de `docs/qr/` llevan escrita la dirección **badulake.vercel.app**. Si badulake.app ya funciona (Tarea 3), **regenerarlos y volver a imprimirlos** (`cd app && npm i --no-save qrcode && node scripts/qr.mjs https://badulake.app`), escanear uno y comprobar que abre `/es/hola`. Imprimir uno de prueba antes de la tirada.
10. **Apuntarse a la vez a escala:** probado (120 a la vez por 10 plazas, [carga.md](carga.md)). Solo repetirlo si cambia `apuntarme()`.
11. **Primeras organizadoras (Tarea 5.2, D-038):** al abrir, nadie puede organizar un badulake hasta haber ido a uno. Para los primeros, alguien del equipo da permiso de organizar desde el panel `/equipo` (el equipo puede organizar siempre). Hacerlo antes de anunciar la app.
12. **Entrar con Google (Tarea 4.1, D-039).** Hoy solo funciona en la copia de pruebas. Para el Supabase real:
    1. Ejecutar `supabase/google.sql` en el SQL Editor del proyecto **real** (antes de abrir las altas).
    2. En Google Cloud (proyecto «Badulake», cuenta de Google del proyecto) → Google Auth Platform → Clientes → **crear un cliente nuevo** «Badulake · web real», tipo «Aplicación web», con la URI de redireccionamiento `https://aecjynkozbepjaljutjz.supabase.co/auth/v1/callback`. Un cliente distinto del de la copia, para que sus claves no se mezclen.
    3. En Supabase real → Authentication → Sign In / Providers → Google: encender, pegar el ID del cliente y la clave secreta (copiar y pegar desde Google, nunca al chat ni al repositorio) y «Save».
    4. Supabase real → URL Configuration: añadir `https://<dirección de la web>/api/cuenta/**` a las direcciones de vuelta permitidas.
    5. Google Auth Platform → Información de la marca: logotipo, página de inicio, enlaces a privacidad y condiciones y dominio autorizado (el de la web). Después, Público → **«Publicar app»** (salir del modo de prueba). Con solo correo y perfil básico no hace falta la verificación larga de Google, pero sí que revise la marca (unos días): hacerlo con tiempo.
    6. En Vercel (proyecto real) poner **`GOOGLE_ACTIVADO=1`** y volver a publicar.
    7. Probar con una cuenta de Google de una persona del equipo: «Un último paso», entrar y salir. Mirar en Supabase (Authentication → Users) que la cuenta no guarda nombre ni foto.

## 9. Denuncias, suspensiones y panel del equipo (Tarea 13, D-027)

Script: `supabase/denuncias.sql`. Todo se aplica en la base de datos, no solo en la pantalla.

- **Quién puede qué:** cualquier persona con sesión crea denuncias propias (motivo de una lista de 6 y texto de hasta 300 letras; una abierta por badulake; solo de badulakes que ve). **Nadie puede leerlas desde la app**, tampoco quien las crea. Las tablas `equipo` y `suspendidas` no tienen permisos para la web: solo se tocan desde el panel de Supabase.
- **El equipo** son las cuentas de la tabla `equipo`. Las funciones `equipo_denuncias`, `equipo_ocultar`, `equipo_suspender` y `equipo_resolver` comprueban `soy_equipo()` antes de nada y no devuelven correos, quién denuncia, quién organiza ni la dirección exacta.
- **Ocultar** (`badulakes.oculto`): no se ve (salvo la organizadora, con aviso), no admite inscripciones, no cuenta plazas y su dirección deja de verse a quien estaba apuntado.
- **Suspender:** la cuenta entra en `suspendidas`, Supabase Auth la bloquea (`banned_until`) y se cierran sus sesiones; sus badulakes se ocultan; no puede crear, publicar, apuntarse ni denunciar aunque su sesión (que dura hasta una hora) siga abierta. No se puede suspender a una cuenta del equipo.
- **Levantar una suspensión** (desde el SQL Editor de Supabase, con el identificador de la cuenta): `delete from public.suspendidas where persona = '…'; update auth.users set banned_until = null where id = '…'; update public.badulakes set oculto = false where organizadora = '…';`
- **Límite de intentos:** 5 denuncias por hora desde la misma conexión (además de la regla de una abierta por badulake).
- **Prueba de ataque** con la clave pública y cuatro cuentas inventadas: 54 comprobaciones superadas (ver [diario.md](diario.md)); cuentas borradas al acabar.
- **Límite conocido:** quien denuncia a un badulake propio o de una cuenta que luego se borra deja la denuncia sin denunciante (`on delete set null`); no hay botón para levantar suspensiones ni para reabrir denuncias resueltas.

## 10. Cupo, lista de espera y cancelación automática (Tarea 20, D-032)

Script `supabase/cupo.sql`, ejecutado por Claude en Supabase el 19/11/2026.

- **Lista de espera de cada badulake** (tabla `espera`): RLS; cada persona solo ve y borra sus propias filas, y **no puede leer quién más espera** (ni siquiera la columna de la persona). Nadie inserta ni cambia su puesto: se entra con `apuntarme()`, que bloquea el badulake mientras decide si hay plaza o va a la lista. El puesto («eres la 2.ª») lo da `mi_espera()`, solo de las propias filas.
- **Subir de la lista sin carreras:** cuando alguien se borra (o se borra su cuenta), la propia base de datos, en la misma operación, bloquea el badulake con el mismo bloqueo que `apuntarme()` y hace entrar a la primera de la lista (`rellenar_desde_espera`, que nadie puede llamar desde fuera). Las cuentas suspendidas no entran ni cuentan para el puesto.
- **Cancelar:** la organizadora, con `cancelar_mi_badulake()` (comprueba que es suya, que está publicado y que no ha empezado). La cancelación automática (`cancelar_sin_minimo()`) la lanza **Supabase Cron cada 10 minutos**: cancela los publicados que empiezan en 24 horas o menos y tienen menos de 5 apuntadas. Al cancelarse, la **dirección exacta se borra**; un cancelado no admite apuntarse ni lista de espera. Nadie puede llamar a `cancelar`, `cancelar_sin_minimo` ni `al_borrarse` desde fuera, ni cambiar el estado a mano.
- **48 horas de margen** para crear o publicar un badulake (antes bastaba con que fuera futuro), para que dé tiempo a juntar a 5 personas antes del corte de 24 horas.
- **Prueba de ataque** con la clave pública y 15 cuentas inventadas (`prueba-t20-00` a `14`, del dominio badulake.app, creadas por SQL porque las altas están apagadas; D-011), **54 de 54 comprobaciones superadas**, entre ellas: **carrera de 12 personas a la vez por 5 plazas → entran exactamente 5 y las otras 7 quedan con los puestos 1 a 7 sin repetir**; 3 personas se borran a la vez mientras otra intenta entrar → siguen 5 dentro, suben las 3 primeras de la lista en orden y la nueva queda la última; quien espera no ve la dirección y la ve al entrar; la cuenta suspendida no se apunta ni entra en la lista; nadie lee la lista de otras, ni se cuela en inscripciones o en la lista, ni cambia su puesto, ni cancela un badulake ajeno; sin sesión no se puede nada; la cancelación automática cancela el de 2 personas a 20 horas y respeta el de 5. Además, en el Mac con la web: lista, detalle, «Ponerme en lista de espera», «Salir de la lista de espera», «Borrarme» (entra la siguiente), cancelar como organizadora y avisos de «Tu cuenta», en castellano y euskera; axe-core 0 fallos. Cuentas, badulakes, inscripciones, lista de espera y perfiles borrados al acabar: todo a 0.

## 11. Verificación en dos pasos de las cuentas (Tarea 8.2)

- **Google** (cuenta del proyecto): dos pasos activados el 19/11/2026 con llave de acceso (huella o cara) y teléfono como alternativa; los códigos de respaldo los guarda OlaIA en Contraseñas de Apple (no están en el repositorio).
- **GitHub**: sin verificación propia; entra solo con Google y no tiene contraseña, así que la protege la de Google. La llave de acceso propia queda opcional.
- **Vercel y Supabase**: entran con GitHub, protegidas por la misma cadena (GitHub → Google). Supabase, por confirmar.
- **Riverside y Resend**: pendientes de confirmar con qué entran.
- **Revisor de seguridad de Supabase (Security Advisor), 20/11/2026, después del script:** **0 errores**, 15 avisos y 2 sugerencias, **todos a propósito**. Los 15 avisos son las 15 funciones especiales que se pueden llamar con sesión (nunca sin sesión): `apuntarme`, `crear_badulake`, `cancelar_mi_badulake`, `mi_espera`, `mis_badulakes`, `plazas_ocupadas`, `estoy_suspendida`, `soy_equipo`, `badulake_oculto` y las seis `equipo_*`. Son la única forma de hacer esas cosas y cada una comprueba quién llama (o que es del equipo) y solo devuelve lo propio. Las funciones internas de esta tarea (`rellenar_desde_espera`, `al_borrarse`, `cancelar`, `cancelar_sin_minimo`) no las puede llamar nadie, comprobado también con una consulta a los permisos. Las 2 sugerencias son las tablas `equipo` y `suspendidas`, con RLS y sin reglas: a propósito, para que nadie pueda leerlas desde la app (D-027).

## 12. Borrar cuenta y contraseñas (Tarea 21, D-034)

- `borrar_mi_cuenta()` se puede llamar solo con sesión (sin sesión: «permission denied»), no recibe ningún identificador (solo borra a quien llama), tiene ruta fija y no se puede usar para borrar a otra persona.
- Tabla `bloqueados` y funciones `huella_correo` y `comprobar_bloqueado`: sin permisos para la app (comprobado con la clave pública).
- Pruebas con 8 cuentas inventadas (`prueba-borrar1..8@badulake.app`, borradas al acabar): sin sesión no se puede borrar; al borrar la suya, las demás siguen; el badulake con gente se cancela, sin organizadora, sin dirección y sin descripción; el borrador desaparece; entra la primera de la lista de espera; la denuncia queda sin denunciante; la cuenta suspendida deja la huella y la base de datos rechaza volver a crearla.
- Recuperar contraseña: respuesta idéntica exista o no el correo; límite de 5 por hora y correo.

## 13. Herramientas del día del badulake (Tarea 24, D-036)

- Tablas `dia_estado` y `dia_personas` con RLS y **sin permisos para la clave pública** salvo leer las columnas `id, badulake_id, presente, orden_exponer, orden_elegir` de la **propia** fila. Todo lo demás pasa por funciones `security definer` con ruta fija; las que escriben (`dia_fijar`, `dia_etiqueta`, `dia_presente`, `dia_sortear_orden`, `dia_empezar_elegir`, `dia_siguiente`, `dia_panel`) comprueban dentro `dia_permitido()`: sesión, que sea la organizadora, que no esté suspendida, badulake publicado y no oculto, desde 2 h antes hasta 1 día después y confirmado al abrir. Sin sesión (`anon`): sin permiso.
- **Sorteos únicos:** `dia_sortear_orden` y `dia_empezar_elegir` bloquean el badulake y la fila de estado y responden `ya_sorteado` / `ya_empezado` si ya se hicieron; la hora queda registrada.
- El panel no devuelve identificadores de cuenta ni correos. La página `/dia` da 404 a quien no organiza (y a todos si las cuentas están cerradas) y no incluye datos en el HTML.
- Pruebas en `docs/diario.md` y D-036: 32 comprobaciones; la clave pública no lee etiquetas, no escribe y solo ve su fila.

## 14. Título por lugar y haber ido antes de organizar (Tareas 5.1 y 5.2, D-037 y D-038)

- `crear_badulake` ya no recibe título: forma «Badulake de barrio, ciudad (provincia)» y comprueba las longitudes. Como nadie inserta en `badulakes` por la clave pública, el título no puede ser un tema.
- `permiso_organizar` (quién ya puede organizar): RLS activada y **sin ningún permiso** para `anon` ni `authenticated`; solo la tocan funciones de la base de datos. `persona_ha_ido` y `registrar_asistencias` no las puede llamar nadie desde fuera (comprobado con la clave pública).
- `puedo_organizar()` (con sesión; devuelve si el que llama puede) y `equipo_permiso_organizar()` (comprueba `soy_equipo()`; no devuelve correos ni lista de personas) se pueden llamar con sesión a propósito: salen en el revisor de Supabase como avisos, como las demás funciones de este tipo.
- La política «publicar_mi_borrador» exige `puedo_organizar()`: no se puede publicar un borrador sin haber ido (probado: bloqueado por RLS).
- Tarea de Supabase Cron `registrar-asistencias` cada 10 minutos.

## 15. Entrar con Google (Tarea 4.1, D-039)

- Botón «Continuar con Google» solo con `CUENTAS_ABIERTAS=1` **y** `GOOGLE_ACTIVADO=1`. Hoy encendido solo en la copia de pruebas.
- **La edad no se puede saltar:** la cuenta de Google nace pendiente; `estoy_suspendida()` la trata como suspendida (no puede crear, publicar, apuntarse, denunciar ni usar el día del badulake) y reglas RLS restrictivas `edad_confirmada` en `badulakes`, `badulakes_direccion` e `interes` le impiden ver nada. Solo `confirmar_mayoria_edad(fecha, idioma)` (con sesión; solo cambia la cuenta de quien llama) la desbloquea; si es menor, borra la cuenta. `edad_pendiente()` se puede llamar con sesión a propósito (saldrá en el revisor de Supabase como aviso, como las demás de este tipo).
- `perfiles.mayoria_edad_comprobada_en` no se puede cambiar desde fuera (solo `idioma`, como antes).
- `borrar_cuentas_sin_edad()` y `solo_datos_minimos()` no las puede llamar nadie desde fuera. Supabase Cron `borrar-cuentas-sin-edad` cada hora (minuto 40).
- **Direcciones de vuelta fijas:** la vuelta de Google se construye con la dirección fija de la web (`siteOrigin`, D-023), no con la de la petición; en Supabase solo está permitida `https://badulake-pruebas.vercel.app/api/cuenta/**`.
- **Clave secreta del cliente OAuth:** solo en Supabase (Authentication → Sign In / Providers → Google). No está en el repositorio, ni en Vercel, ni en el chat. Se pasó con copiar y pegar y luego se vació el portapapeles.
- **Límite de intentos:** 20 cada 15 minutos para empezar con Google y 10 cada 15 minutos para confirmar la edad, por conexión.

## 16. Compartir y vista previa pública (Tarea 6.3, D-042)

- `badulake_vista(id)` es la **única función que se puede llamar sin cuenta** (además de la lista de espera de antes del lanzamiento). Devuelve solo título, fecha, zona, estado y plazas libres de un badulake publicado o cancelado, no oculto y de los últimos 30 días. Nunca la dirección ni personas. Saldrá en el revisor de Supabase como aviso (función `security definer` abierta), a propósito.
- `proxy.ts` solo la usa para la ficha compartida sin sesión; lo que no devuelve nada da 404.
- La cookie `badulake-volver` es `httpOnly`, `SameSite=Lax`, segura en https y dura un día. Solo se usa si es una ruta privada de esta web (misma comprobación que las rutas protegidas): no puede llevar a otra web.

## 17. Buscar por zona (Tarea 6.2, D-043)

- `Permissions-Policy: geolocation=(self)` (antes `()`): solo la propia web puede pedir la ubicación, y solo cuando la persona pulsa «Cerca de mí». La ubicación no se envía al servidor: el móvil calcula la provincia y solo manda su código.
- El texto que se busca (`?donde=`) se recorta a 60 letras y solo se compara; no se guarda ni se manda a la base de datos.
