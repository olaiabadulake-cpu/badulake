"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { removePush, savePush } from "./push-actions";

// «Avisos en el móvil» (Tarea 16.1, D-050): activarlos o quitarlos en este móvil. Solo en la copia.
function keyBytes(base64: string): Uint8Array {
  const pad = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + pad).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

type State = "loading" | "unsupported" | "denied" | "off" | "on" | "busy" | "error";

export function PushAvisos({ publicKey }: { publicKey: string }) {
  const t = useTranslations("Account");
  const [state, setState] = useState<State>("loading");

  useEffect(() => {
    const check = async () => {
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) return "unsupported";
      if (Notification.permission === "denied") return "denied";
      const reg = await navigator.serviceWorker.getRegistration("/");
      const sub = await reg?.pushManager.getSubscription();
      return sub ? "on" : "off";
    };
    check().then((s) => setState(s as State)).catch(() => setState("unsupported"));
  }, []);

  async function enable() {
    setState("busy");
    try {
      if ((await Notification.requestPermission()) !== "granted") return setState("denied");
      const reg = (await navigator.serviceWorker.getRegistration("/")) ?? (await navigator.serviceWorker.register("/sw.js", { scope: "/" }));
      await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes(publicKey) as BufferSource });
      const ok = await savePush(sub.toJSON() as { endpoint: string; keys: { p256dh: string; auth: string } });
      if (!ok) {
        await sub.unsubscribe();
        return setState("error");
      }
      setState("on");
    } catch {
      setState("error");
    }
  }

  async function disable() {
    setState("busy");
    try {
      const reg = await navigator.serviceWorker.getRegistration("/");
      const sub = await reg?.pushManager.getSubscription();
      if (sub) {
        await removePush(sub.endpoint);
        await sub.unsubscribe();
      }
      setState("off");
    } catch {
      setState("error");
    }
  }

  return (
    <section aria-labelledby="avisos-movil" className="flex flex-col gap-3">
      <h2 id="avisos-movil" className="titulo-2">{t("pushTitle")}</h2>
      <p>{t("pushExplain")}</p>
      {state === "unsupported" && <p className="ayuda">{t("pushUnsupported")}</p>}
      {state === "denied" && <p role="alert" className="aviso-error">{t("pushDenied")}</p>}
      {state === "error" && <p role="alert" className="aviso-error">{t("pushError")}</p>}
      {state === "on" && <p role="status" className="aviso">{t("pushActive")}</p>}
      {(state === "off" || state === "error") && (
        <button type="button" onClick={enable} className="boton-2 sm:self-start">{t("pushOn")}</button>
      )}
      {(state === "on" || state === "busy") && (
        <button type="button" onClick={disable} disabled={state === "busy"} className="boton-2 sm:self-start">{t("pushOff")}</button>
      )}
    </section>
  );
}
