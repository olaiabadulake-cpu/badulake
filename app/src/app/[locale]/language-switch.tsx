"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

// Cada idioma se nombra en su propia lengua, para que se reconozca siempre.
const names = { eu: "Euskara", es: "Castellano" } as const;
const short = { eu: "EU", es: "ES" } as const;

export function LanguageSwitch({ label }: { label: string }) {
  const pathname = usePathname();
  const current = useLocale();

  return (
    <nav aria-label={label}>
      <ul className="flex rounded-full border-2 border-noche bg-white p-0.5 text-sm font-semibold">
        {routing.locales.map((locale) => {
          const active = locale === current;
          return (
            <li key={locale}>
              <Link
                href={pathname}
                locale={locale}
                lang={locale}
                hrefLang={locale}
                aria-current={active ? "true" : undefined}
                aria-label={names[locale]}
                title={names[locale]}
                className={`block min-w-11 rounded-full px-3 py-1.5 text-center transition-colors ${
                  active ? "bg-noche text-white" : "text-noche hover:bg-amarillo"
                }`}
              >
                {short[locale]}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
