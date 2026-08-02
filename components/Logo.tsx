/**
 * The Luxe Axis mark (spec §3.6).
 *
 * The two monogram paths — the L and the A — lifted verbatim from the studio's
 * Illustrator master. Everything else in that file is deliberately left behind,
 * and each omission is a decision rather than a trim:
 *
 * - **The navy background rectangle.** The master is artwork on a `#002E5C`
 *   field; the site's surface token is `#0d2b4e`. Two navies three shades
 *   apart, so shipping the rect would draw a visibly mismatched patch behind
 *   the logo in the header. The page already provides the surface.
 * - **The `<text>` elements.** "LUXE AXIS PVT LTD" and "DESIGNING DREAMS" are
 *   live text in the master, set in `JavaneseText` — a font no visitor has, so
 *   a browser would silently substitute something else and the wordmark would
 *   render wrong on every machine but the designer's. Converting them to paths
 *   would fix the rendering and make the words unselectable, untranslatable and
 *   invisible to search. They stay as real HTML text in Header and Footer,
 *   which is where they were already.
 * - **The hard-coded gold.** The master paints `#AE8839`; the accent token is
 *   `#c9a84c`. `currentColor` lets the mark inherit whatever the surrounding
 *   text colour is, so it tracks the design system and stays correct in both
 *   themes rather than being a third gold on the page.
 *
 * The viewBox is cropped to the monogram's own bounds rather than kept at the
 * master's 842x595 page, which was mostly empty space around it.
 */
export function Logo({
  className,
  title,
}: {
  className?: string;
  /** Accessible name. Omit when the mark sits beside the wordmark as text, so
   *  a screen reader is not told the brand name twice. */
  title?: string;
}) {
  return (
    <svg
      // Measured from the paths' own bounding boxes in a browser (x 304–534.4,
      // y 146.1–343.8) plus two units of padding, not estimated from reading
      // the path data — an eyeballed crop was clipping the foot of the A.
      viewBox="302 144 235 202"
      fill="currentColor"
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {/* L */}
      <path d="M304,147.82v-1.75h68.21v1.75c0-1.14-11.15,1.27-11.81,1.51c-6.33,2.47-10.79,7.89-12.05,14.58c-1.45,7.59-0.48,16.15-0.54,23.86c-0.06,8.31-0.12,16.69-0.12,25c-0.06,15.48-0.12,31.03-0.18,46.51c0,5.48-0.24,11.03,0.3,16.45c0.42,4.28,1.02,9.76,4.88,12.41c2.17,1.51,4.76,2.17,7.35,2.59c14.34,2.35,28.26,5.96,41.51,11.99c6.93,3.13,13.62,6.75,20.18,10.6c7.53,4.4,14.94,9.04,22.47,13.44c5.18,3.01,10.42,5.84,15.85,8.25c10.3,4.52,19.7,7.11,27.35,8.68c-1.87,0.06-3.74,0.06-5.66,0c-25.61-0.72-47.3-11.03-63.87-22.59c-5.36-3.74-10.79-7.29-16.51-10.42c-4.64-2.59-9.4-4.88-14.22-7.11c-2.23-1.08-4.52-2.17-6.75-3.19c-1.93-0.9-4.4-1.81-6.39-0.54c-1.08,0.66-1.57,1.69-1.75,2.17c-1.87,4.88-3.68,9.82-5.48,14.7c-2.53,6.87-6.21,15.67,1.33,20.91c2.35,1.63,5.24,2.35,8.07,2.23c0,0.3,0,0.54,0,0.84c-10,0.12-20.06,0.24-30.07,0.36c-1.14,0-2.29,0-3.37,0.06v-1.75c0.78-0.12,1.51-0.24,2.17-0.42c8.74-2.41,13.2-11.69,14.76-15.67c3.01-7.23,6.09-14.46,9.1-21.75c0.54-1.33,0.42-2.83-0.42-3.92c-0.78-0.96-1.81-1.21-2.17-1.33c-5.42-1.14-11.21-1.27-16.75-1.33c-15.12-0.24-30.25-0.18-45.43-0.36v-1.33c0,0.84,8.13-0.42,8.62-0.54c8.44-2.41,14.22-10.66,13.98-19.46c0-17.96,0.3-35.97,0.48-53.99c0.06-8.98,0.18-18.02,0.24-26.99c0.06-8.56,1.08-17.65-0.18-26.15C325.45,154.87,315.81,146.44,304,147.82z" />
      {/* A */}
      <path d="M378.35,288.21l-3.01-1.33l58.69-136.47l73.03,169.49c0,0,5.24,21.75,27.35,20.43v0.42h-54.77c0,0,13.5-3.01,10.42-11.75c-3.01-8.68-13.5-33.44-13.5-33.44l-16.51-38.68l-12.17-27.35l-15.67-36.09l-6.93-16.51L378.35,288.21z" />
    </svg>
  );
}
