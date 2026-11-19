import type { Metadata } from "next";
import { contentLang } from "@/i18n/content-lang";
import { getTranslations } from "next-intl/server";
import { WhatIs } from "../what-is";

// Pública también en producción: explica qué es un badulake sin necesidad de cuenta.
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("WhatIs");
  return { title: `${t("title")} · Badulake` };
}

export default async function WhatIsPage() {
  return (
    <div lang={await contentLang()} className="mx-auto flex max-w-2xl flex-col gap-6 px-4 pt-6 pb-12 sm:px-8">
      <WhatIs asPage />
    </div>
  );
}
