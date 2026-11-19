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
- **Correo propio** (Tarea 10) y **denuncias** (Tarea 13).
- **Copia de la base de datos:** el plan gratuito no guarda copias recuperables; valorar antes de tener datos reales.
- La revisión del experto de seguridad del episodio 4 se hará al final, como todas (no en tiempo real). Los fallos que enseñe el guion solo se reproducirán en una copia con datos inventados (Tarea 22), nunca en la app real.

## 8. Qué hay que hacer el día del lanzamiento

Para abrir las cuentas, todo a la vez:

1. En Supabase (Authentication → Sign In / Providers), volver a encender **«Allow new users to sign up»**.
2. En Vercel, poner **`CUENTAS_ABIERTAS=1`** (y `PRIVACY_NOTICE_READY=true` para la lista de espera) y volver a publicar.
3. Añadir la dirección de la web a las direcciones permitidas de Supabase (URL Configuration) y comprobar que el correo propio (Tarea 10) envía el enlace de verificación.
4. Que estén publicados el aviso de privacidad (Tareas 9 y 12): sustituir el borrador provisional de `/privacidad` (clave `Privacy` de `app/messages/*.json`) por el texto definitivo de la Asesoría Jurídica, con el correo para ejercer los derechos, y quitar el recuadro «Borrador provisional».
5. Comprobar en Supabase (Integrations → Cron) que la tarea `borrar-datos-caducados` sigue activa y se ha ejecutado bien la última noche.
6. Comprobar que la parte del servidor sigue en Frankfurt: la cabecera `x-vercel-id` de `/api/hora` debe contener `fra1`.
7. Si la Tarea 10 añade un proveedor de correo, sumarlo a [privacidad.md](privacidad.md) (apartado 3) y al aviso.
