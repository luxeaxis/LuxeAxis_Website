import type { Metadata } from 'next';
import { Container, Grid, Stack } from '@/components/layout';
import { Button } from '@/components/Button';
import { ToBePublished } from '@/components/ToBePublished';
import { Section } from '@/components/sections/Section';
import { canonicalFor } from '@/lib/seo/hreflang';

const ROUTE = '/contact';

export const metadata: Metadata = {
  title: 'Contact — Luxe Axis',
  description: 'Reach the studio, or book a free design audit with a designer.',
  alternates: canonicalFor(ROUTE),
};

/**
 * `/contact` (Spec §2.2).
 *
 * The awkward page, and worth being straight about why: the studio has not
 * supplied a phone number, a WhatsApp number, an email address or a street
 * address. `components/Footer.tsx` has carried the same gap since the nav
 * shipped.
 *
 * So this page leads with the one route that genuinely works — the audit form —
 * and names each missing channel rather than inventing one. A fabricated phone
 * number on a contact page is not a placeholder; it is a number that belongs to
 * somebody, and a visitor will ring it.
 *
 * The audit form is also, right now, the ONLY working contact route on the
 * site, and it needs `LEAD_WEBHOOK_URL` set before it delivers anything. That
 * makes this page's honesty load-bearing rather than decorative: until those
 * details land, a visitor genuinely cannot reach the studio through the
 * website, and pretending otherwise would be the single most costly lie here.
 */
const CHANNELS = [
  'Phone',
  'WhatsApp',
  'Email',
  'Studio address',
  'Opening hours',
] as const;

export default function ContactPage() {
  return (
    <main id="main" tabIndex={-1}>
      <Container className="py-section-y">
        <Stack gap={4} className="max-w-measure">
          <p className="font-ui text-overline uppercase tracking-[var(--font-tracking-wider)] text-accent">
            Contact
          </p>
          <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-tight tracking-[var(--font-tracking-tight)] text-on-surface">
            Talk to a designer
          </h1>
          <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2">
            The quickest way to reach us is to tell us about the space. A designer reads it and
            comes back to agree a time — no obligation, no hard sell.
          </p>
          <div>
            <Button as="a" href="/book-audit" size="lg">
              Book a free design audit
            </Button>
          </div>
        </Stack>
      </Container>

      <Section
        id="channels"
        eyebrow="Other ways to reach us"
        title="Direct contact details"
        lede="Being published shortly. Until then the audit form above is the reliable route."
      >
        <Grid cols={2} gap={5}>
          {CHANNELS.map((channel) => (
            <p key={channel} className="text-small">
              <ToBePublished label={channel} />
            </p>
          ))}
        </Grid>
      </Section>
    </main>
  );
}
