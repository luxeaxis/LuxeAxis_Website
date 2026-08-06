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
import { getFaqs, getNriRegions } from '@/lib/content/source';

const ROUTE = '/nri';

export const metadata: Metadata = {
  title: 'Design Your Chennai Home From Anywhere | NRI Remote Interior Design',
  description:
    'Remote design for the Indian diaspora: video reviews in your local time zone, live site camera feeds & spend tracking in Space OS, and 100% turnkey execution in Chennai.',
  alternates: canonicalFor(ROUTE),
};

export default async function NriPage() {
  const [regions, faqs] = await Promise.all([
    getNriRegions(),
    getFaqs(),
  ]);

  const nriFaqs = [...faqs].sort((a, b) => (a.id === 'abroad' ? -1 : b.id === 'abroad' ? 1 : 0));

  const highlights = [
    { title: 'Timezone-Flexible', desc: 'Video Reviews in Your Local Time' },
    { title: 'Space OS Live Portal', desc: '4K Live Feeds & Real-Time Spend' },
    { title: 'Dedicated Site Lead', desc: 'On-Ground Principal Supervision' },
    { title: 'Fixed BOQ Guarantee', desc: 'Zero Hidden Escalation Costs' },
    { title: 'Flat 10-Year Warranty', desc: 'Zero Fine Print Guarantee' },
  ];

  const protocolPillars = [
    {
      num: '01',
      title: 'Timezone-Matched Video Reviews',
      desc: '3D VR walkthroughs scheduled at hours convenient for PST, EST, GMT, GST, SGT, or AEST without taking work leave.',
    },
    {
      num: '02',
      title: 'Space OS 4K Live Site Tracking',
      desc: 'Live site camera feeds, daily photo logs, and real-time financial drawdown ledgers accessible via iOS/Android.',
    },
    {
      num: '03',
      title: 'Escrow & Milestone Financials',
      desc: 'Bank escrow payment releases tied strictly to 4K verified milestone completions, protecting your investment.',
    },
    {
      num: '04',
      title: 'White-Glove Keys-Handover',
      desc: 'Deep cleaning, air purification, appliance setup, and fresh linens so your home is 100% ready when you land in Chennai.',
    },
  ];

  const comparisons = [
    {
      feature: 'Site Oversight',
      traditional: 'Relying on relatives or unmonitored local contractors',
      whiteglove: 'Full-time dedicated senior site manager with 4K camera feeds',
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
      traditional: 'Local shop visits required in person during visits',
      whiteglove: 'Digital material sample kits delivered to your overseas door',
    },
    {
      feature: 'Handover State',
      traditional: 'Dusty construction site requiring week-long cleaning',
      whiteglove: 'Deep cleaned, air-purified, fully turn-key move-in ready',
    },
  ];

  const clientStories = [
    {
      name: 'Anand & Lakshmi Narayanan',
      location: 'San Jose, USA (PST)',
      quote:
        'Designing our 4BHK villa in Adyar while working in Silicon Valley was seamless. Weekly 3D reviews at 8 PM PST and Space OS live feeds gave us complete confidence.',
    },
    {
      name: 'Karthik & Sangeetha',
      location: 'Singapore (SGT)',
      quote:
        'We never had to fly to Chennai once during construction. Luxe Axis handed over our Nungambakkam penthouse clean, decorated, and ready for move-in.',
    },
    {
      name: 'Dr. Rahul Varma',
      location: 'London, UK (GMT)',
      quote:
        'The milestone escrow structure and transparent BOQ eliminated all financial worry. Handover was completed exactly on schedule.',
    },
  ];

  return (
    <main id="main" tabIndex={-1}>
      <FaqJsonLd items={nriFaqs} />

      {/* 1. Hero Stage & Breadcrumbs */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-surface-deep border-b border-border-subtle/40">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-accent/30 via-transparent to-transparent pointer-events-none" />

        <Container>
          <Breadcrumbs path="/nri" labels={{ 'nri': "NRI Remote Design" }} />

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 w-fit">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                Turnkey Remote Protocol
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.1] tracking-[var(--font-tracking-tight)] text-on-surface font-bold">
              Design Your Chennai Home <br />
              <span className="text-accent">From Anywhere in the World</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2 font-medium leading-relaxed max-w-3xl">
              You do not need to be in the country, take work leave, or ask relatives to supervise a site. Reviews happen over 3D VR video calls in your time zone, with live 4K camera streams and spend tracking in Space OS.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button as="a" href="/book-audit" size="lg">
                Start Remote Design
              </Button>
              {STUDIO.whatsapp && (
                <Button
                  as="a"
                  href={whatsappHref(STUDIO.whatsapp)}
                  variant="secondary"
                  size="lg"
                >
                  Message Us on WhatsApp →
                </Button>
              )}
            </div>

            {/* Key Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-8 border-t border-border-subtle/50">
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">100%</strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">Remote Execution</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">6 Hubs</strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">Global Timezones</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">4K Feeds</strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">Space OS Dashboard</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">0 Days</strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">Leave Needed</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">10 Yr</strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">Flat Warranty</span>
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
                <span className="text-[12px] text-on-surface-muted mt-0.5 block">{item.desc}</span>
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
            <div key={p.num} className="lx-liquid-glass rounded-xl p-5 border border-accent/30 flex items-start gap-4">
              <span className="font-display text-h2 font-bold text-accent shrink-0">{p.num}</span>
              <div>
                <h3 className="font-display text-h4 font-bold text-on-surface mb-1">{p.title}</h3>
                <p className="text-small text-on-surface-2 leading-relaxed">{p.desc}</p>
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
                <th className="py-3 px-4 text-accent bg-accent/10 rounded-t-lg">Luxe Axis White-Glove</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/40 text-on-surface-2">
              {comparisons.map((row) => (
                <tr key={row.feature}>
                  <td className="py-3 px-4 font-bold text-on-surface">{row.feature}</td>
                  <td className="py-3 px-4 text-on-surface-muted">{row.traditional}</td>
                  <td className="py-3 px-4 font-semibold text-accent bg-accent/5">{row.whiteglove}</td>
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
            beforeImage={{ src: '/posters/persona-router.avif', alt: 'Bare villa shell before fit-out' }}
            afterImage={{ src: '/posters/portfolio.avif', alt: 'Completed NRI villa in Adyar, Chennai' }}
          />
        </div>
      </Section>

      {/* 7. Process */}
      <ProcessSteps />

      {/* 8. Diaspora Client Stories */}
      <Section
        id="testimonials"
        eyebrow="Diaspora Feedback"
        title="What Overseas Homeowners Say"
        lede="Verified client feedback from NRI home projects in Chennai."
      >
        <Grid cols={3} gap={6}>
          {clientStories.map((t) => (
            <div key={t.name} className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 flex flex-col justify-between">
              <div>
                <div className="flex text-accent text-small mb-3">★★★★★</div>
                <blockquote className="text-body text-on-surface-2 italic leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
              </div>
              <div className="pt-4 border-t border-border-subtle/50">
                <strong className="block font-display text-small font-bold text-on-surface">{t.name}</strong>
                <span className="text-overline text-accent uppercase tracking-wider">📍 {t.location}</span>
              </div>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 9. FAQ Accordion */}
      <Section id="faq" eyebrow="Before you ask" title="NRI Remote Design FAQ">
        <Faq items={nriFaqs} />
      </Section>

      {/* 10. CTA Section */}
      <CTASection />
    </main>
  );
}
