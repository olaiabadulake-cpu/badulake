import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LegalPage } from "../legal-page";

// BORRADOR para la Asesoría Jurídica de EITB (Tarea 12, docs/legal/).
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Legal.condiciones");
  return { title: `${t("title")} · Badulake` };
}

export default function Page() {
  return <LegalPage ns="Legal.condiciones" />;
}
