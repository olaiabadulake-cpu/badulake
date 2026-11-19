"use client";

import { useActionState, useRef } from "react";
import { useFocusFirstError } from "../focus-first-error";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { signIn, type SignInState } from "../cuenta/actions";

const initial: SignInState = { status: "idle" };

const input =
  "campo";

export function SignInForm() {
  const t = useTranslations("Account");
  const locale = useLocale();
  const [state, action, pending] = useActionState(signIn, initial);
  const formRef = useRef<HTMLFormElement>(null);
  useFocusFirstError(formRef, state);
  const err = state.errors ?? {};
  const message = err.credentials ? "credentials" : err.unconfirmed ? "unconfirmed" : err.tooMany ? "tooMany" : err.generic ? "generic" : null;

  return (
    <form ref={formRef} action={action} noValidate className="flex flex-col gap-5">
      <input type="hidden" name="locale" value={locale} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="etiqueta">{t("email")}</label>
        <input
          id="email" name="email" type="email" autoComplete="email" required
          aria-invalid={Boolean(message)} aria-describedby={message ? "signin-error" : undefined}
          className={input}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="etiqueta">{t("password")}</label>
        <input
          id="password" name="password" type="password" autoComplete="current-password" required
          aria-invalid={Boolean(message)} aria-describedby={message ? "signin-error" : undefined}
          className={input}
        />
      </div>

      {message && (
        <p id="signin-error" role="alert" className="error-texto">{t(`errors.${message}`)}</p>
      )}

      <button
        type="submit" disabled={pending}
        className="boton sm:self-start"
      >
        {pending ? t("pending") : t("signInSubmit")}
      </button>

      <p>
        {t("noAccount")}{" "}
        <Link href="/registro" className="enlace">{t("signUpLink")}</Link>
      </p>
    </form>
  );
}
