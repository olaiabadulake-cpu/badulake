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
- **Propuso:** Claude · **Decidió:** pendiente de validar por OlaIA

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

### D-007 · La app se publica en badulake.app
- **Fecha:** 19/11/2026
- **Decisión:** El dominio de la app es **badulake.app** (ya comprado). Mientras se configura, sigue en badulake.vercel.app.
- **Decidió:** OlaIA

### D-008 · Abierta a todas las personas mayores de 18, pensada para mujeres
- **Fecha:** 19/11/2026
- **Decisión:** Cualquier persona mayor de 18 años puede usar Badulake. La comunicación y el tono se dirigen a mujeres, que son el público al que nos dirigimos.
- **Por qué:** Cerrar la app por sexo plantea problemas legales; dirigirse a un público no.
- **Decidió:** OlaIA

### D-009 · Nunca datos de personas reales en pruebas ni demostraciones
- **Fecha:** 19/11/2026
- **Decisión:** Las pruebas, las demostraciones y cualquier fallo que se enseñe se hacen en una copia de la app con datos inventados, nunca con datos de personas reales.
- **Propuso:** Claude · **Decidió:** OlaIA

### D-010 · Sin cobros al principio
- **Fecha:** 19/11/2026
- **Decisión:** La app es gratis. Las ideas de pago (cuentas VIP, monedas) se prueban primero como lista de interés, sin cobrar. Los pagos reales, si llegan, se estudian después con Comercial y la Asesoría Jurídica.
- **Propuso:** Claude · **Decidió:** OlaIA

### D-011 · Web instalable en el móvil, no app en las tiendas
- **Fecha:** 19/11/2026
- **Alternativas:** publicar en App Store y Google Play.
- **Decisión:** Badulake es una web que se instala en el móvil (PWA). No se sube a las tiendas por ahora.
- **Por qué:** Las tiendas exigen cuentas de desarrollador, revisiones y mucho más trabajo, para una app que funciona igual desde el navegador.
- **Propuso:** Claude · **Decidió:** OlaIA

### D-012 · Primero lo imprescindible
- **Fecha:** 19/11/2026
- **Decisión:** Se desarrolla primero lo mínimo para que Badulake funcione de verdad (registro, crear y apuntarse a badulakes, aforo, seguridad, privacidad, accesibilidad, avisos y el día del badulake básico). Grupos, notificaciones en el móvil, filtros, mapa, valoraciones, puntos de generosidad, badulake online y pagos quedan para cuando la comunidad lo pida o haya tiempo.
- **Decidió:** OlaIA
