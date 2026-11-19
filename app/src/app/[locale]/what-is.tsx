import { getTranslations } from "next-intl/server";
import { contentLang } from "@/i18n/content-lang";

// «Qué es un badulake»: en la portada (como sección) y en /que-es (como página).
export async function WhatIs({ asPage = false }: { asPage?: boolean }) {
  const t = await getTranslations("WhatIs");
  const Title = asPage ? "h1" : "h2";
  const Sub = asPage ? "h2" : "h3";
  const steps = ["step1", "step2", "step3", "step4"] as const;
  const facts = ["free", "noMoney", "people", "adults"] as const;

  return (
    <section lang={await contentLang()} aria-labelledby="que-es" className="flex flex-col gap-5">
      <Title id="que-es" className="titulo-1">{t("title")}</Title>
      <p className="text-lg">{t("intro")}</p>

      <Sub className="titulo-3">{t("factsTitle")}</Sub>
      <ul className="flex flex-wrap gap-2">
        {facts.map((k) => (
          <li key={k} className="etiqueta-pildora !px-4 !py-1.5 !text-base">{t(k)}</li>
        ))}
      </ul>

      <Sub className="titulo-3">{t("howTitle")}</Sub>
      <ol className="flex flex-col gap-3 text-lg">
        {steps.map((k, i) => (
          <li key={k} className="flex gap-3">
            <span aria-hidden className="flex size-8 shrink-0 items-center justify-center rounded-full bg-noche font-bold text-white">
              {i + 1}
            </span>
            <span className="pt-0.5">{t(k)}</span>
          </li>
        ))}
      </ol>
      <p className="text-lg">{t("organize")}</p>
    </section>
  );
}
