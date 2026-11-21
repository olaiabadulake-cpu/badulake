import { Roboto, Unbounded } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

// 404 de una dirección que no existe en ninguna lengua (por ejemplo, /algo-raro).
// No sabe la lengua de la persona, así que va en castellano y euskera.
const roboto = Roboto({ variable: "--font-roboto", subsets: ["latin"] });
const unbounded = Unbounded({ variable: "--font-unbounded", subsets: ["latin"] });

export const metadata: Metadata = { title: "Badulake · 404" };

export default function GlobalNotFound() {
  return (
    <html lang="es" className={`${roboto.variable} ${unbounded.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <main className="pagina items-start">
          <h1 className="titulo-1">
            <span lang="es">Esta página no existe</span>
            <br />
            <span lang="eu">Orrialde hau ez dago</span>
          </h1>
          <p className="text-lg">
            <span lang="es">Puede que el enlace esté mal escrito.</span>{" "}
            <span lang="eu">Agian esteka gaizki dago idatzita.</span>
          </p>
          {/* Sin idioma ni rutas de Next.js a las que enlazar: enlace normal a la portada. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/" className="boton">
            <span lang="es">Volver a la portada</span>&nbsp;·&nbsp;<span lang="eu">Itzuli azalera</span>
          </a>
        </main>
      </body>
    </html>
  );
}
