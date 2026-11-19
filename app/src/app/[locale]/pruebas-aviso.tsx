import { copiaDePruebas } from "@/lib/pruebas";

// Aviso grande en todas las páginas de la copia de pruebas (Tarea 22, D-035). En la web real no se pinta.
export function PruebasAviso() {
  if (!copiaDePruebas) return null;
  return (
    <div
      role="note"
      lang="es"
      className="bg-red-700 px-4 py-3 text-center text-base font-extrabold uppercase tracking-wide text-white sm:text-lg"
    >
      Copia de pruebas — datos inventados
    </div>
  );
}
