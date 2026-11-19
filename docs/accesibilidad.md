# Accesibilidad de Badulake (tarea 11)

Objetivo: nivel **AA de las pautas WCAG 2.2** (el nivel que pide la ley europea de accesibilidad para servicios públicos). Esta ficha cuenta, en lenguaje llano, qué se revisó, qué se arregló y qué queda.

## Qué se revisó y cómo

Fecha: 19/11/2026. Con la web en el Mac y las cuentas abiertas, en castellano, euskera y otras lenguas, y con dos cuentas inventadas creadas en la base de datos (borradas al acabar, D-011).

- **Páginas:** portada, «Qué es un badulake», aviso de privacidad, entrar, crear cuenta, tu cuenta, lista de badulakes, crear un badulake y página de cada badulake (como persona sin apuntar, ya apuntada y con avisos de error).
- **Herramienta automática:** axe-core (el motor que usan Lighthouse y muchas auditorías) con las reglas de WCAG 2.0, 2.1 y 2.2 nivel A y AA y las buenas prácticas. Resultado final: **0 fallos y 0 dudas** en todas las páginas.
- **A mano:**
  - **Teclado:** todo se puede hacer sin ratón, el orden es lógico y hay un enlace «Saltar al contenido».
  - **Foco:** se ve en enlaces, botones, campos y selector de idioma.
  - **Títulos y encabezados:** cada página tiene un título propio; hay un único encabezado principal y los demás bajan en orden.
  - **Campos:** todos tienen su etiqueta, su ayuda y su error asociados.
  - **Contraste:** textos entre 4,4 y 15,5 a 1 (el mínimo es 4,5; el único 4,4 es `noche/60` que ya no se usa para texto); errores a 5,8 o más.
  - **Pantalla pequeña y letra grande:** a 320 px de ancho (equivale al 400 % de zoom) no hay desplazamiento lateral ni se pierde nada; con la letra al 200 % tampoco.
  - **Idioma:** `lang` correcto en la página, en cada lengua del selector y en lo que aún está en castellano.
  - **Nombres claros:** enlaces y botones dicen qué hacen; nada depende solo del color (los avisos llevan texto y los errores, mensaje).
  - **Reducir movimiento:** la web casi no tiene animaciones y, si la persona lo pide, se desactivan todas.

## Qué se arregló

1. **Título de cada página.** Todas se llamaban igual. Ahora: «Entrar · Badulake», «Crear cuenta · Badulake», «Próximos badulakes · Badulake»…
2. **Idioma de lo que no está traducido.** En las 42 lenguas sin traducir, la página declaraba, por ejemplo, `lang="fr"` pero el texto estaba en castellano, y el lector de pantalla lo leía con acento francés. Ahora ese texto lleva `lang="es"` y las fechas se escriben en la misma lengua que el texto (D-025).
3. **Bordes de los campos:** tenían 1,9 a 1 de contraste; el mínimo para ver dónde está un campo es 3 a 1. Ahora tienen 4,5 a 1 (ligeramente más oscuros).
4. **Foco visible** con el mismo trazo grueso en toda la web (antes los campos solo cambiaban el color del borde).
5. **Errores anunciados:** el mensaje de cada campo se anuncia solo al enviar, y el foco pasa al primer campo con error (antes se quedaba en el vacío de la página).
6. **Selector de idioma:** su etiqueta «Idioma» queda bien enlazada al menú y se lee en la lengua de la persona; a 320 px y con letra enorme no se sale de la pantalla.
7. **«Saltar al contenido»** ahora lleva de verdad el foco al contenido.
8. **Reducir movimiento** respetado.

## Qué queda

- **Para la Tarea 14 (diseño):** los bordes de las tarjetas de la lista de badulakes (gris claro, decorativos; el texto sí se lee bien) y el tamaño de la letra pequeña de las ayudas (14 px) conviene revisarlos cuando llegue la identidad de LIN3S.
- **Textos en las otras 42 lenguas:** siguen en castellano hasta que se traduzcan (ver [traducciones.md](traducciones.md)); la accesibilidad de esos textos mejorará con ellos.
- **Al registrarse con errores, el formulario borra lo escrito** salvo en «Crear un badulake»: molesto, no un fallo de accesibilidad; apuntado para la Tarea 14/revisión de recorridos.
- **Prueba con personas reales** y con lectores de pantalla (VoiceOver, NVDA, TalkBack): no hecha. La revisión de hoy es automática y manual de código y teclado; lo ideal es una prueba con usuarios con discapacidad antes de abrir. Pendiente de decidir.
- **Vídeo y audio:** la web no tiene; si la docuserie añade, necesitarán subtítulos y transcripción.
- **Página de error 404:** es la de Next.js, sin marca ni traducción; para la Tarea 14.
- **Aviso de privacidad y textos legales (Tarea 12):** al sustituir el borrador, mantener encabezados y listas reales.

## Borrador de declaración de accesibilidad

> **Declaración de accesibilidad de Badulake**
>
> EITB se compromete a que Badulake (badulake.vercel.app, dirección definitiva por decidir) sea accesible, conforme al Real Decreto 1112/2018 y a la Directiva (UE) 2016/2102.
>
> **Estado de cumplimiento.** Badulake cumple en parte las Pautas de Accesibilidad para el Contenido Web (WCAG) 2.2, nivel AA. Los textos de la web están completos en castellano y euskera; en las demás lenguas, la mayor parte aún se muestra en castellano mientras se traduce.
>
> **Contenido no accesible.** (1) Algunos elementos decorativos de la lista de badulakes tienen poco contraste. (2) La página de error 404 no está adaptada. (3) No se ha probado aún con personas usuarias de lectores de pantalla.
>
> **Preparación de esta declaración.** Se hizo el 19/11/2026 con una revisión automática (axe-core) y una revisión manual del equipo de desarrollo.
>
> **Observaciones y contacto.** Si no puedes usar alguna parte de Badulake o encuentras un problema, escribe a [correo de contacto por decidir con la Asesoría Jurídica] y responderemos en un plazo razonable. Si la respuesta no te satisface, puedes reclamar ante la unidad responsable de accesibilidad del Gobierno Vasco [dato por confirmar con la Asesoría].
>
> **Pendiente de revisión por la Asesoría Jurídica de EITB antes de publicarse (Tarea 12).**
