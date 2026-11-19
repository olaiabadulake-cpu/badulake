# Privacidad de Badulake

Ficha hecha el 19/11/2026 (Tarea 9 del plan maestro, decisión D-024). Es el **borrador del registro de actividades de tratamiento** y la **ficha para la Asesoría Jurídica de EITB**, que redactará el aviso de privacidad definitivo. Describe lo que la app hace **de verdad** hoy, comprobado en el código y en la base de datos.

**Estado:** la app sigue cerrada al público. La lista de espera (`PRIVACY_NOTICE_READY`) y las cuentas (`CUENTAS_ABIERTAS`) están apagadas en producción, y las altas están apagadas en Supabase. Hoy no hay datos de ninguna persona real guardados.

## En pocas palabras

- Se guarda **lo mínimo**: ni nombre, ni teléfono, ni foto, ni fecha de nacimiento.
- **Nadie ve datos de otra persona**: ni su correo, ni quién organiza un badulake, ni quién se ha apuntado. La dirección exacta solo la ven la organizadora y las personas apuntadas.
- Los datos **se borran solos** cuando ya no hacen falta (cada noche, con una tarea programada en Supabase).
- **Todo se guarda y se procesa en Frankfurt** (UE).
- **Solo cookies técnicas** (idioma y sesión): no hace falta aviso de cookies.

## 1. Responsable

**EITB** (Euskal Irrati Telebista). *Pendiente de la Asesoría:* datos de contacto, delegado de protección de datos y su correo.

## 2. Actividades de tratamiento

### 2.1 Lista de espera

| | |
|---|---|
| **Datos** | Correo, zona o barrio, idioma de los avisos, fecha del consentimiento y fecha del alta (tabla `lista_espera`). |
| **Para qué** | Avisar del lanzamiento de Badulake. |
| **Base legal propuesta** | Consentimiento (art. 6.1.a RGPD): casilla obligatoria sin marcar y enlace al aviso. |
| **Quién lo ve** | Nadie desde la web: con la clave pública solo se puede añadir, no leer. Solo el equipo, desde el panel de Supabase. |
| **Cuánto tiempo** | Hasta avisar del lanzamiento y, **como mucho, 12 meses** desde el alta (borrado automático). |

### 2.2 Cuentas

| | |
|---|---|
| **Datos** | Correo y contraseña cifrada (Supabase Auth); idioma y fecha en que se comprobó la mayoría de edad (tabla `perfiles`). Supabase Auth guarda además las sesiones abiertas (con la dirección IP y el navegador) para mantener la sesión. |
| **Lo que NO se guarda** | La **fecha de nacimiento**: se usa solo para comprobar los 18 años y la base de datos la borra antes de guardar la cuenta (D-019). |
| **Para qué** | Entrar en la app y usarla; comprobar que solo hay mayores de 18. |
| **Base legal propuesta** | Ejecución del servicio que pide la persona (art. 6.1.b). La comprobación de edad, interés legítimo de proteger a menores (6.1.f) — *a confirmar*. |
| **Quién lo ve** | Solo la propia persona (su perfil). Nadie más, ni otras cuentas. |
| **Cuánto tiempo** | Hasta que la persona pida borrarla (el botón llegará en la Tarea 21). Las **sesiones sin usar 90 días** se borran solas (hay que volver a entrar). |
| **Pendiente de decidir** | Qué hacer con cuentas que nunca se usan (por ejemplo, borrarlas tras 2 años avisando antes por correo; necesita el correo propio, Tarea 10). |

### 2.3 Badulakes

