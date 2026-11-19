"use client";

import { useActionState, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useFocusFirstError } from "../focus-first-error";
import { setNewPassword, type SimpleState } from "../cuenta/actions";

export function NewPasswordForm() {
  const t = useTranslations("Account");
  const locale = useLocale();
  const [state, action, pending] = useActionState(setNewPassword, { status: "idle" } as SimpleState);
  const ref = useRef<HTMLFormElement>(null);
  useFocusFirstError(ref, state);
  const e = state.errors ?? {};
  const msg = e.password ? "password" : e.confirm ? "confirmMismatch" : e.tooMany ? "tooMany" : e.generic ? "generic" : null;

  return (
    <form ref={ref} action={action} noValidate className="flex flex-col gap-5">
      <input type="hidden" name="locale" value={locale} />
      {(["password", "confirm"] as const).map((name) => (
        <div key={name} className="flex flex-col gap-1.5">
          <label htmlFor={`np-${name}`} className="etiqueta">{t(name === "password" ? "newPassword" : "repeatPassword")}</label>
          <input
            id={`np-${name}`} name={name} type="password" autoComplete="new-password" required
            aria-invalid={Boolean(e[name])} aria-describedby={msg ? "np-error" : undefined}
            className="campo"
          />
        </div>
      ))}
      {msg && <p id="np-error" role="alert" className="error-texto">{t(`errors.${msg}`)}</p>}
      <button type="submit" disabled={pending} className="boton sm:self-start">
        {pending ? t("pending") : t("newPasswordSubmit")}
      </button>
    </form>
  );
}
