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
    <LanguageSelect
      label={label}
      current={current}
      disabled={pending}
      onChange={(locale) => startTransition(() => router.replace(pathname, { locale }))}
    />
  );
}

// El mismo menú, quieto, mientras se prepara la página (en las que dependen de la dirección).
export function LanguageSwitchFallback({ label }: { label: string }) {
  const current = useLocale() as Locale;
  return <LanguageSelect label={label} current={current} disabled />;
}

function LanguageSelect({
  label,
  current,
  disabled,
  onChange,
}: {
  label: string;
  current: Locale;
  disabled: boolean;
  onChange?: (locale: Locale) => void;
}) {
  return (
    <div className="flex max-w-full items-center gap-2 text-sm font-semibold">
      {/* El globo se entiende en cualquier lengua; el texto queda para lectores de pantalla. */}
      <svg aria-hidden viewBox="0 0 24 24" className="size-6 shrink-0 text-noche" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
      </svg>
      <label htmlFor="idioma" lang={current} className="sr-only">{label}</label>
      <select
        id="idioma"
        value={current}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.value as Locale)}
        className="min-w-0 max-w-full rounded-full border-2 border-noche bg-white py-1.5 pr-8 pl-3 font-semibold text-noche"
      >
        {locales.map((locale) => (
          <option key={locale} value={locale} lang={locale}>
            {languages[locale]}
          </option>
        ))}
      </select>
    </div>
  );
}
