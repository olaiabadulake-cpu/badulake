import type { Metadata } from "next";
import { contentLang } from "@/i18n/content-lang";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

// Borrador provisional en lenguaje llano (Tarea 9, D-024). Explica lo que la app hace de verdad
// (docs/privacidad.md). PENDIENTE: el texto definitivo de la Asesoría Jurídica de EITB lo
// sustituirá antes de abrir (PRIVACY_NOTICE_READY y CUENTAS_ABIERTAS siguen apagados).
const SECTIONS = ["who", "what", "legal", "access", "where", "time", "rights", "cookies"] as const;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Privacy");
  return { title: `${t("title")} · Badulake` };
}

export default async function Privacy() {
  const t = await getTranslations("Privacy");

  return (
    <div lang={await contentLang()} className="mx-auto flex max-w-2xl flex-col gap-6 px-4 pt-6 pb-12 sm:px-8">
      <h1 className="font-display text-3xl font-bold">{t("title")}</h1>
      <div role="note" className="rounded-lg border-2 border-noche bg-amarillo p-4">
        <p className="font-semibold uppercase tracking-wide">{t("draftBadge")}</p>
        <p className="mt-1">{t("draftNote")}</p>
      </div>
      {SECTIONS.map((key) => (
        <section key={key} aria-labelledby={`privacidad-${key}`} className="flex flex-col gap-2">
          <h2 id={`privacidad-${key}`} className="font-display text-xl font-bold">
            {t(`sections.${key}.title`)}
          </h2>
          <Body text={t(`sections.${key}.body`)} />
        </section>
      ))}
      <Link href="/" className="font-medium underline underline-offset-4">{t("back")}</Link>
    </div>
  );
}

// Cada línea es un párrafo; las que empiezan por «- » forman una lista.
function Body({ text }: { text: string }) {
  const blocks: (string | string[])[] = [];
  for (const line of text.split("\n")) {
    if (line.startsWith("- ")) {
      const last = blocks.at(-1);
      if (Array.isArray(last)) last.push(line.slice(2));
      else blocks.push([line.slice(2)]);
    } else if (line.trim()) blocks.push(line);
  }
  return blocks.map((b, i) =>
    Array.isArray(b) ? (
      <ul key={i} className="flex list-disc flex-col gap-1 pl-6">
        {b.map((item) => <li key={item}>{item}</li>)}
      </ul>
    ) : (
      <p key={i}>{b}</p>
    ),
  );
}
