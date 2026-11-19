"use client";

import { useEffect } from "react";

// Registra el service worker mínimo (public/sw.js). Solo en producción: en desarrollo molestaría.
export function RegisterSW() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});
  }, []);
  return null;
}
