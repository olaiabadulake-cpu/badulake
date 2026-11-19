"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

// «Instálala en tu móvil» (Tarea 16, D-030). Sin ventanas ni avisos que salten: un botón o un
// desplegable discreto en el pie. En Android/Chrome sale solo si el navegador deja instalar;
// en iPhone y iPad (donde no hay botón) explica «Compartir → Añadir a pantalla de inicio».
// Si la app ya está instalada, o el navegador no puede, no sale nada.
type InstallEvent = Event & { prompt: () => Promise<void> };

export function InstallHint({ lang }: { lang: string }) {
  const t = useTranslations("Install");
  const [event, setEvent] = useState<InstallEvent | null>(null);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (standalone) return;
    const ua = navigator.userAgent;
    const isApple = /iPhone|iPad|iPod/.test(ua) || (ua.includes("Macintosh") && navigator.maxTouchPoints > 1);
    // En iPhone solo Safari puede añadir a la pantalla de inicio; los demás navegadores de iOS
    // (Chrome, Firefox…) también, desde iOS 16.4, con el mismo menú Compartir.
    // Hay que mirar el navegador, y eso solo se puede una vez cargada la página.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIos(isApple);
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvent(e as InstallEvent);
    };
    const onInstalled = () => setEvent(null);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (event) {
    return (
      <div lang={lang} className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="font-semibold">{t("title")}</p>
        <button
          type="button"
          className="boton-2 !border-white !text-white hover:!text-noche"
          onClick={() => {
            event.prompt().finally(() => setEvent(null));
          }}
        >
          {t("button")}
        </button>
      </div>
    );
  }

  if (ios) {
    return (
      <details lang={lang} className="group">
        <summary className="enlace cursor-pointer font-semibold">{t("title")}</summary>
        <ol className="mt-2 list-decimal space-y-1 pl-6">
          <li>{t("iosStep1")}</li>
          <li>{t("iosStep2")}</li>
          <li>{t("iosStep3")}</li>
        </ol>
      </details>
    );
  }

  return null;
}
