"use client";

import { useState } from "react";
import { nearestProvincia } from "@/lib/provincias";
import { useRouter } from "@/i18n/navigation";

// «Cerca de mí» (Tarea 6.2, D-043): pide la ubicación una sola vez, en el momento, calcula aquí
// mismo la provincia más cercana y solo pone su código en la dirección. La ubicación no se manda a
// ningún sitio ni se guarda.
export function NearMe({ label, hint, error }: { label: string; hint: string; error: string }) {
  const [state, setState] = useState<"idle" | "busy" | "error">("idle");
  const router = useRouter();
  function locate() {
    if (!("geolocation" in navigator)) return setState("error");
    setState("busy");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p = nearestProvincia(pos.coords.latitude, pos.coords.longitude);
        router.push({ pathname: "/badulakes", query: { prov: p.code } });
        setState("idle");
      },
      () => setState("error"),
      { enableHighAccuracy: false, maximumAge: 0, timeout: 15000 },
    );
  }
  return (
    <div className="flex flex-col gap-1.5">
      <button type="button" onClick={locate} disabled={state === "busy"} className="boton-2 sm:self-start">
        {label}
      </button>
      <p className="ayuda">{hint}</p>
      {state === "error" && <p role="alert" className="aviso-error">{error}</p>}
    </div>
  );
}
