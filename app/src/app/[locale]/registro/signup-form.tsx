"use client";

import { useActionState, useRef } from "react";
import { useFocusFirstError } from "../focus-first-error";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { signUp, type SignUpState } from "../cuenta/actions";

const initial: SignUpState = { status: "idle" };

const input =
  "w-full rounded-lg border-2 border-noche/60 bg-white px-3 py-2.5 text-base focus:border-noche aria-invalid:border-error";

export function SignUpForm() {
  const t = useTranslations("Account");
  const privacy = useTranslations("Privacy");
  const locale = useLocale();
  const [state, action, pending] = useActionState(signUp, initial);
  const formRef = useRef<HTMLFormElement>(null);
  useFocusFirstError(formRef, state);

  if (state.status === "check-email") {
    return (
      <p role="status" className="rounded-lg bg-white p-4 text-lg font-medium">
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
        <label htmlFor="email" className="font-medium">{t("email")}</label>
        <input
          id="email" name="email" type="email" autoComplete="email" required
          aria-invalid={err.email} aria-describedby={err.email ? "email-error" : undefined}
          className={input}
        />
        {err.email && <p id="email-error" role="alert" className="text-sm font-medium text-error">{t("errors.email")}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="font-medium">{t("password")}</label>
        <input
          id="password" name="password" type="password" autoComplete="new-password" required minLength={8}
          aria-invalid={err.password}
          aria-describedby={err.password ? "password-hint password-error" : "password-hint"}
          className={input}
        />
        <p id="password-hint" className="text-sm text-noche/70">{t("passwordHint")}</p>
        {err.password && <p id="password-error" role="alert" className="text-sm font-medium text-error">{t("errors.password")}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="birthdate" className="font-medium">{t("birthdate")}</label>
        <input
          id="birthdate" name="birthdate" type="date" autoComplete="bday" required
          aria-invalid={Boolean(birthError)}
          aria-describedby={birthError ? "birthdate-hint birthdate-error" : "birthdate-hint"}
          className={input}
        />
        <p id="birthdate-hint" className="text-sm text-noche/70">{t("birthdateHint")}</p>
        {birthError && (
          <p id="birthdate-error" role="alert" className="text-sm font-medium text-error">{t(`errors.${birthError}`)}</p>
        )}
      </div>

      <p className="text-sm text-noche/70">
        {privacy.rich("signUpNotice", {
          link: (chunks) => (
            <Link href="/privacidad" className="underline underline-offset-2">{chunks}</Link>
          ),
        })}
      </p>
      {err.generic && <p role="alert" className="font-medium text-error">{t("errors.generic")}</p>}
      {err.tooMany && <p role="alert" className="font-medium text-error">{t("errors.tooMany")}</p>}

      <button
        type="submit" disabled={pending}
        className="rounded-full bg-noche px-6 py-3 text-lg font-semibold text-white hover:bg-noche/90 disabled:opacity-60 sm:self-start"
      >
        {pending ? t("pending") : t("signUpSubmit")}
      </button>

      <p>
        {t("haveAccount")}{" "}
        <Link href="/entrar" className="font-medium underline underline-offset-4">{t("signInLink")}</Link>
      </p>
    </form>
  );
}
