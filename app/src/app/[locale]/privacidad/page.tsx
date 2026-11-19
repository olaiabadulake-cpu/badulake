import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LegalPage } from "../legal-page";

// BORRADOR de la Política de privacidad (Tarea 12, docs/legal/politica-privacidad.md), a partir de
// docs/privacidad.md (Tarea 9, D-024). PENDIENTE: el texto definitivo de la Asesoría Jurídica de EITB
// lo sustituirá antes de abrir (PRIVACY_NOTICE_READY y CUENTAS_ABIERTAS siguen apagados).
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Privacy");
  return { title: `${t("title")} · Badulake` };
}

export default function Privacy() {
  return <LegalPage ns="Privacy" />;
}
