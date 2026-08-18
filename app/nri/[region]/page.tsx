import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container, Grid, Stack } from '@/components/layout';
import { Button } from '@/components/Button';
import { InlineAlert } from '@/components/InlineAlert';
import { ToBePublished } from '@/components/ToBePublished';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Section } from '@/components/sections/Section';
import { CTASection, TestimonialBand } from '@/components/sections/CTASection';
import { ProcessSteps } from '@/components/sections/ProcessSteps';
import { Faq, FaqJsonLd } from '@/components/Faq';
import { canonicalFor } from '@/lib/seo/hreflang';
import { getFaqs, getNriRegions, getTestimonials } from '@/lib/content/source';
import { STUDIO, whatsappHref } from '@/lib/content/studio';
import { HeroBackground } from '@/components/sections/HeroBackground';
import { heroSlidesForNriRegion } from '@/lib/content/heroSlides';

/**
 * `/nri/[region]` (Spec §2.2: `/nri/singapore /uae /usa /uk /canada
 * /australia`).
 *
 * Six prerendered region pages. The only genuinely region-specific fact the
 * studio has supplied is the region itself, so the page earns its existence by
 * computing something real from it: the current time in Chennai next to the
 * current time where the visitor is.
 *
 * That is not decoration. §2.1's NRI objection is "can I run a Chennai project
 * from abroad?", and the concrete form of that worry is "will I be on calls at
 * 3am". Showing both clocks answers it with arithmetic rather than reassurance.
 *
 * ## Why the times are computed at request time, not baked in
 *
 * `Intl.DateTimeFormat` with an IANA zone handles daylight saving on both
 * sides; a stored UTC offset would be silently wrong for several of these
 * regions for half of every year — and wrong in exactly the season a visitor
 * checks it. `dynamic = 'force-dynamic'` is the cost of that: these six pages
 * are server-rendered per request rather than prerendered, which is the right
 * trade for a fact whose whole value is being currently true.
 */
export const dynamicParams = false;
export const dynamic = 'force-dynamic';

const CHENNAI = 'Asia/Kolkata';

