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
import { HeroBackground } from '@/components/sections/HeroBackground';
import { PRIVACY_HERO_SLIDES } from '@/lib/content/heroSlides';
import { loadLegalDocument } from '@/lib/legal/document';
import { getFaqs } from '@/lib/content/source';

const ROUTE = '/privacy';

export const metadata: Metadata = {
  title: 'Privacy Policy — Luxe Axis',
  description:
    'How Luxe Axis collects, uses, shares and protects your personal data under the Digital Personal Data Protection Act, 2023.',
  alternates: canonicalFor(ROUTE),
};

export default async function PrivacyPage() {
  const document = loadLegalDocument('LuxeAxis_PrivacyPolicy.md');
  const faqs = await getFaqs();
  const privacyFaqs = [...faqs].filter(
    (f) => f.id === 'contractors' || f.id === 'materials' || f.id === 'abroad',
  );

  const highlights = [
    { title: 'DPDP 2023', desc: 'Digital Data Act Compliant' },
    { title: '256-Bit SSL', desc: 'Encrypted Data Storage' },
    { title: 'Zero Selling', desc: 'No Third-Party Data Sales' },
    { title: 'Space OS Secure', desc: 'Protected Client Feeds' },
    { title: 'Data Rights', desc: 'Right to Access & Erase' },
  ];

  const dataPillars = [
    {
      title: 'Zero Third-Party Data Sales',
      desc: 'We never sell, rent, or monetize your contact details, floorplans, or spatial preferences to external advertisers.',
    },
    {
      title: '256-Bit Encrypted Storage',
      desc: 'All project CAD files, BOQ estimates, and client communications are encrypted in transit and at rest.',
    },
    {
      title: 'Explicit Consent Protocol',
      desc: 'We collect data strictly necessary to schedule audits, manufacture joinery, and deliver turnkey projects.',
    },
    {
      title: 'Data Principal Rights',
      desc: 'Under DPDP Act 2023, you retain full rights to request data access, correction, or permanent erasure.',
    },
  ];

  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Privacy Policy — Luxe Axis',
          description:
            'How Luxe Axis collects, uses, shares and protects your personal data.',
          url: ROUTE,
        }}
      />

      {/* 1. Hero Stage & Breadcrumbs with Ken Burns Background */}
      <section className="relative overflow-hidden pt-12 pb-16 min-h-[82vh] flex flex-col justify-center bg-surface-deep border-b border-border-subtle/40 isolate">
        <HeroBackground slides={PRIVACY_HERO_SLIDES} overlay="grid" />

        <Container className="relative z-10">
          <Breadcrumbs path="/privacy" labels={{ privacy: 'Privacy Policy' }} />

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/40 w-fit backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                DPDP Act 2023 Statutory Statement
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.08] tracking-[var(--font-tracking-tight)] text-on-surface font-bold drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              Digital Personal Data <br />
              <span className="text-accent">Protection Statement</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface font-medium leading-relaxed max-w-3xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Luxe Axis Private Limited operates as a Data Fiduciary under the
              Digital Personal Data Protection Act, 2023 (DPDP Act). We process
              personal, financial, and spatial floorplan data strictly with explicit
              consent and for specified architectural delivery purposes.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button as="a" href="#statutory-statement" size="lg" className="shadow-2xl">
                View DPDPA Summary ↓
              </Button>
              <Button
                as="a"
                href="#document"
                variant="secondary"
                size="lg"
                className="bg-surface-raised/90 border border-accent/30 backdrop-blur-md"
              >
                Read Statutory Clauses →
              </Button>
            </div>

            {/* Key Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-8 border-t border-border-subtle/50">
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  DPDP 2023
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Act Compliant
                </span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  256-Bit
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  SSL Encryption
                </span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  0%
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Data Sales
                </span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  Space OS
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Secure Portal
                </span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  100%
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Transparent
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

      {/* Statutory DPDPA Statement Callout Box */}
      <Section
        id="statutory-statement"
        eyebrow="DPDP Act 2023 Notice"
        title="Statutory Digital Personal Data Protection Statement"
        lede="Notice to all Data Principals under Section 5 & 6 of the Digital Personal Data Protection Act, 2023."
      >
        <div className="lx-liquid-glass rounded-2xl p-8 border border-accent/40 max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border-subtle/50">
            <span className="px-3 py-1 rounded bg-accent/20 text-accent font-mono text-small font-bold">
              Data Fiduciary: Luxe Axis Private Limited
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-small text-on-surface-2 leading-relaxed">
            <div className="space-y-3">
              <h4 className="font-display text-h4 font-bold text-on-surface">
                1. Purpose Limitation & Notice
              </h4>
              <p>
                Personal data collected (including name, contact details, project property address, and floorplans) is processed exclusively to deliver interior design, 3D CAD modeling, BOQ estimation, and turnkey site execution.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-display text-h4 font-bold text-on-surface">
                2. Explicit Free & Informed Consent
              </h4>
              <p>
                No enquiry or Space OS registration form pre-ticks consent. You may withdraw consent at any time without penalty by emailing <strong className="text-accent font-semibold">privacy@luxeaxis.in</strong>.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-display text-h4 font-bold text-on-surface">
                3. Data Principal Statutory Rights
              </h4>
              <p>
                You retain statutory rights under DPDP Act 2023 to request summary access of processed data, request correction or updating of inaccurate records, and request complete data erasure upon project completion.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-display text-h4 font-bold text-on-surface">
                4. Statutory Grievance Redressal
              </h4>
              <p>
                Grievance Officer: <strong className="text-on-surface font-semibold">Data Protection Lead</strong><br />
                Direct Email: <strong className="text-accent font-semibold">grievance@luxeaxis.in</strong><br />
                Response SLA: Acknowledged within 48 hours.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* 3. Data Protection Pillars */}
      <Section
        id="pillars"
        eyebrow="Privacy Guarantees"
        title="Four Pillars of Data Protection"
        lede="How we safeguard your personal details and architectural floorplans."
      >
        <Grid cols={2} gap={6}>
          {dataPillars.map((pillar) => (
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
        title="Full Privacy Policy Clauses"
        lede="The authoritative text drafted in accordance with DPDP Act 2023."
      >
        <div className="lx-liquid-glass rounded-2xl p-8 border border-accent/30 max-w-4xl mx-auto">
          <LegalDocument document={document} />
        </div>
      </Section>

      {/* 5. FAQ Accordion */}
      <Section
        id="faq"
        eyebrow="Questions Answered"
        title="Privacy & Security FAQ"
      >
        <Faq items={privacyFaqs} />
      </Section>

      {/* 6. Conversion CTA Section */}
      <CTASection />
    </main>
  );
}
