import { Breadcrumbs } from '@/components/Breadcrumbs';
import type { Metadata } from 'next';
import { Container, Grid, Stack } from '@/components/layout';
import { Button } from '@/components/Button';
import { JsonLd } from '@/components/JsonLd';
import { Section } from '@/components/sections/Section';
import { CTASection } from '@/components/sections/CTASection';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';
import { Faq } from '@/components/Faq';
import { canonicalFor } from '@/lib/seo/hreflang';
import { getFaqs } from '@/lib/content/source';

const ROUTE = '/digital/starter';

export const metadata: Metadata = {
  title: 'Starter Digital Design Package (₹25,000/room) | Luxe Axis Digital',
  description:
    'Essential remote interior design package: 2D CAD floorplan layout, curated color moodboard, Vastu compass check, and itemized shop-it-yourself procurement list.',
  alternates: canonicalFor(ROUTE),
};

export default async function StarterDigitalPage() {
  const faqs = await getFaqs();
  const digitalFaqs = [...faqs].filter((f) => f.id === 'abroad' || f.id === 'materials');

  const inclusions = [
    '2D CAD floorplan spatial optimization',
    'Curated color, lighting & material moodboard',
    'Vastu-Tech basic solar compass check',
    'Shop-it-yourself procurement list with direct vendor links',
    '1 Scheduled video consultation call with senior designer',
    'Digital delivery within 7 business days',
  ];

  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Starter Digital Design Package (₹25,000/room)',
          description: 'Essential remote interior design package for homeowners.',
          url: ROUTE,
        }}
      />

      {/* 1. Hero Stage & Breadcrumbs */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-surface-deep border-b border-border-subtle/40">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-accent/30 via-transparent to-transparent pointer-events-none" />

        <Container>
          <Breadcrumbs path="/digital/starter" labels={{ 'starter': "Starter Package" }} />

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 w-fit">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                Remote Package • ₹25,000 / room
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.1] tracking-[var(--font-tracking-tight)] text-on-surface font-bold">
              Starter Digital <br />
              <span className="text-accent">Design Package</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2 font-medium leading-relaxed max-w-3xl">
              Essential remote design guidance for homeowners who already have a trusted local contractor and need expert CAD spatial planning, color palettes, Vastu alignment, and direct shopping links.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button as="a" href="/book-audit" size="lg">
                Book Starter Audit
              </Button>
              <Button as="a" href="/digital/pro" variant="secondary" size="lg">
                View Pro Package (₹45k) →
              </Button>
            </div>

            {/* Key Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-border-subtle/50">
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">₹25,000</strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">Per Room Rate</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">7 Days</strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">Turnaround SLA</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">2D CAD</strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">Layout Optimization</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">1 Call</strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">Video Review</span>
              </div>
            </div>
          </Stack>
        </Container>
      </section>

      {/* 2. Inclusions */}
      <Section
        id="inclusions"
        eyebrow="Package Deliverables"
        title="What Is Included in Starter Digital"
        lede="Comprehensive deliverables shipped digitally within 7 business days."
      >
        <div className="lx-liquid-glass rounded-2xl p-8 border border-accent/30 max-w-4xl mx-auto">
          <ul className="flex flex-col gap-4 text-body text-on-surface-2">
            {inclusions.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="text-accent font-bold text-h4">✓</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 3. Before & After Slider */}
      <Section
        id="transformation"
        eyebrow="Remote Execution"
        title="Starter Package Makeover Result"
        lede="Chennai apartment living room designed under Starter Digital."
      >
        <div className="max-w-4xl mx-auto">
          <BeforeAfterSlider
            beforeImage={{ src: '/posters/persona-router.avif', alt: 'Bare shell living room before Starter Digital design' }}
            afterImage={{ src: '/posters/pricing-axis.avif', alt: 'Completed living room using Starter Digital floorplans' }}
          />
        </div>
      </Section>

      {/* 4. Upgrade Option */}
      <Section
        id="upgrade"
        eyebrow="Explore Upgrades"
        title="Compare Higher Digital Tiers"
        lede="Need 4K 3D renders or 360 VR walkthroughs? Explore Pro & Premium digital packages."
      >
        <Grid cols={2} gap={6}>
          <div className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 flex flex-col justify-between">
            <div>
              <h3 className="font-display text-h3 font-bold text-on-surface mb-2">Pro Package (₹45,000 / room)</h3>
              <p className="text-small text-on-surface-2 leading-relaxed mb-4">Adds 4K 3D photorealistic interior renders, full 2D working drawings, and itemized BOQ.</p>
            </div>
            <Button as="a" href="/digital/pro" variant="secondary" className="w-full justify-center">
              View Pro Package →
            </Button>
          </div>
          <div className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 flex flex-col justify-between">
            <div>
              <h3 className="font-display text-h3 font-bold text-on-surface mb-2">Premium VIP (₹75,000 / room)</h3>
              <p className="text-small text-on-surface-2 leading-relaxed mb-4">Adds 360 VR walkthrough, physical material sample box shipped to your door, and 3 video calls.</p>
            </div>
            <Button as="a" href="/digital/premium" variant="secondary" className="w-full justify-center">
              View Premium VIP →
            </Button>
          </div>
        </Grid>
      </Section>

      {/* 5. FAQ Accordion */}
      <Section id="faq" eyebrow="Questions Answered" title="Starter Package FAQ">
        <Faq items={digitalFaqs} />
      </Section>

      {/* 6. Conversion CTA Section */}
      <CTASection />
    </main>
  );
}
