// Todas las lenguas de Badulake. Cada una se nombra en su propia lengua,
// para que cada persona reconozca la suya. Para añadir una lengua:
// añadirla aquí y crear messages/<código>.json.
export const languages = {
  eu: "Euskara",
  es: "Castellano",
  ast: "Asturianu",
  bg: "Български",
  bs: "Bosanski",
  br: "Brezhoneg",
  ca: "Català",
  cnr: "Crnogorski",
  co: "Corsu",
  cs: "Čeština",
  cy: "Cymraeg",
  da: "Dansk",
  de: "Deutsch",
  el: "Ελληνικά",
  en: "English",
  fi: "Suomi",
  fr: "Français",
  fy: "Frysk",
  ga: "Gaeilge",
  gd: "Gàidhlig",
  gl: "Galego",
  gsw: "Elsässerditsch",
  hr: "Hrvatski",
  hu: "Magyar",
  it: "Italiano",
  lld: "Ladin",
  mk: "Македонски",
  nb: "Norsk bokmål",
  nl: "Nederlands",
  nn: "Norsk nynorsk",
  oc: "Occitan",
  "oc-aranes": "Aranés",
  pl: "Polski",
  pt: "Português",
  ro: "Română",
  rue: "Руски язик",
  se: "Davvisámegiella",
  sk: "Slovenčina",
  sl: "Slovenščina",
  sq: "Shqip",
  sr: "Српски",
  sv: "Svenska",
  uk: "Українська",
  "ca-valencia": "Valencià",
} as const;

export type Locale = keyof typeof languages;

// Euskera y castellano primero; el resto, por orden alfabético de su nombre.
const rest = (Object.keys(languages) as Locale[])
  .filter((code) => code !== "eu" && code !== "es")
  .sort((a, b) => languages[a].localeCompare(languages[b], "es"));

export const locales: Locale[] = ["eu", "es", ...rest];
