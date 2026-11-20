import { getLocale, getTranslations } from "next-intl/server";

// Botón «Continuar con Google» (Tarea 4.1, D-039), en /entrar y /registro.
// Es un enlace normal (funciona sin JavaScript) a /api/cuenta/google, que manda a Google.
// La «G» de colores es el logotipo que Google pide usar en estos botones.
export async function GoogleButton() {
  const t = await getTranslations("Account");
  const locale = await getLocale();
  return (
    <div className="flex flex-col gap-5">
      <a href={`/api/cuenta/google?locale=${locale}`} className="boton-2 gap-3 sm:self-start">
        <svg aria-hidden="true" focusable="false" width="22" height="22" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
        </svg>
        {t("google")}
      </a>
      <p className="flex items-center gap-3 text-sm font-medium" aria-hidden="true">
        <span className="h-px flex-1 bg-current opacity-30" />
        {t("or")}
        <span className="h-px flex-1 bg-current opacity-30" />
      </p>
    </div>
  );
}
