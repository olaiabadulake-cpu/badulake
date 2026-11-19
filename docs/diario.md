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

**Herramientas para programar.** Claude instala en el Mac Node.js 26 (versión LTS) con fnm, un gestor de versiones de Node que no necesita la contraseña del ordenador, y la herramienta de GitHub para el Terminal (`gh`), descargada de la página oficial y comprobada con su firma (checksum). OlaIA inicia sesión en GitHub desde el Terminal con el código de verificación. Git firma los commits como «OlaIA».

**De «Hola mundo» a la primera página de verdad.** OlaIA pide crear la aplicación en este repositorio, publicada en Vercel. Claude lee los requisitos técnicos v2 y monta la base que proponen: Next.js con TypeScript, en euskera y castellano desde el primer día. La carpeta `app/` deja de ser un HTML suelto y pasa a ser la aplicación:
- Portada en `/eu` y `/es` (el navegador elige el idioma; se puede cambiar abajo).
- Formulario de lista de espera (correo, zona e idioma de los avisos) con validación en el servidor.
- Colores y tipografías provisionales de la marca existente (amarillo y azul noche), hasta que llegue la identidad definitiva.

**Un error por el camino.** La primera vez que Claude arranca la app en el Mac falla al procesar los estilos: el servidor de pruebas no encontraba Node.js porque fnm solo se activa en el Terminal. Claude lo arregla indicándole dónde está Node, pero el error se queda guardado en la caché y hay que borrarla para que desaparezca.

**Lo que aún no está.** El formulario funciona en el Mac, pero en la web publicada no se enseña todavía: falta la base de datos donde guardar los correos y el aviso de privacidad de la Asesoría Jurídica. Hasta entonces, la web dice que muy pronto se podrá apuntar.

**El euskera, revisado con traductores vascos.** OlaIA pide corregir los textos en euskera, que había escrito Claude, con un traductor que no sea el de Google. Claude pasa todos los textos por **Itzuli** (Gobierno Vasco) y contrasta las frases dudosas con **Elia** (Elhuyar). Ninguno es perfecto: Itzuli traduce «quedadas» como «geratzen dira» y «lanzamiento» como «jaurtiketa» (un lanzamiento de tiro), y los dos usan «eraman» tanto para «lleva» como para «llévate». Claude se queda con lo que ambos hacen mejor que la primera versión (por ejemplo, «2027. urtearen hasieran helduko da» en vez de «2027aren hasieran», «Posta elektronikoa», «Esaiguzu», «Berrikusi posta elektronikoa: ez dirudi baliozkoa») y descarta sus errores. Pendiente: que una persona euskaldun lo revise antes del estreno.

**Selector de idioma.** OlaIA pide un botón para elegir idioma. Claude cambia el enlace pequeño del pie de página por un selector **EU | ES** arriba a la derecha, visible en todas las páginas: el idioma activo aparece marcado y, al cambiar, se queda en la misma página.

**El idioma se recuerda.** OlaIA pide seguir los consejos de Claude sobre los idiomas, en orden. Claude descubre que la web ya guardaba el idioma elegido, pero en una cookie que se borraba al cerrar el navegador. Ahora dura un año, y la página de privacidad lo explica en los dos idiomas. Claude prepara también `docs/revision-euskera.md`, una tabla con todos los textos en castellano y euskera y las dudas concretas, para que la revise una persona euskaldun. El idioma por defecto queda como decisión pendiente de EITB (D-007). La preparación para más lenguas no necesita nada más por ahora (D-008).
