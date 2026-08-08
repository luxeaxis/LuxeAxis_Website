import { TestimonialBand } from '@/components/sections/CTASection';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import type { Metadata } from 'next';
import { Container, Grid, Stack } from '@/components/layout';
import { FeatureCard, TierCard } from '@/components/Card';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { FeeCalculator } from '@/components/FeeCalculator';
import { JsonLd } from '@/components/JsonLd';
import { Section } from '@/components/sections/Section';
import { CTASection } from '@/components/sections/CTASection';
import { ProcessSteps } from '@/components/sections/ProcessSteps';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';
import { Faq } from '@/components/Faq';
import { canonicalFor } from '@/lib/seo/hreflang';
import { serviceJsonLd } from '@/lib/seo/jsonLd';
import {
  getCalculatorConfig,
  getFaqs,
  getTiers,
  getTestimonials,
} from '@/lib/content/source';

const ROUTE = '/residential';

export const metadata: Metadata = {
  title: 'Turnkey Residential Interior Design in Chennai | Luxe Axis',
  description:
    'Three transparent investment tiers and 13 specialized service disciplines for complete home interiors, modular kitchens, wardrobes, and luxury villas in Chennai.',
  alternates: canonicalFor(ROUTE),
};

export default async function ResidentialPage() {
  const [tiers, calculatorConfig, faqs] = await Promise.all([
    getTiers(),
    getCalculatorConfig(),
    getFaqs(),
  ]);
  const allPriced = tiers.every((tier) => tier.priceFrom !== null);

  const highlights = [
    { title: '₹1,800 / sq.ft', desc: 'Starting Rate Card' },
    { title: '45-Day Handover', desc: 'Guaranteed On-Time Handover' },
    { title: 'Blum & Hafele', desc: '100% German Hardware' },
    { title: 'BWP Marine Ply', desc: 'Boiling Water & Termite Proof' },
    { title: 'Flat 10-Year Warranty', desc: 'Zero Fine Print Guarantee' },
  ];

  const comparisons = [
    {
      feature: 'Wood & Ply Core',
      generic: 'Commercial Grade (MR) Ply subject to water swelling',
      luxeaxis: '100% Boiling Water Proof (BWP) IS:710 Marine Plywood',
    },
    {
      feature: 'Hardware & Fittings',
      generic: 'Unbranded local hinges subject to rust and sagging',
      luxeaxis: 'Blum & Hafele soft-close hinges with lifetime warranty',
    },
    {
      feature: 'Pricing Transparency',
      generic: 'Rough square-footage estimate with 25%+ cost escalation',
      luxeaxis: 'Itemized component BOQ locked in contract',
    },
    {
      feature: 'Delivery Commitment',
      generic: 'Unpredictable delays with zero financial compensation',
      luxeaxis: 'Contractual 45-day handover guarantee',
    },
    {
      feature: 'Warranty',
      generic: '1-year oral promise without written service backing',
      luxeaxis: 'Flat 10-year structural warranty backed by studio SLA',
    },
  ];

  const testimonials = await getTestimonials();

  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={serviceJsonLd({
          name: 'Residential interior design',
          description:
            'Three tiers of residential interior design in Chennai, stated openly with what each one includes.',
          url: ROUTE,
        })}
      />

      {/* 1. Hero Stage & Breadcrumbs */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-surface-deep border-b border-border-subtle/40">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-accent/30 via-transparent to-transparent pointer-events-none" />

        <Container>
          <Breadcrumbs path="/residential" />

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 w-fit">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                Turnkey Residential Architectural Studio
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.1] tracking-[var(--font-tracking-tight)] text-on-surface font-bold">
              Turnkey Residential <br />
              <span className="text-accent">Interior Design in Chennai</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2 font-medium leading-relaxed max-w-3xl">
              Three structured investment tiers and 13 specialized service
              disciplines for complete home interiors, modular kitchens,
              wardrobes, and luxury villas. Stated openly with transparent
              itemized pricing, factory-direct manufacturing, and a 10-year flat
              structural warranty.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button as="a" href="/book-audit" size="lg">
                Book Free Design Audit
              </Button>
              <Button as="a" href="#calculator" variant="secondary" size="lg">
                Estimate Project Budget →
              </Button>
            </div>

            {/* Key Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-8 border-t border-border-subtle/50">
              {highlights.map((h) => (
                <div
                  key={h.title}
                  className="p-4 rounded-xl lx-liquid-glass-card border border-accent/20"
                >
                  <strong className="block font-display text-h3 text-accent font-bold">
                    {h.title}
                  </strong>
                  <span className="text-overline text-on-surface-muted uppercase tracking-wider font-semibold">
                    {h.desc}
                  </span>
                </div>
              ))}
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

      {/* 3. Investment Tiers Grid */}
      <Section
        id="tiers"
        eyebrow="Structured Investment Tiers"
        title="Three Tiers of Residential Fit-Out"
        lede="Every tier includes design, drawings, and a Vastu-Tech check. They differ in materials, joinery finishes, and scope of studio delivery."
      >
        <Grid cols={3} gap={5}>
          {tiers.map((tier) =>
            allPriced && tier.priceFrom !== null ? (
              <TierCard
                key={tier.id}
                name={tier.name}
                price={{ amount: tier.priceFrom, period: 'onwards' }}
                inclusions={tier.inclusions}
                cta={{
                  label: 'See ' + tier.name,
                  href: `/residential/${tier.id}`,
                }}
                recommended={tier.recommended}
              />
            ) : (
              <FeatureCard
                key={tier.id}
                href={`/residential/${tier.id}`}
                title={tier.name}
                body={tier.summary}
              />
            ),
          )}
        </Grid>
      </Section>

      {/* 4. Specialized Services Catalogue */}
      <Section
        id="services-catalogue"
        eyebrow="Specialized Services"
        title="Residential Services Catalogue"
        lede="Explore our dedicated architectural interior design disciplines, from modular kitchens and walk-in suites to sacred mandaps and 3D VR visualization."
      >
        <Grid cols={3} gap={6}>
          {[
            {
              title: 'Complete Home Interiors',
              href: '/residential/home-interiors',
              body: 'Turnkey architectural interior design, bespoke joinery, and Vastu-Tech spatial engineering for complete residences.',
            },
            {
              title: 'Modular Kitchens',
              href: '/residential/modular-kitchen',
              body: 'Ergonomic culinary spaces with Blum soft-close hardware, quartz countertops, and anti-termite marine ply.',
            },
            {
              title: 'Bedroom Design',
              href: '/residential/bedroom',
              body: 'Restful master sanctuaries featuring acoustic wall panelling, walk-in closets, and circadian LED lighting.',
            },
            {
              title: 'Living Room Interiors',
              href: '/residential/living-room',
              body: 'Statement TV feature walls, sintered stone cladding, false ceiling coves, and fluid open-plan layouts.',
            },
            {
              title: 'Pooja Room Mandaps',
              href: '/residential/pooja-room',
              body: 'Vastu-Tech verified sacred spaces with CNC teak lattice doors, brass inlays, and backlit onyx stone.',
            },
            {
              title: 'Apartment Interiors',
              href: '/residential/apartments',
              body: 'Space-optimized 2BHK/3BHK luxury planning with multi-functional storage walls and live Space OS tracking.',
            },
            {
              title: 'Home Renovation',
              href: '/residential/renovation',
              body: 'Structural wall alterations, MEP rewiring, civil remodeling, and modern luxury interior overhauls.',
            },
            {
              title: 'Kitchen Cabinetry',
              href: '/residential/kitchen-cabinets',
              body: 'Factory-finished acrylic, lacquered glass, ceramic, and PU painted cabinet joinery.',
            },
            {
              title: 'Wardrobe Suites',
              href: '/residential/wardrobe',
              body: 'Custom walk-in dressing suites, sliding glass doors, built-in organizers, and motion LED lighting.',
            },
            {
              title: 'TV & Media Consoles',
              href: '/residential/tv-unit',
              body: 'Floating cantilevered consoles, acoustic soundbar integration, and stone wall feature paneling.',
            },
            {
              title: 'Architectural False Ceilings',
              href: '/residential/false-ceiling',
              body: 'Gyproc plasterboard ceilings, magnetic light tracks, anti-glare spotlights, and perimeter coves.',
            },
            {
              title: '3D Spatial OS',
              href: '/residential/3d-design',
              body: 'Photorealistic 4K renders, 360-degree VR walkthroughs, and real-time material previews.',
            },
            {
              title: 'Ultra-Luxury Interiors',
              href: '/residential/luxury',
              body: 'Uncompromising villa & penthouse design with imported Italian marble, liquid metal, and Crestron automation.',
            },
          ].map((service) => (
            <FeatureCard
              key={service.href}
              href={service.href}
              title={service.title}
              body={service.body}
            />
          ))}
        </Grid>
      </Section>

      {/* 5. Interactive Fee Calculator */}
      <Section
        id="calculator"
        eyebrow="Instant Project Budget"
        title="Estimate Your Residential Project"
        lede="Two inputs, an instant price band. No email gate and no mandatory callback before you find out what it costs."
      >
        <div className="max-w-measure">
          {calculatorConfig ? (
            <FeeCalculator config={calculatorConfig} />
          ) : (
            <EmptyState
              icon="gauge"
              title="The fee calculator is not live yet"
              body="We publish our rates rather than quoting privately, and the calculator goes up as soon as the current rate card is signed off. Ask us for an indicative figure in the meantime."
              headingAs="h3"
              action={
                <Button as="a" href="/book-audit" variant="secondary">
                  Book an audit
                </Button>
              }
            />
          )}
        </div>
      </Section>

      {/* 6. Comparison Matrix */}
      <Section
        id="comparison"
        eyebrow="The Luxe Axis Standard"
        title="Luxe Axis vs Generic Interior Contractors"
        lede="How our factory-manufactured architectural fit-outs compare with traditional local contractors."
      >
        <div className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 overflow-x-auto">
          <table className="w-full text-left text-small">
            <thead>
              <tr className="border-b border-border-subtle/60 text-accent font-display text-body font-bold">
                <th className="py-3 px-4">Feature</th>
                <th className="py-3 px-4">Generic Local Contractors</th>
                <th className="py-3 px-4 text-accent bg-accent/10 rounded-t-lg">
                  Luxe Axis Residential Studio
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
        eyebrow="Real Transformation"
        title="Chennai Residence Makeover"
        lede="Side-by-side comparison of a 3BHK flat in Nungambakkam before and after turnkey Luxe Axis interior fit-out."
      >
        <div className="max-w-4xl mx-auto">
          <BeforeAfterSlider
            beforeImage={{
              src: '/posters/persona-router.avif',
              alt: 'Bare shell 3BHK flat before interior fit-out',
            }}
            afterImage={{
              src: '/posters/portfolio.avif',
              alt: 'Completed luxury 3BHK residential interior in Chennai',
            }}
          />
        </div>
      </Section>

      {/* 8. 5-Step Process */}
      <ProcessSteps />

      {/* 9. Verified Homeowner Testimonials */}
      <TestimonialBand testimonials={testimonials} />

      {/* 10. FAQ Accordion */}
      <Section
        id="faq"
        eyebrow="Questions Answered"
        title="Residential Interior FAQ"
      >
        <Faq items={faqs} />
      </Section>

      {/* 11. Conversion CTA Section */}
      <CTASection />
    </main>
  );
}
