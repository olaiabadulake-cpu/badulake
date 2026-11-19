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
    <div lang={await contentLang()} className="pagina">
      <WhatIs asPage />
    </div>
  );
}
