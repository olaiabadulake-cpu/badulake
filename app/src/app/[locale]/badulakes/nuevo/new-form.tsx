"use client";

import { useActionState, useRef } from "react";
import { useFocusFirstError } from "../../focus-first-error";
import { useLocale, useTranslations } from "next-intl";
import { createBadulake, type NewBadulakeState } from "../actions";

const initial: NewBadulakeState = { status: "idle" };

const input =
  "w-full rounded-lg border-2 border-noche/60 bg-white px-3 py-2.5 text-base focus:border-noche aria-invalid:border-error";

type Field = "title" | "description" | "date" | "zone" | "address" | "seats";

export function NewBadulakeForm() {
  const t = useTranslations("Badulake");
  const locale = useLocale();
  const [state, action, pending] = useActionState(createBadulake, initial);
  const formRef = useRef<HTMLFormElement>(null);
  useFocusFirstError(formRef, state);
  const err = state.errors ?? {};
  const v = (k: Field) => state.values?.[k] ?? "";

  const props = (k: Field) => ({
    id: k,
    name: k,
    defaultValue: v(k),
    required: true,
    "aria-invalid": err[k],
    "aria-describedby": err[k] ? `${k}-error` : `${k}-hint`,
    className: input,
  });
  const note = (k: Field) =>
    err[k] ? (
      <p id={`${k}-error`} role="alert" className="text-sm font-medium text-error">{t(`errors.${k}`)}</p>
    ) : (
      <p id={`${k}-hint`} className="text-sm text-noche/70">{t(`hints.${k}`)}</p>
    );

  return (
    <form ref={formRef} action={action} noValidate className="flex flex-col gap-5">
      <input type="hidden" name="locale" value={locale} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className="font-medium">{t("title")}</label>
        <input {...props("title")} type="text" maxLength={80} />
        {note("title")}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="font-medium">{t("description")}</label>
        <textarea {...props("description")} rows={4} maxLength={500} />
        {note("description")}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="date" className="font-medium">{t("date")}</label>
        <input {...props("date")} type="datetime-local" />
        {note("date")}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="zone" className="font-medium">{t("zone")}</label>
        <input {...props("zone")} type="text" maxLength={80} />
        {note("zone")}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="address" className="font-medium">{t("address")}</label>
        <input {...props("address")} type="text" maxLength={200} autoComplete="off" />
        {note("address")}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="seats" className="font-medium">{t("seats")}</label>
        <input {...props("seats")} type="number" min={5} max={10} step={1} defaultValue={v("seats") || "10"} />
        {note("seats")}
      </div>

      {err.generic && (
        <p role="alert" className="font-medium text-error">{t("errors.generic")}</p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit" name="intent" value="publish" disabled={pending}
          className="rounded-full bg-noche px-6 py-3 text-lg font-semibold text-white hover:bg-noche/90 disabled:opacity-60"
        >
          {t("publish")}
        </button>
        <button
          type="submit" name="intent" value="draft" disabled={pending}
          className="rounded-full border-2 border-noche px-6 py-2.5 text-lg font-semibold hover:bg-noche/5 disabled:opacity-60"
        >
          {t("save")}
        </button>
      </div>
      {pending && <p role="status">{t("pending")}</p>}
    </form>
  );
}
