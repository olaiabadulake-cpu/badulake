# Decisiones

Registro de decisiones importantes: qué se decidió, qué alternativas había, por qué y quién lo decidió.

---

### D-001 · Grabar las sesiones solo con Riverside
- **Fecha:** 19/11/2026
- **Alternativas:** Riverside para grabar y Google Meet para compartir pantalla; grabadores de pantalla aparte.
- **Decisión:** Solo Riverside. Una sesión por jornada de trabajo.
- **Por qué:** Riverside ya permite invitados por enlace, compartir pantalla (grabada como pista aparte) y usar un iPhone como segunda cámara sincronizada. Una sola herramienta es más fácil de manejar mientras se programa.
- **Propuso:** Claude · **Decidió:** OlaIA

### D-002 · Documentación pública desde el primer día
- **Fecha:** 19/11/2026
- **Alternativas:** repositorio privado al principio y abrirlo más adelante.
- **Decisión:** Repositorio público en GitHub desde el día 1.
- **Por qué:** El experimento consiste en hacerlo en abierto; la gente puede seguir el proceso y sugerir mejoras.
- **Propuso:** Claude (como opción) · **Decidió:** OlaIA

### D-003 · Las contraseñas nunca van en documentos
- **Fecha:** 19/11/2026
- **Decisión:** Las claves se guardan en un gestor de contraseñas. La documentación interna solo registra qué cuenta existe y dónde está su clave. En este repositorio nunca habrá claves.
- **Por qué:** Un repositorio público es visible para cualquiera, y los documentos se comparten y se copian.
- **Propuso:** Claude · **Decidió:** OlaIA

### D-004 · Publicar la app en Vercel
- **Fecha:** 19/11/2026
- **Alternativas:** GitHub Pages (gratis, en el mismo GitHub).
- **Decisión:** Vercel, plan gratuito Hobby. Publica la carpeta `app/` cada vez que cambia algo en GitHub.
- **Por qué:** Preferencia de OlaIA. Vercel está pensado para aplicaciones web y nos servirá cuando Badulake tenga más partes. El plan Hobby vale para proyectos personales y prototipos; si Badulake pasa a ser comercial habrá que pasar al plan Pro.
- **Propuso:** OlaIA · **Configuró:** Claude

### D-005 · Next.js con TypeScript, en euskera y castellano
- **Fecha:** 19/11/2026
- **Alternativas:** seguir con páginas HTML sueltas; otros frameworks web.
- **Decisión:** La app se construye con Next.js y TypeScript como web que se instala en el móvil, con next-intl para los idiomas (euskera y castellano desde el primer día) y Tailwind para los estilos. Todos los textos están en `app/messages/`, nunca escritos a mano en las pantallas.
- **Por qué:** Es la base que proponen los requisitos técnicos v2. Es muy conocida y la IA la maneja bien, y Vercel la publica sin configurar nada.
- **Propuso:** requisitos técnicos v2 · **Montó:** Claude · **Pendiente:** que Adrián cierre el stack.

### D-006 · El formulario de lista de espera no se publica sin base de datos
- **Fecha:** 19/11/2026
- **Decisión:** En el Mac las altas se guardan en un archivo local (que no se sube a GitHub). En la web publicada el formulario se oculta hasta que haya base de datos y aviso de privacidad.
- **Por qué:** Publicar un formulario que recoge correos sin guardarlos bien ni explicar qué se hace con ellos sería engañar a quien se apunta.
- **Propuso:** Claude · **Decidió:** OlaIA (validado el 19/11/2026; el siguiente paso es añadir la base de datos)

### D-007 · Idioma por defecto: castellano
- **Fecha:** 19/11/2026
- **Contexto:** La web elige el idioma según el navegador. Si el navegador no está ni en euskera ni en castellano (por ejemplo, en inglés), usa el idioma por defecto. Hoy es el castellano.
- **Alternativas:** castellano (la mayoría de navegadores de Euskadi están en castellano); euskera (proyecto de EITB, que da prioridad al euskera).
- **Decisión:** se queda el castellano. Si en el futuro se quiere cambiar, es una palabra en `app/src/i18n/routing.ts`.
- **Propuso:** Claude · **Decidió:** OlaIA

