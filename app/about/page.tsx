import type { Metadata } from 'next';
import { Container, Grid, Stack } from '@/components/layout';
import { Button } from '@/components/Button';
import { ToBePublished } from '@/components/ToBePublished';
import { Section } from '@/components/sections/Section';
import { CTASection } from '@/components/sections/CTASection';
import { canonicalFor } from '@/lib/seo/hreflang';

const ROUTE = '/about';

export const metadata: Metadata = {
  title: 'About — Luxe Axis',
  description:
    'A Chennai interior design studio built around published prices, applied intelligence, and designers who decide.',
  alternates: canonicalFor(ROUTE),
};

/**
 * `/about` (Spec §2.2).
 *
 * The thinnest page on the site by a distance, and honestly so.
 *
 * An About page is made of company facts — who founded the studio, when, how
 * many people, which awards, which credentials — and not one of them has been
 * supplied. Everything the specs contain about the studio is a *position*: what
 * it believes about pricing, about AI, about proof. So that is what this page
 * carries, and the biography is named as outstanding rather than written.
 *
 * That split matters more here than elsewhere: on an About page, an invented
 * founding year or team size is a fabricated company record — the kind of
 * detail a journalist, a client's lawyer or a procurement form would rely on.
 * The principles below are drawn from Spec §1 and §10.6 and assert nothing
 * about the studio's history.
 */
const PRINCIPLES = [
  {
    title: 'We publish the price',
    body: 'Most Chennai studios quote privately. We put tiers and a calculator on the website, because a price you have to ask for is a price that moves depending on who is asking.',
  },
  {
    title: 'The software narrows, a designer decides',
    body: 'Vastu-Tech, Space Score and Virtual Staging do real work on a project. None of them signs anything off. A person reviews every result before it reaches you.',
  },
  {
    title: 'We show the work',
    body: 'Real project photography with client consent, real numbers, testimonials tied to named projects. Where we do not have the proof yet, we say so instead of borrowing someone else’s.',
  },
] as const;

export default function AboutPage() {
  return (
    <main id="main" tabIndex={-1}>
      <Container className="py-section-y">
        <Stack gap={4} className="max-w-measure">
          <p className="font-ui text-overline uppercase tracking-[var(--font-tracking-wider)] text-accent">
            About
          </p>
          <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-tight tracking-[var(--font-tracking-tight)] text-on-surface">
            A studio that argues for its choices
          </h1>
          <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2">
            Luxe Axis designs interiors in Chennai. What follows is what we believe about doing it
            well — the parts of the studio you can hold us to.
          </p>
        </Stack>
      </Container>

      <Section id="principles" eyebrow="What we hold to" title="Three positions">
        <Grid cols={3} gap={5}>
          {PRINCIPLES.map((principle) => (
            <div
              key={principle.title}
              className="rounded-lg border border-border-subtle bg-surface-raised p-6"
            >
              <Stack gap={3}>
                <h3 className="font-display text-[length:var(--typography-h3-font-size)] text-on-surface">
                  {principle.title}
                </h3>
                <p className="text-small text-on-surface-2">{principle.body}</p>
              </Stack>
            </div>
          ))}
        </Grid>
      </Section>

      <Section
        id="studio"
        eyebrow="The studio"
        title="Who we are"
        lede="The part of an About page that has to be true rather than well written."
      >
        {/* Every one of these is a company record. Inventing a founding year or
            a team size is not a placeholder — it is a fabricated fact that a
            journalist, a procurement form or a client's lawyer could rely on. */}
        <Stack gap={3} className="max-w-measure">
          {[
            'Founded',
            'The team',
            'Studio address',
            'Registration details (CIN, GST)',
            'Credentials and memberships',
          ].map((fact) => (
            <p key={fact} className="text-small">
              <ToBePublished label={fact} />
            </p>
          ))}
          <div className="pt-2">
            <Button as="a" href="/book-audit" variant="secondary">
              Talk to a designer
            </Button>
          </div>
        </Stack>
      </Section>

      <CTASection />
    </main>
  );
}
