import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container, Grid, Stack } from '@/components/layout';
import { Button } from '@/components/Button';
import { FeatureCard } from '@/components/Card';
import { JsonLd } from '@/components/JsonLd';
import { Section } from '@/components/sections/Section';
import { CTASection } from '@/components/sections/CTASection';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';
import { canonicalFor } from '@/lib/seo/hreflang';
import { getIntelligenceFeatures } from '@/lib/content/source';

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getIntelligenceFeatures()).map((feature) => ({ feature: feature.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ feature: string }>;
}): Promise<Metadata> {
  const { feature: id } = await params;
  const feature = (await getIntelligenceFeatures()).find((candidate) => candidate.id === id);
  if (!feature) return {};

  return {
    title: `${feature.name} | Applied Spatial Intelligence — Luxe Axis`,
    description: `${feature.claim} ${feature.summary}`,
    alternates: canonicalFor(feature.href),
  };
}

export default async function IntelligenceFeaturePage({
  params,
}: {
  params: Promise<{ feature: string }>;
}) {
  const { feature: id } = await params;
  const features = await getIntelligenceFeatures();
  const feature = features.find((candidate) => candidate.id === id);
  if (!feature) notFound();

  const others = features.filter((candidate) => candidate.id !== feature.id);

  // Capability-specific metadata
  const stats =
    feature.id === 'vastu-tech'
      ? [
          { value: '100%', label: 'AI Compass Precision' },
          { value: '< 60s', label: 'Initial Grid Scan' },
          { value: '100%', label: 'Human Architect Verification' },
          { value: '0 Cost', label: 'Included in Design Audit' },
        ]
      : feature.id === 'space-score'
      ? [
          { value: '4 Pillars', label: 'Wellness, Function, Design, Eco' },
          { value: '100 Pt', label: 'Granular Index System' },
          { value: '3D Simulation', label: 'Acoustic & Lighting Map' },
          { value: 'Verified', label: 'Post-Occupancy Audit' },
        ]
      : feature.id === 'space-os'
      ? [
          { value: 'Real-time', label: 'Budget & BOQ Tracking' },
          { value: '4K VR', label: 'Interactive 3D Walkthrough' },
          { value: '24/7', label: 'Client Portal Access' },
          { value: 'Zero', label: 'Hidden Escalations' },
        ]
      : [
          { value: 'Photorealistic', label: '8K V-Ray Render Quality' },
          { value: '48 Hours', label: 'First Render Delivery' },
          { value: 'B2B Ready', label: 'Real Estate Developer Suite' },
          { value: 'Unlimited', label: 'Material Finish Options' },
        ];

  const comparison =
    feature.id === 'vastu-tech'
      ? [
          { traditional: 'Manual paper compass & vague guidelines', luxe: 'Raytraced solar orientation & electromagnetic grid overlay' },
          { traditional: 'Expensive demolition suggested for errors', luxe: 'Non-structural micro-corrections (pyramids, brass & color zoning)' },
          { traditional: 'Subjective interpretations without proof', luxe: 'Favourable zones marked gold, review zones in teal with notes' },
        ]
      : feature.id === 'space-score'
      ? [
          { traditional: 'Guesswork on room acoustics & daylight', luxe: 'Quantified 4-pillar index (Wellness, Function, Aesthetics, Eco)' },
          { traditional: 'Dark spots & harsh lighting glare', luxe: 'Lux-level simulation & circadian color-temperature planning' },
          { traditional: 'Averages away design flaws', luxe: 'Weakest arc identified so effort targets the biggest impact' },
        ]
      : feature.id === 'space-os'
      ? [
          { traditional: 'Paper invoices & unexpected cost overruns', luxe: 'Live digital BOQ budget dashboard updated in real-time' },
          { traditional: 'Visiting dusty construction sites blindly', luxe: 'Daily 3D site progress tracker & 4K VR simulation' },
          { traditional: 'Scattered WhatsApp photos & lost emails', luxe: 'Unified client portal with moodboards, AR & approvals' },
        ]
      : [
          { traditional: 'Costly physical staging with rented furniture', luxe: 'Instant photorealistic 3D virtual staging in 8K resolution' },
          { traditional: 'Static 2D photos that fail to convey space', luxe: 'Interactive 360° VR walkthroughs for prospective buyers' },
          { traditional: 'Fixed styles that cannot be altered', luxe: 'One-click finish swap between Contemporary, Classical & Minimalist' },
        ];

  const faqs = [
    {
      q: `How does ${feature.name} work during my interior design project?`,
      a: `${feature.summary} It integrates directly into your initial CAD floor plan audit and ongoing project tracking.`,
    },
    {
      q: `Is ${feature.name} reviewed by a human architect or interior designer?`,
      a: 'Yes. A licensed senior designer reviews every output and simulation before it reaches you. The software narrows the question; a person answers it.',
    },
    {
      q: `Do I have to pay extra for ${feature.name}?`,
      a: `No. ${feature.name} is included free as part of every Luxe Axis design audit and turnkey execution project.`,
    },
    {
      q: 'Can I access this on my smartphone?',
      a: 'Yes. All Luxe Axis Intelligence tools are fully responsive and accessible via web, tablet, and mobile devices.',
    },
  ];

  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: feature.name,
          applicationCategory: 'DesignApplication',
          description: feature.claim,
          url: feature.href,
        }}
      />

      {/* 1. Hero Stage */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-surface-deep border-b border-border-subtle/40">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-accent/30 via-transparent to-transparent pointer-events-none" />

        <Container>
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-small text-on-surface-3">
              <li><a href="/" className="hover:text-accent transition-colors">Home</a></li>
              <span>/</span>
              <li><a href="/intelligence" className="hover:text-accent transition-colors">Intelligence</a></li>
              <span>/</span>
              <li aria-current="page" className="text-accent font-semibold">{feature.name}</li>
            </ol>
          </nav>

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 w-fit">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                Proprietary Applied Spatial Technology
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.1] tracking-[var(--font-tracking-tight)] text-on-surface font-bold">
              {feature.name} <br />
              <span className="text-accent">Spatial Engine</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2 font-medium leading-relaxed max-w-3xl">
              {feature.claim} {feature.summary}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button as="a" href="/book-audit" size="lg">
                Launch Free {feature.name} Scan
              </Button>
              <Button as="a" href="/pricing" variant="secondary" size="lg">
                View BOQ Cost Engine →
              </Button>
            </div>

            {/* Key Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-border-subtle/50">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <strong className="block font-display text-h3 text-accent font-bold">{stat.value}</strong>
                  <span className="text-overline text-on-surface-3 uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </div>
          </Stack>
        </Container>
      </section>

      {/* 2. Core Reassurance & Claim */}
      <Section
        id="proof-statement"
        eyebrow="Market Reassurance"
        title="Human Expertise + Applied Intelligence"
        lede="The software narrows the question; a licensed designer answers it."
      >
        <div className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 max-w-4xl mx-auto">
          {feature.proof && (
            <div className="p-4 rounded-xl bg-accent/10 border border-accent/30 mb-4">
              <strong className="block font-display text-body text-accent font-bold mb-1">
                Verified Market Claim:
              </strong>
              <p className="text-small text-on-surface font-medium">{feature.proof}</p>
            </div>
          )}
          {feature.humanInTheLoop && (
            <p className="text-small text-on-surface-2 leading-relaxed">
              {feature.humanInTheLoop}
            </p>
          )}
        </div>
      </Section>

      {/* 3. What is Inside */}
      {feature.highlights && feature.highlights.length > 0 && (
        <Section
          id="highlights"
          eyebrow="Capability Architecture"
          title={feature.id === 'space-score' ? 'The Four Evaluated Pillars' : 'What You Get'}
          lede="Engineered into every Luxe Axis project workflow."
        >
          <Grid cols={4} gap={4}>
            {feature.highlights.map((item) => (
              <div key={item} className="lx-liquid-glass rounded-xl p-5 border border-accent/30 text-center">
                <span className="block font-display text-h4 font-bold text-accent mb-1">{item}</span>
                <span className="text-[12px] text-on-surface-3">System Module Active</span>
              </div>
            ))}
          </Grid>
        </Section>
      )}

      {/* 4. Step-by-Step Procedure */}
      {feature.steps && feature.steps.length > 0 && (
        <Section
          id="how-it-works"
          eyebrow="Step-by-Step Procedure"
          title={`How ${feature.name} Operates`}
          lede="From initial floor plan upload to designer verification."
        >
          <Grid cols={2} gap={6}>
            {feature.steps.map((step, idx) => (
              <div key={step.title} className="lx-liquid-glass rounded-xl p-5 border border-accent/30 flex items-start gap-4">
                <span className="font-display text-h2 font-bold text-accent shrink-0">0{idx + 1}</span>
                <div>
                  <h3 className="font-display text-h4 font-bold text-on-surface mb-1">{step.title}</h3>
                  <p className="text-small text-on-surface-2 leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </Grid>
        </Section>
      )}

      {/* 5. Before and After Optimization */}
      <Section
        id="transformation"
        eyebrow="Visual Proof"
        title="Standard Layout vs Intelligence-Optimized Space"
        lede="See how spatial simulation eliminates design bottlenecks before execution."
      >
        <div className="max-w-4xl mx-auto">
          <BeforeAfterSlider
            beforeImage={{
              src: '/images/hero/hero-slide-4.jpg',
              alt: `Un-optimized floor plan layout before ${feature.name}`,
            }}
            afterImage={{
              src: '/images/hero/hero-slide-1.jpg',
              alt: `Completed ${feature.name} optimized space by Luxe Axis`,
            }}
          />
        </div>
      </Section>

      {/* 6. Comparison Matrix */}
      <Section
        id="comparison"
        eyebrow="Why Applied Intelligence Matters"
        title="Traditional Methods vs Luxe Axis Technology"
        lede="Eliminate subjective guesswork with data-backed spatial decisions."
      >
        <div className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 max-w-4xl mx-auto">
          <div className="space-y-4">
            {comparison.map((item) => (
              <div key={item.traditional} className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-border-subtle/40 last:border-0 last:pb-0">
                <div className="p-3 rounded-lg bg-surface-deep/50 border border-border-subtle/50">
                  <span className="text-[10px] uppercase tracking-wider text-on-surface-3 font-bold block mb-1">Traditional Method</span>
                  <p className="text-small text-on-surface-2">{item.traditional}</p>
                </div>
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/30">
                  <span className="text-[10px] uppercase tracking-wider text-accent font-bold block mb-1">Luxe Axis {feature.name}</span>
                  <p className="text-small text-on-surface font-medium">{item.luxe}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 7. Also in Intelligence */}
      <Section
        id="other-features"
        eyebrow="Complete Suite"
        title="The Rest of Our Intelligence Stack"
        lede="Explore the other proprietary capabilities built for your space."
      >
        <Grid cols={3} gap={5}>
          {others.map((other) => (
            <FeatureCard
              key={other.id}
              href={other.href}
              icon={other.icon}
              title={other.name}
              body={other.claim}
            />
          ))}
        </Grid>
      </Section>

      {/* 8. FAQ Accordion */}
      <Section
        id="faq"
        eyebrow="Questions Answered"
        title={`${feature.name} FAQ`}
        lede="Everything you need to know about our applied spatial technology."
      >
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq) => (
            <details key={faq.q} className="group lx-liquid-glass rounded-xl p-4 border border-accent/30">
              <summary className="font-display text-body font-bold text-on-surface cursor-pointer flex items-center justify-between list-none">
                <span>{faq.q}</span>
                <span className="text-accent group-open:rotate-45 transition-transform text-h4">＋</span>
              </summary>
              <p className="text-small text-on-surface-2 mt-3 pt-3 border-t border-border-subtle/40 leading-relaxed">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </Section>

      {/* 9. Conversion CTA Section */}
      <CTASection />
    </main>
  );
}
