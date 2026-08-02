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
import { COMMERCIAL_VERTICALS, ratesFor } from '@/lib/content/commercial';
import { formatBand, formatRupees } from '@/lib/pricing/estimate';

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
  const rates = ratesFor(vertical.slug);

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

      {rates.length > 0 && (
        <Section
          id="rates"
          eyebrow="What it costs"
          title="Published rates"
          lede="Stated openly, the same way our residential pricing is. A commercial buyer is quoted all of these — finding out about any of them late is how a relationship starts badly."
        >
          {/* A real table: this is tabular data with three or four figures per
              row, and a screen-reader user navigating it by column header is
              the whole reason `<th scope>` exists. Scrolls inside its own
              container on narrow screens rather than making the page scroll
              sideways. */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[40rem] border-collapse text-small">
              <caption className="sr-only">
                Published {vertical.name} rates by segment
              </caption>
              <thead>
                <tr className="border-b-hairline border-border-subtle text-left text-on-surface-muted">
                  <th scope="col" className="py-3 pr-4 font-ui font-medium">
                    Segment
                  </th>
                  <th scope="col" className="py-3 pr-4 font-ui font-medium">
                    Typical area
                  </th>
                  <th scope="col" className="py-3 pr-4 font-ui font-medium">
                    Build rate
                  </th>
                  <th scope="col" className="py-3 font-ui font-medium">
                    Our design fee
                  </th>
                </tr>
              </thead>
              <tbody>
                {rates.map((rate) => (
                  <tr key={rate.id} className="border-b-hairline border-border-subtle align-top">
                    <th scope="row" className="py-4 pr-4 text-left font-ui font-medium text-on-surface">
                      {rate.label}
                    </th>
                    <td className="py-4 pr-4 text-on-surface-2">
                      {rate.area
                        ? `${rate.area.min.toLocaleString('en-IN')}–${rate.area.max.toLocaleString('en-IN')} sq ft`
                        : 'Varies'}
                    </td>
                    <td className="py-4 pr-4 font-mono tabular-nums text-on-surface-2">
                      {/* Concept fee, rate and margin as separate lines. Folding
                          the margin into the rate would produce a tidier number
                          and hide the thing the studio says it publishes. */}
                      <span className="block">
                        ₹{rate.perSqFt.low}–{rate.perSqFt.high} / sq ft
                      </span>
                      {rate.conceptFee !== null && (
                        <span className="block text-on-surface-muted">
                          + {formatRupees(rate.conceptFee)} concept
                        </span>
                      )}
                      {rate.executionMargin !== null && (
                        <span className="block text-on-surface-muted">
                          + {Math.round(rate.executionMargin * 100)}% execution
                        </span>
                      )}
                    </td>
                    <td className="py-4 font-mono tabular-nums text-on-surface-2">
                      {formatBand(rate.designFee)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

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
