"use client";

import { Link, usePathname } from "@/i18n/navigation";

// Enlace del menú: marca la página en la que estás (subrayado y aria-current para lectores de pantalla).
export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  // «Badulakes» sigue marcado dentro de un badulake (pero no en «Crear un badulake», que tiene el suyo).
  const current =
    pathname === href ||
    (href === "/badulakes" && pathname.startsWith("/badulakes/") && pathname !== "/badulakes/nuevo");
  return (
    <Link href={href} aria-current={current ? "page" : undefined} className={`${linkClass} ${current ? "underline decoration-lima decoration-[3px]" : ""}`}>
      {children}
    </Link>
  );
}

// El mismo enlace sin marcar la página actual. Se enseña un instante mientras se prepara la página
// en las que dependen de la dirección (p. ej. cada badulake), que no se pueden preparar de antemano.
export function PlainNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className={linkClass}>{children}</Link>;
}

const linkClass =
  "rounded py-1 underline-offset-4 hover:underline hover:decoration-lima hover:decoration-2";
