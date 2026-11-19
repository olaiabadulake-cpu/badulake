import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function Privacy() {
  const t = await getTranslations("Privacy");

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-12 sm:px-8">
      <h1 className="font-display text-3xl font-bold">{t("title")}</h1>
      {/* PENDIENTE: texto definitivo de la Asesoría Jurídica (Fernando Canales y Nora Elorriaga). */}
      <p className="text-lg">{t("pending")}</p>
      <Link href="/" className="font-medium underline underline-offset-4">{t("back")}</Link>
    </div>
  );
}
