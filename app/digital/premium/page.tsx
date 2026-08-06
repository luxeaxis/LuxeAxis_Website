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

const ROUTE = '/digital/premium';

export const metadata: Metadata = {
  title: 'Premium VIP Digital Package (₹75,000/room) | Luxe Axis Digital',
  description:
    'Ultra-luxury remote design package: 360-degree VR walkthrough, physical material sample box shipped globally, custom joinery sheets, and 1-year Design Club VIP membership.',
  alternates: canonicalFor(ROUTE),
};

export default async function PremiumDigitalPage() {
  const faqs = await getFaqs();
  const digitalFaqs = [...faqs].filter((f) => f.id === 'abroad' || f.id === 'materials');

  const inclusions = [
    'All Pro Package deliverables included',
    'Interactive 360-degree VR virtual walkthrough simulation',
    'Physical material sample box (marbles, BWP veneers, hardware) shipped globally',
    'Custom joinery, false ceiling & lighting detail execution sheets',
    '3 Video review calls with senior architectural director',
    'Direct WhatsApp studio access with dedicated project coordinator',
    '1-Year Luxe Axis Design Club VIP Membership included (trade discounts)',
  ];

  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Premium VIP Digital Package (₹75,000/room)',
          description: 'Ultra-luxury remote design package with sample box.',
          url: ROUTE,
        }}
      />

      {/* 1. Hero Stage & Breadcrumbs */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-surface-deep border-b border-border-subtle/40">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-accent/30 via-transparent to-transparent pointer-events-none" />

        <Container>
          <Breadcrumbs path="/digital/premium" labels={{ 'premium': "Premium VIP" }} />

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 w-fit">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                Ultra-Luxury Package • ₹75,000 / room
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.1] tracking-[var(--font-tracking-tight)] text-on-surface font-bold">
              Premium VIP Digital <br />
              <span className="text-accent">Design Package</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2 font-medium leading-relaxed max-w-3xl">
              Uncompromising remote architectural design: 360-degree VR walkthrough, a physical material sample box shipped to your door worldwide, and 1-year VIP Design Club membership.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button as="a" href="/book-audit" size="lg">
                Book Premium Audit
              </Button>
              <Button as="a" href="/digital" variant="secondary" size="lg">
                View All Digital Tiers →
              </Button>
            </div>

            {/* Key Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-border-subtle/50">
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">₹75,000</strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">Per Room Rate</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">360 VR</strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">Virtual Walkthrough</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">Sample Box</strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">Shipped Worldwide</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">VIP Club</strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">1-Year Included</span>
              </div>
            </div>
          </Stack>
        </Container>
      </section>

      {/* 2. Inclusions */}
      <Section
        id="inclusions"
        eyebrow="Package Deliverables"
        title="What Is Included in Premium VIP"
        lede="White-glove remote design package delivered digitally and physically to your address."
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
        title="Premium VIP Transformation Result"
        lede="Villa in London designed remotely under Premium VIP and executed by local contractors."
      >
        <div className="max-w-4xl mx-auto">
          <BeforeAfterSlider
            beforeImage={{ src: '/posters/persona-router.avif', alt: 'Bare shell villa before Premium VIP design package' }}
            afterImage={{ src: '/posters/portfolio.avif', alt: 'Completed luxury villa interior using Premium VIP 360 VR drawings' }}
          />
        </div>
      </Section>

      {/* 4. Upgrade Option */}
      <Section
        id="upgrade"
        eyebrow="Explore Alternatives"
        title="Compare Other Digital Packages"
        lede="Evaluate our Starter and Pro remote design packages."
      >
        <Grid cols={2} gap={6}>
          <div className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 flex flex-col justify-between">
            <div>
              <h3 className="font-display text-h3 font-bold text-on-surface mb-2">Starter Package (₹25,000 / room)</h3>
              <p className="text-small text-on-surface-2 leading-relaxed mb-4">Essential 2D layout, color moodboard, Vastu compass check, and direct shopping links.</p>
            </div>
            <Button as="a" href="/digital/starter" variant="secondary" className="w-full justify-center">
              View Starter Package →
            </Button>
          </div>
          <div className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 flex flex-col justify-between">
            <div>
              <h3 className="font-display text-h3 font-bold text-on-surface mb-2">Pro Package (₹45,000 / room)</h3>
              <p className="text-small text-on-surface-2 leading-relaxed mb-4">Adds 4K 3D photorealistic interior renders, full 2D working drawings, and itemized BOQ.</p>
            </div>
            <Button as="a" href="/digital/pro" variant="secondary" className="w-full justify-center">
              View Pro Package →
            </Button>
          </div>
        </Grid>
      </Section>

      {/* 5. FAQ Accordion */}
      <Section id="faq" eyebrow="Questions Answered" title="Premium VIP FAQ">
        <Faq items={digitalFaqs} />
      </Section>

      {/* 6. Conversion CTA Section */}
      <CTASection />
    </main>
  );
}
