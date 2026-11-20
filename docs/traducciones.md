# Traducciones de Badulake

La web está en 44 lenguas: las de los medios de FORTA y CIRCOM, incluidas las minoritarias (ver [lenguas-forta-circom.md](lenguas-forta-circom.md)). El texto original es siempre el castellano (`app/messages/es.json`). Cada persona elige su lengua en el menú del globo, arriba a la derecha, y la web la recuerda durante un año.

**Ninguna traducción la ha revisado todavía una persona nativa.** Por eso, en todas las lenguas menos el castellano, el pie de página avisa de que es una traducción automática pendiente de revisar.

## Cómo se ha traducido

No se ha usado el traductor de Google. Para cada lengua, Claude buscó el mejor traductor neuronal disponible. Después repasó todas las traducciones para que sonaran naturales y no literales:
- mismo trato en toda la web (tú o usted, según lo habitual en esa lengua);
- frases que el traductor dejó raras;
- el enlace al aviso de privacidad, que los traductores cortaban.

| Lengua | Traductor | Notas |
|---|---|---|
| Euskera | Itzuli y Elia | Revisado antes (ver [revision-euskera.md](revision-euskera.md)) |
| Inglés, francés, alemán, italiano, portugués, neerlandés, danés, sueco, noruego bokmål, finés, polaco, checo, eslovaco, esloveno, búlgaro, rumano, húngaro, griego, ucraniano | DeepL | Desde el castellano |
| Croata, bosnio, serbio, macedonio, albanés | DeepL | Lenguas nuevas en DeepL. Serbio en alfabeto cirílico |
| Catalán, occitano, irlandés, galés, bretón | DeepL | El occitano es languedociano |
| Gallego | Proxecto Nós (Xunta y USC) y DeepL | Claude combinó lo mejor de los dos |
| Sami del norte | TartuNLP (Universidad de Tartu) | A partir del noruego, porque no traduce desde el castellano |
| Frisón | Frysker (Fryske Akademy) | A partir del neerlandés |
| Ladino | Tradutur (Universidad de Innsbruck) | A partir del italiano. Variante de Val Badia. En la tarea 23.1 ya no estaba disponible |
| Valenciano | Claude, a partir del catalán de DeepL | Sigue la norma de la AVL. SalamandraTA (BSC), el traductor recomendado, no estaba disponible |
| Aranés | Claude, a partir del catalán y el occitano | SalamandraTA no estaba disponible |
| Asturiano | Claude | SalamandraTA no estaba disponible. Los demás traductores de asturiano no son neuronales |
| Noruego nynorsk | Claude, a partir del bokmål | Ni DeepL ni Microsoft tienen nynorsk. SalamandraTA no estaba disponible |
| Montenegrino | Claude, a partir del bosnio | No existe traductor. Escrito en alfabeto latino, ijekavo |
| Gaélico escocés | Claude | El único traductor disponible, NLLB, daba resultados muy pobres |
| Corso, alsaciano, rusino | Claude | No existe ningún traductor neuronal para estas lenguas |

**Las traducciones hechas directamente por Claude son las que más necesitan revisión**, sobre todo el rusino, el alsaciano, el corso, el aranés y el montenegrino.

## Para revisar o cambiar una traducción

Cada lengua tiene su archivo en `app/messages/<código>.json`. Basta con cambiar el texto entre comillas y no tocar lo que va a la izquierda de los dos puntos. Si cambia un texto en castellano, hay que actualizar las 43 lenguas.

## Traducción conjunta de cuentas y badulakes (tarea 23.1, noche del 20 al 21/11/2026)

