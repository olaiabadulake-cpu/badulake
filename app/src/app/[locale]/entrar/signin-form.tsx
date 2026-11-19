"use client";

import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { signIn, type SignInState } from "../cuenta/actions";

const initial: SignInState = { status: "idle" };

const input =
  "w-full rounded-lg border-2 border-noche/30 bg-white px-3 py-2.5 text-base focus:border-noche focus:outline-none aria-invalid:border-error";

export function SignInForm() {
  const t = useTranslations("Account");
  const locale = useLocale();
  const [state, action, pending] = useActionState(signIn, initial);
  const err = state.errors ?? {};
  const message = err.credentials ? "credentials" : err.unconfirmed ? "unconfirmed" : err.generic ? "generic" : null;

  return (
    <form action={action} noValidate className="flex flex-col gap-5">
      <input type="hidden" name="locale" value={locale} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="font-medium">{t("email")}</label>
        <input
          id="email" name="email" type="email" autoComplete="email" required
          aria-invalid={Boolean(message)} aria-describedby={message ? "signin-error" : undefined}
          className={input}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="font-medium">{t("password")}</label>
        <input
          id="password" name="password" type="password" autoComplete="current-password" required
          aria-invalid={Boolean(message)} aria-describedby={message ? "signin-error" : undefined}
          className={input}
        />
      </div>

      {message && (
        <p id="signin-error" role="alert" className="font-medium text-error">{t(`errors.${message}`)}</p>
      )}

      <button
        type="submit" disabled={pending}
        className="rounded-full bg-noche px-6 py-3 text-lg font-semibold text-white hover:bg-noche/90 disabled:opacity-60 sm:self-start"
      >
        {pending ? t("pending") : t("signInSubmit")}
      </button>

      <p>
        {t("noAccount")}{" "}
        <Link href="/registro" className="font-medium underline underline-offset-4">{t("signUpLink")}</Link>
      </p>
    </form>
  );
}