### D-008 · Recordar el idioma elegido durante un año
- **Fecha:** 19/11/2026
- **Decisión:** Cuando alguien cambia de idioma, la web lo guarda en una cookie (`NEXT_LOCALE`) que dura un año. Antes se borraba al cerrar el navegador, y el navegador volvía a elegir por la persona. La página de privacidad lo explica.
- **Por qué:** Quien elige euskera con el navegador en castellano tiene que poder volver otro día y seguir en euskera. Es una cookie técnica: solo guarda «eu» o «es».
- **Propuso:** Claude · **Decidió:** OlaIA
- **Más lenguas (FORTA, CIRCOM):** la app ya está preparada. Añadir una lengua es añadirla en `routing.ts` y crear su archivo en `app/messages/`. Solo habrá que ampliar el selector EU | ES cuando llegue la tercera lengua; no se hace antes.

### D-009 · La app se publica en badulake.app
- **Fecha:** 19/11/2026
- **Decisión:** El dominio de la app es **badulake.app** (ya comprado). Mientras se configura, sigue en badulake.vercel.app.
- **Decidió:** OlaIA

### D-010 · Abierta a todas las personas mayores de 18, pensada para mujeres
- **Fecha:** 19/11/2026
- **Decisión:** Cualquier persona mayor de 18 años puede usar Badulake. La comunicación y el tono se dirigen a mujeres, que son el público al que nos dirigimos.
- **Por qué:** Cerrar la app por sexo plantea problemas legales; dirigirse a un público no.
- **Decidió:** OlaIA

### D-011 · Nunca datos de personas reales en pruebas ni demostraciones
- **Fecha:** 19/11/2026
- **Decisión:** Las pruebas, las demostraciones y cualquier fallo que se enseñe se hacen en una copia de la app con datos inventados, nunca con datos de personas reales.
- **Propuso:** Claude · **Decidió:** OlaIA

### D-012 · Sin cobros al principio
- **Fecha:** 19/11/2026
- **Decisión:** La app es gratis. Las ideas de pago (cuentas VIP, monedas) se prueban primero como lista de interés, sin cobrar. Los pagos reales, si llegan, se estudian después con Comercial y la Asesoría Jurídica.
- **Propuso:** Claude · **Decidió:** OlaIA

### D-013 · Web instalable en el móvil, no app en las tiendas
- **Fecha:** 19/11/2026
- **Alternativas:** publicar en App Store y Google Play.
- **Decisión:** Badulake es una web que se instala en el móvil (PWA). No se sube a las tiendas por ahora.
- **Por qué:** Las tiendas exigen cuentas de desarrollador, revisiones y mucho más trabajo, para una app que funciona igual desde el navegador.
- **Propuso:** Claude · **Decidió:** OlaIA

### D-014 · Primero lo imprescindible
- **Fecha:** 19/11/2026
- **Decisión:** Se desarrolla primero lo mínimo para que Badulake funcione de verdad (registro, crear y apuntarse a badulakes, aforo, seguridad, privacidad, accesibilidad, avisos y el día del badulake básico). Grupos, notificaciones en el móvil, filtros, mapa, valoraciones, puntos de generosidad, badulake online y pagos quedan para cuando la comunidad lo pida o haya tiempo.
- **Decidió:** OlaIA
- **Ajuste (19/11/2026):** el objetivo de la lista de espera para empezar es de 10 personas.
- **Revisión del euskera:** la hará Iñako antes de publicar.
- **Infraestructura:** Supabase y Resend (correo) con servidores en la UE; Vercel pasa a un plan de pago.

### D-015 · Badulake en todas las lenguas de FORTA y CIRCOM
- **Fecha:** 19/11/2026
- **Alternativas:** solo las lenguas principales (unas 31); solo las de FORTA y el inglés.
- **Decisión:** 44 lenguas, también las minoritarias (sami, frisón, bretón, corso, ladino, rusino…). Cada persona elige la suya en un menú, y cada lengua aparece escrita en su propio idioma. Se publican ya, con un aviso de que son traducciones automáticas pendientes de revisar. Nunca se usa el traductor de Google: para cada lengua se usa el mejor traductor neuronal disponible, y Claude lo pule para que suene natural (detalle en `docs/traducciones.md`).
- **Por qué:** Que cualquier persona pueda usar la app en su lengua, como piden FORTA y CIRCOM.
- **Propuso:** OlaIA · **Hizo:** Claude · **Pendiente:** revisión por personas nativas.

### D-016 · Base de datos en Supabase, en Frankfurt (UE)
- **Fecha:** 19/11/2026
- **Alternativas:** Firebase; una base de datos en un servidor propio.
- **Decisión:** La base de datos de Badulake es un proyecto de Supabase en Frankfurt (`eu-central-1`), con seguridad por filas (RLS) activada en las tablas nuevas. Plan gratuito para empezar.
- **Por qué:** Los datos de las personas se guardan en la UE (RGPD), Supabase tiene plan gratuito y encaja con Next.js. Las claves nunca van en el repositorio: solo en `app/.env.local` y en las variables de entorno de Vercel. En la app solo se usa la clave pública (publishable); la clave secreta no se usa.
- **Propuso:** Claude · **Decidió:** OlaIA · **Hizo:** OlaIA (cuenta y contraseña) y Claude (proyecto, función y claves)

