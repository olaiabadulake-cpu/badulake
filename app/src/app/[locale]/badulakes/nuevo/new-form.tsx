"use client";

import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { createBadulake, type NewBadulakeState } from "../actions";

const initial: NewBadulakeState = { status: "idle" };

const input =
  "w-full rounded-lg border-2 border-noche/30 bg-white px-3 py-2.5 text-base focus:border-noche focus:outline-none aria-invalid:border-error";

type Field = "title" | "description" | "date" | "zone" | "address" | "seats";

export function NewBadulakeForm() {
  const t = useTranslations("Badulake");
  const locale = useLocale();
  const [state, action, pending] = useActionState(createBadulake, initial);
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
      <p id={`${k}-error`} className="text-sm font-medium text-error">{t(`errors.${k}`)}</p>
    ) : (
      <p id={`${k}-hint`} className="text-sm text-noche/70">{t(`hints.${k}`)}</p>
    );

  return (
    <form action={action} noValidate className="flex flex-col gap-5">
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

      <button
        type="submit" disabled={pending}
        className="rounded-full bg-noche px-6 py-3 text-lg font-semibold text-white hover:bg-noche/90 disabled:opacity-60 sm:self-start"
      >
        {pending ? t("pending") : t("save")}
      </button>
    </form>
  );
}
