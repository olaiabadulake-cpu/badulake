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

### D-024 · Privacidad por diseño: nadie ve quién organiza, los datos se borran solos y todo se procesa en Frankfurt
- **Fecha:** 19/11/2026
- **Alternativas:** esperar al texto de la Asesoría Jurídica para tocar nada; guardar los badulakes pasados sin límite; borrar a mano; plazos de 7 o de 90 días; dejar la parte del servidor de la web en EE. UU. (opción por defecto de Vercel).
- **Decisión:** Se revisa la app con el RGPD y se deja escrito en [privacidad.md](privacidad.md) (borrador del registro de actividades y ficha para la Asesoría):
  - **Minimización** (`supabase/privacidad.sql`): nadie más puede leer quién organiza un badulake ni a quién pertenece una dirección (la web usa la función `mis_badulakes()` para saber cuáles son tuyos). El límite de intentos ya no tiene en memoria la IP ni el correo tal cual, solo una huella cifrada.
  - **Plazos de conservación**, decididos por OlaIA y aplicados solos cada noche con Supabase Cron (función `borrar_datos_caducados()`): dirección exacta, 1 día después del badulake; badulake e inscripciones, 30 días después; lista de espera, 12 meses como máximo; sesiones sin usar, 90 días; registro de accesos de Supabase Auth, 30 días.
  - **Frankfurt:** la parte del servidor de la web pasa de Washington a Frankfurt (`"regions": ["fra1"]` en `app/vercel.json`), junto a la base de datos.
  - **Cookies:** solo técnicas (idioma y sesión); sin banner. Comprobado que no hay otras ni scripts de terceros.
  - **Página `/privacidad`:** borrador provisional en lenguaje llano, marcado como tal (castellano y euskera), con qué se guarda, para qué, quién lo ve, dónde, cuánto tiempo, derechos y cookies. Enlace en el pie de todas las páginas y en «Crear cuenta».
  - **Derechos:** por correo a EITB (dirección pendiente de la Asesoría); el botón de borrar la cuenta llegó en la Tarea 21 (D-034).
- **Cerrado en producción:** `PRIVACY_NOTICE_READY` y `CUENTAS_ABIERTAS` siguen apagados (D-018, D-019).
- **Por qué:** El RGPD exige privacidad desde el diseño y guardar los datos solo el tiempo necesario. La dirección de una casa no sirve de nada después del badulake. Saber qué badulakes organiza la misma persona podría revelar dónde vive y cuándo está en casa.
- **Propuso:** Claude · **Decidió:** OlaIA (tarea 9 del plan maestro; plazos y correo de derechos) · **Hizo:** Claude

### D-025 · Accesibilidad nivel AA: lo que aún no está traducido se marca con su idioma verdadero
- **Fecha:** 19/11/2026
- **Alternativas:** dejar `lang` de la página tal cual (lectores de pantalla leen castellano con acento extranjero); no dejar elegir lenguas sin traducir; marcar cada texto suelto.
- **Decisión:** El nivel de accesibilidad es **WCAG 2.2 AA** (detalle en [accesibilidad.md](accesibilidad.md)). Como solo el castellano y el euskera tienen todos los textos, en las demás lenguas el selector y la portada siguen con su lengua, pero el menú, el contenido de cada página, el enlace de privacidad y las fechas llevan `lang="es"` (`app/src/i18n/content-lang.ts`). Al completar una lengua hay que añadirla a la lista `complete` de ese archivo.
- **Por qué:** `lang` mal puesto hace que el lector de pantalla pronuncie mal y es un fallo de WCAG (3.1.1 y 3.1.2). Es la corrección más pequeña que no cambia el diseño ni obliga a esperar a las traducciones.
- **Propuso y hizo:** Claude (tarea 11 del plan maestro) · **Decidió:** Claude, por ser técnica; OlaIA puede cambiarla.


### D-026 · Textos legales: borradores completos para la Asesoría, publicados y marcados como provisionales
- **Fecha:** 19/11/2026
- **Alternativas:** esperar a que la Asesoría Jurídica de EITB escriba los textos desde cero; publicar solo la privacidad; usar plantillas genéricas de internet.
- **Decisión:** Claude redacta en castellano claro cuatro borradores completos en [legal/](legal/README.md): aviso legal (LSSI), política de privacidad (RGPD y LOPDGDD), condiciones de uso y política de cookies. Parten de lo que la app hace de verdad (D-006, D-010 a D-012, D-018 a D-025 y la ficha [privacidad.md](privacidad.md)). Cada uno empieza con «BORRADOR para revisión de la Asesoría Jurídica de EITB — no es un texto definitivo» y una lista de dudas; los datos que no se conocen (razón social, NIF, domicilio, correo de contacto, delegado de protección de datos, tribunales, licencia del código) quedan como **[A COMPLETAR POR ASESORÍA]**, nunca inventados. Se copian en el Google Doc «Badulake · Borrador de textos legales» para que la Asesoría comente y corrija, y se publican en la app (`/aviso-legal`, `/privacidad`, `/condiciones`, `/cookies`, con enlaces en el pie de todas las páginas) con el recuadro «Borrador provisional».
- **Criterios que se proponen a la Asesoría:** bases legales (consentimiento para la lista de espera; ejecución del servicio para cuentas, badulakes e inscripciones; interés legítimo para comprobar la edad y la seguridad); sin dinero ni venta entre personas; EITB solo pone en contacto, no es parte del intercambio; cookies solo técnicas, sin banner; autoridad de control AEPD (o también la agencia vasca: duda).
- **Sigue cerrado:** `PRIVACY_NOTICE_READY` y `CUENTAS_ABIERTAS` siguen apagados. No se abre nada hasta que la Asesoría entregue los textos definitivos y se sustituyan los borradores.
- **Pendiente:** texto definitivo de la Asesoría; traducción al euskera y a las demás lenguas (solo después de validarlo, ver [traducciones.md](traducciones.md)); sumar a la política el proveedor de correo (Tarea 10) y las denuncias (Tarea 13).
- **Propuso y redactó:** Claude (tarea 12 del plan maestro) · **Decidió:** OlaIA (pidió intensidad media para un borrador completo y útil)

