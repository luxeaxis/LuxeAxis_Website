import { Breadcrumbs } from '@/components/Breadcrumbs';
import type { Metadata } from 'next';
import { Container, Grid, Stack } from '@/components/layout';
import { Button } from '@/components/Button';
import { JsonLd } from '@/components/JsonLd';
import { LegalDocument } from '@/components/LegalDocument';
import { Section } from '@/components/sections/Section';
import { CTASection } from '@/components/sections/CTASection';
import { Faq } from '@/components/Faq';
import { canonicalFor } from '@/lib/seo/hreflang';
import { loadLegalDocument } from '@/lib/legal/document';
import { getFaqs } from '@/lib/content/source';

const ROUTE = '/terms';

export const metadata: Metadata = {
  title: 'Terms of Service — Luxe Axis',
  description:
    'The terms governing the Luxe Axis website, Space OS, and our design, execution, subscription and marketplace services.',
  alternates: canonicalFor(ROUTE),
};

export default async function TermsPage() {
  const document = loadLegalDocument('LuxeAxis_TermsOfService.md');
  const faqs = await getFaqs();
  const termsFaqs = [...faqs].filter(
    (f) => f.id === 'contractors' || f.id === 'materials' || f.id === 'abroad',
  );

  const highlights = [
    { title: 'Fixed BOQ Lock', desc: 'Zero Cost Escalation Contract' },
    { title: '45-Day Handover', desc: 'Contractual Delivery SLA' },
    { title: '10-Yr Warranty', desc: 'Flat Structural Coverage' },
    { title: 'Escrow Payments', desc: 'Milestone Financial Security' },
    { title: 'Space OS', desc: 'Digital Governance Portal' },
  ];

  const governancePillars = [
    {
      title: 'Itemized BOQ Price Lock',
      desc: 'Our contracts feature component-by-component price locks preventing mid-project cost escalations.',
    },
    {
      title: '45-Day Handover SLA',
      desc: 'Contractual delivery timelines backed by daily Space OS tracking and penalty clauses for delay.',
    },
    {
      title: 'Flat 10-Year Structural Warranty',
      desc: 'Written structural warranty covering marine BWP plywood cores, German joinery, and hardware.',
    },
    {
      title: 'Milestone Escrow Protection',
      desc: 'Funds are released incrementally upon physical site verification and digital milestone signoffs.',
    },
  ];

  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Terms of Service — Luxe Axis',
          description:
            'The terms governing Luxe Axis services, Space OS, and project execution.',
          url: ROUTE,
        }}
      />

      {/* 1. Hero Stage & Breadcrumbs */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-surface-deep border-b border-border-subtle/40">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-accent/30 via-transparent to-transparent pointer-events-none" />

        <Container>
          <Breadcrumbs path="/terms" labels={{ terms: 'Terms of Service' }} />

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 w-fit">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                Contractual Governance & Terms
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.1] tracking-[var(--font-tracking-tight)] text-on-surface font-bold">
              Terms of Service & <br />
              <span className="text-accent">Project Governance</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2 font-medium leading-relaxed max-w-3xl">
              The contractual terms governing the Luxe Axis website, Space OS
              client portal, project execution SLAs, itemized BOQ price locks,
              and 10-year flat structural warranty.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button as="a" href="#document" size="lg">
                Read Full Terms ↓
              </Button>
              <Button as="a" href="/book-audit" variant="secondary" size="lg">
                Book Free Design Audit →
              </Button>
            </div>

            {/* Key Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-8 border-t border-border-subtle/50">
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
                  0%
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Price Escalation
                </span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  45 Days
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Handover SLA
                </span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  Space OS
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Governance
                </span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  100%
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Contractual
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

      {/* 3. Governance Pillars */}
      <Section
        id="pillars"
        eyebrow="Contractual Rights"
        title="Key Governance Commitments"
        lede="How our contracts protect homeowner investment and project timelines."
      >
        <Grid cols={2} gap={6}>
          {governancePillars.map((pillar) => (
            <div
              key={pillar.title}
              className="lx-liquid-glass rounded-2xl p-6 border border-accent/30"
            >
              <h3 className="font-display text-h4 font-bold text-on-surface mb-2">
                {pillar.title}
              </h3>
              <p className="text-small text-on-surface-2 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 4. Official Legal Document Section */}
      <Section
        id="document"
        eyebrow="Statutory Document"
        title="Full Terms of Service Clauses"
        lede="The complete legal text governing project execution and digital services."
      >
        <div className="lx-liquid-glass rounded-2xl p-8 border border-accent/30 max-w-4xl mx-auto">
          <LegalDocument document={document} />
        </div>
      </Section>

      {/* 5. FAQ Accordion */}
      <Section
        id="faq"
        eyebrow="Questions Answered"
        title="Terms & Governance FAQ"
      >
        <Faq items={termsFaqs} />
      </Section>

      {/* 6. Conversion CTA Section */}
      <CTASection />
    </main>
  );
}