### D-017 · Lista de espera guardada en Supabase, solo con permiso de alta
- **Fecha:** 19/11/2026
- **Alternativas:** usar la clave secreta (`service_role`) desde el servidor; guardar en un archivo.
- **Decisión:** Los correos se guardan en la tabla `lista_espera` de Supabase (Frankfurt) con RLS activada y una única política: la clave pública solo puede insertar. Leer la lista se hace solo desde el panel de Supabase. No se usa la clave secreta. Un correo repetido se ignora sin avisar.
- **Por qué:** Es lo mínimo necesario (RGPD: solo correo, zona, idioma y fecha del consentimiento) y, aunque alguien consiguiera la clave pública, no podría leer los correos de nadie.
- **Pendiente:** el aviso de privacidad definitivo de la Asesoría Jurídica debe estar publicado **antes de abrir la web al público**; la página `/privacidad` es provisional.
- **Propuso:** Claude · **Decidió:** OlaIA · **Hizo:** Claude

### D-018 · Lista de espera cerrada hasta tener el aviso de privacidad
- **Fecha:** 19/11/2026
- **Alternativas:** dejarla abierta con el aviso provisional.
- **Decisión:** En producción el formulario no se enseña y el servidor rechaza cualquier envío hasta que la Asesoría Jurídica entregue el aviso de privacidad definitivo y se publique en `/privacidad`. Entonces se abre poniendo `PRIVACY_NOTICE_READY=true` en Vercel. En local y en las vistas previas se puede seguir probando, siempre con datos inventados (D-011).
- **Por qué:** El RGPD obliga a informar antes de recoger un correo; el aviso actual es provisional. Así se cumple D-006 y D-017.
- **Propuso:** Claude · **Decidió:** OlaIA · **Hizo:** Claude

### D-019 · Cuentas con correo y contraseña, solo para mayores de 18, cerradas hasta tener el aviso de privacidad
- **Fecha:** 19/11/2026
- **Alternativas:** entrar con Google u otras cuentas; entrar con un enlace por correo sin contraseña; pedir un documento de identidad para comprobar la edad.
- **Decisión:** Las cuentas usan Supabase Auth con correo y contraseña (mínimo 8 caracteres) y verificación por correo. Para comprobar los 18 años se pide la fecha de nacimiento: la comprueba la web y la vuelve a comprobar la base de datos, que la **borra antes de guardar la cuenta**. De cada persona solo se guarda un perfil con su idioma y la fecha en que se comprobó la mayoría de edad (tabla `perfiles`, script en `supabase/perfiles.sql`). Con RLS, cada persona solo puede leer su perfil y cambiar su idioma; no puede crear ni borrar perfiles ni leer los de otras.
- **Cerrado en producción:** el registro, la entrada y la cuenta solo funcionan si está encendido el interruptor `CUENTAS_ABIERTAS=1`, que hoy solo está en el Mac (`app/.env.local`). En badulake.vercel.app esas páginas no existen (error 404). Se abrirá cuando esté publicado el aviso de privacidad de la Asesoría Jurídica (igual que la lista de espera, D-018) **y** haya correo propio (tarea 10): el correo de serie de Supabase solo envía a las personas del equipo y 2 mensajes por hora, así que nadie más podría verificar su cuenta. Al abrirlo, también hay que actualizar la página de privacidad (las cuentas usan cookies de sesión) y añadir la dirección de la web a las direcciones permitidas de Supabase.
- **Por qué:** Es lo mínimo para tener cuentas (D-014) y guarda el mínimo de datos (RGPD). La comprobación en la base de datos impide saltarse los 18 años llamando a Supabase directamente.
- **Propuso:** Claude · **Decidió:** OlaIA (tarea 4 del plan maestro) · **Hizo:** Claude

