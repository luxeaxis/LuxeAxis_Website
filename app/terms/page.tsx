import type { Metadata } from 'next';
import { Container, Stack } from '@/components/layout';
import { InlineAlert } from '@/components/InlineAlert';
import { Link } from '@/components/Link';
import { canonicalFor } from '@/lib/seo/hreflang';

const ROUTE = '/terms';

export const metadata: Metadata = {
  title: 'Terms — Luxe Axis',
  description: 'The Luxe Axis terms of use are being prepared.',
  // Nothing here is worth a search result yet, and an indexed near-empty legal
  // page is a quality signal against the whole domain.
  robots: { index: false, follow: true },
  alternates: canonicalFor(ROUTE),
};

/**
 * `/terms` (Spec §2.2). Deliberately close to empty.
 *
 * Terms of use are a contract. Unlike a placeholder statistic — which is
 * plainly a gap — plausible-looking terms would be an enforceable-seeming set
 * of representations the studio has never agreed to, covering liability,
 * governing law and dispute resolution. Generating them from a template would
 * be the most consequential invention available anywhere on this site, and it
 * is the one piece of content here that has to come from a lawyer rather than
 * from a spec.
 *
 * So the page exists only to stop the footer link 404ing, says what it is
 * waiting for, and points at the pages that DO carry real commitments.
 */
export default function TermsPage() {
  return (
    <main id="main" tabIndex={-1}>
      <Container className="py-section-y">
        <Stack gap={5} className="max-w-measure">
          <p className="font-ui text-overline uppercase tracking-[var(--font-tracking-wider)] text-accent">
            Terms
          </p>
          <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-tight tracking-[var(--font-tracking-tight)] text-on-surface">
            Terms of use
          </h1>
          <InlineAlert tone="info" title="Being prepared">
            Our terms of use have not been published yet. Nothing on this site is offered as a
            contract in the meantime.
          </InlineAlert>
          <p className="text-on-surface-2">
            The commitments we do make are published and specific: our{' '}
            <Link href="/pricing" variant="inline">
              pricing and guarantees
            </Link>
            , how a project actually{' '}
            <Link href="/process" variant="inline">
              runs
            </Link>
            , and what this website collects about you in our{' '}
            <Link href="/privacy" variant="inline">
              privacy notes
            </Link>
            .
          </p>
        </Stack>
      </Container>
    </main>
  );
}