Siguiendo la decisión de OlaIA del 20/11 («todo junto»), Claude tradujo de una vez a las 42 lenguas todos los textos de la web que no son legales: cuentas, crear y ver badulakes, lista de espera, menú, «Qué es un badulake», denunciar, instalar, Modo badulake, la página del QR (`Hola`, salvo el catalán, que ya la tenía), la página 404 y el marco de los textos legales (títulos, recuadro de borrador, enlaces del pie y un aviso de que el cuerpo está en castellano, pendiente de traducción). En total, 280 textos por lengua, más `Badulake.zone` de la tarea 5.1. **No se tradujo:** el cuerpo de `Legal` y de `Privacy` (espera al texto definitivo de la Asesoría) ni `Team` (panel interno, se sigue viendo en castellano y marcado como tal).

Con esto **las 44 lenguas están completas** salvo los textos legales y están todas en `complete` (`app/src/i18n/content-lang.ts`), así que cada página se marca con su lengua. La palabra que hay que escribir para borrar la cuenta es la de cada lengua (DELETE, LÖSCHEN, ОБРИШИ…), y el servidor la saca del mismo archivo de textos.

**Ninguna de estas traducciones la ha revisado una persona nativa.**

### Cómo se tradujo cada lengua

Primero Claude escribió una versión de cada lengua, con el mismo trato y vocabulario que el resto de su archivo y frases naturales en vez de calcos. Después se compararon con el traductor de la tabla de arriba, quedándose con la frase más natural de cada una. **DeepL agotó el uso gratuito de este Chrome a mitad de la noche** («límite de uso de la versión gratuita», vuelve en 30 días), así que la mayoría de lenguas quedaron con la versión de Claude sola:

| Lengua | Método | Trato |
|---|---|---|
| Inglés | DeepL (7 de 9 bloques) + repaso de Claude | you (ortografía británica) |
| Croata | DeepL + repaso de Claude | vi |
| Búlgaro | Claude + DeepL en 3 de 9 bloques | вие |
| Catalán | Claude + DeepL en 7 de 9 bloques (solo términos de interfaz) | tu |
| Valenciano | Claude a partir del catalán, norma AVL | tu |
| Gallego | Claude + Proxecto Nós en las 8 frases más difíciles (Nós solo admite 1.000 letras) | ti |
| Sami del norte | Claude + TartuNLP (desde el noruego; salida floja, solo algunos términos) | don |
| Frisón | Claude + Frysker (desde el neerlandés, 3 de 5 bloques) | do |
| Francés, alemán, italiano, portugués, neerlandés, danés, sueco, noruego bokmål, finés, polaco, checo, eslovaco, esloveno, húngaro, rumano, griego, ucraniano, macedonio, serbio (cirílico), bosnio, albanés, occitano, irlandés, galés, bretón | Claude + **DeepL Pro** (los 9 bloques, segunda pasada del 21/11) | el de su archivo |
| Noruego nynorsk, montenegrino, asturiano, aranés, corso, rusino, gaélico escocés, alsaciano | **Solo Claude** (no hay traductor neuronal útil) | el de su archivo |
| Ladino | **Solo Claude** (la dirección de Tradutur ya no existe) | tu |

Comprobado con un programa: las 44 tienen las mismas claves que el castellano en esas secciones, variables (`{name}`, `{n}`…) y enlaces intactos, plurales con las formas de cada lengua (polaco, checo, eslovaco, ucraniano, serbio… con 3 o 4 formas; galés con 6) y todos los mensajes se pueden leer sin error. **Segunda pasada con DeepL Pro (21/11/2026).** OlaIA contrató DeepL Pro (traductor web, pago anual) y las 25 lenguas que habían quedado solo con Claude se compararon bloque a bloque con DeepL, quedándose con la frase más natural. Se cambiaron entre 3 y 33 frases por lengua (269 en total); en la mayoría la versión de Claude ya era la más natural, porque DeepL cambiaba el trato (tú/usted), traducía las variables o declinaba «badulake». Sirvió sobre todo para quitar calcos («hoy no existe» → «de momento no existe»), frases más cortas en borrar la cuenta y en «aún no puedes organizar», y formas que no marcan género («no ha venido» → «no está»). La palabra para borrar la cuenta no cambió en ninguna. Ahora quedan **9 lenguas solo con Claude**: las 8 sin traductor útil y el ladino.