| | |
|---|---|
| **Datos** | Título, descripción, fecha y hora, zona o barrio, plazas, estado (borrador o publicado) y quién lo organiza (tabla `badulakes`). La **dirección exacta** va aparte (tabla `badulakes_direccion`). |
| **Para qué** | Que otras personas encuentren el badulake y puedan ir. |
| **Base legal propuesta** | Ejecución del servicio (6.1.b). |
| **Quién lo ve** | Un badulake publicado lo ven las personas con cuenta, **sin dirección y sin saber quién lo organiza** (corregido en esta tarea: antes se podía leer el identificador de la organizadora). Los borradores, solo la organizadora. La **dirección**, solo la organizadora y las personas apuntadas. |
| **Cuánto tiempo** | La **dirección se borra al día siguiente** del badulake. El **badulake, 30 días después** (margen para quejas o denuncias). |
| **Aviso para la Asesoría** | La dirección suele ser la de una casa: es el dato más delicado de la app. La descripción es texto libre: la organizadora podría escribir datos personales (lo explicarán las condiciones de uso, Tarea 12). |

### 2.4 Inscripciones (apuntarse a un badulake)

| | |
|---|---|
| **Datos** | Qué persona se apunta a qué badulake y cuándo (tabla `inscripciones`). |
| **Para qué** | Reservar la plaza, no pasarse del cupo y enseñar la dirección a quien va. |
| **Base legal propuesta** | Ejecución del servicio (6.1.b). |
| **Quién lo ve** | Solo la propia persona. La **organizadora ve cuántas personas hay, no quiénes**. |
| **Cuánto tiempo** | Se borran con el badulake, **30 días después** de celebrarse. Si la persona se borra antes, desaparece en el momento. |

### 2.5 Denuncias (Tarea 13, D-027)

| | |
|---|---|
| **Datos** | Qué badulake se denuncia, el motivo (de una lista), un texto libre opcional de hasta 300 letras, el estado (abierta o resuelta), las fechas y **quién denuncia** (identificador de la cuenta, sin su nombre; tabla `denuncias`). Además, qué cuentas son del equipo (`equipo`) y cuáles están suspendidas (`suspendidas`, con la fecha). |
| **Para qué** | Atender quejas, ocultar badulakes y suspender cuentas que incumplen las condiciones, y proteger a la comunidad. |
| **Base legal propuesta** | Interés legítimo en la seguridad de la comunidad (6.1.f) y ejecución del servicio (6.1.b) — *a confirmar*. |
| **Quién lo ve** | Solo el equipo, desde el panel `/equipo`, que **no enseña** quién denuncia, quién organiza, correos ni la dirección exacta (solo motivo, texto, título, descripción, zona y fecha del badulake). Con la clave pública nadie puede leerlas, tampoco quien denuncia. El equipo, además, puede ver los datos completos desde el panel de Supabase. |
| **Cuánto tiempo** | Se borran con el badulake, **30 días después** de celebrarse. Una cuenta suspendida se mantiene como suspendida hasta que se borre o se levante. Si quien denunció borra su cuenta, la denuncia sigue sin su identificador. |
| **Aviso para la Asesoría** | El texto libre podría contener datos personales de terceros: el formulario avisa de que no se escriban. La cuenta suspendida no puede entrar ni usar la app. Falta decidir si la persona suspendida debe poder saber el motivo y reclamar (Tarea 12). |

### 2.6 Lista de interés «VIP» y «BaduCoins» (Tarea 17, D-030)

| | |
|---|---|
| **Datos** | Qué opción marca cada persona (VIP o BaduCoins) y cuándo (tabla `interes`). |
| **Para qué** | Medir el interés. **Hoy no existe ninguna de las dos ni se cobra nada** (D-012). |
| **Base legal propuesta** | Consentimiento (6.1.a): la persona marca «Me interesa» y lo quita cuando quiera. |
| **Quién lo ve** | Solo la propia persona, que ve y borra lo suyo. El equipo solo ve el número total por opción, sin nombres. |
| **Cuánto tiempo** | Hasta que la persona lo quite o borre su cuenta (lo borra también el borrado de la cuenta). |

## 3. Dónde se guarda y quién interviene (encargados del tratamiento)

