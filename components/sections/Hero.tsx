import { Button } from '../Button';
import { Container, Stack } from '../layout';
import { SceneSlot } from '../SceneSlot';
import { BOOK_AUDIT } from '@/lib/nav';

/**
 * The hero (Landing Blueprint §1, §3.1) — the three-second hook.
 *
 * Every word here is the blueprint's own approved copy (H1b, the sub, the trust
 * strip), not developer writing. The claims in the trust strip are the studio's
 * own, taken verbatim from the spec, the same provenance rule `lib/nav.ts`
 * applies to labels.
 *
 * The blueprint's governing constraint is that the MESSAGE beats the machine:
 * headline, sub and both CTAs are server-rendered DOM, painted before any
 * WebGL, and the LCP element must be the H1 rather than an assembling scene.
 * That is why the poster lives behind via `SceneSlot` (which upgrades to a live
 * scene later with no layout change) instead of the hero being built around a
 * canvas — and why `layout="content"` is used, so the copy defines the height
 * rather than being squeezed into a 16/9 box.
 *
 * Two CTAs, one bright: primary "Book Audit" plus a quieter secondary to
 * pricing, per §2's commitment ladder — a price-anxious researcher who is not
 * ready to talk to anyone still has a low-commitment "yes" available, and the
 * blueprint is explicit that there is never a second competing primary in one
 * viewport.
 */
export function Hero({
  headline,
  sub,
  trustPoints,
}: {
  headline: string;
  sub: string;
  trustPoints: readonly string[];
}) {
  return (
    <SceneSlot id="hero" layout="content">
      <Container>
        <div className="py-section-y">
          <Stack gap={6} className="max-w-measure">
            <Stack gap={4}>
              <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-tight tracking-[var(--font-tracking-tight)] text-on-surface">
                {headline}
              </h1>
              <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2">
                {sub}
              </p>
            </Stack>

            {/* `flex-wrap` rather than a Cluster: these are the page's two most
                important controls, and on a narrow phone they must stack to
                full width instead of shrinking side by side. */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button as="a" href={BOOK_AUDIT.href} size="lg">
                {BOOK_AUDIT.label}
              </Button>
              <Button as="a" href="/pricing" variant="secondary" size="lg" iconTrailing="arrow-right">
                See your price
              </Button>
            </div>

            {/* A list, not a decorated sentence: each point is a discrete claim,
                and a screen reader announcing "list, 4 items" conveys that
                shape where interpuncts would just read as punctuation. */}
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-small text-on-surface-2">
              {trustPoints.map((point) => (
                <li key={point} className="flex items-center gap-2">
                  <span aria-hidden="true" className="h-1 w-1 rounded-round bg-accent" />
                  {point}
                </li>
              ))}
            </ul>
          </Stack>
        </div>
      </Container>
    </SceneSlot>
  );
}