### D-020 · Crear un badulake: la dirección exacta va en una tabla aparte y solo la ve la organizadora
- **Fecha:** 19/11/2026
- **Alternativas:** una sola tabla con la dirección dentro y esconderla con la aplicación; ocultar columnas con permisos por columna.
- **Decisión:** Hay dos tablas en Supabase (`supabase/badulakes.sql`): `badulakes` (título, descripción, fecha y hora, zona o barrio, plazas, estado `borrador` o `publicado`) y `badulakes_direccion` (la dirección exacta). Con RLS, solo la organizadora puede leer la dirección; cualquier persona con sesión podrá leer los badulakes publicados, sin dirección (el listado es de la tarea 6). Solo la organizadora puede pasar su borrador a publicado, y solo ese cambio es posible: nadie puede insertar ni editar nada más por la clave pública. Se crea con una función de la base de datos (`crear_badulake`) que guarda las dos tablas a la vez o ninguna. La base de datos comprueba plazas de 5 a 10 (10 por defecto), fecha futura y longitudes máximas; la web también las comprueba en el servidor. La hora se interpreta como hora de Madrid.
- **Cerrado en producción:** `/[locale]/badulakes/nuevo` y la página «Tu badulake» solo funcionan con `CUENTAS_ABIERTAS=1` (hoy, solo en el Mac); en badulake.vercel.app dan 404, igual que las cuentas (D-019).
- **Por qué:** La dirección de una casa es lo más delicado de la app: separarla garantiza que ninguna política futura la enseñe por error. La tarea 6 añadirá una política para enseñarla solo a quien se apunte.
- **Propuso:** Claude · **Decidió:** OlaIA (tarea 5 del plan maestro) · **Hizo:** Claude

### D-021 · Ver badulakes y apuntarse: el cupo se comprueba en la base de datos y la dirección se enseña solo a quien esté apuntada
- **Fecha:** 19/11/2026
- **Alternativas:** contar las plazas en la web antes de apuntar; dejar que cada persona inserte su inscripción directamente; que la organizadora vea quién se ha apuntado.
- **Decisión:** Nueva tabla `inscripciones` (badulake, persona, fecha) en `supabase/inscripciones.sql`, con RLS: cada persona solo ve y borra las suyas y **nadie inserta directamente**. Para apuntarse se usa la función `apuntarme()`, que bloquea el badulake mientras comprueba que está publicado, que es futuro, que quien llama no es la organizadora y que quedan plazas; así, dos personas a la vez no pueden coger la última (probado: 6 personas a la vez por 5 plazas → entran exactamente 5). Apuntarse dos veces no duplica. «Me borro» es un borrado normal bajo RLS. La organizadora (y cualquier persona con sesión, para el listado) solo ve el **número** de plazas ocupadas, mediante la vista `badulakes_ocupadas`, que no contiene datos de ninguna persona; no hay forma de saber quién se ha apuntado (eso se decidirá cuando haga falta). La dirección exacta (`badulakes_direccion`) se lee con una política nueva: la organizadora o quien tenga inscripción; al borrarse, deja de verla. El botón «Añadir al calendario» descarga un `.ics` (duración orientativa de 2 horas) y solo existe para quien esté apuntada: la ruta da 404 al resto.
- **Páginas:** `/[locale]/badulakes` (publicados con fecha futura, por fecha, con zona y plazas libres; solo con sesión) y `/[locale]/badulakes/[id]` (público con sesión; «Apuntarme» / «Me borro»). Enlaces desde «Tu cuenta» y desde la portada si hay sesión.
- **Cerrado en producción:** igual que las Tareas 4 y 5, con `CUENTAS_ABIERTAS=1` solo en el Mac; en badulake.vercel.app dan 404.
- **Fuera de esta tarea:** lista de espera del badulake lleno y cancelación automática a 24 h (tarea 20), correos (tarea 10), filtros, mapa, valoraciones.
- **Por qué:** La última plaza es el único punto de choque entre personas, y solo la base de datos puede arbitrarlo de forma fiable. Dar la dirección solo tras apuntarse protege lo más delicado (D-020) y la organizadora no necesita ver datos de nadie para su trabajo.
- **Propuso:** Claude · **Decidió:** OlaIA (tarea 6 del plan maestro) · **Hizo:** Claude

