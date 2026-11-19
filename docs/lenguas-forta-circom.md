# Lenguas de los medios de FORTA y CIRCOM

Para preparar Badulake por si otros medios públicos quieren usarlo. Listado hecho por Claude el 19/11/2026.

**De dónde sale:** los miembros vienen de la web de FORTA (vía Wikipedia) y de la web oficial de CIRCOM ([circom-regional.eu](https://circom-regional.eu/mem-stat-hidmnu)). Las lenguas de cada medio las ha puesto Claude con lo que sabe, sin comprobarlas una a una con cada medio. Antes de usar esta lista para algo oficial, conviene confirmarla.

## FORTA (12 miembros, España)

| Medio | Comunidad | Lenguas en las que emite |
|---|---|---|
| EITB | Euskadi | Euskera, castellano |
| CCMA (TV3, Catalunya Ràdio) | Cataluña | Catalán (también algo de aranés) |
| CSAG (TVG, Radio Galega) | Galicia | Gallego |
| À Punt (CVMC) | Comunidad Valenciana | Valenciano, castellano |
| IB3 | Islas Baleares | Catalán |
| RTPA (TPA) | Asturias | Castellano, asturiano en algunos programas |
| CARTV (Aragón TV) | Aragón | Castellano |
| RTVA (Canal Sur) | Andalucía | Castellano |
| Telemadrid | Madrid | Castellano |
| CMM | Castilla-La Mancha | Castellano |
| RTVC | Canarias | Castellano |
| RTRM (La 7) | Murcia | Castellano |

**Lenguas de FORTA:** castellano, euskera, catalán/valenciano y gallego. El aranés y el asturiano solo aparecen en programas sueltos.

## CIRCOM Regional (29 países)

En España, CIRCOM incluye a todos los de FORTA más **RTVCyL** (Castilla y León) y **CEXMA** (Canal Extremadura), que emiten en castellano.

| País | Medios | Lengua principal | Otras lenguas con programas propios |
|---|---|---|---|
| Albania | RTSH | Albanés | |
| Alemania | HR | Alemán | |
| Austria | ORF | Alemán | Esloveno, croata, húngaro (regiones) |
| Bosnia y Herzegovina | BHRT | Bosnio, croata, serbio | |
| Bulgaria | BNT | Búlgaro | |
| Croacia | HRT | Croata | |
| Chequia | ČT | Checo | |
| Dinamarca | TV2 | Danés | |
| Eslovaquia | STVR | Eslovaco | Húngaro |
| Eslovenia | RTVSLO | Esloveno | Italiano, húngaro |
| España | FORTA, RTVCyL, CEXMA | Castellano | Euskera, catalán/valenciano, gallego |
| Finlandia | Yle | Finés | Sueco, sami |
| Francia | France Télévisions | Francés | Bretón, corso, occitano, alsaciano, euskera, catalán |
| Grecia | ERT3 | Griego | |
| Hungría | MTVA | Húngaro | |
| Irlanda | RTÉ, TG4 | Inglés | Irlandés (TG4 emite en irlandés) |
| Italia | RAI | Italiano | Alemán, ladino, esloveno, francés (regiones) |
| Macedonia del Norte | MKRTV | Macedonio | Albanés y otras |
| Montenegro | RTCG | Montenegrino | |
| Noruega | NRK | Noruego | Sami |
| Países Bajos | RPO | Neerlandés | Frisón |
| Polonia | TVP | Polaco | |
| Portugal | RTP | Portugués | |
| Reino Unido | BBC, MG ALBA | Inglés | Galés, gaélico escocés (MG ALBA), irlandés |
| Rumanía | TVR | Rumano | Húngaro |
| Serbia | RTS, RTV | Serbio | Húngaro, eslovaco, rumano y otras (RTV, Voivodina) |
| Suecia | SVT | Sueco | Finés, sami |
| Suiza | RSI | Italiano | |
| Ucrania | Suspilne, hromadske.tv (asociado) | Ucraniano | |

## Qué supone para la app

- **Lo que ya está listo:** añadir una lengua es añadirla en `app/src/i18n/routing.ts` y crear su archivo en `app/messages/`.
- **Selector:** con más de dos o tres lenguas, el selector EU | ES tendría que pasar a ser un menú desplegable.
- **Alfabetos:** las letras de la web (Roboto y Raleway) solo cargan el alfabeto latino. El búlgaro, el macedonio, el serbio, el ucraniano y el montenegrino usan alfabeto cirílico, y el griego tiene el suyo propio. Para esas lenguas habría que cargar esos alfabetos o cambiar de tipografía.
- **Dirección del texto:** ninguna de estas lenguas se escribe de derecha a izquierda, así que no hace falta adaptar el diseño.
- **Lenguas con varias formas:** el noruego (bokmål y nynorsk) y el catalán/valenciano pueden necesitar dos versiones según quién lo use.
