# Copia de pruebas con datos inventados

Tarea 22 del plan maestro, decisión D-035 (apoya a D-011). Aquí se graban los **fallos que enseña el guion** (episodios 3 y 4); **nunca** en la app real.

## Qué es

| | App real | Copia de pruebas |
|---|---|---|
| Web | badulake.vercel.app (rama `main`) | badulake-pruebas.vercel.app (otro proyecto de Vercel, `badulake-pruebas`, también desde `main`) |
| Base de datos | Supabase `badulake` (Frankfurt) | Supabase `badulake-pruebas` (Frankfurt, otro proyecto gratuito) |
| Datos | personas reales (cuando abra) | solo inventados (`supabase/pruebas/02-datos.sql`) |
| Aviso | ninguno | franja roja «COPIA DE PRUEBAS — DATOS INVENTADOS» en todas las páginas, `noindex` y sin analítica |

Coste: **0 €** (Supabase Free permite 2 proyectos activos por organización; Vercel Hobby permite varios proyectos sobre el mismo repositorio).

## Reglas

- Las claves de la copia (`SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`) viven **solo** en Vercel (proyecto `badulake-pruebas`) y, si se prueba en el Mac, en `app/.env.pruebas` (ignorado por Git). Nunca en el repositorio y nunca las de producción.
- La copia es siempre el código de `main`: cada cambio que se sube a `main` se publica en las dos webs a la vez, y los interruptores no hacen nada sin sus variables. (El plan hablaba de una rama `pruebas`; se descartó para no tener que mantener dos ramas al día.)
- Todas las cuentas son inventadas: `nombre.demo@pruebas.badulake.app`, contraseña `Pruebas-Badulake-1` (no es de nadie). Cuenta del equipo: `equipo.demo@…`.

## Estado (20/11/2026)

- Supabase `badulake-pruebas`: creado (Frankfurt, gratis), esquema y datos cargados, «Confirm email» **desactivado** (fallo 1 encendido).
- Probado en el Mac contra la copia con `app/.env.pruebas` (ignorado por Git): copiar `app/.env.local`-style con las variables de abajo y arrancar con `set -a; . ./.env.pruebas; set +a; npm run dev`.
- Vercel `badulake-pruebas`: publicado en https://badulake-pruebas.vercel.app (desde `main`), con las variables de abajo y los dos interruptores de variable en `0`. Probado: franja roja, `noindex` y entrar con una cuenta inventada. La web real sigue sin franja, sin `noindex` y con las cuentas cerradas.
- Hay que **redesplegar** (Vercel → Deployments → Redeploy) después de cambiar una variable.

## Montar la copia desde cero

1. **Supabase:** crear el proyecto `badulake-pruebas` (Frankfurt). Dejar **desmarcado** «Grant API access to new tables automatically».
2. **Esquema:** `LC_ALL=en_US.UTF-8 sh supabase/pruebas/juntar-esquema.sh | pbcopy` y pegar en *SQL Editor → Run* (confirmar el aviso de «operaciones destructivas»). Junta los `supabase/*.sql` en su orden, más `hora_actual` (tarea 2) y una `rls_auto_enable` vacía que en el proyecto real creó Supabase. Si aparecen letras raras (`√∫`), faltó `LC_ALL`.
3. **Marca de copia y fallo de datos:** pegar y ejecutar `supabase/pruebas/01-fallos.sql`.
4. **Datos inventados:** pegar y ejecutar `supabase/pruebas/02-datos.sql`. Se puede **volver a ejecutar las veces que haga falta**: borra todo y lo deja como al principio. Se niega a correr si no existe la marca del paso 3.
5. **Vercel:** proyecto nuevo `badulake-pruebas` desde este repositorio (*Import* con GitHub), carpeta raíz `app`, rama `main`. Variables de entorno (todas solo ahí):