### D-027 · Denunciar un badulake, suspender cuentas y un panel sencillo para el equipo
- **Fecha:** 19/11/2026
- **Alternativas:** revisar las denuncias solo desde el panel de Supabase (sin pantalla); marcar al equipo con un dato del perfil o de la sesión (la persona podría cambiarlo); poder denunciar también personas y mensajes; borrar el badulake en vez de ocultarlo.
- **Decisión** (`supabase/denuncias.sql`, [seguridad.md](seguridad.md), [privacidad.md](privacidad.md)):
  - **Denunciar:** quien tenga sesión ve «Denunciar este badulake» en su detalle (no en los suyos): elige un motivo (estafa o piden dinero · ofensivo o discriminatorio · datos personales de alguien · algo ilegal o peligroso · spam o repetido · otro) y puede escribir hasta 300 letras. La tabla `denuncias` tiene RLS: cada persona solo crea las suyas, de badulakes que puede ver, una abierta por badulake, y **no puede leer ninguna**. Límite de 5 denuncias por hora.
  - **Equipo:** la tabla `equipo` solo se rellena desde el panel de Supabase; la app no puede leerla ni escribirla. Las funciones `equipo_*` comprueban primero que quien llama está en ella.
  - **Panel `/[locale]/equipo`:** solo para el equipo (para el resto, 404; cerrado también con `CUENTAS_ABIERTAS`). Enseña la denuncia abierta, el motivo, lo que escribió la persona y el badulake (título, descripción, zona y fecha). **No enseña** quién denuncia, quién organiza, ni correos ni la dirección exacta (D-024). Acciones: ocultar o volver a mostrar el badulake, **suspender a quien lo organiza** y marcar la denuncia como resuelta.
  - **Se aplica en la base de datos:** un badulake oculto no lo ve nadie salvo su organizadora (con aviso), no admite inscripciones y deja de enseñar su dirección a quien se había apuntado. Una cuenta suspendida no puede entrar (Supabase Auth la bloquea y se cierran sus sesiones) ni, con una sesión que aún no haya caducado, crear, publicar, apuntarse ni denunciar; sus badulakes se ocultan. No se puede suspender a una cuenta del equipo.
  - **Levantar una suspensión** se hace desde el panel de Supabase (instrucciones en [seguridad.md](seguridad.md)); no hay botón.
  - **Plazo:** las denuncias se borran con el badulake, 30 días después de celebrarse (D-024).
- **No entra:** avisos por correo (Tarea 10), estadísticas (15), denunciar personas o mensajes, borrar cuentas (21).
- **Cerrado en producción:** con `CUENTAS_ABIERTAS`, como el resto. Día del lanzamiento: dar de alta al equipo (ver [seguridad.md](seguridad.md)).
- **Por qué:** Una app que pone en contacto a desconocidos en casas necesita una forma de denunciar y de actuar rápido, sin que el equipo tenga que ver más datos personales de los imprescindibles.
- **Propuso:** Claude · **Decidió:** OlaIA (motivos y equipo: la propuesta de Claude; solo su cuenta por ahora) · **Hizo:** Claude (tarea 13 del plan maestro; OlaIA autorizó los cambios en Supabase)

