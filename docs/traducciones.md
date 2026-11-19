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
| Ladino | Tradutur (Universidad de Innsbruck) | A partir del italiano. Variante de Val Badia |
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

## Textos nuevos aún sin traducir

Si a una lengua le falta un texto, la web enseña el texto en castellano en vez de un error (`app/src/i18n/request.ts`). Así está hoy todo lo de las cuentas (crear cuenta, entrar, salir), crear un badulake y, desde la tarea 6, ver badulakes, apuntarse y el calendario: escrito en castellano y euskera; las otras 42 lenguas se traducirán con los mismos traductores antes de abrir las cuentas al público.

**Recorridos y «Qué es un badulake» (tarea 7):** los textos nuevos (`Nav`, `WhatIs` y los avisos nuevos de `Account` y `Badulake`) están escritos en castellano y euskera; las otras 42 lenguas los ven en castellano hasta que se traduzcan. Ojo: como «Qué es un badulake» ya se ve en la portada pública, en esas 42 lenguas esa sección sale hoy en castellano. Los textos que ya no se usan (`Home.point1–3`, `Home.signIn`…) siguen en esos archivos y no molestan.

**Aviso de privacidad (tarea 9):** el borrador provisional (`Privacy`) está en castellano y euskera; las otras 42 lenguas lo ven en castellano (solo conservan su título y «Volver»). Se quitó de esos archivos el texto viejo que decía que había una sola cookie, porque con las cuentas ya no es cierto. No merece la pena traducir el borrador: se traducirá el texto definitivo de la Asesoría Jurídica.

**Crear un badulake (tarea 5):** los textos nuevos (`Badulake` y `Account.newBadulake`) están escritos en castellano y euskera; las otras 42 lenguas ven el castellano hasta que se traduzcan, antes de abrir las cuentas al público.

**Textos legales (tarea 12):** `Legal` (aviso legal, condiciones de uso y política de cookies) y el cuerpo de `Privacy.sections` están escritos **solo en castellano**; en euskera solo están traducidos los títulos, el recuadro «Borrador provisional» y los enlaces del pie (**pendiente de traducir al euskera el cuerpo de los cuatro textos, y a las otras 42 lenguas**). En todas las lenguas menos el castellano el cuerpo se enseña en castellano, marcado con `lang="es"` (D-025), y en euskera con un aviso de que está pendiente de traducción. Se quitó el cuerpo antiguo de la privacidad en euskera porque ya no coincidía con el texto nuevo. **No conviene traducirlos hasta que la Asesoría entregue el texto definitivo**: un texto legal traducido a máquina antes de validarse no sirve. Los textos fuente están en [legal/](legal/README.md).

**Denunciar y panel del equipo (tarea 13):** los textos nuevos (`Report`, `Team` y los avisos `denunciado`, `denuncia_repetida` y `denuncia_error` de `Badulake.notices`) están escritos en castellano y euskera; las otras 42 lenguas los ven en castellano. El panel del equipo (`Team`) es interno: no hace falta traducirlo. El botón de denunciar sí conviene traducirlo antes de abrir las cuentas.
