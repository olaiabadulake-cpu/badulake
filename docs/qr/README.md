# Códigos QR para Sant Boi (Tarea 18, D-033)

Tres códigos, uno por idioma, listos para imprimir: **castellano, euskera y catalán**. Cada archivo existe en **SVG** (vectorial: sirve para cualquier tamaño, el mejor para imprenta) y **PNG** de unos 3000 × 3000 píxeles (para documentos y pantallas).

| Idioma | Archivos | Dirección que abren |
|---|---|---|
| Castellano | `badulake-santboi-es.svg` / `.png` | https://badulake.vercel.app/es/hola?utm_source=qr&utm_campaign=santboi |
| Euskera | `badulake-santboi-eu.svg` / `.png` | https://badulake.vercel.app/eu/hola?utm_source=qr&utm_campaign=santboi |
| Catalán | `badulake-santboi-ca.svg` / `.png` | https://badulake.vercel.app/ca/hola?utm_source=qr&utm_campaign=santboi |

## Para imprimir

- **Tamaño mínimo: 3 × 3 cm** de código (sin contar el margen blanco); para un cartel que se mire a unos 2 metros, **al menos 10 × 10 cm**.
- **No cambies los colores ni lo retoques:** negro sobre blanco, con el margen blanco incluido (es parte del código; no lo recortes ni le pongas nada encima). Un fondo de color, un código «de colores de marca» o una foto detrás hacen que falle en móviles viejos.
- **Imprime en mate**, no en brillo (el reflejo de los focos de grabación estropea la lectura).
- Aguanta hasta un 25 % de suciedad o arañazos (corrección de errores nivel Q), pero no lo dobles por el medio.
- Antes de imprimir cien, **imprime uno y pruébalo** con un Android y un iPhone, a la distancia real del cartel.
- Comprobado: los tres PNG se leen con un lector de QR y salen exactamente las direcciones de la tabla.

## Qué pasa al escanear

Abre la página `/<idioma>/hola`: qué es un badulake en tres pasos y, según el momento, «Crear cuenta» (cuentas abiertas) o la lista de espera (D-018), o el aviso de «muy pronto». Siempre enseña también el enlace a «Qué es un badulake». La página pesa poco y no necesita nada más que la propia web, así que carga con poca cobertura.

## Si cambia el dominio (badulake.app, Tarea 3)

Los QR llevan la dirección escrita dentro: **si badulake.app ya funciona, hay que volver a generarlos y volver a imprimirlos** (los de badulake.vercel.app seguirían funcionando mientras la dirección antigua exista, pero no hay que contar con eso). Para regenerarlos:

```bash
cd app
npm i --no-save qrcode
node scripts/qr.mjs https://badulake.app
```

Sustituye los archivos de esta carpeta. Después, escanea uno y comprueba que abre la página.

## Medir las visitas

Los QR llevan `utm_source=qr&utm_campaign=santboi`. En el plan gratuito de Vercel Analytics (D-029) **no se separan los utm** (haría falta el complemento Plus, 10 $/mes), pero las visitas de los QR se ven igualmente como las de la página `/es/hola`, `/eu/hola` y `/ca/hola`, que solo se abren desde los carteles.
