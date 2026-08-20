import { Breadcrumbs } from '@/components/Breadcrumbs';
import type { Metadata } from 'next';
import { Container, Grid, Stack } from '@/components/layout';
import { Button } from '@/components/Button';
import { JsonLd } from '@/components/JsonLd';
import { Section } from '@/components/sections/Section';
import { CTASection } from '@/components/sections/CTASection';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';
import { Faq, FaqJsonLd } from '@/components/Faq';
import { canonicalFor } from '@/lib/seo/hreflang';
import { getFaqs } from '@/lib/content/source';

const ROUTE = '/digital/pro';

export const metadata: Metadata = {
  title: 'Pro 3D E-Design Package (₹45,000/room) | Luxe Axis Digital',
  description:
    'Complete architectural remote design package: 4K photorealistic 3D interior renders, full 2D working drawings, Vastu-Tech compass audit, and itemized component BOQ.',
  keywords: [
    'pro 3d interior design package',
    '4k 3d render e-design cost',
    'remote architectural floorplans and boq',
  ],
  alternates: canonicalFor(ROUTE),
  openGraph: {
    title: 'Pro 3D E-Design Package (₹45,000/room) | Luxe Axis',
    description:
      '4K photorealistic 3D interior renders, full 2D working drawings, and itemized component BOQ.',
    url: canonicalFor(ROUTE).canonical,
    images: [
      {
        url: '/posters/digital-hub-hero.png',
        width: 1200,
        height: 630,
        alt: 'Luxe Axis Pro 3D Digital Design Package',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pro 3D E-Design Package (₹45,000/room) | Luxe Axis',
    description:
      '4K 3D renders, working drawings, and itemized BOQ delivered remotely.',
    images: ['/posters/digital-hub-hero.png'],
  },
};

export default async function ProDigitalPage() {
  const faqs = await getFaqs();
  const digitalFaqs = [...faqs].filter(
    (f) => f.id === 'abroad' || f.id === 'materials',
  );

  const inclusions = [
    'All Starter Package deliverables included',
    '4K photorealistic 3D interior renders (3 camera angles per room)',
    'Full 2D working drawings (electrical, plumbing, wall elevations & joinery)',
    'Comprehensive Vastu-Tech 16-Zone solar compass audit',
    'Itemized component BOQ financial breakdown',
    '2 Video review calls with senior interior architect',
    'Digital delivery within 10 business days',
  ];

  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Pro Digital Design Package (₹45,000/room)',
          description: 'Complete architectural remote design package.',
          url: ROUTE,
        }}
      />
      <FaqJsonLd items={digitalFaqs} />

      {/* 1. Hero Stage & Breadcrumbs */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-surface-deep border-b border-border-subtle/40">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-accent/30 via-transparent to-transparent pointer-events-none" />

        <Container>
          <Breadcrumbs path="/digital/pro" labels={{ pro: 'Pro Package' }} />

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 w-fit">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                Most Popular Package • ₹45,000 / room
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.1] tracking-[var(--font-tracking-tight)] text-on-surface font-bold">
              Pro Digital <br />
              <span className="text-accent">Design Package</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2 font-medium leading-relaxed max-w-3xl">
              Complete architectural remote design package equipped with 4K
              photorealistic 3D renders, full 2D working drawings, Vastu-Tech
              solar compass audit, and an itemized component BOQ estimate.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button as="a" href="/book-audit" size="lg">
                Book Pro Audit
              </Button>
              <Button
                as="a"
                href="/digital/premium"
                variant="secondary"
                size="lg"
              >
                View Premium VIP (₹75k) →
              </Button>
            </div>

            {/* Key Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-border-subtle/50">
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  ₹45,000
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Per Room Rate
                </span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  4K 3D
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Photorealistic Visuals
                </span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  Working CAD
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Full Drawings
                </span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  2 Calls
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Architect Reviews
                </span>
              </div>
            </div>
          </Stack>
        </Container>
      </section>

      {/* 2. Inclusions */}
      <Section
        id="inclusions"
        eyebrow="Package Deliverables"
        title="What Is Included in Pro Digital"
        lede="Complete 4K 3D renders and architectural CAD working drawings delivered in 10 business days."
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
        title="Pro Package Makeover Result"
        lede="Singapore 3BHK flat designed under Pro Digital and built by local contractors."
      >
        <div className="max-w-4xl mx-auto">
          <BeforeAfterSlider
            beforeImage={{
              src: '/posters/penthouse-before-omr.png',
              alt: 'Bare shell flat before Pro Digital package',
            }}
            afterImage={{
              src: '/posters/nri-singapore-hero.png',
              alt: 'Completed apartment interior using Pro Digital 4K 3D drawings',
            }}
          />
        </div>
      </Section>

      {/* 4. Upgrade Option */}
      <Section
        id="upgrade"
        eyebrow="Explore Upgrades"
        title="Compare Other Digital Packages"
        lede="Need physical material sample boxes shipped to your door or 360 VR walkthroughs?"
      >
        <Grid cols={2} gap={6}>
          <div className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 flex flex-col justify-between">
            <div>
              <h3 className="font-display text-h3 font-bold text-on-surface mb-2">
                Starter Package (₹25,000 / room)
              </h3>
              <p className="text-small text-on-surface-2 leading-relaxed mb-4">
                Essential 2D layout, color moodboard, Vastu compass check, and
                direct shopping links.
              </p>
            </div>
            <Button
              as="a"
              href="/digital/starter"
              variant="secondary"
              className="w-full justify-center"
            >
              View Starter Package →
            </Button>
          </div>
          <div className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 flex flex-col justify-between">
            <div>
              <h3 className="font-display text-h3 font-bold text-on-surface mb-2">
                Premium VIP (₹75,000 / room)
              </h3>
              <p className="text-small text-on-surface-2 leading-relaxed mb-4">
                Adds 360 VR walkthrough, physical material sample box shipped to
                your door, and 3 video calls.
              </p>
            </div>
            <Button
              as="a"
              href="/digital/premium"
              variant="secondary"
              className="w-full justify-center"
            >
              View Premium VIP →
            </Button>
          </div>
        </Grid>
      </Section>

      {/* 5. FAQ Accordion */}
      <Section id="faq" eyebrow="Questions Answered" title="Pro Package FAQ">
        <Faq items={digitalFaqs} />
      </Section>

      {/* 6. Conversion CTA Section */}
      <CTASection />
    </main>
  );
}