Dudas que dejaron los traductores para una persona nativa: albanés «Draft» como préstamo para «borrador»; macedonio «профил» en vez de «сметка» para «cuenta»; polaco «{name}: nieobecność» (neutro, algo seco); portugués y neerlandés cambian el botón «Me interesa» (ya estaba publicado con otra forma).

**Lo que más conviene que revise una persona nativa:** rusino, ladino, sami del norte, aranés, corso, alsaciano, asturiano y montenegrino; y en todas, la palabra para borrar la cuenta y cómo se escribe «badulake» con terminaciones (húngaro «badulakét», rumano «badulake-ul», serbio «badulake-а»).

## Textos nuevos aún sin traducir

**Desde la tarea 23.1 no queda ninguno fuera de los legales** (ver arriba). Lo que sigue es el historial de cómo se fueron quedando en castellano.


Si a una lengua le falta un texto, la web enseña el texto en castellano en vez de un error (`app/src/i18n/request.ts`). Así está hoy todo lo de las cuentas (crear cuenta, entrar, salir), crear un badulake y, desde la tarea 6, ver badulakes, apuntarse y el calendario: escrito en castellano y euskera; las otras 42 lenguas se traducirán con los mismos traductores antes de abrir las cuentas al público.

**Recorridos y «Qué es un badulake» (tarea 7):** los textos nuevos (`Nav`, `WhatIs` y los avisos nuevos de `Account` y `Badulake`) están escritos en castellano y euskera; las otras 42 lenguas los ven en castellano hasta que se traduzcan. Ojo: como «Qué es un badulake» ya se ve en la portada pública, en esas 42 lenguas esa sección sale hoy en castellano. Los textos que ya no se usan (`Home.point1–3`, `Home.signIn`…) siguen en esos archivos y no molestan.

**Aviso de privacidad (tarea 9):** el borrador provisional (`Privacy`) está en castellano y euskera; las otras 42 lenguas lo ven en castellano (solo conservan su título y «Volver»). Se quitó de esos archivos el texto viejo que decía que había una sola cookie, porque con las cuentas ya no es cierto. No merece la pena traducir el borrador: se traducirá el texto definitivo de la Asesoría Jurídica.

**Crear un badulake (tarea 5):** los textos nuevos (`Badulake` y `Account.newBadulake`) están escritos en castellano y euskera; las otras 42 lenguas ven el castellano hasta que se traduzcan, antes de abrir las cuentas al público.

**Textos legales (tarea 12):** `Legal` (aviso legal, condiciones de uso y política de cookies) y el cuerpo de `Privacy.sections` están escritos **solo en castellano**; en euskera solo están traducidos los títulos, el recuadro «Borrador provisional» y los enlaces del pie (**pendiente de traducir al euskera el cuerpo de los cuatro textos, y a las otras 42 lenguas**). En todas las lenguas menos el castellano el cuerpo se enseña en castellano, marcado con `lang="es"` (D-025), y en euskera con un aviso de que está pendiente de traducción. Se quitó el cuerpo antiguo de la privacidad en euskera porque ya no coincidía con el texto nuevo. **No conviene traducirlos hasta que la Asesoría entregue el texto definitivo**: un texto legal traducido a máquina antes de validarse no sirve. Los textos fuente están en [legal/](legal/README.md).

**Denunciar y panel del equipo (tarea 13):** los textos nuevos (`Report`, `Team` y los avisos `denunciado`, `denuncia_repetida` y `denuncia_error` de `Badulake.notices`) están escritos en castellano y euskera; las otras 42 lenguas los ven en castellano. El panel del equipo (`Team`) es interno: no hace falta traducirlo. El botón de denunciar sí conviene traducirlo antes de abrir las cuentas.

