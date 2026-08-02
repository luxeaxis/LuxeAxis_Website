import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container, Stack } from '@/components/layout';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { ToBePublished } from '@/components/ToBePublished';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { Section } from '@/components/sections/Section';
import { CTASection } from '@/components/sections/CTASection';
import { canonicalFor } from '@/lib/seo/hreflang';
import { serviceJsonLd } from '@/lib/seo/jsonLd';
import { COMMERCIAL_VERTICALS } from '@/lib/content/commercial';

/**
 * `/commercial/[vertical]` — Workplace, Retail & Hospitality, Healthcare
 * (Spec §2.2).
 *
 * Each page leads with what that sector actually fails on rather than what the
 * studio offers, because a commercial buyer is diagnosing before they are
 * shopping. The concerns are facts about the sector, not claims about the
 * studio's track record — that distinction is the whole reason this page can be
 * written at all without any commercial case studies to hand.
 *
 * Sector experience IS the thing a buyer wants next, and it is exactly what
 * nobody has supplied, so it is named as outstanding rather than implied.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  return COMMERCIAL_VERTICALS.map((vertical) => ({ vertical: vertical.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ vertical: string }>;
}): Promise<Metadata> {
  const { vertical: slug } = await params;
  const vertical = COMMERCIAL_VERTICALS.find((candidate) => candidate.slug === slug);
  if (!vertical) return {};

  return {
    title: `${vertical.name} interiors in Chennai — Luxe Axis`,
    description: vertical.summary,
    alternates: canonicalFor(`/commercial/${vertical.slug}`),
  };
}

export default async function CommercialVerticalPage({
  params,
}: {
  params: Promise<{ vertical: string }>;
}) {
  const { vertical: slug } = await params;
  const vertical = COMMERCIAL_VERTICALS.find((candidate) => candidate.slug === slug);
  if (!vertical) notFound();

  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={serviceJsonLd({
          name: `${vertical.name} interior design`,
          description: vertical.summary,
          url: `/commercial/${vertical.slug}`,
        })}
      />

      <Container className="py-section-y">
        <Stack gap={5} className="max-w-measure">
          <Breadcrumbs
            path={`/commercial/${vertical.slug}`}
            labels={{ [vertical.slug]: vertical.name }}
          />
          <p className="font-ui text-overline uppercase tracking-[var(--font-tracking-wider)] text-accent">
            Commercial
          </p>
          <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-tight tracking-[var(--font-tracking-tight)] text-on-surface">
            {vertical.name}
          </h1>
          <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2">
            {vertical.summary}
          </p>
          <div>
            <Button as="a" href="/book-audit" size="lg">
              Request a consult
            </Button>
          </div>
        </Stack>
      </Container>

      <Section
        id="constraints"
        eyebrow="What this sector fails on"
        title="The constraints we design against"
        lede="Not a feature list — the things that make this kind of space work or not work once it is open."
      >
        <ul className="flex max-w-measure flex-col gap-3">
          {vertical.concerns.map((concern) => (
            <li key={concern} className="flex items-start gap-3 text-on-surface-2">
              <Icon name="check" size="sm" decorative className="mt-1 shrink-0 text-accent" />
              <span>{concern}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="experience"
        eyebrow="Our record here"
        title={`${vertical.name} work we have delivered`}
        lede="The question a commercial buyer asks second, after whether we understand the brief."
      >
        <p className="max-w-measure text-small">
          <ToBePublished label={`${vertical.name} case studies and references`} />
        </p>
      </Section>

      <CTASection />
    </main>
  );
}
