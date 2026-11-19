# Diario de Badulake

Cada entrada indica quién hizo cada cosa: **Claude** (la IA), **OlaIA** (dirige) o **Adrián** (mentor).

---

## Día 1 · Jueves 19 de noviembre de 2026

**Arranque.** OlaIA le explica a Claude el experimento y le pide que planifique y opere todo lo posible: herramientas, documentación y grabación.

**Grabación.** Claude investiga y propone usar solo Riverside para grabar: permite invitar a Adrián con un enlace, graba la pantalla compartida como pista aparte y admite el iPhone de OlaIA como segunda cámara. Así no hace falta Google Meet. OlaIA lo aprueba.

**Documentación en dos niveles.** Claude propone las opciones y OlaIA elige:
- Una bitácora interna (pasos, costes, cuentas) para el seguimiento del experimento.
- Esta documentación pública en GitHub, visible desde el primer día.
- Las contraseñas nunca se escriben en documentos; se guardan en un gestor de contraseñas.

**Claude crea la estructura de documentación** (bitácora interna, hoja de costes y cuentas, y este repositorio).

**Git en el Mac.** Claude revisa el ordenador de OlaIA y ve que tiene instaladas las herramientas de desarrollo de Apple, que incluyen git. OlaIA lo confirma en el Terminal (git 2.54.0).

**Nueva norma: si Claude puede hacerlo, lo hace Claude.** OlaIA decide que, cuando una tarea la pueda hacer Claude (por ejemplo, escribir un comando en el Terminal), la haga directamente sin preguntar. Las excepciones son los pagos, los mensajes en nombre de OlaIA y las contraseñas o códigos de verificación, que siguen siendo cosa suya. Pendiente: preguntar a Adrián qué le parece.

**GitHub conectado a Claude.** Claude instala desde el navegador la app de Claude en GitHub, con acceso solo a este repositorio. OlaIA pone el código de verificación que manda GitHub. Esta entrada del diario ya la ha subido Claude directamente, sin pasar por el navegador.

**Primera línea de código: «Hola mundo».** OlaIA pide una app que de momento solo diga «Hola mundo». Claude escribe una página web sencilla en `app/index.html` y la sube a GitHub.

**Publicada en Vercel.** Claude propone publicarla con GitHub Pages, pero OlaIA prefiere Vercel. Claude crea la cuenta de Vercel con el GitHub de OlaIA, conecta solo este repositorio y publica la carpeta `app`. OlaIA pone la verificación por SMS y los códigos que llegan por email. Resultado: **[badulake.vercel.app](https://badulake.vercel.app)**. A partir de ahora, cada cambio que Claude suba a GitHub se publica solo.
