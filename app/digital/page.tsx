import type { Metadata } from 'next';
import { Container, Stack } from '@/components/layout';
import { Button } from '@/components/Button';
import { ToBePublished } from '@/components/ToBePublished';
import { Section } from '@/components/sections/Section';
import { CTASection } from '@/components/sections/CTASection';
import { canonicalFor } from '@/lib/seo/hreflang';

const ROUTE = '/digital';

export const metadata: Metadata = {
  title: 'Remote design — Luxe Axis',
  description:
    'Design-only engagements, run remotely: drawings, materials and a Vastu-Tech check, without the studio managing the build.',
  alternates: canonicalFor(ROUTE),
};

/**
 * `/digital` (Spec §2.2: "Remote design (Starter / Pro / Premium)").
 *
 * A different product from the residential tiers — design without delivery, for
 * someone who already has a contractor. The sitemap names three levels and
 * nothing else: no scope per level, no price, no deliverable list. So the page
 * states what the product IS, which the route name does tell us, and names the
 * three levels as outstanding rather than inventing three tiers of scope.
 *
 * §10.8 gives this path its own CTA — "Get an AI moodboard" — which is not
 * wired to anything, because no such flow exists. The ask here is the one that
 * does work: a CTA that goes nowhere is worse than a plainer CTA that goes
 * somewhere.
 */
export default function DigitalPage() {
  return (
    <main id="main" tabIndex={-1}>
      <Container className="py-section-y">
        <Stack gap={4} className="max-w-measure">
          <p className="font-ui text-overline uppercase tracking-[var(--font-tracking-wider)] text-accent">
            Remote design
          </p>
          <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-tight tracking-[var(--font-tracking-tight)] text-on-surface">
            Design, without us running the build
          </h1>
          <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2">
            For people who already have a contractor they trust and want the design done properly:
            layouts, drawings, a material palette and a Vastu-Tech check, delivered remotely.
          </p>
          <div>
            <Button as="a" href="/book-audit" size="lg">
              Talk to a designer
            </Button>
          </div>
        </Stack>
      </Container>

      <Section
        id="levels"
        eyebrow="How it is packaged"
        title="Starter, Pro and Premium"
        lede="Three levels of remote engagement."
      >
        <Stack gap={3} className="max-w-measure">
          {['Starter', 'Pro', 'Premium'].map((level) => (
            <p key={level} className="text-small">
              <ToBePublished label={`${level} — what is included and what it costs`} />
            </p>
          ))}
        </Stack>
      </Section>

      <CTASection />
    </main>
  );
}
