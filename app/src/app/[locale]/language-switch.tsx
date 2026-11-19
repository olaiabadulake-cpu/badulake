"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { languages, locales, type Locale } from "@/i18n/languages";

// Menú con todas las lenguas, cada una escrita en su propia lengua.
export function LanguageSwitch({ label }: { label: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const current = useLocale() as Locale;
  const [pending, startTransition] = useTransition();

  return (
    <label className="flex items-center gap-2 text-sm font-semibold">
      {/* El globo se entiende en cualquier lengua; el texto queda para lectores de pantalla. */}
      <svg aria-hidden viewBox="0 0 24 24" className="size-6 text-noche" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
      </svg>
      <span className="sr-only">{label}</span>
      <select
        value={current}
        disabled={pending}
        onChange={(event) => {
          const locale = event.target.value as Locale;
          startTransition(() => router.replace(pathname, { locale }));
        }}
        className="rounded-full border-2 border-noche bg-white py-1.5 pr-8 pl-3 font-semibold text-noche focus:outline-2 focus:outline-offset-2 focus:outline-noche"
      >
        {locales.map((locale) => (
          <option key={locale} value={locale} lang={locale}>
            {languages[locale]}
          </option>
        ))}
      </select>
    </label>
  );
}
