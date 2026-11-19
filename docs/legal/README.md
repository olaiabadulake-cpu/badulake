# Textos legales de Badulake (borradores)

**BORRADORES para revisión de la Asesoría Jurídica de EITB — no son textos definitivos** (Tarea 12, decisión D-026).

| Texto | Archivo | Página en la app |
|---|---|---|
| Aviso legal (LSSI) | [aviso-legal.md](aviso-legal.md) | `/aviso-legal` |
| Política de privacidad (RGPD y LOPDGDD) | [politica-privacidad.md](politica-privacidad.md) | `/privacidad` |
| Condiciones de uso | [condiciones-uso.md](condiciones-uso.md) | `/condiciones` |
| Política de cookies | [politica-cookies.md](politica-cookies.md) | `/cookies` |

- **Para que la Asesoría comente y corrija:** Google Doc «Badulake · Borrador de textos legales» (carpeta de Drive del proyecto): https://docs.google.com/document/d/1HGjhieNgzS6wlglqDn6L4Q80puewQhzl2curwobZVVU/edit
- Cada texto empieza con una lista de **dudas para la Asesoría**. Los huecos **[A COMPLETAR POR ASESORÍA]** son datos que no se conocen con certeza (razón social, NIF, domicilio, correo de contacto, delegado de protección de datos, tribunales, licencia del código, fechas de versión).
- **Dónde está el texto en la app:** `app/messages/es.json`, claves `Legal.aviso`, `Legal.condiciones`, `Legal.cookies` y `Privacy.sections`. Se generaron desde estos archivos; cuando llegue el texto definitivo hay que cambiar ambos sitios (o rehacer los mensajes desde los `.md`) y quitar el recuadro «Borrador provisional».
- Se apoyan en [privacidad.md](../privacidad.md) (ficha de datos), [seguridad.md](../seguridad.md) y [accesibilidad.md](../accesibilidad.md). Si cambia lo que la app hace (por ejemplo, la Tarea 10 añade correo propio y la 13 denuncias), hay que actualizarlos.
