import { TestimonialBand } from '@/components/sections/CTASection';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import type { Metadata } from 'next';
import { Container, Grid, Stack } from '@/components/layout';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { JsonLd } from '@/components/JsonLd';
import { Section } from '@/components/sections/Section';
import { CTASection } from '@/components/sections/CTASection';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';
import { Faq } from '@/components/Faq';
import { canonicalFor } from '@/lib/seo/hreflang';
import { getFaqs, getTestimonials } from '@/lib/content/source';

const ROUTE = '/digital';

export const metadata: Metadata = {
  title: 'Luxe Axis Digital & Design Club | Remote Architectural Design',
  description:
    'Complete, professional architectural interior design delivered remotely: 2D layouts, 4K 3D VR renders, Vastu-Tech compass scans, and shop-it-yourself itemized BOQs.',
  alternates: canonicalFor(ROUTE),
};

export default async function DigitalPage() {
  const testimonials = await getTestimonials();
  const faqs = await getFaqs();
  const digitalFaqs = [...faqs].filter(
    (f) => f.id === 'abroad' || f.id === 'materials' || f.id === 'contractors',
  );

  const highlights = [
    { title: '100% Remote', desc: 'Global Online Coordination' },
    { title: '4K 3D Renders', desc: 'Photorealistic VR Walkthroughs' },
    { title: 'Vastu-Tech Scan', desc: 'Solar Compass Alignment' },
    { title: 'Shop-It-Yourself', desc: 'Itemized Vendor Links' },
    { title: 'Design Club VIP', desc: 'Exclusive Material Discounts' },
  ];

  const packages = [
    {
      id: 'starter',
      name: 'Starter Package',
      price: '₹25,000 / room',
      summary:
        'Essential remote design package for homeowners who want professional layout guidance and color palettes.',
      href: '/digital/starter',
      inclusions: [
        'Optimized 2D CAD floorplan layout',
        'Curated color & material moodboard',
        'Vastu-Tech basic compass orientation check',
        'Shop-it-yourself procurement list with direct links',
        '1 Video consultation call with a designer',
      ],
    },
    {
      id: 'pro',
      name: 'Pro Package',
      price: '₹45,000 / room',
      recommended: true,
      summary:
        'Complete architectural design package with 4K 3D renders and detailed working drawings for contractor execution.',
      href: '/digital/pro',
      inclusions: [
        'All Starter Package deliverables',
        '4K photorealistic 3D interior renders (3 views/room)',
        'Full 2D working drawings (electrical, plumbing, elevation)',
        'Itemized component BOQ cost estimate',
        '2 Video review calls with senior architect',
      ],
    },
    {
      id: 'premium',
      name: 'Premium VIP Package',
      price: '₹75,000 / room',
      summary:
        'Ultra-luxury remote design with 360 VR walkthrough, physical material sample box shipped to your door, and 3 video calls.',
      href: '/digital/premium',
      inclusions: [
        'All Pro Package deliverables',
        'Interactive 360-degree VR virtual walkthrough',
        'Physical material sample box shipped to your address',
        'Custom joinery & lighting detail sheets',
        '3 Video calls & direct WhatsApp studio access',
        '1-Year Design Club VIP Membership included',
      ],
    },
  ];

  const clubBenefits = [
    {
      title: '15-25% Trade Discounts',
      desc: 'Access exclusive wholesale pricing on Blum hardware, Kohler sanitaryware, Saint-Gobain glass, and Asian Paints Royale.',
    },
    {
      title: 'Priority Audit Slots',
      desc: 'Skip the standard waitlist with guaranteed 24-hour consultation booking at our Chennai experience studios.',
    },
    {
      title: 'Quarterly Trend Lookbooks',
      desc: 'Receive curated South Indian spatial intelligence reports, Italian marble trends, and lighting innovations.',
    },
    {
      title: 'VIP Studio Events',
      desc: 'Invitations to private material launch galas, architect talks, and private art previews in Chennai.',
    },
  ];

  const comparisons = [
    {
      feature: 'Deliverable Output',
      starter: '2D Layout & Moodboard',
      pro: '4K 3D Renders & CAD Drawings',
      premium: '360 VR & Physical Sample Box',
    },
    {
      feature: 'Vastu Alignment',
      starter: 'Basic Solar Compass Check',
      pro: 'Full Vastu-Tech 16-Zone Audit',
      pro1: 'Full Vastu-Tech 16-Zone Audit',
      premium: 'Comprehensive Vastu & Energy Optimization',
    },
    {
      feature: 'Procurement List',
      starter: 'Basic Vendor Links',
      pro: 'Itemized Component BOQ',
      premium: 'BOQ + Trade Discount Code Integration',
    },
    {
      feature: 'Video Consultations',
      starter: '1 Consultation Call',
      pro: '2 Consultation Calls',
      premium: '3 Calls + Direct WhatsApp Studio Access',
    },
  ];

  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Luxe Axis Digital & Design Club | Remote Architectural Design',
          description:
            'Complete, professional architectural interior design delivered remotely.',
          url: ROUTE,
        }}
      />

      {/* 1. Hero Stage & Breadcrumbs */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-surface-deep border-b border-border-subtle/40">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-accent/30 via-transparent to-transparent pointer-events-none" />

        <Container>
          <Breadcrumbs
            path="/digital"
            labels={{ digital: 'Digital & Design Club' }}
          />

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 w-fit">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                Remote Architectural Design & VIP Club
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.1] tracking-[var(--font-tracking-tight)] text-on-surface font-bold">
              Luxe Axis Digital & <br />
              <span className="text-accent">Private Design Club</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2 font-medium leading-relaxed max-w-3xl">
              Not everyone needs studio-managed execution. Luxe Axis Digital
              gives you complete, professional architectural design — 2D
              layouts, 4K 3D VR renders, Vastu-Tech compass scans, and an
              itemized shop-it-yourself list — remotely, affordably, and on your
              schedule.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button as="a" href="#digital-packages" size="lg">
                Explore Digital Tiers
              </Button>
              <Button as="a" href="#design-club" variant="secondary" size="lg">
                Join Design Club →
              </Button>
            </div>

            {/* Key Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-8 border-t border-border-subtle/50">
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  100% Remote
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Global Service
                </span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  3 Packages
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Starter / Pro / Premium
                </span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  4K 3D VR
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Photorealistic Visuals
                </span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  Shop-It-Yourself
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Itemized BOQ
                </span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  4.9 ★
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Client Rating
                </span>
              </div>
            </div>
          </Stack>
        </Container>
      </section>

      {/* 2. Highlights Strip */}
      <section className="py-6 bg-surface-raised/40 border-b border-border-subtle/40">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            {highlights.map((item) => (
              <div key={item.title} className="p-2">
                <strong className="block font-ui text-small font-bold text-accent uppercase tracking-wider">
                  {item.title}
                </strong>
                <span className="text-[12px] text-on-surface-muted mt-0.5 block">
                  {item.desc}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. Three Digital Package Tiers Grid */}
      <Section
        id="digital-packages"
        eyebrow="Remote Packages"
        title="Three Digital Design Packages"
        lede="Select the exact level of design depth and architectural drawings for your project."
      >
        <Grid cols={3} gap={6}>
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`lx-liquid-glass rounded-2xl p-6 border flex flex-col justify-between relative ${
                pkg.recommended
                  ? 'border-accent shadow-[0_0_30px_rgba(212,175,55,0.15)] bg-accent/5'
                  : 'border-accent/30'
              }`}
            >
              {pkg.recommended && (
                <div className="absolute -top-3 left-6">
                  <Badge tone="accent" icon="check">
                    Most Popular
                  </Badge>
                </div>
              )}
              <Stack gap={4}>
                <div>
                  <h3 className="font-display text-h3 font-bold text-on-surface">
                    {pkg.name}
                  </h3>
                  <strong className="block font-display text-h2 text-accent font-bold mt-1">
                    {pkg.price}
                  </strong>
                  <p className="text-small text-on-surface-2 mt-2 leading-relaxed">
                    {pkg.summary}
                  </p>
                </div>

                <ul className="flex flex-col gap-2.5 border-t border-border-subtle/40 pt-4 text-small text-on-surface-2">
                  {pkg.inclusions.map((inc) => (
                    <li key={inc} className="flex items-start gap-2">
                      <span className="text-accent font-bold">✓</span>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </Stack>

              <div className="pt-6">
                <Button
                  as="a"
                  href={pkg.href}
                  variant={pkg.recommended ? 'primary' : 'secondary'}
                  className="w-full justify-center"
                >
                  Explore {pkg.name} →
                </Button>
              </div>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 4. Design Club VIP Membership Spotlight */}
      <Section
        id="design-club"
        eyebrow="Exclusive Membership"
        title="Luxe Axis Design Club VIP"
        lede="Join our private membership network for trade discounts, priority audits, and design intelligence."
      >
        <div className="lx-liquid-glass rounded-2xl p-8 border border-accent/30">
          <div className="max-w-3xl mb-8">
            <h3 className="font-display text-h2 font-bold text-on-surface mb-3">
              Trade Discounts & Insider Access
            </h3>
            <p className="text-body text-on-surface-2 leading-relaxed">
              Design Club is our private community for design enthusiasts,
              homeowners, and real-estate investors. Members receive exclusive
              trade pricing on premium fittings, priority studio appointments,
              and early access to trend lookbooks.
            </p>
          </div>

          <Grid cols={2} gap={6}>
            {clubBenefits.map((b) => (
              <div
                key={b.title}
                className="p-5 rounded-xl bg-surface-deep/40 border border-accent/20"
              >
                <h4 className="font-display text-h4 font-bold text-accent mb-1">
                  {b.title}
                </h4>
                <p className="text-small text-on-surface-2 leading-relaxed">
                  {b.desc}
                </p>
              </div>
            ))}
          </Grid>
        </div>
      </Section>

      {/* 5. Package Comparison Matrix */}
      <Section
        id="comparison"
        eyebrow="Compare Packages"
        title="Digital Package Feature Matrix"
        lede="Detailed comparison of Starter, Pro, and Premium Remote Digital Design packages."
      >
        <div className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 overflow-x-auto">
          <table className="w-full text-left text-small">
            <thead>
              <tr className="border-b border-border-subtle/60 text-accent font-display text-body font-bold">
                <th className="py-3 px-4">Feature</th>
                <th className="py-3 px-4">Starter Package</th>
                <th className="py-3 px-4 text-accent bg-accent/10 rounded-t-lg">
                  Pro Package
                </th>
                <th className="py-3 px-4">Premium VIP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/40 text-on-surface-2">
              {comparisons.map((row) => (
                <tr key={row.feature}>
                  <td className="py-3 px-4 font-bold text-on-surface">
                    {row.feature}
                  </td>
                  <td className="py-3 px-4 text-on-surface-muted">
                    {row.starter}
                  </td>
                  <td className="py-3 px-4 font-semibold text-accent bg-accent/5">
                    {row.pro}
                  </td>
                  <td className="py-3 px-4 text-on-surface-2">{row.premium}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 6. Interactive Before & After Transformation Slider */}
      <Section
        id="transformation"
        eyebrow="Remote Result"
        title="Remotely Designed Transformation"
        lede="Apartment in Singapore designed remotely by Luxe Axis Digital and built by local contractors."
      >
        <div className="max-w-4xl mx-auto">
          <BeforeAfterSlider
            beforeImage={{
              src: '/posters/persona-router.avif',
              alt: 'Bare shell flat before Luxe Axis Digital design package',
            }}
            afterImage={{
              src: '/posters/portfolio.avif',
              alt: 'Completed apartment interior using Luxe Axis Digital drawings',
            }}
          />
        </div>
      </Section>

      {/* 7. Testimonials */}
      <TestimonialBand testimonials={testimonials} />

      {/* 8. FAQ Accordion */}
      <Section
        id="faq"
        eyebrow="Questions Answered"
        title="Digital & Design Club FAQ"
      >
        <Faq items={digitalFaqs} />
      </Section>

      {/* 9. Conversion CTA Section */}
      <CTASection />
    </main>
  );
}