| Variable | Valor |
|---|---|
| `SUPABASE_URL` | la URL del proyecto de la copia |
| `SUPABASE_PUBLISHABLE_KEY` | la clave pública (publishable) de la copia |
| `CUENTAS_ABIERTAS` | `1` |
| `PRIVACY_NOTICE_READY` | `true` |
| `PRUEBAS_COPIA` | `1` |
| `PRUEBAS_SUPABASE_REF` | la referencia del proyecto de la copia (la parte de la URL antes de `.supabase.co`) |
| `PRUEBAS_DATOS_A_LA_VISTA` | `0` (apagado) o `1` (encendido) |
| `PRUEBAS_BOTONES_CONFUSOS` | `0` (apagado) o `1` (encendido) |

6. **Supabase → Authentication → Sign In / Providers → Email:** ajustar «Confirm email» y «Authentication → URL Configuration» con la dirección de la copia (ver el interruptor 1).

## Interruptores de fallos

Se encienden y apagan **solo en la copia**. Después de cambiar una variable en Vercel hay que **redesplegar** (Deployments → «Redeploy») para que surta efecto.

### 1. «El correo no se verifica» (episodio 4)

- **Qué se ve:** una persona crea la cuenta con cualquier correo, también uno que no existe, y entra sin verificarlo.
- **Es un ajuste de Supabase, no una variable:** en la copia, *Authentication → Sign In / Providers → Email → «Confirm email»*.
  - **Fallo encendido:** «Confirm email» **desactivado**. Al crear la cuenta la web ya entra directamente.
  - **Fallo apagado (verificación):** «Confirm email» activado. Ojo: mientras no haya correo propio (tarea 10), Supabase solo envía a direcciones del equipo, así que solo funciona con el correo de OlaIA; para ver «mira tu correo» con una cuenta inventada, no hace falta enseñarlo en la copia: eso se enseña en la app real.
- **En la app real no se puede tocar** desde aquí: es otro proyecto de Supabase.

### 2. «Todos los datos a la vista al apuntarse» (episodio 4)

- **Variable:** `PRUEBAS_DATOS_A_LA_VISTA=1` (encender) / quitarla o `0` (apagar).
- **Qué se ve:** quien está apuntada a un badulake ve, bajo la ficha, «Personas apuntadas» con el **correo, el idioma y la fecha** de todas las demás (todo inventado).
- **Cómo funciona:** el código llama a la función `pruebas_asistentes`, que solo existe en la base de datos de la copia (`01-fallos.sql`).
- **Probar:** entrar con `ane.demo@pruebas.badulake.app` → el badulake de Colina del Tejo (Sant Boi de Llobregat).

### 3. «Botones confusos y pasos de más» (episodio 3)

- **Variable:** `PRUEBAS_BOTONES_CONFUSOS=1` (encender) / quitarla o `0` (apagar).
- **Qué se ve:** apuntarse pasa de un botón («Apuntarme») a **tres pasos** con nombres que no dicen qué hacen («Siguiente» → «Aceptar» → «Continuar»), y el botón de borrarse se llama «Aceptar».
- **Probar:** entrar con `leire.demo@…` → el badulake de Barrio del Olmo (Sant Boi de Llobregat; hay plazas libres).

## Por qué producción no puede activarlos

Los fallos están en el código de `main`, pero `app/src/lib/pruebas.ts` solo los activa si **a la vez**: `PRUEBAS_COPIA=1`, `PRUEBAS_SUPABASE_REF` es una referencia válida **y coincide con el dominio de `SUPABASE_URL`**, y el interruptor propio vale `1`. Esas variables no existen en el proyecto de Vercel real. Aunque se pusieran por error allí, la base de datos real no coincidiría con la referencia anotada; y la función `pruebas_asistentes` no existe en la base de datos real. Comprobaciones hechas: ver el diario.

**Actualizada el 20/11/2026 (tareas 5.1 y 5.2, D-037 y D-038):** la copia ya tiene `titulo_lugar.sql` y `haber_ido.sql` (también los carga `juntar-esquema.sh`), los títulos inventados son «Badulake de <barrio>, <ciudad> (<provincia>)» y las vecinas 1 a 7 ya pueden organizar; Unai (8) no, para enseñar el aviso «Todavía no puedes organizar un badulake». El equipo (cuenta Equipo) puede darle permiso desde `/equipo`.
