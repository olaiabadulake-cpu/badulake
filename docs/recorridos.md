# Recorridos de la app: el «algoritmo del Badulake»

Tarea 7 del plan maestro. Episodio 3 (escenas 3.6–3.9): Daniel Torres Burriel, experto en usabilidad, critica que la navegación es inconsistente, las etiquetas ambiguas, los mensajes de estado y de error poco claros, y que la palabra «badulake» no se explica en ningún sitio. Adrián lo convierte en el «algoritmo del Badulake»: escribir los pasos uno a uno, sacar de ahí el árbol del menú y dárselo a Claude.

Como los expertos revisan al final (decisión de OlaIA del 19/11/2026), esto se hace ya, adelantándose a esas críticas.

## 1. Qué es un badulake (lo que la app tiene que explicar)

Un badulake es una **quedada en persona de 5 a 10 personas para intercambiar ropa y cosas que ya no usáis**. Nadie paga ni cobra nada.

Cómo funciona, en cuatro pasos:

1. Crea tu cuenta. Es gratis y solo para mayores de 18 años.
2. Busca un badulake y apúntate. Al apuntarte verás la dirección exacta.
3. Ve con lo que ya no usas.
4. Intercambia: llévate lo que te guste.

¿Prefieres organizarlo tú? Crea un badulake y publícalo.

Esto aparece en la portada y en su propia página, «Qué es un badulake», enlazada siempre desde el menú.

## 2. Los recorridos, paso a paso

### Recorrido A · Llegar sin cuenta y entender qué es

1. Abro la web. Veo el nombre, una frase que lo resume y la sección «Qué es un badulake» con los cuatro pasos.
2. Arriba, el menú siempre igual: «Qué es un badulake», «Entrar», «Crear cuenta» e idioma.
3. Si quiero más detalle, pulso «Qué es un badulake» desde cualquier página.

### Recorrido B · Crear cuenta

1. Pulso «Crear cuenta» (en el menú o en la portada).
2. Escribo correo, contraseña y fecha de nacimiento. Si algo está mal, el aviso sale junto al campo y no pierdo lo escrito.
3. Si tengo menos de 18 años, me lo dice con claridad.
4. Me avisa: «Te hemos enviado un correo». Abro el enlace del correo.
5. Vuelvo a la web con el aviso «Tu correo está verificado. Ya puedes entrar».

### Recorrido C · Entrar

1. Pulso «Entrar» y escribo correo y contraseña.
2. **Voy directamente a la lista de badulakes** (antes iba a «Tu cuenta», que era un paso de más).
3. Si intento abrir una página de badulakes sin haber entrado, me lleva a «Entrar» y me dice por qué: «Entra en tu cuenta para ver los badulakes».

### Recorrido D · Ver badulakes, entrar en uno y apuntarme

1. En «Badulakes» veo los próximos, ordenados por fecha: título, día y hora, zona y plazas libres.
2. Si no hay ninguno: «Todavía no hay badulakes. Vuelve pronto o crea uno tú», con el botón «Crear un badulake».
3. En la lista también veo marcados los míos: los que organizo (aunque sean borradores) y en los que estoy apuntada.
4. Pulso uno. Veo la descripción, el día y la hora, la zona y las plazas libres. Me dice que la dirección exacta la veré al apuntarme.
5. Pulso «Apuntarme».
   - Bien: «¡Te has apuntado!», ya veo la dirección exacta y el botón «Añadir al calendario».
   - Sin plazas: «Lo sentimos: ya no quedan plazas».
   - Ya pasado o retirado: «Este badulake ya no admite inscripciones».
   - Fallo: «Algo ha fallado. Inténtalo de nuevo en un rato».
6. Si cambio de idea, pulso «Borrarme» y me confirma «Te has borrado de este badulake».
7. Desde cualquier sitio puedo volver con «Badulakes» en el menú, o con el enlace «Volver a los badulakes».

### Recorrido E · Organizar un badulake

1. Pulso «Crear un badulake» (en el menú o en la lista).
2. Relleno título, descripción, fecha y hora, zona, dirección exacta y plazas (de 5 a 10). Cada campo explica qué poner; los errores salen junto al campo y no se pierde nada.
3. **Pulso «Publicar»** y queda publicado de una vez (antes había que guardar borrador y luego publicar: un paso de más). Si aún no lo quiero publicar, pulso «Guardar como borrador».
4. Veo «Tu badulake» con un aviso claro: publicado («Ya lo pueden ver las personas con cuenta») o borrador («De momento solo lo ves tú», con el botón «Publicar»).
5. Veo cuántas plazas están ocupadas, y que la dirección exacta solo la ven quienes se apunten.
6. Lo encuentro después en la lista de badulakes, marcado como mío.

### Recorrido F · Mi cuenta y salir

1. En «Tu cuenta» veo con qué correo he entrado y el botón «Salir».
2. Al salir vuelvo a la portada con el aviso «Has salido de tu cuenta».

## 3. Árbol del menú

El mismo menú arriba en todas las páginas. Cambia solo según haya o no sesión.

```
Sin sesión
├── badulakë (logo) ............ Portada
├── Qué es un badulake
├── Entrar
├── Crear cuenta
└── Idioma

Con sesión
├── badulakë (logo) ............ Portada
├── Badulakes .................. lista
│   └── (un badulake) .......... Apuntarme / Borrarme / Añadir al calendario
│                                 Si es mío: Publicar (si es borrador)
├── Crear un badulake
├── Qué es un badulake
├── Tu cuenta .................. correo y Salir
└── Idioma
```

En la web pública, mientras las cuentas sigan cerradas (hasta el aviso de privacidad), el menú solo enseña «Qué es un badulake» e idioma.

## 4. Palabras que se usan siempre igual

| Siempre | En vez de |
|---|---|
| Entrar | «Entra», «Iniciar sesión» |
| Crear cuenta | «Créala aquí», «Registrarse» |
| Salir | «Cerrar sesión» |
| Badulakes | «Ver badulakes», «Listado» |
| Crear un badulake | «Nuevo», «Organizar» |
| Apuntarme / Borrarme | «Me borro», «Inscribirse» |
| Tu cuenta | «Perfil», «Mi cuenta» |

## 5. Qué queda fuera

Diseño visual, colores y logo (Tarea 14), fotos de objetos o personas, seguridad (8), privacidad (9), correos (10) y la revisión completa de accesibilidad (11).
