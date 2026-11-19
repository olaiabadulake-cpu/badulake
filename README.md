# Badulake

**Una app para organizar quedadas de intercambio de ropa y cosas, pensada para mujeres y abierta a todas las personas mayores de 18 años, construida por alguien que no sabe programar.**

Badulake es a la vez dos cosas:

1. **Una aplicación**: organiza badulakes, quedadas en persona para intercambiar ropa y objetos sin dinero. Está pensada para mujeres y abierta a cualquier persona mayor de 18 años (decisión [D-010](docs/decisiones.md)).
2. **Un experimento en abierto**: OlaIA, sin ningún conocimiento de programación, construye la app dirigiendo a una IA (Claude, de Anthropic), con la supervisión de Adrián, programador y mentor. Queremos ver hasta dónde llega la IA sola cuando la dirige alguien que no programa.

Todo se graba y se documenta aquí: el código, cada decisión, las herramientas y los errores.

## Las reglas del experimento

- **OlaIA dirige y decide.** No escribe código.
- **Claude hace todo lo que puede.** Si una tarea la pueden hacer tanto OlaIA como Claude, la hace Claude y OlaIA la valida.
- **Adrián aconseja y revisa.** Interviene en sesiones grabadas y deja constancia de sus sugerencias.
- **Todo queda escrito.** Cada paso indica quién lo hizo: Claude, OlaIA o Adrián.

## Cómo seguir el proyecto

| Qué | Dónde |
|---|---|
| Diario del proyecto, día a día | [docs/diario.md](docs/diario.md) |
| Decisiones y por qué se tomaron | [docs/decisiones.md](docs/decisiones.md) |
| Herramientas que usamos | [docs/herramientas.md](docs/herramientas.md) |
| La app publicada | [badulake.vercel.app](https://badulake.vercel.app) |
| El código de la app (Next.js) | carpeta [`app/`](app/) |

## ¿Eres programador o programadora?

Nos encanta que mires el código y opines. Abre un *issue* con sugerencias, dudas o errores que veas. Este es un proyecto de aprendizaje en público, así que las explicaciones importan tanto como el código.

## Estado

🟡 Día 1 (19 de noviembre de 2026): primera versión publicada en [badulake.vercel.app](https://badulake.vercel.app), una portada en euskera y castellano. La lista de espera se abrirá cuando haya base de datos.

## Arrancar la app en tu ordenador

Necesitas Node.js 20 o posterior.

```bash
cd app
npm install
npm run dev
```

Y abre http://localhost:3000.