export async function generateStaticParams() {
  return (await getNriRegions()).map((region) => ({ region: region.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string }>;
}): Promise<Metadata> {
  const { region: slug } = await params;
  const region = (await getNriRegions()).find(
    (candidate) => candidate.slug === slug,
  );
  if (!region) return {};

  const pageTitle = `Turnkey Chennai Interior Design from ${region.name} | Luxe Axis NRI Studio`;
  const pageDesc = `Remote luxury interior design in Chennai for homeowners in ${region.name}. 3D VR audits in your local time zone, live 4K site cameras, un-gated BOQs, and 10-year warranty.`;

  return {
    title: pageTitle,
    description: pageDesc,
    keywords: [
      `nri interior design chennai from ${region.name.toLowerCase()}`,
      `chennai home interiors ${region.name.toLowerCase()} nri`,
      'remote turnkey interior design chennai',
      'nri villa construction management chennai',
    ],
    alternates: canonicalFor(`/nri/${region.slug}`),
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      url: canonicalFor(`/nri/${region.slug}`).canonical,
      images: [
        {
          url:
            region.slug === 'singapore'
              ? '/posters/nri-singapore-hero.png'
              : '/posters/nri-hub-hero.png',
          width: 1200,
          height: 630,
          alt: `Luxe Axis NRI Turnkey Interior Design from ${region.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDesc,
      images: [
        region.slug === 'singapore'
          ? '/posters/nri-singapore-hero.png'
          : '/posters/nri-hub-hero.png',
      ],
    },
  };
}

/** Time of day in an IANA zone, as a visitor would read it. */
function timeIn(timeZone: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date());
}

export default async function NriRegionPage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region: slug } = await params;
  const [regions, faqs, testimonials] = await Promise.all([
    getNriRegions(),
    getFaqs(),
    getTestimonials(),
  ]);

  const region = regions.find((candidate) => candidate.slug === slug);
  if (!region) notFound();

  const nriFaqs = [...faqs].sort((a, b) =>
    a.id === 'abroad' ? -1 : b.id === 'abroad' ? 1 : 0,
  );

  const highlights = [
    {
      title: `${region.name} Timezone`,
      desc: 'Reviews Scheduled in Your Local Time',
    },
    {
      title: 'Space OS 4K Portal',
      desc: 'Live Camera Streams & Spend Ledgers',
    },
    { title: 'Principal Lead', desc: 'Dedicated Senior Site Architect' },
    { title: 'Fixed BOQ Contract', desc: 'Zero Price Escalation Guarantee' },
    {
      title: '10-Year Warranty',
      desc: 'Comprehensive Structural & Joinery Cover',
    },
  ];

  const protocolPillars = [
    {
      num: '01',
      title: `${region.name} Timezone-Matched Reviews`,
      desc: `3D VR walkthroughs scheduled at hours convenient for ${region.name} local time without taking work leave or interrupting your day.`,
    },
    {
      num: '02',
      title: 'Space OS 4K Live Site Tracking',
      desc: 'Continuous HD site camera streams, daily photo logs of fit-out progress, and real-time financial drawdown ledgers accessible via iOS/Android app.',
    },
    {
      num: '03',
      title: 'Dispatched Material Sample Kits',
      desc: `Physical material boards (Italian marble swatches, veneer finishes, brass accents) dispatched directly to your address in ${region.name} for tactile approval.`,
    },
    {
      num: '04',
      title: 'White-Glove Turnkey Keys Handover',
      desc: 'Deep cleaning, medical-grade air purification, appliance integration, and fresh linens so your home is 100% ready when you land in Chennai.',
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
      whiteglove: `Scheduled 3D VR walkthroughs in ${region.name} local timezone`,
    },
    {
      feature: 'Budget Control',
      traditional: 'Opaque verbal quotes with 20–40% cost overruns',
      whiteglove: 'Fixed contractual BOQ with zero cost escalation',
    },
    {
      feature: 'Material Sourcing',
      traditional: 'Local shop visits required in person during short trips',
      whiteglove: `Physical material sample kits delivered to your door in ${region.name}`,
    },
    {
      feature: 'Quality Assurance',
      traditional: 'Unchecked joinery finish & uneven tile alignment',
      whiteglove:
        'Laser-guided precision leveling & factory-controlled joinery',
    },
    {
      feature: 'Handover State',
      traditional: 'Dusty construction site requiring week-long cleaning',
      whiteglove: 'Deep cleaned, air-purified, fully turn-key move-in ready',
    },
  ];

  return (
    <main id="main" tabIndex={-1}>
      <FaqJsonLd items={nriFaqs} />

      {/* 1. Hero Stage with Ken Burns Background */}
      <section className="relative overflow-hidden pt-12 pb-16 min-h-[82vh] flex flex-col justify-center bg-surface-deep border-b border-border-subtle/40 isolate">
        {/* Full-Bleed Background Image with Ken Burns Effect */}
        <HeroBackground slides={heroSlidesForNriRegion(region.slug)} overlay="dots" />

        <Container className="relative z-10">
          <Breadcrumbs
            path={`/nri/${region.slug}`}
            labels={{ nri: 'NRI Remote Design', [region.slug]: region.name }}
          />

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/40 w-fit backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                Turnkey Remote Protocol • {region.name} Hub
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.08] tracking-[var(--font-tracking-tight)] text-on-surface font-bold drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              Designing Your Chennai Home <br />
              <span className="text-accent">From {region.name}</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface font-medium leading-relaxed max-w-3xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Remote luxury interior design and turnkey fit-outs built
              specifically for clients residing in {region.name}. Design reviews
              happen over 3D VR video calls in your time zone, with live 4K site
              feeds, digital and physical material sample kits, and spend
              ledgers in Space OS.
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
                  {region.name}
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Local Timezone
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

      {/* 3. Live Timezone Synchronization Section */}
      <Section
        id="timing"
        eyebrow="Timezone Synchronization"
        title={`What a Review Call Looks Like from ${region.name}`}
        lede="Reviews are scheduled to suit your end of the day, not ours. Compare current local times side by side."
      >
        <div className="grid max-w-4xl mx-auto grid-cols-1 md:grid-cols-2 gap-6">
          <div className="lx-liquid-glass-card rounded-2xl p-6 border border-accent/40 text-center">
            <p className="text-overline text-accent font-bold uppercase tracking-wider mb-2">
              📍 {region.name} Local Time
            </p>
            <p className="font-mono text-display font-bold text-on-surface tabular-nums">
              {timeIn(region.timeZone)}
            </p>
            <p className="text-small text-on-surface-muted mt-3 pt-3 border-t border-border-subtle/40">
              Reviews scheduled during your evening or weekend mornings
            </p>
          </div>

          <div className="lx-liquid-glass-card rounded-2xl p-6 border border-accent/40 text-center">
            <p className="text-overline text-accent font-bold uppercase tracking-wider mb-2">
              🏢 Chennai On-Ground Studio
            </p>
            <p className="font-mono text-display font-bold text-on-surface tabular-nums">
              {timeIn(CHENNAI)}
            </p>
            <p className="text-small text-on-surface-muted mt-3 pt-3 border-t border-border-subtle/40">
              Active site managers on ground supervising fit-out work
            </p>
          </div>
        </div>
      </Section>

      {/* 4. White-Glove Remote Protocol */}
      <Section
        id="protocol"
        eyebrow="Remote Architecture"
        title={`The ${region.name} Remote Protocol`}
        lede="Four operational commitments that make remote execution stress-free from abroad."
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
        title="Traditional Remote Supervision vs White-Glove Protocol"
        lede="How our structured protocol eliminates the risk of managing a project from abroad."
      >
        <div className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 overflow-x-auto">
          <table className="w-full text-left text-small">
            <thead>
              <tr className="border-b border-border-subtle/60 text-accent font-display text-body font-bold">
                <th className="py-3 px-4">Dimension</th>
                <th className="py-3 px-4">Traditional Remote Supervision</th>
                <th className="py-3 px-4 text-accent bg-accent/10 rounded-t-lg">
                  Luxe Axis White-Glove Protocol
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

      {/* 6. Payment Information */}
      <Section
        id="paying"
        eyebrow="Financial Governance"
        title={`Paying from ${region.name}`}
        lede="Transparent pricing with zero hidden currency surprises or escalation fees."
      >
        <div className="max-w-measure mx-auto">
          {/* T-18 asks for a "multi-currency note". What the studio actually
              accepts from each region is a finance question nobody has
              answered, and payment terms are precisely the wrong thing to
              guess at — a visitor could act on it. Named as outstanding. */}
          <InlineAlert
            tone="info"
            title={`Accepted payment routes for ${region.name}`}
          >
            <ToBePublished
              label={`Verified international bank wire & escrow routes for ${region.name}`}
            />
          </InlineAlert>
        </div>
      </Section>

      {/* A "Remote Project Result" section stood here, captioned "Adyar Villa
          Remote Transformation" and introduced as a real villa executed while
          the client lived abroad. Its before/after slider pointed at
          persona-router.avif and portfolio.avif — two of the 324-byte
          solid-tone placeholders described in lib/content/posters.ts. A named
          case study is the strongest claim on this page, and it cannot be the
          one section rendered from stubs. It returns when the studio's own
          photography of that project does. */}

      {/* 7. Process Steps */}
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
