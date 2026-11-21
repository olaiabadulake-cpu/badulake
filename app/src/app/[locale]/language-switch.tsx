"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { languages, locales, type Locale } from "@/i18n/languages";

export type LanguageLabels = { label: string; search: string; none: string; suggest: string; dismiss: string };

// Selector de lengua (Tarea 11.1, D-049): un panel con buscador. Cada lengua sale escrita en su
// propia lengua y se puede buscar también por su nombre en la lengua de la página («alemán» →
// Deutsch). Son enlaces normales a la misma página en otra lengua.
export function LanguageSwitch({ labels }: { labels: LanguageLabels }) {
  const pathname = usePathname();
  const current = useLocale() as Locale;
  return (
    <>
      <LanguagePanel labels={labels} current={current} pathname={pathname} />
      <LanguageSuggest labels={labels} current={current} pathname={pathname} />
    </>
  );
}

// Mientras se prepara la página: el mismo botón, sin abrir.
export function LanguageSwitchFallback({ labels }: { labels: LanguageLabels }) {
  const current = useLocale() as Locale;
  return <Pill current={current} label={labels.label} />;
}

function Globe() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-6 shrink-0 text-noche" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
    </svg>
  );
}

function Pill({ current, label }: { current: Locale; label: string }) {
  return (
    <span className="flex items-center gap-2 text-sm font-semibold">
      <Globe />
      <span className="sr-only">{label}: </span>
      <span lang={current} className="rounded-full border-2 border-noche bg-papel px-3 py-1.5 text-noche">
        {languages[current]}
      </span>
    </span>
  );
}

const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function LanguagePanel({ labels, current, pathname }: { labels: LanguageLabels; current: Locale; pathname: string }) {
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDetailsElement>(null);
  // Nombre de cada lengua en la lengua de la página (si el navegador lo sabe), para buscar.
  const names = useMemo(() => {
    let dn: Intl.DisplayNames | null = null;
    try {
      dn = new Intl.DisplayNames([current.startsWith("ca") ? "ca" : current === "oc-aranes" ? "oc" : current], { type: "language" });
    } catch {
      dn = null;
    }
    return Object.fromEntries(
      locales.map((l) => {
        let local = "";
        try {
          local = dn?.of(l.split("-")[0]) ?? "";
        } catch {
          local = "";
        }
        return [l, fold(`${languages[l]} ${local} ${l}`)];
      }),
    ) as Record<Locale, string>;
  }, [current]);
  const q = fold(query.trim());
  const shown = q ? locales.filter((l) => names[l].includes(q)) : locales;

  // Se cierra con Escape o tocando fuera.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && el.open) {
        el.open = false;
        el.querySelector("summary")?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (el.open && !el.contains(e.target as Node)) el.open = false;
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <details ref={ref} className="relative max-w-full">
      <summary className="cursor-pointer list-none rounded-full [&::-webkit-details-marker]:hidden">
        <Pill current={current} label={labels.label} />
      </summary>
      <div className="absolute right-0 z-20 mt-2 flex w-72 max-w-[calc(100vw-2rem)] flex-col gap-2 rounded-2xl border-2 border-noche bg-papel p-3 shadow-lg">
        <label htmlFor="idioma-buscar" className="etiqueta">{labels.search}</label>
        <input
          id="idioma-buscar" type="search" value={query} onChange={(e) => setQuery(e.target.value)}
          className="campo" autoComplete="off" aria-controls="idioma-lista"
        />
        <ul id="idioma-lista" className="flex max-h-72 flex-col overflow-y-auto">
          {shown.map((l) => (
            <li key={l}>
              <Link
                href={pathname} locale={l} lang={l} hrefLang={l}
                aria-current={l === current ? "true" : undefined}
                className={`block rounded-lg px-3 py-2 text-base hover:bg-amarillo ${l === current ? "font-bold" : ""}`}
              >
                {languages[l]}
              </Link>
            </li>
          ))}
        </ul>
        {shown.length === 0 && <p role="status" className="ayuda">{labels.none}</p>}
      </div>
    </details>
  );
}

// La lengua del móvil, entre las 44 (Tarea 11.1): «eu-ES» → eu, «ca-ES-valencia» → ca-valencia…
function deviceLocale(): Locale | null {
  for (const tag of navigator.languages ?? [navigator.language]) {
    const t = tag.toLowerCase();
    if (t.startsWith("ca") && t.includes("valencia")) return "ca-valencia";
    if (t.startsWith("oc") && t.includes("aranes")) return "oc-aranes";
    if (t.startsWith("cnr")) return "cnr";
    if (t.startsWith("no")) return "nb";
    const base = t.split("-")[0];
    if ((locales as readonly string[]).includes(base)) return base as Locale;
  }
  return null;
}

// Si el móvil está en otra de nuestras lenguas, se ofrece una vez, con un botón en esa lengua.
// Lo que elija la persona se recuerda en este navegador (no se manda a ningún sitio).
function LanguageSuggest({ labels, current, pathname }: { labels: LanguageLabels; current: Locale; pathname: string }) {
  const [offer, setOffer] = useState<Locale | null>(null);
  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem("badulake-lengua-vista") === "1";
    } catch {
      seen = false;
    }
    const best = deviceLocale();
    // Se calcula tras montar (depende del navegador): un solo cambio de estado, sin bucles.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!seen && best && best !== current) setOffer(best);
  }, [current]);
  const done = () => {
    try {
      localStorage.setItem("badulake-lengua-vista", "1");
    } catch {
      // Sin almacenamiento: se volverá a ofrecer, sin más.
    }
    setOffer(null);
  };
  if (!offer) return null;
  return (
    <div role="region" aria-label={labels.suggest} className="flex w-full flex-wrap items-center gap-2 rounded-2xl border-2 border-noche bg-papel px-3 py-2 text-sm">
      <span>{labels.suggest}</span>
      <Link href={pathname} locale={offer} lang={offer} hrefLang={offer} onClick={done} className="boton-2 !min-h-0 !py-1 !text-base">
        {languages[offer]}
      </Link>
      <button type="button" onClick={done} className="enlace">{labels.dismiss}</button>
    </div>
  );
}