**App instalable (tarea 16):** los textos de `Install` (botón y pasos para iPhone) están en castellano y euskera; las otras 42 lenguas los ven en castellano, marcados con `lang="es"`. La página `public/sin-conexion.html` es estática y bilingüe castellano-euskera. El manifiesto usa la descripción `Meta.description` de cada lengua.

**Página del QR `/hola` (tarea 18):** los textos de `Hola` están en castellano, euskera y **catalán** (escritos por Claude, sin revisar por una persona nativa; el catalán es el que se ve en Sant Boi, conviene que lo repase alguien). Las otras 41 lenguas ven el castellano, marcado con `lang="es"`. La web entera en catalán sigue siendo la traducción automática de DeepL de la portada y el pie; el resto de textos ya salen en castellano.

**Cupo, lista de espera y cancelación (tarea 20):** los textos nuevos de `Badulake` (estados confirmado y cancelado, lista de espera, cancelar, avisos `en_espera`, `espera_salida`, `cancelado` y `no_publicable`, y la ayuda y el error de la fecha, que ahora pide 2 días de margen) y los avisos de `Account` (`noticesTitle`, `noticeFromWaitlist`, `noticeCancelled`, `noticeWaiting`) están en castellano y euskera (euskera escrito por Claude y repasado por Claude el 20/11/2026: singular y plural, puesto en la lista y mismas palabras que el resto de la web; falta que lo revise una persona euskaldun, tabla en [revision-euskera.md](revision-euskera.md)). Las otras 42 lenguas los ven en castellano, marcados con `lang="es"`.

**Borrar cuenta y contraseñas (tarea 21):** los textos nuevos de `Account` (olvidada, nueva contraseña, cambiar contraseña, borrar cuenta, palabra de confirmación BORRAR / EZABATU) y los cambios de `Privacy` están en castellano y euskera (euskera escrito por Claude, sin revisar por una persona nativa). Las demás lenguas ven el castellano.

**Decisión de OlaIA (20/11/2026): todo junto, más adelante.** No se traducen sueltos los textos de una sola tarea: en las otras 42 lenguas la página saldría mezclada (casi todo en castellano y unas frases en su lengua) y esas frases quedarían marcadas como castellano (`lang="es"`, D-025), así que los lectores de pantalla las leerían mal. Todos los textos de cuentas y badulakes (Tareas 4 a 20: `Account`, `Badulake`, `Nav`, `WhatIs`, `Report`, `Install`…) se traducen de una vez, con los traductores de la tabla de arriba, antes de abrir las cuentas al público. Al terminar una lengua hay que añadirla a `complete` en `app/src/i18n/content-lang.ts`. Los textos legales (`Legal`, `Privacy`) siguen esperando al texto definitivo de la Asesoría.

El «Modo badulake» del día del evento (tarea 24, textos `Dia` y `Badulake.dayMode`, `myTurn`…) está en castellano y euskera; las demás lenguas lo ven en castellano hasta la traducción conjunta.

**Entrar con Google (Tarea 4.1, 21/11/2026):** 9 textos nuevos de `Account` (`google`, `or`, `ageTitle`, `ageIntro`, `ageSubmit`, `ageLeaveHint`, `ageLeave`, `ageDeleted`, `notices.google`) escritos a la vez en las 44 lenguas, con el mismo trato (tú o usted) y las mismas palabras que el resto de la cuenta en cada lengua, y el nombre del botón como lo usa Google donde se conoce («Weiter mit Google», «Continuer avec Google», «Pokračovat s Googlem»…). Versión de Claude, **sin pasar todavía por DeepL** (OlaIA dormía y DeepL Pro está en su Chrome): pendiente de esa pasada en las lenguas que tiene DeepL y de revisión nativa como el resto. El texto de `/privacidad` (cuerpo legal) se cambió solo en castellano, como siempre.

