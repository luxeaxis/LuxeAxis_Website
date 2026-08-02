import type { Metadata } from 'next';
import { Container } from '@/components/layout';
import { LegalDocument } from '@/components/LegalDocument';
import { canonicalFor } from '@/lib/seo/hreflang';
import { loadLegalDocument } from '@/lib/legal/document';

const ROUTE = '/privacy';

export const metadata: Metadata = {
  title: 'Privacy Policy — Luxe Axis',
  description:
    'How Luxe Axis collects, uses, shares and protects your personal data, under the Digital Personal Data Protection Act, 2023.',
  alternates: canonicalFor(ROUTE),
};

/**
 * `/privacy` — the studio's DPDP Act privacy statement.
 *
 * For most of this build this page carried an explicit disclaimer that it was
 * NOT a privacy policy, because drafting one would have meant the studio making
 * binding representations nobody had approved about processes nobody had
 * decided. The studio has now supplied the real document, so both the
 * disclaimer and the interim summary of what the audit form collects come down.
 * Leaving that summary beside the policy would give a Data Principal two
 * accounts of the same processing to reconcile, and only one of them binds.
 *
 * Rendered from `docs/Pages/LuxeAxis_PrivacyPolicy.md` rather than transcribed
 * into JSX, so a revision from the studio's lawyer reaches the page as written.
 * See `lib/legal/document.ts`.
 */
export default function PrivacyPage() {
  const document = loadLegalDocument('LuxeAxis_PrivacyPolicy.md');

  return (
    <main id="main" tabIndex={-1}>
      <Container className="py-section-y">
        <LegalDocument document={document} />
      </Container>
    </main>
  );
}
