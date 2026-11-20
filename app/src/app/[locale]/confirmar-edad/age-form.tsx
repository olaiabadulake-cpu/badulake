"use client";

import { useActionState, useRef } from "react";
import { useFocusFirstError } from "../focus-first-error";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { confirmAge, signOut, type AgeState } from "../cuenta/actions";

const initial: AgeState = { status: "idle" };

export function AgeForm() {
  const t = useTranslations("Account");
  const privacy = useTranslations("Privacy");
  const locale = useLocale();
  const [state, action, pending] = useActionState(confirmAge, initial);
  const formRef = useRef<HTMLFormElement>(null);
  useFocusFirstError(formRef, state);

  if (state.status === "deleted") {
    return <p role="status" className="aviso text-lg">{t("ageDeleted")}</p>;
  }

  const err = state.errors ?? {};
  return (
    <>
      <form ref={formRef} action={action} noValidate className="flex flex-col gap-5">
        <input type="hidden" name="locale" value={locale} />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="birthdate" className="etiqueta">{t("birthdate")}</label>
          <input
            id="birthdate" name="birthdate" type="date" autoComplete="bday" required
            aria-invalid={Boolean(err.birthdate)}
            aria-describedby={err.birthdate ? "birthdate-hint birthdate-error" : "birthdate-hint"}
            className="campo"
          />
          <p id="birthdate-hint" className="ayuda">{t("birthdateHint")}</p>
          {err.birthdate && (
            <p id="birthdate-error" role="alert" className="error-texto">{t("errors.birthdate")}</p>
          )}
        </div>

        <p className="ayuda">
          {privacy.rich("signUpNotice", {
            link: (chunks) => <Link href="/privacidad" className="enlace">{chunks}</Link>,
          })}
        </p>
        {err.generic && <p role="alert" className="error-texto">{t("errors.generic")}</p>}
        {err.tooMany && <p role="alert" className="error-texto">{t("errors.tooMany")}</p>}

        <button type="submit" disabled={pending} className="boton sm:self-start">
          {pending ? t("pending") : t("ageSubmit")}
        </button>
      </form>

      <form action={signOut} className="flex flex-col gap-2">
        <input type="hidden" name="locale" value={locale} />
        <p className="ayuda">{t("ageLeaveHint")}</p>
        <button type="submit" className="boton-2 sm:self-start">{t("ageLeave")}</button>
      </form>
    </>
  );
}
