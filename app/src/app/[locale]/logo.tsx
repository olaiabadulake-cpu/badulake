// Logotipo sencillo: el símbolo (la «ë» en un círculo) y la palabra «badulakë» con la «a» subrayada.
// Es texto y dibujo, sin imágenes; el símbolo es el mismo del icono de la app (src/app/icon.svg).
export function Symbol({ className = "size-10" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 64 64" className={`${className} shrink-0`}>
      <circle cx="32" cy="32" r="32" fill="var(--color-noche)" />
      <g fill="var(--color-amarillo)">
        <circle cx="24.5" cy="19" r="3.6" />
        <circle cx="39.5" cy="19" r="3.6" />
      </g>
      <path
        d="M17 37.5H47A15 15 0 1 0 42.6 48.1"
        fill="none" stroke="var(--color-amarillo)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

export function Wordmark() {
  return (
    <span className="font-display font-extrabold tracking-tight">
      b<span className="underline decoration-[3px] underline-offset-[5px]">a</span>dulakë
    </span>
  );
}

export function Logo({ symbolClass }: { symbolClass?: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Symbol className={symbolClass} />
      <Wordmark />
    </span>
  );
}
