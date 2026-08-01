import type { Metadata } from 'next';
import { BookAuditForm } from '@/components/BookAuditForm';
import { Container, Grid, Stack } from '@/components/layout';
import { Icon } from '@/components/Icon';
import { canonicalFor } from '@/lib/seo/hreflang';
import { getTrustPoints } from '@/lib/content/source';

const ROUTE = '/book-audit';

export const metadata: Metadata = {
  title: 'Book a free design audit — Luxe Axis',
  description:
    'A free 45-minute audit with a real designer. Tell us about the space, and we will come back to agree a time. No obligation, no hard sell.',
  alternates: canonicalFor(ROUTE),
};

/**
 * `/book-audit` (Spec §2.2 "Dedicated conversion route (ad landing target)").
 *
 * This is the destination of every primary CTA on the site — the header, the
 * hero, the closing band on three pages — all of which 404'd until now.
 *
 * Landing Blueprint §3.8 governs the treatment: "CALM/NONE at the moment of
 * action. No motion, no ambient 3D near the form or button." So there is no
 * scene slot, no reveal and no hover theatre here. The form is the brightest
 * thing on the page and the only thing asking for attention.
 */
export default async function BookAuditPage() {
  const trustPoints = await getTrustPoints();

  return (
    <main id="main" tabIndex={-1}>
      <Container className="py-section-y">
        <Grid cols={2} gap={8} className="lg:grid-cols-[3fr_2fr]">
          <div>
            <Stack gap={6}>
              <Stack gap={4} className="max-w-measure">
                <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-tight tracking-[var(--font-tracking-tight)] text-on-surface">
                  Book a free design audit
                </h1>
                {/* Landing Blueprint §3.8, verbatim. */}
                <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2">
                  A free 45-minute audit with a real designer. No obligation, no hard sell.
                </p>
              </Stack>
              <BookAuditForm />
            </Stack>
          </div>

          {/* Reassurance beside the form rather than above it: at the moment of
              action the visitor is scanning for reasons not to continue, and
              these answer the common ones without pushing the form below the
              fold. */}
          <aside aria-labelledby="what-happens-heading">
            <div className="rounded-lg border border-border-subtle bg-surface-raised p-6">
              <Stack gap={5}>
                <h2
                  id="what-happens-heading"
                  className="font-display text-[length:var(--typography-h3-font-size)] text-on-surface"
                >
                  What happens next
                </h2>
                <ol className="flex flex-col gap-4">
                  {[
                    'A designer reads what you have sent and comes back to agree a time.',
                    'The audit itself is 45 minutes, in person or over video.',
                    'You get our read on the space and an indicative cost. Nothing is committed.',
                  ].map((item, index) => (
                    <li key={item} className="flex gap-3 text-small text-on-surface-2">
                      <span
                        aria-hidden="true"
                        className="flex h-icon-lg w-icon-lg shrink-0 items-center justify-center rounded-round border-hairline border-border-subtle font-mono text-overline text-accent"
                      >
                        {index + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
                <ul className="flex flex-col gap-2 border-t-hairline border-border-subtle pt-5">
                  {trustPoints.map((point) => (
                    <li key={point} className="flex items-center gap-2 text-small text-on-surface-2">
                      <Icon name="check" size="sm" decorative className="shrink-0 text-accent" />
                      {point}
                    </li>
                  ))}
                </ul>
                <p className="text-small text-on-surface-muted">
                  You will speak to a designer, not a bot.
                </p>
              </Stack>
            </div>
          </aside>
        </Grid>
      </Container>
    </main>
  );
}
