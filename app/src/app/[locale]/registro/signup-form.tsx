"use client";

import { useActionState, useRef } from "react";
import { useFocusFirstError } from "../focus-first-error";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { signUp, type SignUpState } from "../cuenta/actions";

const initial: SignUpState = { status: "idle" };

const input =
  "campo";

export function SignUpForm() {
  const t = useTranslations("Account");
  const privacy = useTranslations("Privacy");
  const locale = useLocale();
  const [state, action, pending] = useActionState(signUp, initial);
  const formRef = useRef<HTMLFormElement>(null);
  useFocusFirstError(formRef, state);

  if (state.status === "check-email") {
    return (
      <p role="status" className="aviso bg-papel text-lg">
        {t("checkEmail")}
      </p>
    );
  }

  const err = state.errors ?? {};
  const birthError = err.birthdate ? "birthdate" : err.underage ? "underage" : null;

  return (
    <form ref={formRef} action={action} noValidate className="flex flex-col gap-5">
      <input type="hidden" name="locale" value={locale} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="etiqueta">{t("email")}</label>
        <input
          id="email" name="email" type="email" autoComplete="email" required
          aria-invalid={err.email} aria-describedby={err.email ? "email-error" : undefined}
          className={input}
        />
        {err.email && <p id="email-error" role="alert" className="error-texto">{t("errors.email")}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="etiqueta">{t("password")}</label>
        <input
          id="password" name="password" type="password" autoComplete="new-password" required minLength={8}
          aria-invalid={err.password}
          aria-describedby={err.password ? "password-hint password-error" : "password-hint"}
          className={input}
        />
        <p id="password-hint" className="ayuda">{t("passwordHint")}</p>
        {err.password && <p id="password-error" role="alert" className="error-texto">{t("errors.password")}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="birthdate" className="etiqueta">{t("birthdate")}</label>
        <input
          id="birthdate" name="birthdate" type="date" autoComplete="bday" required
          aria-invalid={Boolean(birthError)}
          aria-describedby={birthError ? "birthdate-hint birthdate-error" : "birthdate-hint"}
          className={input}
        />
        <p id="birthdate-hint" className="ayuda">{t("birthdateHint")}</p>
        {birthError && (
          <p id="birthdate-error" role="alert" className="error-texto">{t(`errors.${birthError}`)}</p>
        )}
      </div>

      <p className="ayuda">
        {privacy.rich("signUpNotice", {
          link: (chunks) => (
            <Link href="/privacidad" className="enlace">{chunks}</Link>
          ),
        })}
      </p>
      {err.generic && <p role="alert" className="error-texto">{t("errors.generic")}</p>}
      {err.tooMany && <p role="alert" className="error-texto">{t("errors.tooMany")}</p>}

      <button
        type="submit" disabled={pending}
        className="boton sm:self-start"
      >
        {pending ? t("pending") : t("signUpSubmit")}
      </button>

      <p>
        {t("haveAccount")}{" "}
        <Link href="/entrar" className="enlace">{t("signInLink")}</Link>
      </p>
    </form>
  );
}
