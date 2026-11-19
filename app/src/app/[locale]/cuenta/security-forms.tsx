"use client";

import { useActionState, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useFocusFirstError } from "../focus-first-error";
import { changePassword, deleteAccount, type SimpleState } from "./actions";

const initial: SimpleState = { status: "idle" };

// Cambiar la contraseña estando dentro: pide la actual.
export function ChangePassword() {
  const t = useTranslations("Account");
  const [state, action, pending] = useActionState(changePassword, initial);
  const ref = useRef<HTMLFormElement>(null);
  useFocusFirstError(ref, state);
  const e = state.errors ?? {};
  const msg = e.current ? "currentWrong" : e.password ? "password" : e.confirm ? "confirmMismatch" : e.tooMany ? "tooMany" : e.generic ? "generic" : null;

  return (
    <section aria-labelledby="cp-title" className="flex flex-col gap-4">
      <h2 id="cp-title" className="titulo-2">{t("changePasswordTitle")}</h2>
      <form ref={ref} action={action} noValidate className="flex flex-col gap-4">
        {(["current", "password", "confirm"] as const).map((name) => (
          <div key={name} className="flex flex-col gap-1.5">
            <label htmlFor={`cp-${name}`} className="etiqueta">
              {t(name === "current" ? "currentPassword" : name === "password" ? "newPassword" : "repeatPassword")}
            </label>
            <input
              id={`cp-${name}`} name={name} type="password" required
              autoComplete={name === "current" ? "current-password" : "new-password"}
              aria-invalid={Boolean(e[name])} aria-describedby={msg ? "cp-error" : undefined}
              className="campo"
            />
          </div>
        ))}
        {msg && <p id="cp-error" role="alert" className="error-texto">{t(`errors.${msg}`)}</p>}
        {state.status === "done" && <p role="status" className="aviso">{t("passwordChanged")}</p>}
        <button type="submit" disabled={pending} className="boton-2 sm:self-start">
          {pending ? t("pending") : t("changePasswordSubmit")}
        </button>
      </form>
    </section>
  );
}

// Borrar la cuenta: hay que escribir la palabra de confirmación.
export function DeleteAccount() {
  const t = useTranslations("Account");
  const locale = useLocale();
  const [state, action, pending] = useActionState(deleteAccount, initial);
  const ref = useRef<HTMLFormElement>(null);
  useFocusFirstError(ref, state);
  const e = state.errors ?? {};
  const msg = e.confirm ? "deleteWord" : e.tooMany ? "tooMany" : e.generic ? "generic" : null;

  return (
    <section aria-labelledby="del-title" className="flex flex-col gap-4">
      <h2 id="del-title" className="titulo-2">{t("deleteTitle")}</h2>
      <p>{t("deleteIntro")}</p>
      <ul className="list-disc pl-6">
        <li>{t("deleteItem1")}</li>
        <li>{t("deleteItem2")}</li>
        <li>{t("deleteItem3")}</li>
      </ul>
      <p><strong>{t("deleteWarning")}</strong></p>
      <form ref={ref} action={action} noValidate className="flex flex-col gap-4">
        <input type="hidden" name="locale" value={locale} />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="del-confirm" className="etiqueta">{t("deleteLabel", { word: t("deleteWord") })}</label>
          <input
            id="del-confirm" name="confirm" type="text" autoComplete="off" autoCapitalize="characters" required
            aria-invalid={Boolean(msg)} aria-describedby={msg ? "del-error" : undefined}
            className="campo"
          />
        </div>
        {msg && <p id="del-error" role="alert" className="error-texto">{msg === "deleteWord" ? t("errors.deleteWord", { word: t("deleteWord") }) : t(`errors.${msg}`)}</p>}
        <button type="submit" disabled={pending} className="boton-2 sm:self-start">
          {pending ? t("pending") : t("deleteSubmit")}
        </button>
      </form>
    </section>
  );
}
