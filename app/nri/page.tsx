import { TestimonialBand } from '@/components/sections/CTASection';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import type { Metadata } from 'next';
import { Container, Grid, Stack } from '@/components/layout';
import { Button } from '@/components/Button';
import { FeatureCard } from '@/components/Card';
import { STUDIO, whatsappHref } from '@/lib/content/studio';
import { Faq, FaqJsonLd } from '@/components/Faq';
import { Section } from '@/components/sections/Section';
import { CTASection } from '@/components/sections/CTASection';
import { ProcessSteps } from '@/components/sections/ProcessSteps';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';
import { canonicalFor } from '@/lib/seo/hreflang';
import { getFaqs, getNriRegions, getTestimonials } from '@/lib/content/source';
import { NriHeroBackground } from '@/components/sections/NriHeroBackground';

const ROUTE = '/nri';

export const metadata: Metadata = {
  title: 'Design Your Chennai Home From Anywhere | NRI Remote Interior Design',
  description:
    'Remote design for the Indian diaspora: video reviews in your local time zone, live site camera feeds & spend tracking in Space OS, and 100% turnkey execution in Chennai.',
  alternates: canonicalFor(ROUTE),
};

export default async function NriPage() {
  const [regions, faqs] = await Promise.all([getNriRegions(), getFaqs()]);

  const nriFaqs = [...faqs].sort((a, b) =>
    a.id === 'abroad' ? -1 : b.id === 'abroad' ? 1 : 0,
  );

  const highlights = [
    { title: 'Timezone-Flexible', desc: '3D VR Reviews in Your Local Time' },
    { title: 'Space OS 4K Portal', desc: 'Live Camera Streams & Spend Ledgers' },
    { title: 'Principal Architect', desc: 'On-Ground Lead Supervision' },
    { title: 'Fixed BOQ Contract', desc: 'Zero Price Escalation Guarantee' },
    { title: '10-Year Warranty', desc: 'Comprehensive Structural & Joinery Cover' },
  ];

  const protocolPillars = [
    {
      num: '01',
      title: 'Timezone-Matched 3D VR Design Reviews',
      desc: 'Walk through high-fidelity 3D interior renders and VR walkthroughs scheduled at hours convenient for PST, EST, GMT, GST, SGT, or AEST without taking work leave.',
    },
    {
      num: '02',
      title: 'Space OS 4K Live Site Tracking',
      desc: 'Continuous HD site camera streams, daily photo logs of fit-out progress, and real-time financial drawdown ledgers accessible via iOS/Android app.',
    },
    {
      num: '03',
      title: 'Material Sample Kits & Sourcing',
      desc: 'Physical material boards (Italian marble swatches, veneer finishes, brass accents, acoustic fabrics) dispatched directly to your overseas address for physical approval.',
    },
    {
      num: '04',
      title: 'White-Glove Turnkey Keys Handover',
      desc: 'Deep cleaning, medical-grade air purification, appliance integration, smart home automation calibration, and fresh linens so your home is 100% ready when you land in Chennai.',
    },
  ];

  const comparisons = [
    {
      feature: 'Site Oversight',
      traditional: 'Relying on relatives or unmonitored local contractors',
      whiteglove:
        'Full-time dedicated senior site architect with 4K camera feeds',
    },
    {
      feature: 'Design Review',
      traditional: 'Low-res WhatsApp photos and midnight phone calls',
      whiteglove: 'Scheduled 3D VR walkthroughs in your local timezone',
    },
    {
      feature: 'Budget Control',
      traditional: 'Opaque verbal quotes with 20–40% cost overruns',
      whiteglove: 'Fixed contractual BOQ with zero cost escalation',
    },
    {
      feature: 'Material Sourcing',
      traditional: 'Local shop visits required in person during short trips',
      whiteglove:
        'Physical material sample kits delivered to your overseas door',
    },
    {
      feature: 'Quality Assurance',
      traditional: 'Unchecked joinery finish & uneven tile alignment',
      whiteglove: 'Laser-guided precision leveling & factory-controlled joinery',
    },
    {
      feature: 'Handover State',
      traditional: 'Dusty construction site requiring week-long cleaning',
      whiteglove: 'Deep cleaned, air-purified, fully turn-key move-in ready',
    },
  ];

  const testimonials = await getTestimonials();

  return (
    <main id="main" tabIndex={-1}>
      <FaqJsonLd items={nriFaqs} />

      {/* 1. Hero Stage & Breadcrumbs with Ken Burns Background */}
      <section className="relative overflow-hidden pt-12 pb-16 min-h-[82vh] flex flex-col justify-center bg-surface-deep border-b border-border-subtle/40 isolate">
        {/* Full-Bleed Animated Background with Ken Burns Effect */}
        <NriHeroBackground />

        <Container className="relative z-10">
          <Breadcrumbs path="/nri" labels={{ nri: 'NRI Remote Design' }} />

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/40 w-fit backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                Turnkey Remote Interior Architecture Protocol
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.08] tracking-[var(--font-tracking-tight)] text-on-surface font-bold drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              Design Your Chennai Luxury Residence <br />
              <span className="text-accent">From Anywhere in the World</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface font-medium leading-relaxed max-w-3xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Bespoke interior design and turnkey fit-outs for overseas home-owners.
              You do not need to take work leave or ask relatives to supervise a site.
              Design reviews happen over 3D VR video calls in your timezone, with live 4K site feeds,
              curated material sample kits sent abroad, and milestone spend tracking in Space OS.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                as="a"
                href="/book-audit"
                size="lg"
                className="shadow-2xl"
              >
                Start Remote Design
              </Button>
              {STUDIO.whatsapp && (
                <Button
                  as="a"
                  href={whatsappHref(STUDIO.whatsapp)}
                  variant="secondary"
                  size="lg"
                  className="bg-surface-raised/90 border border-accent/30 backdrop-blur-md"
                >
                  Message Us on WhatsApp →
                </Button>
              )}
            </div>

            {/* Key Stats Bar with Liquid Glass Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-8 border-t border-accent/20">
              <div className="lx-liquid-glass-card p-4 rounded-xl text-center">
                <strong className="block font-display text-h3 text-accent font-bold">
                  100%
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Remote Execution
                </span>
              </div>
              <div className="lx-liquid-glass-card p-4 rounded-xl text-center">
                <strong className="block font-display text-h3 text-accent font-bold">
                  6 Hubs
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Global Timezones
                </span>
              </div>
              <div className="lx-liquid-glass-card p-4 rounded-xl text-center">
                <strong className="block font-display text-h3 text-accent font-bold">
                  4K Feeds
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Space OS Dashboard
                </span>
              </div>
              <div className="lx-liquid-glass-card p-4 rounded-xl text-center">
                <strong className="block font-display text-h3 text-accent font-bold">
                  0 Days
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Leave Needed
                </span>
              </div>
              <div className="lx-liquid-glass-card p-4 rounded-xl text-center col-span-2 sm:col-span-1">
                <strong className="block font-display text-h3 text-accent font-bold">
                  10 Yr
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Flat Warranty
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

      {/* 3. Global Diaspora Regions Grid */}
      <Section
        id="regions"
        eyebrow="Global Remote Hubs"
        title="Tailored for Where You Live"
        lede="Select your region to view timezone-matched review schedules and regional client case studies."
      >
        <Grid cols={3} gap={6}>
          {regions.map((region) => (
            <FeatureCard
              key={region.slug}
              href={`/nri/${region.slug}`}
              title={region.name}
              body={`Remote Chennai interior design tailored for ${region.name} timezones.`}
            />
          ))}
        </Grid>
      </Section>

      {/* 4. White-Glove Remote Protocol */}
      <Section
        id="protocol"
        eyebrow="Remote Architecture"
        title="The White-Glove Remote Protocol"
        lede="Four operational commitments that make remote execution stress-free."
      >
        <Grid cols={2} gap={6}>
          {protocolPillars.map((p) => (
            <div
              key={p.num}
              className="lx-liquid-glass rounded-xl p-5 border border-accent/30 flex items-start gap-4"
            >
              <span className="font-display text-h2 font-bold text-accent shrink-0">
                {p.num}
              </span>
              <div>
                <h3 className="font-display text-h4 font-bold text-on-surface mb-1">
                  {p.title}
                </h3>
                <p className="text-small text-on-surface-2 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 5. Comparison Matrix */}
      <Section
        id="comparison"
        eyebrow="Protocol Advantage"
        title="Traditional Remote Build vs Luxe Axis White-Glove"
        lede="How our structured protocol eliminates the risk of managing a project from abroad."
      >
        <div className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 overflow-x-auto">
          <table className="w-full text-left text-small">
            <thead>
              <tr className="border-b border-border-subtle/60 text-accent font-display text-body font-bold">
                <th className="py-3 px-4">Dimension</th>
                <th className="py-3 px-4">Traditional Remote Supervision</th>
                <th className="py-3 px-4 text-accent bg-accent/10 rounded-t-lg">
                  Luxe Axis White-Glove
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/40 text-on-surface-2">
              {comparisons.map((row) => (
                <tr key={row.feature}>
                  <td className="py-3 px-4 font-bold text-on-surface">
                    {row.feature}
                  </td>
                  <td className="py-3 px-4 text-on-surface-muted">
                    {row.traditional}
                  </td>
                  <td className="py-3 px-4 font-semibold text-accent bg-accent/5">
                    {row.whiteglove}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 6. Before & After Transformation Slider */}
      <Section
        id="transformation"
        eyebrow="Remote Project Result"
        title="Adyar Villa Remote Transformation"
        lede="Real NRI project in Adyar executed 100% remotely while client resided in Silicon Valley."
      >
        <div className="max-w-4xl mx-auto">
          <BeforeAfterSlider
            beforeImage={{
              src: '/posters/persona-router.avif',
              alt: 'Bare villa shell before fit-out',
            }}
            afterImage={{
              src: '/posters/portfolio.avif',
              alt: 'Completed NRI villa in Adyar, Chennai',
            }}
          />
        </div>
      </Section>

      {/* 7. Process */}
      <ProcessSteps />

      {/* 8. Diaspora Client Stories */}
      <TestimonialBand testimonials={testimonials} />

      {/* 9. FAQ Accordion */}
      <Section id="faq" eyebrow="Before you ask" title="NRI Remote Design FAQ">
        <Faq items={nriFaqs} />
      </Section>

      {/* 10. CTA Section */}
      <CTASection />
    </main>
  );
}
