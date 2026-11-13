interface LogoProps {
  className?: string;
}

/** The A mark, two legs of one triangle; the same shape as `app/icon.svg`, coloured by `currentColor`. */
export function Logo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false" className={className}>
      <path d="M16 2 2.5 29H10l6-12.5Z" fill="currentColor" />
      <path d="M16 2 29.5 29H22l-6-12.5Z" fill="currentColor" opacity="0.6" />
    </svg>
  );
}
