import { getTranslations } from "next-intl/server";
import { contentLang } from "@/i18n/content-lang";
import { Link } from "@/i18n/navigation";

// Textos legales: BORRADORES para la Asesoría Jurídica de EITB (Tarea 12, docs/legal/).
// El cuerpo de cada texto solo existe en castellano, así que en las demás lenguas se enseña en
// castellano y se marca con lang="es" (D-025). Título y avisos siguen la lengua de la persona.
export async function LegalPage({ ns }: { ns: "Privacy" | "Legal.aviso" | "Legal.condiciones" | "Legal.cookies" }) {
  const t = await getTranslations(ns);
  const legal = await getTranslations("Legal");
  const sections = Object.keys(t.raw("sections") as Record<string, unknown>);
  const lang = await contentLang();
  const id = ns.replace(".", "-").toLowerCase();

  return (
    <div lang={lang} className="mx-auto flex max-w-2xl flex-col gap-6 px-4 pt-6 pb-12 sm:px-8">
      <h1 className="font-display text-3xl font-bold">{t("title")}</h1>
      <div role="note" className="rounded-lg border-2 border-noche bg-amarillo p-4">
        <p className="font-semibold uppercase tracking-wide">{legal("draftBadge")}</p>
        <p className="mt-1">{legal("draftNote")}</p>
        {legal.has("pendingTranslation") && <p className="mt-2">{legal("pendingTranslation")}</p>}
      </div>
      <div lang="es" className="flex flex-col gap-6">
        {sections.map((key) => (
          <section key={key} aria-labelledby={`${id}-${key}`} className="flex flex-col gap-2">
            <h2 id={`${id}-${key}`} className="font-display text-xl font-bold">
              {t(`sections.${key}.title`)}
            </h2>
            <Body text={t(`sections.${key}.body`)} />
          </section>
        ))}
      </div>
      <Link href="/" className="font-medium underline underline-offset-4">{legal("back")}</Link>
    </div>
  );
}

// Cada línea es un párrafo; las que empiezan por «- » forman una lista; **negrita** se respeta.
function Inline({ text }: { text: string }) {
  return text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
    part.startsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : part,
  );
}

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
        {b.map((item) => <li key={item}><Inline text={item} /></li>)}
      </ul>
    ) : (
      <p key={i}><Inline text={b} /></p>
    ),
  );
}
