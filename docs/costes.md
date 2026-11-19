# Cuánto cuesta mantener Badulake

Resumen para la escena de monetizar (Tarea 17, D-030). Los datos salen de la pestaña **Costes** de la hoja «Badulake · Costes y cuentas» y de los precios oficiales anotados allí (revisados 19/11/2026). Todo en dólares (USD), tal como cobran los proveedores; el importe en euros lo confirma la factura.

**Lo que no cuesta nada ni se cobra:** Badulake no cobra a nadie (D-012). Los costes los paga el proyecto, no las usuarias.

## Qué paga la app al mes

| Servicio | Para qué | Hoy | Con 100 usuarias | Con 1.000 usuarias |
|---|---|---|---|---|
| **Vercel** (la web) | Publica la app | Hobby, gratis | Pro: **20 USD** (por miembro del equipo) | Pro: **20 USD** (el mismo plan; revisar el uso incluido) |
| **Supabase** (base de datos, Frankfurt) | Cuentas, badulakes, inscripciones | Free, **gratis** (pausa el proyecto tras 1 semana sin uso) | Pro: **25 USD** (sin pausas, copias de seguridad) | Pro: **25 USD** (por encima del uso incluido, se paga aparte; a vigilar) |
| **Correo** (Resend, UE) | Avisos a las personas | Free, **gratis** (3.000 correos al mes), pendiente de alta (Tarea 10) | Free: **0 USD** | Pro: **20 USD** si se supera 3.000 correos al mes |
| **Analítica** (Vercel Web Analytics) | Visitas sin cookies | Hobby, **gratis** (50.000 eventos al mes) | Hobby: **0 USD** | Hobby o Plus (10 USD) si se quieren campañas por utm |
| **Dominio** | Dirección de la web | **Pendiente**: no está anotado en la hoja | Pendiente | Pendiente |
| **Total aproximado (sin dominio)** | | **0 USD** | **≈ 45 USD/mes** | **≈ 45–75 USD/mes** |

## Cómo leer esto

- **Hoy** todo es gratuito, pero Supabase Free pausa el proyecto si nadie entra en una semana y Vercel Hobby es para uso no comercial: para publicar de verdad hacen falta los planes de pago.
- **Con 100 o con 1.000 usuarias** la cuenta es parecida: la base de datos y la web siguen en planes de pago fijos. Lo que sube con el uso son los correos (si pasan de 3.000 al mes) y el consumo de Supabase y Vercel por encima de lo incluido. Por eso el 1.000 aparece como rango.
- **Las cifras de 100 y 1.000 son estimaciones**, no medidas: la app no tiene usuarias reales. Hay que revisarlas con el consumo real antes de decidir precios.
- **Vercel Pro:** las páginas oficiales de Vercel no coinciden en lo que incluye; revisar antes de contratar (ya anotado en la hoja).
- **Lo que queda fuera:** Riverside (35 USD/mes) y Claude (200 USD/mes) son herramientas de la docuserie, no de la app. Están en la hoja, pero no cuentan aquí.

## Qué falta para cerrar la cifra

1. Precio y fecha de renovación del **dominio** (no está en la hoja).
2. Confirmar en factura los importes en euros.
3. Medir el uso real cuando haya usuarias (Vercel y Supabase lo muestran en su panel).

Fuentes: pestaña Costes de la hoja «Badulake · Costes y cuentas» (id `12aWhyZ6NU-NntOUr3BkQBNMNGGB-RXU95mGSAEkZkwA`), D-012, D-029 y las entradas de Supabase y Vercel en la hoja.
