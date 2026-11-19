# ¿Aguanta Badulake el día de Sant Boi? (Tarea 18)

**Resumen:** sí. La parte pública (portada, «Qué es un badulake» y la página del QR) aguanta de sobra a 200 personas entrando a la vez. La parte con cuenta también: 120 personas apuntándose a la vez a un badulake de 10 plazas dieron exactamente 10 dentro, 110 en lista con puestos del 1 al 110 y 0 errores.

## 1. Lo que NO se hizo, y por qué

No se lanzó una prueba de carga fuerte contra la web publicada (badulake.vercel.app). Las condiciones de Vercel dicen que las pruebas de carga sobre su plataforma están pensadas para planes de empresa o hay que avisarles antes; si no, pueden tomarlo por un ataque y **bloquear la conexión desde la que se prueba**. Además el plan gratuito de Vercel es «de uso personal» y tiene tope de visitas al mes. Una prueba grande podría dejar sin acceso a OlaIA a su propia web antes de rodar. Lo prudente era no tocarla.

## 2. Qué sí se probó

**a) La misma web, en el Mac, con 200 personas a la vez.** Se compiló la versión idéntica a la publicada (cuentas cerradas) y se la machacó con 200 visitantes simultáneos durante 20 segundos en cada página, con la herramienta libre autocannon (Node). Todas las visitas pidiendo la página completa, sin esperar entre una y otra (mucho más duro que gente real).

| Página | Visitas atendidas en 20 s | Por segundo | Tiempo medio de respuesta | El 99 % de las visitas, en menos de | Errores |
|---|---|---|---|---|---|
| Portada `/es` | 53.000 | 2.600 | 75 ms | 110 ms | 0 |
| `/es/que-es` | 54.000 | 2.700 | 74 ms | 105 ms | 0 |
| `/es/hola` (QR, castellano) | 49.000 | 2.460 | 81 ms | 111 ms | 0 |
| `/eu/hola` (QR, euskera) | 49.000 | 2.460 | 81 ms | 120 ms | 0 |

Traducido: en Sant Boi no llegarán 2.500 personas por segundo; lo normal serán unas decenas en total en unos minutos. Un solo Mac sirve cientos de veces eso, y la web publicada además va repartida por la red de Vercel, que es más rápida y escala sola. Ninguna de estas páginas habla con la base de datos (Supabase): se sirven ya preparadas, así que **la base de datos no se entera de las visitas** de la gente que escanea el QR.

**b) Comprobación suave en la web publicada** (como si fueran unas pocas personas normales, sin pasar de 5 a la vez y unas 100 visitas en total): ver el apartado 4.

## 3. Apuntarse a la vez (con cuenta): hecho

La Tarea 6 comprobó 6 personas a la vez por 5 plazas; la Tarea 20 (D-032) añadió la lista de espera. Aquí se repitió a escala, **en la base de datos real** (Frankfurt, sin tocar la web) y con datos inventados:

- **Preparación:** 121 cuentas inventadas (`prueba-t18-000` a `120`, del dominio badulake.app, creadas por SQL con permiso de OlaIA, D-011) y un badulake publicado de **10 plazas** organizado por la 000.
- **La prueba:** las 120 cuentas inician sesión y, **todas a la vez** (120 llamadas simultáneas a `apuntarme`), pulsan «Apuntarme».

| Resultado | Esperado | Obtenido |
|---|---|---|
| Entran con plaza | 10 | **10** |
| En lista de espera | 110 | **110** |
| Errores | 0 | **0** |
| Puestos de la lista (cada cuenta pregunta el suyo) | del 1 al 110, sin repetir ni saltos | **del 1 al 110 exactos** |
| Alguien en las dos (dentro y en espera) | 0 | **0** |
| Tiempo en atender a las 120 a la vez | | **1,4 s** en total (mediana 1,2 s, la más lenta 1,4 s) |

Traducido: aunque 120 personas pulsen en el mismo segundo, entran justo las plazas, el resto queda en la lista en orden y nadie recibe un error. Las peticiones se ponen en cola dentro de la base de datos (bloqueo del badulake), por eso la última espera algo más de un segundo, pero ninguna falla.

- **Límite de Supabase al probar:** las entradas de cuenta (iniciar sesión) están limitadas por conexión (tras las primeras 30, unas 10 más cada 20 segundos), así que preparar las 120 sesiones tardó unos 5 minutos. **Es un límite de la prueba, no de apuntarse:** el día de Sant Boi la gente entra poco a poco. Para registrarse a la vez (crear cuentas) rige además el límite de correos de Supabase hasta tener el correo propio (Tarea 10).
- **Borrado:** al acabar se borraron las cuentas, el badulake y todo lo demás. Comprobado: cuentas, perfiles, badulakes, direcciones, inscripciones y lista de espera **a 0**.
- **No se probó** la salida a la vez de varias personas con otras entrando (la Tarea 20 ya lo comprobó con 3 bajas a la vez y 15 cuentas).

## 4. Web publicada (comprobación suave)

Tras publicar (commit `c604bda`), 100 visitas en total (25 por página, 5 a la vez) a la web de verdad:

| Página | Tiempo medio | Errores |
|---|---|---|
| Portada | 153 ms | 0 |
| Qué es | 119 ms | 0 |
| `/es/hola` (QR) | 88 ms | 0 |
| `/eu/hola` (QR) | 95 ms | 0 |

Las páginas salen ya preparadas desde la red de Vercel (cabecera `x-vercel-cache: HIT`). Comprobado también que las públicas dan 200 (portada, Qué es, `/hola` en es, eu y ca) y que lo que va con cuenta (`registro`, `entrar`, `badulakes`, `cuenta`, `equipo`) da 404 mientras las cuentas sigan cerradas.

## 5. Límites que conviene saber (consultados el 19/11/2026)

- **Vercel (plan gratuito Hobby):** uso personal y no comercial según su política; las pruebas de carga fuertes requieren aviso a Vercel. Si el día de Sant Boi se espera mucha más gente (miles), conviene revisar con OlaIA y EITB si el plan gratuito sirve (ver [costes.md](costes.md)).
- **Supabase (gratis):** las páginas públicas no le hacen preguntas, así que el QR no gasta nada de la base de datos. Lo que sí gasta es crear cuentas (correo de verificación limitado hasta que exista el correo propio, Tarea 10).
- **Herramientas usadas:** autocannon y qrcode, libres y sin cuenta ni coste.
