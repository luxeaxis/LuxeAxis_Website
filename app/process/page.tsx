import { TestimonialBand } from '@/components/sections/CTASection';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import type { Metadata } from 'next';
import { Container, Grid, Stack } from '@/components/layout';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { JsonLd } from '@/components/JsonLd';
import { ToBePublished } from '@/components/ToBePublished';
import { Section } from '@/components/sections/Section';
import { CTASection } from '@/components/sections/CTASection';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';
import { Faq, FaqJsonLd } from '@/components/Faq';
import { canonicalFor } from '@/lib/seo/hreflang';
import { HeroBackground } from '@/components/sections/HeroBackground';
import { PROCESS_HERO_SLIDES } from '@/lib/content/heroSlides';
import { serviceJsonLd } from '@/lib/seo/jsonLd';
import {
  getGuarantees,
  getProcessStages,
  getTiers,
  getFaqs,
  getTestimonials,
} from '@/lib/content/source';

const ROUTE = '/process';

export const metadata: Metadata = {
  title: 'Our Turnkey 7-Stage Architectural Execution Process & Guarantees | Luxe Axis',
  description:
    'Discover our 7-stage master interior execution sequence from CAD spatial audit to 10-year concierge care. Backed by 45-day contractual handover SLAs and zero-escalation BOQ pricing in Chennai.',
  keywords: [
    'turnkey interior execution process chennai',
    'interior project management steps',
    '45 day interior handover guarantee',
    'vastu tech interior workflow',
    'interior quality control checklist chennai',
  ],
  alternates: canonicalFor(ROUTE),
  openGraph: {
    title: 'Our 7-Stage Turnkey Interior Execution Process | Luxe Axis',
    description:
      'Rigorous 7-stage engineering methodology with 45-day guaranteed handover, daily 4K site logs, and 10-year warranty.',
    url: canonicalFor(ROUTE).canonical,
    images: [
      {
        url: '/posters/hero-process.png',
        width: 1200,
        height: 630,
        alt: 'Luxe Axis 7-Stage Architectural Interior Execution Process',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '7-Stage Interior Execution Process | Luxe Axis',
    description:
      'Turnkey interior execution sequence with 45-day delivery guarantee and 10-year warranty.',
    images: ['/posters/hero-process.png'],
  },
};

export default async function ProcessPage() {
  const [stages, guarantees, tiers, faqs] = await Promise.all([
    getProcessStages(),
    getGuarantees(),
    getTiers(),
    getFaqs(),
  ]);
  const guaranteeById = new Map(
    guarantees.map((guarantee) => [guarantee.id, guarantee]),
  );

  const processFaqs = [...faqs].filter(
    (f) => f.id === 'contractors' || f.id === 'abroad' || f.id === 'materials',
  );

  const highlights = [
    { title: '7 Master Stages', desc: 'Systematic Execution Sequence' },
    // 45 days is ESSENTIAL's handover; Signature commits to 60 and Elite to
    // agreed milestones. This page covers the process for all three, so it
    // states the shape of the commitment and leaves the number to the tier
    // that owns it — see the timeline guarantee in lib/content/source.ts.
    { title: 'Committed Date', desc: 'Handover Guarantee, Set Per Tier' },
    { title: 'Space OS Live', desc: '4K CCTV Daily Site Updates' },
    { title: 'Fixed BOQ Lock', desc: 'Zero Cost Escalation Contract' },
    { title: '10-Yr Warranty', desc: 'Flat Structural Coverage' },
  ];

  const comparisons = [
    {
      feature: 'Execution Workflow',
      generic: 'Ad-hoc site decision making with frequent revisions',
      luxeaxis: '7-stage systematic protocol with digital milestone gates',
    },
    {
      feature: 'Site Transparency',
      generic: 'Requires physical site visits to catch mistakes',
      luxeaxis: 'Space OS 4K daily feeds & digital milestone tracking',
    },
    {
      feature: 'Financial Control',
      generic: 'Unplanned cost overruns during mid-project execution',
      luxeaxis: 'Itemized BOQ price lock guaranteed in contract',
    },
    {
      feature: 'Timeline Commitment',
      generic: 'Vague promises with months of project delay',
      // Was "Contractual 45-day handover SLA with penalty clause". The flat 45
      // is Essential's alone, and no penalty clause is published anywhere in
      // lib/content/source.ts — the timeline guarantee's stated term is that
      // the date is not met until the snag list is empty, which is what this
      // now says.
      luxeaxis:
        'Handover date committed per tier; not met until the snag list is empty',
    },
    {
      feature: 'Post-Handover Support',
      generic: 'Contractor uncontactable after final payment',
      luxeaxis: 'Dedicated 10-year concierge care & 24-hr resolution SLA',
    },
  ];

  const testimonials = await getTestimonials();

  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={serviceJsonLd({
          name: '7-Stage Architectural Execution Process',
          description:
            'Seven stages from first conversation to 10-year concierge care.',
          url: ROUTE,
        })}
      />
      <FaqJsonLd items={processFaqs} />

      {/* 1. Hero Stage & Breadcrumbs with Ken Burns Background */}
      <section className="relative overflow-hidden pt-12 pb-16 min-h-[82vh] flex flex-col justify-center bg-surface-deep border-b border-border-subtle/40 isolate">
        <HeroBackground slides={PROCESS_HERO_SLIDES} overlay="grid" />

        <Container className="relative z-10">
          <Breadcrumbs path="/process" />

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/40 w-fit backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                Turnkey Execution Protocol
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.08] tracking-[var(--font-tracking-tight)] text-on-surface font-bold drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              Seven Stages of <br />
              <span className="text-accent">Architectural Execution</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface font-medium leading-relaxed max-w-3xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              A project is systematic or it is chaos with good taste. Explore
              our 7-stage sequence from initial spatial audit to 10-year
              concierge care, with every contractual guarantee attached directly
              to the stage where it applies.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button as="a" href="/book-audit" size="lg" className="shadow-2xl">
                Book Free Design Audit
              </Button>
              <Button
                as="a"
                href="#guarantees"
                variant="secondary"
                size="lg"
                className="bg-surface-raised/90 border border-accent/30 backdrop-blur-md"
              >
                Explore Guarantees →
              </Button>
            </div>

            {/* Key Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-8 border-t border-border-subtle/50">
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  7 Stages
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Master Sequence
                </span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  45–60 Days
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Handover, By Tier
                </span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  10 Yr
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Flat Warranty
                </span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  4K Feeds
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Space OS Portal
                </span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  4.9 ★
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Google Rating
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

      {/* 3. 7 Master Stages Stepper */}
      <Section
        id="stages"
        eyebrow="The Master Sequence"
        title="From First Conversation to Concierge Care"
        lede="Each node represents a distinct phase of engineering, with relevant contractual guarantees attached."
      >
        <ol className="flex max-w-4xl flex-col gap-6 mx-auto">
          {stages.map((stage, index) => {
            const attached = (stage.guaranteeIds ?? [])
              .map((id) => guaranteeById.get(id))
              .filter((guarantee) => guarantee !== undefined);
            return (
              <li
                key={stage.id}
                className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 flex gap-6 items-start"
              >
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-accent/40 font-mono text-h3 text-accent font-bold bg-accent/10"
                >
                  {index + 1}
                </span>
                <Stack gap={2} className="grow">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-display text-h3 font-bold text-on-surface">
                      {stage.name}
                    </h3>
                    <span className="text-overline text-accent uppercase tracking-wider font-semibold">
                      Stage 0{index + 1}
                    </span>
                  </div>
                  <p className="text-body text-on-surface-2 leading-relaxed">
                    {stage.body}
                  </p>
                  {attached.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2 pt-3 border-t border-border-subtle/40">
                      {attached.map((guarantee) => (
                        <Badge key={guarantee.id} tone="accent" icon="check">
                          {guarantee.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </Stack>
              </li>
            );
          })}
        </ol>
      </Section>

      {/* 4. The Guarantees in Full */}
      <Section
        id="guarantees"
        eyebrow="Contractual Commitments"
        title="Our Guarantees in Full"
        lede="Legal commitments attached to our contracts for complete client peace of mind."
      >
        <Grid cols={2} gap={6}>
          {guarantees.map((guarantee) => (
            <div
              key={guarantee.id}
              className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 flex flex-col justify-between"
            >
              <Stack gap={3}>
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-h3 font-bold text-on-surface">
                    {guarantee.name}
                  </h3>
                  <Badge tone="accent" icon="check">
                    Contractual
                  </Badge>
                </div>
                <p className="text-body text-on-surface-2 leading-relaxed">
                  {guarantee.summary}
                </p>
                {guarantee.byTier && (
                  <dl className="flex flex-col gap-1.5 border-l-2 border-accent pl-4 text-small my-2 bg-surface-deep/30 p-3 rounded-r-lg">
                    {tiers.map((tier) =>
                      guarantee.byTier?.[tier.name] ? (
                        <div key={tier.id} className="flex gap-2">
                          <dt className="text-accent font-semibold">
                            {tier.name}:
                          </dt>
                          <dd className="text-on-surface-2">
                            {guarantee.byTier[tier.name]}
                          </dd>
                        </div>
                      ) : null,
                    )}
                  </dl>
                )}
                <p className="text-small text-on-surface-muted">
                  {guarantee.terms ?? <ToBePublished label="Full terms" />}
                </p>
              </Stack>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 5. Space OS Remote Supervision Feature */}
      <Section
        id="space-os-spotlight"
        eyebrow="Digital Transparency"
        title="Track Every Stage via Space OS"
        lede="Our proprietary client portal gives you real-time visibility into factory joinery production and site progress."
      >
        <div className="lx-liquid-glass rounded-2xl p-8 border border-accent/30 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2">
            <h3 className="font-display text-h2 font-bold text-on-surface mb-3">
              4K Daily Feeds & Milestones
            </h3>
            <p className="text-body text-on-surface-2 leading-relaxed mb-4">
              Never worry about what is happening on site. Log into Space OS
              from your phone or desktop to view daily 4K photographic logs,
              inspect material batch certifications, and approve financial
              milestones with a tap.
            </p>
            <div className="flex flex-wrap gap-3">
              <Badge tone="accent" icon="check">
                Daily 4K Photo Feed
              </Badge>
              <Badge tone="accent" icon="check">
                Digital Milestones
              </Badge>
              <Badge tone="accent" icon="check">
                Escrow Payments
              </Badge>
            </div>
          </div>
          <div className="p-6 rounded-xl bg-surface-deep border border-accent/20 text-center">
            <strong className="block font-display text-h1 text-accent font-bold mb-1">
              4K
            </strong>
            <span className="text-overline text-on-surface-muted uppercase tracking-wider">
              Live CCTV Feed
            </span>
          </div>
        </div>
      </Section>

      {/* 6. Comparison Matrix */}
      <Section
        id="comparison"
        eyebrow="The Standard"
        title="Luxe Axis Process vs Traditional Execution"
        lede="How our structured 7-stage protocol compares against unorganized contractors."
      >
        <div className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 overflow-x-auto">
          <table className="w-full text-left text-small">
            <thead>
              <tr className="border-b border-border-subtle/60 text-accent font-display text-body font-bold">
                <th className="py-3 px-4">Feature</th>
                <th className="py-3 px-4">Traditional Contractors</th>
                <th className="py-3 px-4 text-accent bg-accent/10 rounded-t-lg">
                  Luxe Axis 7-Stage Process
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
                    {row.generic}
                  </td>
                  <td className="py-3 px-4 font-semibold text-accent bg-accent/5">
                    {row.luxeaxis}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 7. Interactive Before & After Transformation Slider */}
      <Section
        id="transformation"
        eyebrow="Real Execution"
        title="From Raw Site to Completed Handover"
        lede="Witness the transformation of a 3BHK flat in Adyar managed under our 7-stage sequence."
      >
        <div className="max-w-4xl mx-auto">
          <BeforeAfterSlider
            beforeImage={{
              src: '/posters/apt-before-construction-raw.png',
              alt: 'Raw shell apartment before Stage 1 Discover',
            }}
            afterImage={{
              src: '/posters/apt-after-living-luxury.png',
              alt: 'Completed home interior after Stage 6 Handover',
            }}
          />
        </div>
      </Section>

      {/* 8. Testimonials */}
      <TestimonialBand testimonials={testimonials} />

      {/* 9. FAQ Accordion */}
      <Section
        id="faq"
        eyebrow="Questions Answered"
        title="Process & Guarantees FAQ"
      >
        <Faq items={processFaqs} />
      </Section>

      {/* 10. Conversion CTA Section */}
      <CTASection />
    </main>
  );
}
