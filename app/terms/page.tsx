import type { Metadata } from 'next';
import { Container } from '@/components/layout';
import { LegalDocument } from '@/components/LegalDocument';
import { canonicalFor } from '@/lib/seo/hreflang';
import { loadLegalDocument } from '@/lib/legal/document';

const ROUTE = '/terms';

export const metadata: Metadata = {
  title: 'Terms of Service — Luxe Axis',
  description:
    'The terms governing the Luxe Axis website, Space OS, and our design, execution, subscription and marketplace services.',
  alternates: canonicalFor(ROUTE),
};

/**
 * `/terms` — the studio's terms of service.
 *
 * This page was previously close to empty on purpose: terms of use are a
 * contract, and plausible-looking ones would have been an enforceable-seeming
 * set of representations about liability, governing law and dispute resolution
 * that the studio had never agreed to. The `robots: { index: false }` that went
 * with that is gone too — it was there because an indexed near-empty legal page
 * is a quality signal against the whole domain, and the page is no longer near
 * empty.
 *
 * Rendered from `docs/Pages/LuxeAxis_TermsOfService.md`. See
 * `lib/legal/document.ts` for why the markdown stays the source of truth.
 */
export default function TermsPage() {
  const document = loadLegalDocument('LuxeAxis_TermsOfService.md');

  return (
    <main id="main" tabIndex={-1}>
      <Container className="py-section-y">
        <LegalDocument document={document} />
      </Container>
    </main>
  );
}