### D-028 · Diseño visual «Luz de barrio»: un pequeño sistema de estilos sobre la marca que ya existe
- **Fecha:** 19/11/2026
- **Alternativas:** B «Armario compartido» (terracota, lila y berenjena, títulos con serifa Fraunces y texto Nunito): más nueva, pero se aleja de la marca actual; esperar a LIN3S sin tocar nada.
- **Decisión:** OlaIA elige la dirección A «Luz de barrio»: se conservan el amarillo (#FEDB75) y el azul noche (#161944) de badulake.org, con Raleway en los títulos y Roboto en el texto, ya cargadas, así que no hay recursos nuevos ni costes. Cabecera amarilla, pie azul noche, fondo crema, tarjetas de badulake blancas con borde azul y sombra amarilla «de pegatina», botones redondeados de 44 px de alto como mínimo. Todo sale de un solo sitio, `app/src/app/globals.css` (colores, letras y piezas `pagina`, `titulo-1/2/3`, `boton`, `boton-2`, `campo`, `etiqueta`, `ayuda`, `aviso`, `aviso-error`, `tarjeta`, `etiqueta-pildora`), descrito en [diseno.md](diseno.md). Logotipo en texto y SVG (`logo.tsx`: símbolo «ë» en círculo y «badulakë» con la «a» subrayada) e icono de la app `icon.svg` (para la Tarea 16). Página 404 con marca, también para direcciones que no existen en ninguna lengua. No cambian recorridos ni textos, salvo los tres de la 404.
- **Provisional:** es una base hasta que LIN3S entregue la identidad y Miren Sanz (EITB) la valide; para cambiarla basta con tocar `globals.css` y `logo.tsx`.
- **Propuso y aplicó:** Claude (tarea 14 del plan maestro) · **Decidió:** OlaIA


### D-029 · Contador para el equipo y analítica de visitas sin cookies (Vercel Web Analytics)
- **Fecha:** 19/11/2026
- **Alternativas:** Google Analytics o píxel de Meta (cookies, seguimiento entre webs, banner obligatorio); Plausible o Umami (otra empresa más, de pago o con servidor propio); no medir nada.
- **Decisión:**
  - **Contador** (`supabase/contador.sql`): la función `equipo_contador()` devuelve cuentas creadas, usuarias activas (han entrado o usado su sesión en los últimos 30 días), badulakes publicados (no ocultos), inscripciones y personas en la lista de espera. Solo números; comprueba `soy_equipo()` (a quien no es del equipo y a la clave pública les da error). Se ve arriba del panel `/equipo`. No hay contador público (si OlaIA lo quiere, se pregunta).
  - **Analítica:** **Vercel Web Analytics** (`@vercel/analytics`), sin cookies, sin guardar IP y sin seguirte entre webs (según Vercel). Mide página, web de origen (Instagram, Facebook…), país y tipo de dispositivo. El script y los avisos salen del mismo dominio (ruta propia del mismo dominio), así que **la política de seguridad (CSP) no cambia** (D-023). Sigue sin hacer falta banner de cookies; los textos de `/privacidad` y `/cookies` y las políticas para la Asesoría lo explican.
  - **Coste (precios oficiales, comprobados 19/11/2026):** plan Hobby, gratis: 50.000 eventos al mes, datos de 1 mes, **sin parámetros utm**. El complemento «Web Analytics Plus» (10 $/mes) añade utm y 24 meses. Las visitas desde Instagram y Facebook se distinguen por la web de origen sin pagar; para separar campañas por `utm_campaign` hace falta Plus (decide OlaIA antes de las campañas). Los precios de Vercel Pro que publica su documentación no coinciden entre sus páginas: revisar antes de contratar.
- **No entra:** píxel de Meta ni nada con cookies (si se quisiera, habría que añadir banner con consentimiento previo y cambiar CSP, privacidad y cookies).
- **Propuso y hizo:** Claude (tarea 15 del plan maestro) · **Decidió:** Claude, por ser técnica; OlaIA puede cambiarla.

### D-030 · Lista de interés «VIP» y «BaduCoins» y coste de la app: se mide el interés, nada se cobra
- **Fecha:** 19/11/2026
- **Alternativas:** lanzar un botón de compra o una moneda de prueba (eso sería cobrar o simularlo, D-012); no preguntar nada; guardar el interés sin decir que no existe.
- **Decisión:**
  - **Lista de interés** (`supabase/interes.sql`): en «Tu cuenta», dos ideas explicadas en una frase cada una y dejando claro que **hoy no existen y no cuestan nada**, con un botón «Me interesa» / «Ya no me interesa» por cada una. La tabla `interes` (persona, opción, fecha) tiene RLS: cada persona solo ve, crea y borra lo suyo. El equipo ve solo el número total por opción en el contador (`equipo_interes()`, con `soy_equipo()`).
  - **Tratamiento** añadido a [privacidad.md](privacidad.md) (2.6), a la política de privacidad de la Asesoría, a `/privacidad` (castellano y euskera) con base legal propuesta: consentimiento, retirable.
  - **Coste** en [costes.md](costes.md): hoy 0 USD; con 100 usuarias ≈ 45 USD/mes; con 1.000, ≈ 45–75 USD/mes (estimación; dominio pendiente, sin precio en la hoja).
- **Por qué:** El guion del episodio 6 habla de VIP y BaduCoins; la app puede medir si la gente las quiere sin cobrar nada ni prometer algo que no existe.
- **Propuso y hizo:** Claude (tarea 17 del plan maestro) · **Decidió:** OlaIA (la idea de medir interés y no cobrar)

### D-031 · App instalable (PWA): manifiesto por idioma, iconos y un service worker que no guarda datos
- **Fecha:** 19/11/2026
- **Alternativas:** app en las tiendas (descartada en D-013); service worker que guarde páginas para usarlas sin conexión (descartado: habría datos personales y direcciones en el móvil); ventana emergente de «Instalar» al entrar (molesta e inaccesible).
- **Decisión** (Tarea 16 del plan maestro):
  - **Manifiesto** `/<idioma>/manifest.webmanifest` (uno por idioma, para que la app instalada se abra en el idioma desde el que se instaló): nombre «Badulake», `display: standalone`, fondo crema #FFF6DC y color de tema amarillo #FEDB75 (D-028). Iconos 192 y 512 (círculo del icono de la Tarea 14), 192 y 512 «maskable» (cuadrado, símbolo al 62 %) y el de iPhone de 180 px, generados con `app/scripts/iconos.mjs` en `app/public/iconos/`.
  - **Instalar:** en el pie de todas las páginas, sin ventanas. En Android/Chrome sale el botón «Instalar» cuando el navegador lo permite; en iPhone/iPad, un desplegable «Instálala en tu móvil» con «Compartir → Añadir a pantalla de inicio». Si ya está instalada, no sale nada. Textos en castellano y euskera (las demás lenguas, castellano marcado con `lang="es"`).
  - **Service worker** (`app/public/sw.js`, registrado solo en producción): guarda **solo** la página «sin conexión» (`/sin-conexion.html`, castellano y euskera) y un icono. No guarda páginas, datos de nadie ni respuestas de la API: cada visita va a la red, y solo si falla una página se enseña la de «sin conexión». Cabecera `no-cache` en `sw.js`.
  - **CSP: no cambia** (D-023): el service worker y el manifiesto salen del mismo dominio (`script-src`/`default-src 'self'`).
- **No entra:** notificaciones push, tiendas, usar datos sin conexión.
- **Propuso y hizo:** Claude (tarea 16 del plan maestro) · **Decidió:** Claude, por ser técnica; OlaIA puede cambiarla.

### D-032 · Cupo, lista de espera del badulake y cancelación automática: todo lo decide la base de datos
- **Fecha:** 19/11/2026
- **Alternativas:** decidir quién entra desde la web (dos personas a la vez podrían coger la misma plaza); guardar «confirmado» como estado (se quedaría desfasado si alguien se borra); que quien espera vea la dirección; avisos solo por correo; una tarea programada fuera de Supabase (Vercel Cron, GitHub Actions) o ninguna (cancelar a mano); dejar crear badulakes para dentro de pocas horas.
- **Decisión** (`supabase/cupo.sql`, [seguridad.md](seguridad.md) §10, [privacidad.md](privacidad.md) §2.4.1, [recorridos.md](recorridos.md)):
  - **Lista de espera:** si no quedan plazas, el botón pasa a «Ponerme en lista de espera» (misma función `apuntarme()`, con el mismo bloqueo del badulake). Nueva tabla `espera` con RLS: cada persona solo ve y borra sus filas; nadie ve quién más espera, tampoco la organizadora. La persona ve su puesto («Estás en la lista de espera: eres la 2.ª») y puede salir. **Quien espera no ve la dirección exacta.** Cuando alguien se borra (o se borra su cuenta), en la misma operación de la base de datos entra la primera de la lista por orden de llegada, sin carreras. Las cuentas suspendidas (D-027) no pueden apuntarse ni ponerse en la lista, y si ya estaban no entran ni cuentan para el puesto.
  - **Estados:** `borrador`, `publicado` y `cancelado` se guardan; **«Confirmado» se calcula** (publicado con 5 apuntadas o más), así nunca se queda desfasado. Lista y detalle enseñan «Confirmado», «Cancelado» o «Faltan N personas para confirmarse». Los cancelados solo salen en la lista a quien organizaba, estaba apuntada o esperaba.
  - **Cancelación automática:** Supabase Cron (gratis, ya activo desde D-024) cada **10 minutos**: cancela los publicados que empiezan en 24 horas o menos con menos de 5 apuntadas. La organizadora puede cancelar el suyo («Cancelar este badulake» → «Sí, cancelarlo»). Un cancelado no admite apuntarse ni lista de espera y **su dirección exacta se borra en el acto**.
  - **48 horas de margen** para crear o publicar un badulake (antes bastaba con que fuera futuro): si no, el corte de 24 horas lo cancelaría casi en el acto. La web y la base de datos lo comprueban. **Confirmado por OlaIA el 20/11/2026** («Sí, 48 horas»).
  - **Avisos dentro de la app** (sin correo): en el detalle y en «Tu cuenta» (sección «Avisos»): «Has entrado desde la lista de espera», tu puesto en la lista y «Este badulake se ha cancelado» (a quien estaba apuntada o esperando, y a la organizadora si se canceló solo; hasta una semana después de la fecha).
  - **Correos que tendrá que enviar la Tarea 10** (no se envía ninguno ahora): a quien entra desde la lista («Tienes plaza en …», con la dirección dentro de la app, no en el correo); a las apuntadas y a la lista cuando se cancela (solo o por la organizadora); a la organizadora cuando se cancela solo; opcional, a la organizadora unas 48 horas antes si aún faltan personas.
  - **Plazos:** la lista de espera de un badulake se borra al empezar; la dirección de un cancelado, al cancelarse; lo demás, como D-024. Políticas de privacidad actualizadas.
  - **Probado** con la clave pública y 15 cuentas inventadas creadas por SQL: 54 de 54, con una carrera de 12 personas a la vez por 5 plazas (entran 5, las otras 7 con puestos 1 a 7) y 3 bajas a la vez con otra entrando (suben las 3 primeras en orden). En el Mac con la web, en castellano y euskera; axe-core 0 fallos. Todo borrado al acabar.
- **No entra:** correos (Tarea 10), herramientas del día del badulake (24), valoraciones, grupos, ver quién se ha apuntado.
- **Cerrado en producción:** con `CUENTAS_ABIERTAS`, como el resto (D-019).
- **Por qué:** el guion pide cupo de 5 a 10, lista de espera y cancelación si no hay mínimo. Solo la base de datos puede repartir plazas de forma justa cuando varias personas pulsan a la vez, y la dirección de una casa no debe verla nadie que no vaya a ir.
- **Propuso y hizo:** Claude (tarea 20 del plan maestro) · **Decidió:** Claude, por ser técnica; el margen de 48 horas lo confirmó OlaIA el 20/11/2026 (el aviso de una semana, OlaIA puede cambiarlo).

### D-033 · QR de Sant Boi, página de llegada `/hola` y prueba de carga sin tocar la web publicada
- **Fecha:** 19/11/2026
- **Alternativas:** que el QR abra la portada (más texto, menos directo); un QR de colores con el logo (se lee peor); prueba de carga fuerte contra badulake.vercel.app (las condiciones de Vercel la limitan a planes de empresa o con aviso previo, y pueden bloquear la conexión de quien prueba); una sola lengua de QR.
- **Decisión** (Tarea 18 del plan maestro):
  - **Página de llegada** `/<idioma>/hola`: pública, corta, sin imágenes ni datos de nadie (se sirve ya preparada, no consulta la base de datos). Explica qué es un badulake en tres pasos y enseña «Crear cuenta» si las cuentas están abiertas, el formulario de la lista de espera si lo está, o «muy pronto». Enlace a «Qué es un badulake». No sale en buscadores (`noindex`). Textos propios en castellano, euskera y catalán (D-025: el resto de lenguas lo ve en castellano).
  - **QR** en `docs/qr/` (SVG y PNG de 3000 px) en castellano, euskera y catalán: negro sobre blanco, margen de 4 módulos y corrección de errores nivel Q. Apuntan a `badulake.vercel.app/<idioma>/hola?utm_source=qr&utm_campaign=santboi`. **Hay que regenerarlos si badulake.app ya funciona** (`node scripts/qr.mjs https://badulake.app`; apartado 8 de `seguridad.md`). Generador: `app/scripts/qr.mjs`.
  - **Medir:** la analítica gratuita (D-029) no separa utm, pero `/es/hola`, `/eu/hola` y `/ca/hola` solo se abren desde los carteles, así que se ven aparte.
  - **Carga:** prueba con autocannon, **en el Mac y con la versión idéntica a la publicada** (200 visitantes a la vez, unas 2.500 visitas por segundo, 0 errores); en la web publicada solo una comprobación suave. Apuntarse a la vez, a escala, en la base real con datos inventados: 120 cuentas a la vez por 10 plazas dieron 10 dentro, 110 en lista con puestos 1 a 110 y 0 errores; todo borrado (`docs/carga.md`).
- **No entra:** abrir cuentas, correos, dominio, herramientas del día del badulake.
- **Propuso y hizo:** Claude (tarea 18 del plan maestro) · **Decidió:** Claude, por ser técnica; OlaIA puede cambiarla.

### D-034 · Borrar la cuenta con un botón, recuperar y cambiar la contraseña
- **Fecha:** 20/11/2026
- **Alternativas:** borrar solo desde el panel de Supabase a petición por correo; borrar también las denuncias hechas; no guardar nada de las cuentas suspendidas borradas.
- **Decisión:**
  - **Borrar mi cuenta** (en «Tu cuenta», escribiendo BORRAR / EZABATU): una función segura de la base de datos (`borrar_mi_cuenta`, `security definer`, ruta fija, solo para quien tiene sesión y solo borra la cuenta de quien llama; `supabase/borrar_cuenta.sql`). Borra perfil, inscripciones (entra la primera de cada lista de espera), listas de espera, «Me interesa» y los badulakes que organiza; los publicados con gente apuntada o esperando se cancelan antes, se quedan sin organizadora ni descripción y se borran 30 días después. Las denuncias que hizo quedan anonimizadas (sin identificador).
  - **Cuentas suspendidas (decide OlaIA, 20/11/2026):** si se borra una suspendida se guarda solo una huella cifrada del correo (tabla `bloqueados`, sin permisos para la app) 12 meses, y la base de datos no deja crear una cuenta con ese correo.
  - **Contraseña:** «¿Has olvidado tu contraseña?» en /entrar (mismo mensaje exista o no el correo, con límite de intentos) y página `/nueva-contrasena` con el enlace del correo; cambiar la contraseña dentro pide la actual.
- **Pendiente:** el correo de recuperación solo llega a quien sea del equipo hasta tener correo propio (Tarea 10). La Asesoría debe confirmar la base legal de la huella.
- **Cerrado en producción:** todo sigue con `CUENTAS_ABIERTAS` (D-019): las páginas nuevas dan 404 en la web publicada.

### D-035 · Copia de pruebas con datos inventados para grabar los fallos del guion
- **Fecha:** 20/11/2026
- **Alternativas:** grabar los fallos en la app real con cuentas inventadas; un ordenador con la base de datos en local; un proyecto de pago.
- **Decisión** (Tarea 22; [copia-pruebas.md](copia-pruebas.md)):
  - La copia es **otro proyecto de Supabase gratuito** (`badulake-pruebas`, Frankfurt) y **otro proyecto de Vercel** (`badulake-pruebas`, rama `pruebas`), con el mismo esquema (`supabase/*.sql`) y datos inventados que se pueden volver a cargar (`supabase/pruebas/02-datos.sql`). Todas las páginas llevan una franja roja «COPIA DE PRUEBAS — DATOS INVENTADOS», `noindex` y sin analítica.
  - **Tres fallos del guion, solo en la copia:** (1) correo sin verificar: el ajuste «Confirm email» de Supabase de la copia (no es variable, porque sin correo propio Supabase no puede enviar a direcciones inventadas); (2) datos de las demás personas a la vista al apuntarse: `PRUEBAS_DATOS_A_LA_VISTA=1` y una función que solo existe en la base de la copia; (3) botones confusos y pasos de más: `PRUEBAS_BOTONES_CONFUSOS=1`.
  - **Producción no puede activarlos:** el código solo los enciende con `PRUEBAS_COPIA=1` **y** `PRUEBAS_SUPABASE_REF` igual a la referencia de `SUPABASE_URL` **y** el interruptor propio. Nada de eso existe en el Vercel real; y aunque se pusiera por error, la base real no coincide. `app/scripts/comprobar-pruebas.mjs` lo comprueba (7 casos).
  - Las claves de la copia solo en Vercel y en `app/.env.pruebas` (ignorado por Git). Coste: 0 €.
- **Propuso:** Claude · **Decidió:** OlaIA · **Hizo:** Claude (OlaIA puso la contraseña de la base de datos)

### D-036 · Herramientas del día del badulake: sorteo del orden, contador de objetos, cola de turnos y «lo que sobra»
- **Fecha:** 20/11/2026
- **Alternativas:** hacerlo en papel o en una hoja de cálculo; guardar el nombre de cada persona en su cuenta (hoy las cuentas no tienen nombre); sortear en el móvil de la organizadora (se podría repetir hasta que salga el orden que conviene); contar con «+1» sueltos (si falla la señal y se reenvía, cuenta doble); que cada apuntada vea toda la cola.
- **Decisión** (Tarea 24; `supabase/dia.sql`, [recorridos.md](recorridos.md) recorrido G, [seguridad.md](seguridad.md) §13, [privacidad.md](privacidad.md) §2.4.2):
  - **Modo badulake:** botón y página `/[idioma]/badulakes/<id>/dia`, **solo para la organizadora** (para el resto, la página no existe) y **solo el día del evento**: desde **2 horas antes** de la hora hasta **1 día después**, con el badulake publicado y confirmado (5 apuntadas o más al abrirlo; si luego alguien se borra no se cierra). Lo comprueba la base de datos, no la web.
  - **Quién sale:** las apuntadas **y la propia organizadora** (también intercambia). Como las cuentas no tienen nombre, aparecen como «Persona 3» y la organizadora puede escribirles a mano un nombre o apodo (opcional, 30 letras, solo para ese día).
  - **«No ha venido» / «Ha llegado» (idea de OlaIA, reversible):** quien no ha venido sale de los sorteos y de la cola. Si llega tarde y se pulsa «Ha llegado», **entra desde ese momento**: la última en el orden de exponer y la última en la cola de elegir (con su propio número al azar para los empates); no cambia nada de lo ya sorteado.
  - **Sorteo del orden de exponer:** en el servidor (`dia_sortear_orden`), **una sola vez**: repetirlo responde «ya sorteado» y queda guardada la hora. El botón pide confirmación.
  - **Contador:** ropa, calzado, accesorios y otros, con **+** y **−** grandes (0 a 99). Se envían los **valores completos, no «+1»**, así que reenviar tras una mala señal no cuenta doble. Si no hay señal, lo contado **queda guardado en el móvil** y se envía solo al volver (aunque se recargue la página); el aviso de arriba dice «Guardando», «Todo guardado» o «Sin conexión».
  - **Cola para elegir:** «Empezar a elegir» la congela una sola vez: **más objetos aportados primero; si empatan, sorteo** (un número al azar por persona, guardado). «Siguiente turno» avanza y se salta a quien no ha venido. Antes de empezar se ve una vista previa.
  - **Apuntadas:** en el detalle ven «Tu turno es el 3.º» (o su puesto para exponer, o de quién es el turno ahora). Solo su fila: ni nombres ni aportes de nadie. La tabla no se lee ni se escribe desde fuera (RLS sin permisos, salvo leer la propia fila de turnos); todo va por funciones.
  - **«Lo que sobra»:** cuatro consejos de texto (bolsas por tipo, tienda solidaria o contenedor, que cada una recupere lo suyo, dejar el sitio como estaba). Sin contadores extra: es lo mínimo.
  - **Plazo:** todo lo del día se borra **1 día después del badulake** (Supabase Cron, 03:20 UTC, `borrar_dia_caducado()`), también con la cuenta o el badulake. Políticas de privacidad actualizadas (`/privacidad` es/eu y `docs/legal`).
  - **Probado** con 8 cuentas inventadas creadas por SQL y deshechas solas (32 comprobaciones: ajena, apuntada y organizadora; sorteo único; desempate; llegada tarde; fuera de hora; sin confirmar; borrado) y con 6 cuentas en la web del Mac (castellano y euskera, móvil, sin señal y recarga; axe 0 fallos y 0 dudas). Todo borrado: 0 cuentas, 0 badulakes.
- **No entra:** valoraciones, fotos, chat, correos, pagos; contar lo que sobra; que las apuntadas vean la cola entera; nombres en las cuentas.
- **Cerrado en producción:** con `CUENTAS_ABIERTAS`, como el resto (D-019): sin las cuentas abiertas, la página da 404.
- **Por qué:** el guion pide sortear quién enseña, contar objetos y dar turnos con desempate, y el día del evento hay prisa, poca señal y manos ocupadas. Que sortee la base de datos y una sola vez impide la trampa; mandar valores completos y guardar en el móvil evita perder o duplicar lo contado.
- **Propuso y hizo:** Claude (tarea 24 del plan maestro) · **Decidió:** OlaIA (recorrido aprobado el 20/11/2026; «No ha venido» reversible idea suya); la ventana de 2 h antes y que la organizadora también salga en la lista, Claude (OlaIA puede cambiarlo).

### D-037 · El título de un badulake es el lugar: barrio, ciudad y provincia, nunca un tema
- **Fecha:** 20/11/2026
- **Alternativas:** dejar el título libre con un ejemplo de lugar; que la organizadora escriba el título con un formato; un solo campo «lugar».
- **Decisión** (Tarea 5.1; `supabase/titulo_lugar.sql`, [recorridos.md](recorridos.md) recorrido E, [privacidad.md](privacidad.md) §2.3): el formulario de crear pide **barrio, ciudad o pueblo y provincia** (2–40, 2–40 y 2–30 letras) y no hay campo de título. La función `crear_badulake` los recibe y **forma el título ella misma**: «Badulake de Gràcia, Barcelona», y si la provincia es distinta de la ciudad, «Badulake de Deusto, Bilbao (Bizkaia)». Como nadie puede insertar directamente en `badulakes` (D-020), **ningún badulake puede titularse por un tema**, tampoco saltándose la web. La columna `zona` pasa a guardar el barrio (el listado, las denuncias y la lista de espera siguen igual); el límite del título sube de 80 a 130 letras para que quepa el título formado. Se quitan los ejemplos y ayudas que sugerían temas (la ayuda de la descripción ya no habla de «qué vais a intercambiar»). El prefijo «Badulake de» se guarda en castellano también en euskera (es el título guardado; las otras lenguas usan el mismo). Cupo, lista de espera, cancelación y día del badulake no cambian. Copia de pruebas: datos inventados con el mismo formato y `juntar-esquema.sh` carga el nuevo script.
- **No entra:** buscar o filtrar por ciudad (los datos ya están separados solo en el título; si se necesita, habrá que guardar ciudad y provincia en columnas).
- **Por qué:** el badulake es un sitio y una hora, no un tema; así nadie convoca «de ropa infantil» y se evita sugerir que hay que traer cierto tipo de cosas.
- **Propuso:** OlaIA (idea tras la Tarea 22) · **Decidió:** OlaIA · **Hizo:** Claude (Tarea 5.1)

### D-038 · Para organizar hay que haber ido antes a un badulake (con permiso del equipo para los primeros)
- **Fecha:** 20/11/2026
- **Alternativas:** que bastara con haberse apuntado; exigir que la organizadora marque «Ha llegado»; invitaciones o «madrinas»; que solo organice el equipo.
- **Decisión** (Tarea 5.2; `supabase/haber_ido.sql`, [seguridad.md](seguridad.md) §14, [privacidad.md](privacidad.md) §2.3.1, [recorridos.md](recorridos.md) recorrido E). **Decidido por OlaIA el 20/11/2026:**
  - **Haber ido** = estar apuntada a un badulake **ya celebrado** (publicado, ni cancelado ni oculto) **y** que la organizadora no la marcara «No ha venido» en el Modo badulake (D-036). También cuenta haber organizado uno celebrado.
  - **Excepción:** el **equipo** (D-027) puede organizar siempre y desde `/equipo` puede **dar o quitar permiso** a una persona escribiendo su correo (función `equipo_permiso_organizar`; el correo no se guarda y el panel nunca enseña quién tiene permiso). Quitar el permiso solo quita el dado por el equipo, no el de haber ido.
  - **La base de datos lo decide:** `crear_badulake` rechaza con «aun_no_puedes_organizar» y la política de publicar un borrador exige `puedo_organizar()`, además de las comprobaciones anteriores (48 horas, cuenta no suspendida). La web enseña antes un mensaje claro («Todavía no puedes organizar un badulake…») en vez del formulario, y el mismo aviso si falla al crear o publicar.
  - **Registro:** como las inscripciones se borran a los 30 días y la marca «No ha venido» al día siguiente, una tarea de Supabase Cron cada 10 minutos (`registrar_asistencias`) apunta en `permiso_organizar` (persona, motivo, fecha; sin enlace al badulake) a quien ha ido. Además, `puedo_organizar` mira lo que ya se vea en las inscripciones, sin esperar a la tarea. Se borra con la cuenta. La tabla no se lee ni se escribe desde fuera.
  - **Probado** con la clave pública y 7 cuentas inventadas creadas por SQL (sin historial: no; apuntada a uno celebrado: sí; con «No ha venido»: no; apuntada solo a uno futuro: no; organizó uno celebrado: sí; equipo: sí; permiso dado y quitado por el equipo; quien no es del equipo no puede dar permiso; publicar un borrador sin poder: bloqueado por RLS; con permiso: publica), y en la web del Mac (castellano y euskera; el panel `/equipo`); axe-core 0 fallos y 0 dudas. Todo borrado: 0 cuentas, 0 badulakes, 0 permisos.
- **No entra (propuestas para Adrián y la Asesoría):** mostrar «creado por…» y valorarse entre usuarias.
- **Cerrado en producción:** con `CUENTAS_ABIERTAS`, como el resto (D-019). Ojo al abrir las cuentas: **nadie podrá organizar hasta que el equipo dé permiso a las primeras personas** (`/equipo` → «Permiso para organizar»).
- **Por qué:** quien convoca debe conocer las reglas de primera mano. Solo la base de datos puede garantizarlo; y la excepción del equipo evita el problema del huevo y la gallina.
- **Propuso:** Claude, sobre una idea de OlaIA · **Decidió:** OlaIA · **Hizo:** Claude (Tarea 5.2)

### D-039 · Entrar con Google, con la edad confirmada en la base de datos y sin guardar nombre ni foto
- **Fecha:** 21/11/2026
- **Alternativas:** solo correo y contraseña (como hasta ahora); Google, Apple y redes sociales a la vez; enlaces mágicos por correo (esperan a la Tarea 10); fiarse de la edad sin comprobarla.
- **Decisión** (Tarea 4.1; `supabase/google.sql`, [seguridad.md](seguridad.md) §15, [privacidad.md](privacidad.md) §2.2.1). Alcance mínimo («parar pronto»): **solo Google**, y se mantiene el correo con contraseña.
  - Botón «Continuar con Google» en `/entrar` y `/registro` (textos en las 44 lenguas). Es un enlace a `/api/cuenta/google`, que pide a Supabase la dirección de Google; la vuelta es `/api/cuenta/google/vuelta`. Solo aparece con **`GOOGLE_ACTIVADO=1`** (además de `CUENTAS_ABIERTAS=1`), para que no salga en una web cuyo Supabase aún no tiene Google configurado.
  - **18 años.** Google no da la edad. Una cuenta nueva de Google nace **pendiente** (`perfiles.mayoria_edad_comprobada_en` vacío) y la web la lleva a `/confirmar-edad` («Un último paso»), que pide la fecha de nacimiento como el registro. La base de datos lo vuelve a comprobar (`confirmar_mayoria_edad`): mayor de 18 → cuenta lista; menor → **la cuenta se borra en el acto**; la fecha no se guarda. Si no termina, la cuenta se borra sola a las 24 horas (Supabase Cron `borrar-cuentas-sin-edad`, cada hora).
  - **No se puede saltar:** para la base de datos, una cuenta pendiente cuenta como suspendida (`estoy_suspendida()`), así que no puede crear, publicar, apuntarse, denunciar ni usar el día del badulake; y unas reglas RLS restrictivas le impiden ver badulakes, direcciones y la lista de interés. Con correo y contraseña se sigue exigiendo la fecha al crear la cuenta; cualquier otra forma de entrar sin fecha se rechaza.
  - **Datos mínimos:** de lo que manda Google se guardan solo el código de su cuenta (`sub`) y el correo verificado. Nombre, foto y demás se tiran antes de guardar, también en cada nueva entrada (trigger `solo_datos_minimos` en `auth.users` y `auth.identities`).
  - **Google Cloud:** proyecto «Badulake» de la cuenta de Google del proyecto, pantalla de consentimiento «usuarios externos» en **modo de prueba** (solo entran los usuarios de prueba) y un cliente OAuth **solo para la copia de pruebas**. La clave secreta está solo en Supabase. La web real tendrá su propio cliente el día que se abran las cuentas (seguridad.md §8).
  - **Probado** en la base de datos de la copia, con cuentas simuladas que se deshacen: la pendiente no ve badulakes y apuntarse le devuelve «suspendida»; al confirmar con 36 años ve los badulakes y queda en su idioma; con 15 años la cuenta desaparece; correo sin fecha, rechazado; de Google solo quedan `sub` y correo. En la web publicada de la copia, el botón lleva a Google con la vuelta correcta. **Pendiente:** el clic final con una cuenta de Google real (lo hace OlaIA).
- **Cerrado en producción:** con `CUENTAS_ABIERTAS` y sin `GOOGLE_ACTIVADO`; en el Supabase real Google sigue apagado.
- **Por qué:** entrar con Google evita otra contraseña, pero no puede abrir una puerta para menores ni guardar más datos de los que pide la app.
- **Propuso:** conversación maestra (plan de tareas) · **Decidió:** OlaIA · **Hizo:** Claude (Tarea 4.1)

### D-040 · Fallos rojos de la auditoría: la organizadora cuenta en las plazas, el Modo badulake se abre siempre, rutas privadas con 404 de verdad y avisos cuando algo falla
- **Fecha:** 21/11/2026
- **Alternativas:** dejar «plazas» como plazas para apuntarse (6 a 11 personas en total); cambiar el nombre de la columna; exigir 5 apuntadas para el Modo badulake; proteger las rutas solo dentro de cada página.
- **Decisión** (Tareas 24.1, 20.1, 8.3 y 5.3 de [auditoria.md](auditoria.md); `supabase/plazas_organizadora.sql`, `app/src/proxy.ts`):
  - **20.1 · La organizadora cuenta como una persona más (decisión de OlaIA).** Un badulake es de 5 a 10 personas **en total**. La columna `plazas` (de 5 a 10) pasa a ser ese total: para apuntarse quedan `plazas − 1`. `apuntarme()` y la lista de espera (`rellenar_desde_espera`) lo cuentan así; «Confirmado» es 4 apuntadas + la organizadora; la cancelación automática de 24 horas antes cancela si no llegan a 5 contándola a ella. En la web: «Plazas» del formulario dice «Entre 5 y 10 personas, contándote a ti», la organizadora ve «X de N plazas ocupadas, contando la tuya» y los avisos dicen «contando a quien organiza».
  - **Badulakes que ya existían:** nadie pierde su plaza. Si con la regla nueva hay más personas que plazas, el total sube hasta caber (máximo 10). En la copia de pruebas solo cambió uno (Colina del Tejo, de 5 a 6: 5 apuntadas + la organizadora, con 2 en lista de espera). En la web real no había ninguno.
  - **Últimas 24 horas:** el aviso «Si 24 horas antes no son 5, se cancela solo» ya no sale (ese badulake ya pasó la comprobación).
  - **24.1 · Modo badulake:** se abre siempre que el badulake esté publicado (ni cancelado ni oculto) y en su horario (2 horas antes hasta el día siguiente), aunque alguien se haya borrado a última hora. Sigue siendo solo para la organizadora.
  - **8.3 · Rutas privadas:** `proxy.ts` mira la sesión **antes** de enviar nada: sin sesión, `/cuenta` y `/badulakes…` dan una redirección de verdad (307) a «Entrar» y `/equipo` un 404 de verdad; con sesión, un badulake que no existe o no puede ver, una dirección mal escrita, el Modo badulake de otra persona y `/equipo` para quien no es del equipo dan 404 de verdad, sin título ni nada de la página. Antes la respuesta salía con «200», el título y una redirección de 1 segundo. **`/api/hora`** da 404 en la web real; en el Mac y en la copia sigue, con un límite de 10 peticiones por minuto.
  - **5.3 · Avisos:** si «Publicar» falla al crear, queda en borrador y se dice por qué (faltan menos de 48 horas, aún no puede organizar, u otro fallo: «No se ha podido publicar y se ha guardado como borrador»). «Me interesa» solo cambia cuando se ha guardado; si falla, se queda como estaba y avisa. Al probarlo en la copia publicada salió que **nunca se podía guardar**, ni en la copia ni en la web real: la tabla `interes` se creó sin permisos para las cuentas (lo nuevo empieza sin permisos, `seguridad.sql`). Se le dan (`grant select, insert, delete`, apartado 6 de `plazas_organizadora.sql`); las reglas de cada persona solo lo suyo siguen igual. Ejecutado en las dos bases de datos. «Denunciar» no sale en badulakes cancelados ni pasados.
  - **Textos** nuevos o cambiados (6) en las 44 lenguas: versión de Claude comparada con DeepL Pro en las 31 que tiene ([traducciones.md](traducciones.md)).
  - **Probado:** en la base de datos de la copia, 11 comprobaciones con un badulake inventado de 5 plazas (entran 4 + la organizadora y el resto va a la lista; al borrarse una entra la primera de la lista; con 4 apuntadas a 23 horas no se cancela; con 2 a 23 horas se cancela solo; el Modo badulake se abre con 2 apuntadas una hora antes, no para otra persona ni si está cancelado); borrado al acabar. En la web del Mac contra la copia, con la cuenta inventada de Mikel: redirecciones y 404, plazas libres, «contando la tuya», últimas 24 horas sin aviso, «Denunciar» oculto en pasado y cancelado, y el aviso al publicar sin margen. Después, en la copia publicada: redirecciones y 404 de verdad sin sesión y con ella, plazas y avisos en las fichas, y «Me interesa» (marcar, recargar y quitar). La web real sigue con las cuentas cerradas (404) y `/api/hora` da 404.
- **Por qué:** «5 a 10 personas» es lo que se cuenta en todas partes, y la organizadora también intercambia. El día del badulake la organizadora necesita sus herramientas pase lo que pase. Lo privado no debe dejar ver ni el título, y quien pulsa un botón tiene que saber si ha funcionado.
- **Propuso:** Claude (auditoría) · **Decidió:** OlaIA · **Hizo:** Claude (Tareas 24.1, 20.1, 8.3 y 5.3)

### D-041 · «Mis badulakes» en la cuenta y estado «Terminado» con su «gracias»
- **Fecha:** 21/11/2026
- **Alternativas:** una página aparte «Mis badulakes»; guardar «terminado» en la base de datos; marcar terminado al día siguiente.
- **Decisión** (Tarea 6.1 de [auditoria.md](auditoria.md); `app/src/app/[locale]/cuenta/mis-badulakes.tsx`, `app/src/lib/badulake-estado.ts`):
  - En «Tu cuenta», la sección **«Mis badulakes»** junta los que organizo, a los que me he apuntado y en los que espero, en **Próximos** y **Pasados**, con sus etiquetas (Lo organizas tú, Te has apuntado, En lista de espera, Cancelado, Terminado, Borrador). Sin badulakes: «Todavía no tienes ningún badulake…» y el botón «Ver los badulakes». Los pasados se ven mientras existen (30 días, D-024).
  - **«Terminado»** no se guarda, se calcula (como «Confirmado», D-032): un badulake publicado está terminado **2 horas después de empezar**, lo mismo que dura en el calendario. En su ficha sale «Este badulake ya ha terminado», «¡Gracias por organizarlo!» a la organizadora y «¡Gracias por venir!» a quien fue (apuntada y sin «No ha venido»); ya no salen las plazas, el calendario ni «Me borro».
  - **«Ya puedes organizar»:** quien ha ido a uno y puede organizar (D-038) lo ve en la ficha, con el botón «Organizar mi badulake», y como aviso en «Tu cuenta» mientras no organice ninguno.
  - Textos nuevos (13) en las 44 lenguas; en las lenguas eslavas e italiano se escribieron sin marcar género («Gracias por la participación»).
  - **Copia de pruebas:** un badulake ya celebrado inventado (Barrio del Sauce, organizado por Ane, con Mikel, Nerea, Iker y Maialen), también en `02-datos.sql`.
- **Por qué:** la auditoría vio que no había forma de encontrar los badulakes propios ni de cerrar el ciclo después de ir; el «gracias» y el «ya puedes organizar» empujan a que quien va organice el siguiente.
- **Propuso:** Claude (auditoría) · **Decidió:** OlaIA (aprobó la auditoría) · **Hizo:** Claude (Tarea 6.1)