| Proveedor | Qué hace | Dónde | Notas para la Asesoría |
|---|---|---|---|
| **Supabase** (Supabase Inc., EE. UU.) | Base de datos y cuentas | **Frankfurt** (`eu-central-1`, UE) | Plan gratuito. Empresa de EE. UU.: revisar su acuerdo de tratamiento (DPA) y garantías (cláusulas tipo / Marco de Privacidad UE-EE. UU.). |
| **Vercel** (Vercel Inc., EE. UU.) | Publica la web y ejecuta la parte del servidor (formularios, sesiones) | **Frankfurt** (`fra1`) desde esta tarea; la red que sirve las páginas está repartida por el mundo y atiende desde el punto más cercano | Plan gratuito (Hobby). Antes de esta tarea la parte del servidor se ejecutaba en Washington (EE. UU.); corregido en `app/vercel.json`. Revisar su DPA y si el plan gratuito es adecuado para un servicio de EITB. |
| **Vercel Web Analytics** (misma empresa) | Mide visitas y de dónde vienen, sin cookies | Red global de Vercel | Incluido en Hobby (50.000 eventos/mes). Sin cookies ni IP guardada (según Vercel): confirmar con la Asesoría que no hace falta banner. |
| **GitHub** (Microsoft) | Guarda el código | — | **No guarda datos de personas.** El repositorio es público y no contiene claves ni datos. |

**No intervienen:** analítica, publicidad, redes sociales, mapas, fuentes ni scripts de otras empresas. Las letras (Google Fonts) se descargan al compilar y se sirven desde la propia web: el navegador de la persona no contacta con Google.

**Pendiente:** el correo propio (Tarea 10) añadirá un proveedor de envío de correos; habrá que sumarlo aquí.

## 4. Minimización: qué se revisó en esta tarea

| Qué | Cómo estaba | Qué se hizo |
|---|---|---|
| Fecha de nacimiento | La base de datos ya la borraba antes de guardar la cuenta. | Comprobado de nuevo: no queda guardada. |
| Quién organiza un badulake | Cualquier persona con sesión podía leer el identificador de la organizadora (un código, no su nombre), y así saber qué badulakes organiza la misma persona. | Ya no se puede leer. La web pregunta «¿cuáles son míos?» con la función `mis_badulakes()`. |
| Límite de intentos | Contaba en la memoria del servidor con la IP y el correo tal cual (nunca se guardaban en disco). | Ahora solo con una huella cifrada con una clave al azar que no sale de la memoria: no se puede saber de qué IP o correo era. |
| Registros del servidor | Solo se apuntan códigos de error, nunca correos ni direcciones. | Comprobado. Los registros de Vercel (plan gratuito) se guardan muy poco tiempo. |
| Registro de accesos de Supabase Auth | Puede guardar la IP de cada acceso. Hoy está vacío. | Se borra solo a los 30 días. |
| Analítica | No hay ninguna. | Sin cambios (la analítica es la Tarea 15 y tendrá que respetar esto). |
| Dónde se procesa | La parte del servidor de la web corría en EE. UU. | Pasa a Frankfurt. |

## 5. Plazos de conservación (decididos por OlaIA el 19/11/2026)

Se aplican **solos cada noche a las 03:15 (hora UTC)** con una tarea programada de Supabase (Supabase Cron, incluido en el plan gratuito), que ejecuta la función `borrar_datos_caducados()` (`supabase/privacidad.sql`).

| Dato | Se borra |
|---|---|
| Dirección exacta de un badulake | 1 día después de celebrarse |
| Badulake e inscripciones | 30 días después de celebrarse |
| Lista de espera | Al avisar del lanzamiento y, como mucho, a los 12 meses del alta |
| Sesiones abandonadas | A los 90 días sin usarse |
| Registro de accesos de Supabase Auth | A los 30 días |
| Contadores del límite de intentos | Nunca se guardan: viven unos minutos en la memoria del servidor |
| Cuenta | Cuando la persona lo pida (Tarea 21) |
| Denuncias | Con el badulake, 30 días después de celebrarse |

