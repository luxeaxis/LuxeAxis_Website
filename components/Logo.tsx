import { MARK_PATHS, MARK_VIEWBOX } from '@/lib/brand/mark';

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
 *
 * The path data itself moved to `lib/brand/mark.ts` when the hero scene needed
 * to extrude the same geometry (§5.1). Two copies of a path string is how the
 * mark and the scene drift apart, which §3.6 forbids, so there is now one.
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
      viewBox={`${MARK_VIEWBOX.x} ${MARK_VIEWBOX.y} ${MARK_VIEWBOX.width} ${MARK_VIEWBOX.height}`}
      fill="currentColor"
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {/* `pathLength={100}` normalises each path to 100 units, so BrandLoader's
          draw-on can dash them without knowing their real lengths. */}
      {MARK_PATHS.map((path) => (
        <path key={path.id} pathLength={100} d={path.d} />
      ))}
    </svg>
  );
}
