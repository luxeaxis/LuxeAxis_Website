import type { Metadata } from 'next';
import { Container, Grid, Stack } from '@/components/layout';
import { Button } from '@/components/Button';
import { FeatureCard } from '@/components/Card';
import { JsonLd } from '@/components/JsonLd';
import { Section } from '@/components/sections/Section';
import { CTASection } from '@/components/sections/CTASection';
import { canonicalFor } from '@/lib/seo/hreflang';
import { serviceJsonLd } from '@/lib/seo/jsonLd';
import { COMMERCIAL_VERTICALS } from '@/lib/content/commercial';

const ROUTE = '/commercial';

export const metadata: Metadata = {
  title: 'Commercial interior design in Chennai — Luxe Axis',
  description:
    'Workplace, retail and hospitality, and healthcare interiors — designed against how the space performs, not just how it looks.',
  alternates: canonicalFor(ROUTE),
};

/**
 * `/commercial` (Spec §2.2).
 *
 * Two of the six personas arrive here — "Will this improve my workspace and be
 * data-backed?" and "Do they understand experience and compliance?" — and §10.8
 * gives them a different ask from the residential one: "Request a workspace
 * consult", not "Book a free design audit". A commercial buyer is not booking a
 * home visit, and using the residential CTA here would read as a studio that
 * does not know which business it is in.
 *
 * Deliberately short. The specs give the three verticals and the persona
 * questions and nothing else — no commercial case studies, no sector claims, no
 * pricing model. A longer page would be padding, and padding on a B2B page is
 * how a studio reads as unserious to exactly the audience it is courting.
 */
export default function CommercialPage() {
  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={serviceJsonLd({
          name: 'Commercial interior design',
          description:
            'Workplace, retail and hospitality, and healthcare interiors in Chennai, designed against how the space performs.',
          url: '/commercial',
        })}
      />

      <Container className="py-section-y">
        <Stack gap={4} className="max-w-measure">
          <p className="font-ui text-overline uppercase tracking-[var(--font-tracking-wider)] text-accent">
            Commercial
          </p>
          <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-tight tracking-[var(--font-tracking-tight)] text-on-surface">
            Spaces that have to perform, not just impress
          </h1>
          <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2">
            A workplace, a restaurant and a clinic fail in completely different ways. We design
            against how each one is actually used, and measure it with Space Score rather than
            arguing about taste.
          </p>
          <div>
            <Button as="a" href="/book-audit" size="lg">
              Request a consult
            </Button>
          </div>
        </Stack>
      </Container>

      <Section
        id="verticals"
        eyebrow="Where we work"
        title="Three verticals"
        lede="Each has its own constraints — utilisation and acoustics, footfall and experience, compliance and infection control."
      >
        <Grid cols={3} gap={5}>
          {COMMERCIAL_VERTICALS.map((vertical) => (
            <FeatureCard
              key={vertical.slug}
              href={`/commercial/${vertical.slug}`}
              icon={vertical.icon}
              title={vertical.name}
              body={vertical.summary}
            />
          ))}
        </Grid>
      </Section>

      <CTASection />
    </main>
  );
}