Comprobado con un badulake inventado: a los 2 días ya no tenía dirección y a los 31 días no quedaba ni el badulake ni la inscripción.

## 6. Cookies

Solo **cookies técnicas**, exentas de consentimiento (art. 22.2 LSSI). Comprobado en la web publicada y en el Mac con sesión abierta: no hay ninguna más. Desde la Tarea 15 hay un único script de terceros: **Vercel Web Analytics** (servido desde la propia web, una ruta propia del mismo dominio), **sin cookies**; registra página, web de origen, país y tipo de dispositivo/navegador, sin IP guardada ni identificador persistente (D-029). Plan Hobby: 50.000 eventos al mes, 1 mes de datos, sin parámetros utm (para verlos hace falta el complemento Web Analytics Plus, 10 $/mes).

| Cookie | Para qué | Cuánto dura |
|---|---|---|
| `NEXT_LOCALE` | Recordar el idioma elegido (D-008) | 1 año |
| `sb-…-auth-token` | Mantener la sesión abierta (solo si se entra en una cuenta) | Hasta salir (comprobado que se borra) o, si no se usa, hasta que caduca la sesión |

**No hace falta banner de cookies.** El texto que lo explica está en la página `/privacidad` (apartado «Cookies»).

## 7. Derechos de las personas

Acceso, rectificación, supresión, portabilidad, oposición y limitación. **Por ahora se ejercen por correo** a EITB (*pendiente de la Asesoría:* la dirección). El botón para borrar la cuenta desde la app es la Tarea 21. Mientras tanto, el equipo puede atender una petición desde el panel de Supabase: borrar una cuenta borra en cascada su perfil, sus badulakes, sus direcciones y sus inscripciones.

## 8. Seguridad

Ver [seguridad.md](seguridad.md): reglas por filas en todas las tablas, 48 de 48 pruebas de ataque superadas (Tarea 8) y, en esta tarea, 22 comprobaciones más de privacidad con dos cuentas inventadas.

## 9. Preguntas para la Asesoría Jurídica

1. Datos del responsable, del delegado de protección de datos y el correo para ejercer derechos.
2. ¿Confirmáis las bases legales propuestas (consentimiento para la lista de espera; ejecución del servicio para lo demás; comprobación de edad)?
3. Supabase y Vercel son empresas de EE. UU. aunque los datos estén en Frankfurt: ¿bastan sus acuerdos de tratamiento estándar y sus garantías? ¿Sirve el plan gratuito o hay que contratar uno con contrato firmado?
4. ¿Os parecen bien los plazos de conservación (apartado 5)? ¿Qué hacer con las cuentas que no se usan?
5. ¿Hace falta una evaluación de impacto (EIPD)? Se guardan direcciones de casas particulares, aunque se borran al día siguiente.
6. El texto provisional de `/privacidad` está escrito en lenguaje llano: podéis usarlo como base.

## 10. La página `/privacidad`

Tiene un **borrador provisional** marcado como tal (desde la Tarea 12 es la política completa de [legal/politica-privacidad.md](legal/politica-privacidad.md); el cuerpo está en castellano y las demás lenguas lo enseñan así hasta traducirlo). Junto a él, [legal/](legal/README.md) tiene el aviso legal, las condiciones de uso y la política de cookies, con sus páginas `/aviso-legal`, `/condiciones` y `/cookies`. Cuando llegue el texto de la Asesoría se sustituye ahí (textos en `app/messages/*.json`, clave `Privacy`) y solo entonces se encienden `PRIVACY_NOTICE_READY` y `CUENTAS_ABIERTAS` (lista del día del lanzamiento en [seguridad.md](seguridad.md)). Hay enlace a la página en el pie de todas las páginas, en la lista de espera y en «Crear cuenta».
