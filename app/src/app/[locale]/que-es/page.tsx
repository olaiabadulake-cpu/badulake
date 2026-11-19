import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { WhatIs } from "../what-is";

// Pública también en producción: explica qué es un badulake sin necesidad de cuenta.
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("WhatIs");
  return { title: `${t("title")} · Badulake` };
}

export default function WhatIsPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 pt-6 pb-12 sm:px-8">
      <WhatIs asPage />
    </div>
  );
}
