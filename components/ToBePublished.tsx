import type { ReactNode } from 'react';

/**
 * The "to be published" marker.
 *
 * `components/Footer.tsx` established this convention for the CIN, GST and
 * studio address: where a fact has not been supplied, say so in the place the
 * fact will go, rather than inventing one or hiding the slot. This component
 * makes that phrasing identical everywhere and greppable — searching for
 * `ToBePublished` finds every outstanding content gap in the product.
 *
 * ## The line this holds
 *
 * A placeholder is only honest while it is unmistakably a placeholder. So this
 * renders the LABEL of the missing fact and the words "To be published" — never
 * a plausible-looking stand-in value. "Projects delivered: To be published"
 * tells a visitor exactly where they stand; "Projects delivered: 120" is a lie
 * that happens to be written in pencil.
 *
 * That distinction matters most for the things this is used for: statistics,
 * prices, testimonials and case studies are all *proof*, and Landing Blueprint
 * §3.5 turns on proof being documentary. Nothing here may ever be swapped for a
 * realistic number to make a page look finished.
 */
export function ToBePublished({
  label,
  children,
  className,
}: {
  /** What the missing fact is — rendered so the slot reads as a real, named
   *  gap rather than an unexplained blank. */
  label?: string;
  /** Optional replacement for the default wording, where a section needs a
   *  fuller sentence than two words. */
  children?: ReactNode;
  className?: string;
}) {
  return (
    <span className={className}>
      {label && <span className="text-on-surface-2">{label}: </span>}
      <span className="text-on-surface-muted">
        {children ?? 'To be published'}
      </span>
    </span>
  );
}
