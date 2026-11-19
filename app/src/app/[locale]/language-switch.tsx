"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export function LanguageSwitch({ label }: { label: string }) {
  const pathname = usePathname();
  const other = useLocale() === "eu" ? "es" : "eu";

  return (
    <Link
      href={pathname}
      locale={other}
      lang={other}
      className="font-medium underline underline-offset-4 hover:no-underline"
    >
      {label}
    </Link>
  );
}
