# Auditoría de la app (21/11/2026)

OlaIA pidió a Claude una auditoría de toda la web: cada pantalla, el código y la copia de pruebas, comparados con los requisitos técnicos v2. También le pidió propuestas de mejora con las tendencias actuales. OlaIA aprobó los cuatro bloques. Las ideas nuevas se le pasan también a Adrián.

**Regla nueva sobre las plazas (decisión de OlaIA):** la organizadora cuenta como una persona más. Un badulake es de 5 a 10 personas en total, contándola a ella.

## 🔴 Fallos

| Subtarea | Qué pasa | Arreglo |
|---|---|---|
| 24.1 | Si alguien se borra en las últimas 24 h y quedan menos de 5, el Modo badulake no se abre (`supabase/dia.sql`) | Abrirlo siempre que el badulake no esté cancelado |
| 20.1 | La organizadora no cuenta en las plazas, así que en la práctica son de 6 a 11 personas. En las últimas 24 h el aviso «si no hay 5, se cancela» sigue saliendo | Contar a la organizadora (de 5 a 10 en total) y corregir los textos |
| 8.3 | En la copia, sin sesión, se ven los títulos de `/equipo` y lo que no existe no da un 404 de verdad. `/api/hora` está abierta en la web real | Proteger esas rutas y devolver 404 de verdad. Cerrar o limitar `/api/hora` |
| 5.3 | Si «Publicar» falla al crear, se queda en borrador sin avisar. «Me interesa» cambia aunque no se guarde. Se puede denunciar un badulake cancelado o pasado | Avisar del fallo, deshacer el cambio si no se guarda y ocultar «Denunciar» donde no toca |

## 🟠 Antes de Sant Boi

| Subtarea | Qué |
|---|---|
| 6.1 | «Mis badulakes» en la cuenta, con los próximos y los pasados. Estado «terminado», con pantalla de gracias y aviso de «ya puedes organizar» |
| 6.2 | Buscar por provincia y ciudad. «Cerca de mí» usa la ubicación solo en ese momento y no la guarda |
| 6.3 | Botón «Compartir» (Web Share). Vista previa con imagen al pasar el enlace, sin la dirección. Volver al badulake del enlace después de entrar o crear cuenta |
| 6.4 | Calendario para todas: organizadora, apuntadas y lista de espera. En el calendario va el enlace a la ficha, no la dirección escrita. Partir las líneas largas del .ics |
| 5.4 | Una persona nueva que choca con «Todavía no puedes» ve cómo funciona y tiene un botón «Quiero organizar» que avisa al equipo |
| 24.2 | Modo badulake en el móvil: una fila por persona, botones grandes, pantalla siempre encendida y la cola arriba. Bloquear los contadores cuando la cola ya está fijada |

## 🟢 Tendencias

| Subtarea | Qué |
|---|---|
| 16.1 | Avisos en el móvil desde la app instalada: el día antes, cuando entras desde la lista de espera y cuando se cancela. Hace falta que la Asesoría lo vea |
| 15.1 | Contador de impacto en la portada («X prendas con segunda vida»), con los números del Modo badulake |
| 7.1 | Lista de qué llevar en cada badulake |

## Técnico

| Subtarea | Qué |
|---|---|
| 8.4 | Aviso automático de errores con Sentry (plan gratuito, región UE). Estaba en los requisitos y no se hizo |
| 11.1 | Selector de idioma: detectar la lengua del móvil y poder buscar entre las 44 |

## Fuera, a propósito

Siguen fuera porque ya se descartaron (D-014 y otras):

- grupos;
- valoraciones entre personas, que necesitan a la Asesoría;
- mapa;
- fotos de las prendas.

Se proponen a Adrián si se quieren retomar.
