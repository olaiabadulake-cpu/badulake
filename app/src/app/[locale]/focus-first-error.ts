"use client";

import { useEffect, useRef } from "react";

// Tras enviar un formulario con errores, el foco pasa al primer campo con error
// (si no hay campo, al aviso general), para que quien usa teclado o lector de pantalla no se pierda.
export function useFocusFirstError(form: React.RefObject<HTMLFormElement | null>, state: unknown) {
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const el = form.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
    el?.focus();
  }, [form, state]);
}
