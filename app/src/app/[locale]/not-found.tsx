import { getTranslations } from "next-intl/server";
import { contentLang } from "@/i18n/content-lang";
import { Link } from "@/i18n/navigation";
import { Symbol } from "./logo";

// Página que no existe (o que aún está cerrada): con la marca y un camino de vuelta.
export default async function NotFound() {
  const t = await getTranslations("NotFound");
  return (
    <div lang={await contentLang()} className="pagina items-start">
      <Symbol className="size-16" />
      <h1 className="titulo-1">{t("title")}</h1>
      <p className="text-lg">{t("text")}</p>
      <Link href="/" className="boton">{t("home")}</Link>
    </div>
  );
}
