"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { setInterest, type InterestState } from "./interes-actions";
import type { InterestOption } from "./interes-config";

export function InterestRow({ option, initialOn }: { option: InterestOption; initialOn: boolean }) {
  const t = useTranslations("Account");
  const [state, action, pending] = useActionState<InterestState, FormData>(setInterest, { status: "idle" });
  // El botón enseña lo que está guardado: cambia solo cuando la base de datos lo confirma, y si
  // falla se queda como estaba (Tarea 5.3). Mientras se guarda, el botón está desactivado.
  const on = state.on ?? initialOn;
  const title = t(`${option}Title`);
  return (
    <div className="flex flex-col gap-2">
      <h3 className="titulo-3">{title}</h3>
      <p>{t(`${option}Text`)}</p>
      <form
        action={(fd) => {
          fd.set("option", option);
          fd.set("on", on ? "0" : "1");
          return action(fd);
        }}
      >
        <button type="submit" className="boton-2" disabled={pending} aria-pressed={on}>
          {on ? t("interestOff") : t("interestOn")}
          <span className="sr-only"> {title}</span>
        </button>
      </form>
      {state.status === "error" && <p role="alert" className="aviso-error">{t("interestError")}</p>}
    </div>
  );
}
