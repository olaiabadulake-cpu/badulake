"use client";

import { useActionState, useRef } from "react";
import { useFocusFirstError } from "./focus-first-error";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { languages, locales, type Locale } from "@/i18n/languages";
import { joinWaitlist, type WaitlistState } from "./actions";

const initial: WaitlistState = { status: "idle" };

const input =
  "w-full rounded-lg border-2 border-noche/60 bg-white px-3 py-2.5 text-base focus:border-noche aria-invalid:border-error";

export function WaitlistForm({ defaultLanguage }: { defaultLanguage: Locale }) {
  const t = useTranslations("Waitlist");
  const [state, action, pending] = useActionState(joinWaitlist, initial);
  const formRef = useRef<HTMLFormElement>(null);
  useFocusFirstError(formRef, state);

  if (state.status === "success") {
    return (
      <p role="status" className="rounded-lg bg-white p-4 text-lg font-medium">
        {t("success")}
      </p>
    );
  }

  const err = state.errors ?? {};

  return (
    <form ref={formRef} action={action} noValidate className="flex flex-col gap-5">
      <h2 className="font-display text-xl font-bold">{t("title")}</h2>

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
        <label htmlFor="zone" className="font-medium">{t("zone")}</label>
        <input
          id="zone" name="zone" type="text" maxLength={80} required placeholder={t("zonePlaceholder")}
          aria-invalid={err.zone} aria-describedby={err.zone ? "zone-error" : undefined}
          className={input}
        />
        {err.zone && <p id="zone-error" role="alert" className="text-sm font-medium text-error">{t("errors.zone")}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="language" className="font-medium">{t("language")}</label>
        <select id="language" name="language" defaultValue={defaultLanguage} className={input}>
          {locales.map((locale) => (
            <option key={locale} value={locale} lang={locale}>{languages[locale]}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="flex items-start gap-3">
          <input
            type="checkbox" name="consent" required
            aria-invalid={err.consent} aria-describedby={err.consent ? "consent-error" : undefined}
            className="mt-1 size-5 shrink-0 accent-noche"
          />
          <span>
            {t.rich("consent", {
              link: (chunks) => (
                <Link href="/privacidad" className="underline underline-offset-2">{chunks}</Link>
              ),
            })}
          </span>
        </label>
        {err.consent && <p id="consent-error" role="alert" className="text-sm font-medium text-error">{t("errors.consent")}</p>}
      </div>

      {err.generic && <p role="alert" className="font-medium text-error">{t("errors.generic")}</p>}
      {err.tooMany && <p role="alert" className="font-medium text-error">{t("errors.tooMany")}</p>}

      <button
        type="submit" disabled={pending}
        className="rounded-full bg-noche px-6 py-3 text-lg font-semibold text-white hover:bg-noche/90 disabled:opacity-60 sm:self-start"
      >
        {pending ? t("pending") : t("submit")}
      </button>
    </form>
  );
}
