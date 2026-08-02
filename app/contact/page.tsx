import type { Metadata } from 'next';
import { Container, Grid, Stack } from '@/components/layout';
import { Button } from '@/components/Button';
import { Link } from '@/components/Link';
import { STUDIO, formatWindow, mailtoHref, telHref, whatsappHref } from '@/lib/content/studio';
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
 * For most of this build the studio had supplied no phone number, no WhatsApp,
 * no email and no address, and this page could only name each gap. All four
 * have now landed, so it does the ordinary thing and lists them. Only opening
 * hours are still outstanding.
 *
 * That matters more than a page filling in: until these arrived, the audit form
 * was the ONLY route to the studio anywhere on the site, and it still refuses
 * every submission until `LEAD_WEBHOOK_URL` is configured — so for a stretch
 * there was genuinely no way to make contact at all. There are now four that
 * work without any deployment configuration.
 *
 * The original reasoning stands for whatever is added next: a fabricated phone
 * number on a contact page is not a placeholder, it is a number that belongs to
 * somebody, and a visitor will ring it.
 */

/** Still outstanding — the only channel nobody has supplied. */
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
        lede="If you would rather just call or write, all of these reach a person."
      >
        <Grid cols={2} gap={6}>
          <Stack gap={5}>
            {STUDIO.telephone && (
              <Stack gap={1}>
                <h3 className="font-ui text-overline uppercase tracking-[var(--font-tracking-wider)] text-on-surface-muted">
                  Phone
                </h3>
                {/* A real `tel:` link. Most of this audience is on a phone, and
                    a number they have to select and copy is a number that does
                    not get dialled. */}
                <p>
                  <Link href={telHref(STUDIO.telephone)} variant="inline">
                    {STUDIO.telephone.display}
                  </Link>
                </p>
              </Stack>
            )}

            {STUDIO.whatsapp && (
              <Stack gap={1}>
                <h3 className="font-ui text-overline uppercase tracking-[var(--font-tracking-wider)] text-on-surface-muted">
                  WhatsApp
                </h3>
                <p>
                  <Link href={whatsappHref(STUDIO.whatsapp)} variant="inline">
                    Message {STUDIO.whatsapp.display}
                  </Link>
                </p>
              </Stack>
            )}
          </Stack>

          <Stack gap={5}>
            {STUDIO.email && (
              <Stack gap={1}>
                <h3 className="font-ui text-overline uppercase tracking-[var(--font-tracking-wider)] text-on-surface-muted">
                  Email
                </h3>
                {/* Two addresses, labelled by what they are for. An existing
                    client's problem sent to a sales inbox is how it waits three
                    days. */}
                <p className="text-small text-on-surface-2">
                  New enquiries —{' '}
                  <Link href={mailtoHref(STUDIO.email.general)} variant="inline" className="text-small">
                    {STUDIO.email.general}
                  </Link>
                </p>
                <p className="text-small text-on-surface-2">
                  Existing projects —{' '}
                  <Link href={mailtoHref(STUDIO.email.support)} variant="inline" className="text-small">
                    {STUDIO.email.support}
                  </Link>
                </p>
              </Stack>
            )}

            {STUDIO.responseWindow && (
              <Stack gap={1}>
                <h3 className="font-ui text-overline uppercase tracking-[var(--font-tracking-wider)] text-on-surface-muted">
                  When we reply
                </h3>
                {/* A response window, not opening hours. The studio has no
                    public counter, so "we are open 9 to 6" would answer a
                    question nobody asked and invite a visit that cannot
                    happen. What someone actually wants before they send a
                    message at 9pm is whether anyone will read it. */}
                <p className="text-on-surface-2">
                  {formatWindow(STUDIO.responseWindow)}
                </p>
                <p className="text-small text-on-surface-muted">
                  Outside that, we pick up the next morning.
                </p>
              </Stack>
            )}

            {STUDIO.address && (
              <Stack gap={1}>
                <h3 className="font-ui text-overline uppercase tracking-[var(--font-tracking-wider)] text-on-surface-muted">
                  Studio
                </h3>
                <address className="not-italic text-on-surface-2">
                  {STUDIO.address.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
                {/* Stated plainly rather than left to be discovered on the
                    pavement. It is a serviced floor with a reception that does
                    not know you are coming. */}
                <p className="text-small text-on-surface-muted">
                  Visits by appointment — please arrange one before coming.
                </p>
              </Stack>
            )}

          </Stack>
        </Grid>
      </Section>
    </main>
  );
}