### D-022 · Recorridos de la app: un solo menú, «Qué es un badulake» a la vista y menos pasos
- **Fecha:** 19/11/2026
- **Alternativas:** esperar a la revisión de Daniel Torres Burriel (experto en usabilidad) para cambiar nada; retocar solo los textos; un menú distinto en cada página, como hasta ahora.
- **Decisión:** Se escribe el «algoritmo del Badulake» en [recorridos.md](recorridos.md) (los recorridos paso a paso y el árbol del menú) y, con el visto bueno de OlaIA, se rehace la app según él:
  - **Un solo menú arriba en todas las páginas.** Sin sesión: «Qué es un badulake», «Entrar», «Crear cuenta» e idioma. Con sesión: «Badulakes», «Crear un badulake», «Qué es un badulake», «Tu cuenta» e idioma. Marca la página en la que estás. Hay un enlace oculto «Saltar al contenido» para quien navega con teclado.
  - **«Qué es un badulake»**: sección en la portada y página propia (`/que-es`), con qué es, cómo funciona en cuatro pasos y el resumen (gratis, sin dinero, de 5 a 10 personas, solo mayores de 18). Es pública también en producción.
  - **Menos pasos:** al entrar se va directamente a los badulakes (no a «Tu cuenta»); al crear un badulake el botón principal es «Publicar», que lo publica de una vez («Guardar como borrador» queda como segunda opción); al salir se vuelve a la portada.
  - **Mensajes claros:** lista vacía («Todavía no hay badulakes…» con botón para crear uno), «¡Te has apuntado!», «Te has borrado de este badulake», «ya no quedan plazas», y por qué te pide entrar si llegas sin sesión. Los avisos de éxito se anuncian como estado y los de error como alerta.
  - **Encontrar lo tuyo:** la lista enseña también tus badulakes (aunque sean borradores) y marca los tuyos y aquellos en los que te has apuntado. Cada badulake tiene «Volver a los badulakes».
  - **Mismas palabras siempre:** Entrar, Crear cuenta, Salir, Badulakes, Crear un badulake, Apuntarme / Borrarme, Tu cuenta.
- **Cerrado en producción:** lo que va con cuenta sigue cerrado con `CUENTAS_ABIERTAS` (D-019); en la web pública el menú solo enseña «Qué es un badulake».
- **Fuera de esta tarea:** diseño visual y logo (tarea 14), fotos, seguridad (8), privacidad (9), correos (10) y revisión completa de accesibilidad (11). En el contenido de la app no hay referencias a Los Simpson; el nombre «badulake» no se toca.
- **Por qué:** El guion (episodio 3) anticipa las críticas: navegación inconsistente, etiquetas ambiguas, malos mensajes y la palabra «badulake» sin explicar. OlaIA decidió que los expertos revisan al final, así que se corrige ya.
- **Propuso:** Claude · **Decidió:** OlaIA (tarea 7 del plan maestro) · **Hizo:** Claude

### D-023 · Seguridad antes de abrir: reglas de la base de datos revisadas, escudos en la web y límite de intentos
- **Fecha:** 19/11/2026
- **Alternativas:** esperar a la revisión del experto en seguridad (episodio 4); usar un servicio de pago para el límite de intentos o un CAPTCHA; pasar al plan Pro de Supabase para comprobar contraseñas filtradas.
- **Decisión:** Se revisa todo lo hecho en las Tareas 2 a 7 y se deja escrito en [seguridad.md](seguridad.md):
  - **Base de datos** (`supabase/seguridad.sql`): se arreglan los avisos del Security Advisor de Supabase (la vista de plazas ocupadas pasa a ser la función `plazas_ocupadas`; ruta fija en `hora_actual`; la lista de espera comprueba la forma del correo; nadie puede llamar a `rls_auto_enable`); un borrador con fecha pasada no se publica; lo que se cree en el futuro empieza sin permisos. Atacada con la clave pública y dos cuentas inventadas: 48 de 48 pruebas superadas.
  - **Web:** enlace de verificación con dirección fija; solo se aceptan idiomas de verdad (sin redirecciones fuera de la web); cabeceras de seguridad en todas las páginas (CSP, HSTS, nosniff, Referrer-Policy, prohibido incrustarla); límite de intentos propio en entrar, crear cuenta, apuntarse y lista de espera, además de los de Supabase.
  - **Supabase Auth:** contraseña mínima de 8 (antes 6), contraseña actual y sesión reciente para cambiarla, enlaces mágicos apagados. La verificación por correo sigue obligatoria.
  - **Dependencias:** 0 fallos conocidos; actualizadas dentro de la misma versión.
- **No se hace:** comprobar contraseñas filtradas (solo plan Pro, 25 $/mes) ni CAPTCHA (no hace falta mientras esté cerrado).
- **Cerrado en producción:** todo sigue como estaba (D-018, D-019).
- **Altas en Supabase apagadas hasta el lanzamiento:** OlaIA apagó «Allow new users to sign up» el 19/11/2026; se vuelve a encender el día del lanzamiento junto con `CUENTAS_ABIERTAS` (lista en [seguridad.md](seguridad.md)). El fallo de compilación con `CUENTAS_ABIERTAS=1` quedó arreglado en la Tarea 8.1.
- **Por qué:** La app guarda direcciones de casas y datos de personas: tiene que ser segura antes de que entre nadie, y el guion anticipa que el experto buscará fallos.
- **Propuso:** Claude · **Decidió:** OlaIA (tarea 8 del plan maestro) · **Hizo:** Claude (OlaIA autorizó los cambios en Supabase)
