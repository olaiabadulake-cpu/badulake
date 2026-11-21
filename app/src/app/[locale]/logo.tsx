// Logotipo (careta de LIN3S, D-052): la palabra en mayúsculas anchas dentro de una pastilla rosa, un poco girada.
// El tamaño lo da la letra del contenedor. El símbolo «ë» es el icono de la app (src/app/icon.svg).
export function Symbol({ className = "size-10" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 64 64" className={`${className} shrink-0`}>
      <circle cx="32" cy="32" r="32" fill="var(--color-noche)" />
      <g fill="var(--color-lima)">
        <circle cx="24.5" cy="19" r="3.6" />
        <circle cx="39.5" cy="19" r="3.6" />
      </g>
      <path
        d="M17 37.5H47A15 15 0 1 0 42.6 48.1"
        fill="none" stroke="var(--color-rosa)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

export function Wordmark() {
  return <span className="logo-pastilla">Badulake</span>;
}

export function Logo() {
  return <Wordmark />;
}

// Borde blanco de «pegatina» y dibujos sencillos (propios, en la misma paleta; no son las ilustraciones originales de la careta).
// Se pinta una sola vez en el diseño general; cada pegatina lo usa con <Pegatina />.
export function PegatinaDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
      <defs>
        <filter id="pegatina" x="-20%" y="-20%" width="140%" height="140%">
          <feMorphology in="SourceAlpha" operator="dilate" radius="4" result="d" />
          <feFlood floodColor="#fff" />
          <feComposite in2="d" operator="in" result="w" />
          <feMerge><feMergeNode in="w" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <symbol id="p-tote" viewBox="0 0 100 120"><path d="M30 40V26a20 20 0 0 1 40 0v14" fill="none" stroke="#ff3fa4" strokeWidth="7" strokeLinecap="round" /><path d="M12 40h76l-6 74H18z" fill="#3b6bff" /><path d="M16 90l68-26v14L16 104z" fill="#c8ff2e" /></symbol>
        <symbol id="p-shirt" viewBox="0 0 120 110"><path d="M40 8l-30 20 14 22 12-8v56h48V42l12 8 14-22L80 8c-6 10-34 10-40 0z" fill="#3b6bff" /><path d="M56 34c12-6 22 4 14 14-4 6-12 4-14 12-8-10-8-20 0-26z" fill="#ff8a2b" /><path d="M40 8c6 10 34 10 40 0l-8 16-12 10-12-10z" fill="#fff6dc" /></symbol>
        <symbol id="p-mug" viewBox="0 0 110 100"><path d="M82 30h8a14 14 0 0 1 0 38h-12" fill="none" stroke="#ff8a2b" strokeWidth="9" strokeLinecap="round" /><path d="M10 20h72l-6 60a12 12 0 0 1-12 10H28A12 12 0 0 1 16 80z" fill="#fff6dc" /><circle cx="46" cy="48" r="13" fill="#ffc83d" /><path d="M20 66c10-12 20 0 30-12" stroke="#0f6e73" strokeWidth="7" fill="none" strokeLinecap="round" /></symbol>
        <symbol id="p-shoe" viewBox="0 0 120 90"><path d="M8 20c20 8 30 24 44 24 14 0 22-14 32-14 18 0 30 14 30 40H48c-8 0-14-8-18-16-8 2-16 4-22 2z" fill="#0f6e73" /><path d="M54 76l22-30c14 4 26 14 26 30z" fill="#7a4a1d" /><path d="M62 68c10-12 18-10 22-2-8 4-14 6-22 2z" fill="#ffc83d" /></symbol>
        <symbol id="p-star" viewBox="0 0 100 100"><path d="M50 6l13 30 33 3-25 22 8 32-29-17-29 17 8-32L4 39l33-3z" fill="#ff3fa4" /></symbol>
        <symbol id="p-hat" viewBox="0 0 130 90"><ellipse cx="65" cy="58" rx="62" ry="22" fill="#3b6bff" /><path d="M28 54c0-34 18-46 37-46s37 12 37 46z" fill="#3b6bff" /><path d="M28 50h74v10H28z" fill="#ff3fa4" /><rect x="58" y="46" width="14" height="18" rx="3" fill="#c8ff2e" /></symbol>
      </defs>
    </svg>
  );
}

const sizes = {
  tote: [100, 120], shirt: [120, 110], mug: [110, 100], shoe: [120, 90], star: [100, 100], hat: [130, 90],
} as const;

// Decoración: nunca lleva texto ni se puede pulsar.
export function Pegatina({
  name, className = "", style,
}: { name: keyof typeof sizes; className?: string; style?: React.CSSProperties }) {
  const [w, h] = sizes[name];
  return (
    <svg aria-hidden focusable="false" viewBox={`0 0 ${w} ${h}`} className={`pegatina ${className}`} style={style}>
      <use href={`#p-${name}`} />
    </svg>
  );
}
