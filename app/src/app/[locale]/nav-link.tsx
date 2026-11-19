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
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className={`rounded underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-noche ${current ? "underline decoration-2" : ""}`}
    >
      {children}
    </Link>
  );
}
