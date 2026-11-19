import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Enlaces que respetan el idioma: usar estos en vez de los de next/link.
export const { Link, usePathname, useRouter, redirect, getPathname } =
  createNavigation(routing);
