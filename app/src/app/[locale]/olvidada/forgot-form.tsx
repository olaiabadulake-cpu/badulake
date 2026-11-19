"use client";

import { useActionState, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useFocusFirstError } from "../focus-first-error";
import { requestReset, type SimpleState } from "../cuenta/actions";

export function ForgotForm() {
  const t = useTranslations("Account");
  const locale = useLocale();
  const [state, action, pending] = useActionState(requestReset, { status: "idle" } as SimpleState);
  const ref = useRef<HTMLFormElement>(null);
  useFocusFirstError(ref, state);
  const e = state.errors ?? {};
  const msg = e.email ? "email" : e.tooMany ? "tooMany" : e.generic ? "generic" : null;

  if (state.status === "done") return <p role="status" className="aviso">{t("forgotSent")}</p>;
  return (
    <form ref={ref} action={action} noValidate className="flex flex-col gap-5">
      <input type="hidden" name="locale" value={locale} />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="forgot-email" className="etiqueta">{t("email")}</label>
        <input
          id="forgot-email" name="email" type="email" autoComplete="email" required
          aria-invalid={Boolean(msg)} aria-describedby={msg ? "forgot-error" : undefined}
          className="campo"
        />
      </div>
      {msg && <p id="forgot-error" role="alert" className="error-texto">{t(`errors.${msg}`)}</p>}
      <button type="submit" disabled={pending} className="boton sm:self-start">
        {pending ? t("pending") : t("forgotSubmit")}
      </button>
    </form>
  );
}
