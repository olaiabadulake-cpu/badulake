# ¿Aguanta Badulake el día de Sant Boi? (Tarea 18)

**Resumen:** sí. La parte pública (portada, «Qué es un badulake» y la página del QR) aguanta de sobra a 200 personas entrando a la vez. La parte con cuenta (apuntarse a la vez) **queda pendiente de probar** cuando la Tarea 20 acabe de cambiar cómo se reparten las plazas.

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

## 3. Pendiente: apuntarse a la vez (con cuenta)

La Tarea 6 comprobó que con **cinco plazas y seis personas a la vez entran exactamente cinco**, gracias a un bloqueo en la base de datos (`apuntarme`, D-021). Quedaba por repetirlo a escala (100–200 personas). **No se ha hecho** por dos razones:
1. **La Tarea 20 está cambiando esa función ahora mismo** (cupo, lista de espera y cancelación automática, D-032): probarla antes de que termine no valdría.
2. **No hay base de datos local** (el Mac no tiene Docker ni Postgres) y la única es la de producción en Frankfurt, que tiene el alta apagada y límites de acceso de cuentas por hora. Crear 150 cuentas inventadas y que entren a la vez a la misma hora se hace con SQL.

Cómo hacerlo cuando la Tarea 20 acabe (con permiso, datos inventados `prueba-carga…@badulake.app` y borrado al terminar): crear un badulake de 10 plazas y 150 cuentas inventadas por SQL, lanzar `apuntarme` desde 150 conexiones a la vez y comprobar que hay exactamente 10 inscripciones y 140 respuestas «lleno» y 0 errores; después, borrar cuentas y badulake y comprobar todo a 0.

## 4. Web publicada (comprobación suave)
