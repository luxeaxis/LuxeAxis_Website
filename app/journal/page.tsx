import type { Metadata } from 'next';
import { Container, Stack } from '@/components/layout';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { CTASection } from '@/components/sections/CTASection';
import { canonicalFor } from '@/lib/seo/hreflang';

const ROUTE = '/journal';

export const metadata: Metadata = {
  title: 'Journal — Luxe Axis',
  description: 'Writing from the studio on designing, pricing and building interiors in Chennai.',
  alternates: canonicalFor(ROUTE),
};

/**
 * `/journal` (Spec §2.2).
 *
 * Empty, and shipped anyway, because the footer has linked it since the nav
 * existed and a 404 is a worse answer than an honest empty state.
 *
 * No `[slug]` route yet. A dynamic article route with no articles would
 * prerender nothing, add a URL shape the sitemap cannot describe, and commit
 * the project to a content model (portable text, per T-18) before anyone has
 * written a word. It lands with the first article, which is the point at which
 * its shape gets decided by real content rather than guessed at.
 *
 * Worth flagging rather than quietly shipping: Spec §10.3 names the Journal as
 * one of the site's two organic-search engines. Empty, it is a marketing gap,
 * not just a missing page.
 */
export default function JournalPage() {
  return (
    <main id="main" tabIndex={-1}>
      <Container className="py-section-y">
        <Stack gap={8}>
          <Stack gap={4} className="max-w-measure">
            <p className="font-ui text-overline uppercase tracking-[var(--font-tracking-wider)] text-accent">
              Journal
            </p>
            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-tight tracking-[var(--font-tracking-tight)] text-on-surface">
              Writing from the studio
            </h1>
            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2">
              On designing, pricing and actually building interiors in Chennai.
            </p>
          </Stack>

          <EmptyState
            icon="layers"
            title="Nothing published yet"
            body="The first pieces are being written. In the meantime, the pricing and process pages say most of what we would put here anyway."
            headingAs="h2"
            action={
              <Button as="a" href="/pricing" variant="secondary">
                See pricing
              </Button>
            }
          />
        </Stack>
      </Container>

      <CTASection />
    </main>
  );
}
