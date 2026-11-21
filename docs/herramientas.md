# Herramientas

| Herramienta | Para qué | Desde |
|---|---|---|
| [Claude](https://claude.ai) (app de escritorio, Mac) | La IA que programa, documenta y maneja el ordenador | Día 1 |
| [Riverside](https://riverside.com) | Grabar las sesiones: cámara, pantalla e invitados | Día 1 |
| iPhone en trípode con la app de Riverside | Segunda cámara para hablarle al público | Día 1 |
| Google Drive | Bitácora interna del experimento | Día 1 |
| GitHub | Código y documentación pública (este repositorio) | Día 1 |
| [Vercel](https://vercel.com) (plan gratuito Hobby) | Publicar la app en internet: cada cambio en GitHub se publica solo | Día 1 |
| [Node.js](https://nodejs.org) 26 (LTS), instalado con [fnm](https://github.com/Schniz/fnm) | Ejecutar la app en el Mac | Día 1 |
| [GitHub CLI](https://cli.github.com) (`gh`) | Manejar GitHub desde el Terminal | Día 1 |
| [Next.js](https://nextjs.org) 16 + TypeScript | La base de la aplicación web | Día 1 |
| [next-intl](https://next-intl.dev) | Euskera y castellano | Día 1 |
| [Tailwind CSS](https://tailwindcss.com) | Los estilos (colores, tamaños, espacios) | Día 1 |
| [Itzuli](https://www.euskadi.eus/itzuli/) (Gobierno Vasco) y [Elia](https://elia.eus) (Elhuyar) | Revisar los textos en euskera (no usamos el traductor de Google) | Día 1 |
| [Supabase](https://supabase.com) (plan gratuito, Frankfurt, UE) | La base de datos. Claves solo en `app/.env.local` y en Vercel | Día 1 (tarea 2) |
| Segundo proyecto de Supabase (`badulake-pruebas`) y de Vercel (rama `pruebas`) | La copia con datos inventados para grabar los fallos del guion (D-035). Gratis | Tarea 22 |
| [DeepL](https://www.deepl.com/translator) | Traducir la web a la mayoría de lenguas europeas (versión web gratuita, sin cuenta) | Día 1 |
| [Proxecto Nós](http://tradutor.nos.gal) (Xunta y USC) | Traducir al gallego | Día 1 |
| [TartuNLP](https://translate.ut.ee) (Universidad de Tartu) | Traducir al sami del norte | Día 1 |
| [Frysker](https://frysker.nl) (Fryske Akademy) | Traducir al frisón | Día 1 |
| [Tradutur](https://tradutur-informatik.uibk.ac.at) (Universidad de Innsbruck) | Traducir al ladino | Día 1 |

Las herramientas para programar la app se añaden aquí a medida que las elegimos.

## Sentry (Tarea 8.4, D-051) — PENDIENTE: crear la cuenta (OlaIA)

El código ya está en la web y no hace nada hasta que existan las variables. Pasos para OlaIA (unos 10 minutos):

1. Entrar en https://sentry.io/signup/ con la cuenta de Google del proyecto (la que tiene la verificación en dos pasos). **Plan:** Developer (gratis). **Data storage location: European Union (Frankfurt)** — se elige al crear la organización y luego no se puede cambiar.
2. Crear un proyecto de tipo **Next.js** llamado `badulake`. En la pantalla de instalación no hay que hacer nada: solo copiar el **DSN** (empieza por `https://` y acaba en `.ingest.de.sentry.io/…`).
3. En Sentry → Settings → Security & Privacy: activar **Data Scrubber** y **Prevent Storing of IP Addresses**.
4. En Vercel, en **badulake-pruebas** (y, cuando se quiera, en la real): Settings → Environment Variables → añadir `SENTRY_DSN` y `NEXT_PUBLIC_SENTRY_DSN`, las dos con el DSN. Después, Deployments → «Redeploy».
5. Avisar a Claude para comprobar que llega un error de prueba y apuntarlo en la hoja de costes (pestañas Costes: 0 €; Cuentas y accesos: dónde está guardado el acceso).
