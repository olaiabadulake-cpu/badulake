"use client";

import { useState } from "react";

// Compartir (Tarea 6.3, D-042): el menú de compartir del móvil (WhatsApp, Telegram…) y, si no
// existe, copiar el enlace. El enlace lleva a la ficha; sin cuenta se ve la vista previa pública.
export function ShareButton({ title, text, label, copied }: { title: string; text: string; label: string; copied: string }) {
  const [done, setDone] = useState(false);
  async function share() {
    const url = `${location.origin}${location.pathname}`;
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setDone(true);
    } catch {
      // Cancelar el menú de compartir no es un error.
    }
  }
  return (
    <div className="flex flex-col gap-2 sm:self-start">
      <button type="button" onClick={share} className="boton-2">{label}</button>
      {done && <p role="status" className="ayuda">{copied}</p>}
    </div>
  );
}
