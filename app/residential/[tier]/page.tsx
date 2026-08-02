import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container, Grid, Stack } from '@/components/layout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { InclusionList, TierSummary } from '@/components/sections/TierSummary';
import { CTASection } from '@/components/sections/CTASection';
import { canonicalFor } from '@/lib/seo/hreflang';
import { serviceJsonLd } from '@/lib/seo/jsonLd';
import { getTiers } from '@/lib/content/source';

/**
 * `/residential/[tier]` — Essential, Signature and Elite (Spec §2.2).
 *
 * A dynamic segment rather than three near-identical route files. The tiers are
 * a closed set today, so three static files would also work, but they are
 * content rather than routing: adding a fourth tier should be an edit to
 * `lib/content/source.ts`, not a new directory. `generateStaticParams` still
 * prerenders this to three static pages, and `dynamicParams = false` turns a
 * URL outside the set into a 404 at the routing layer rather than something the
 * page body has to defend against.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getTiers()).map((tier) => ({ tier: tier.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tier: string }>;
}): Promise<Metadata> {
  const { tier: tierId } = await params;
  const tier = (await getTiers()).find((candidate) => candidate.id === tierId);
  if (!tier) return {};

  return {
    title: `${tier.name} — residential interior design in Chennai — Luxe Axis`,
    description: tier.summary,
    alternates: canonicalFor(`/residential/${tier.id}`),
  };
}

export default async function TierPage({ params }: { params: Promise<{ tier: string }> }) {
  const { tier: tierId } = await params;
  const tier = (await getTiers()).find((candidate) => candidate.id === tierId);
  // Unreachable while `dynamicParams` is false, and kept regardless: it is what
  // makes `tier` non-optional for everything below, so the page can never
  // render half-built from an undefined.
  if (!tier) notFound();

  return (
    <main id="main" tabIndex={-1}>
      {/* A tier IS a service the studio offers, which is what this node
          says. No `offers` on it — that needs a price, and none is published. */}
      <JsonLd
        data={serviceJsonLd({
          name: `${tier.name} residential interior design`,
          description: tier.summary,
          url: `/residential/${tier.id}`,
        })}
      />

      <Container className="py-section-y">
        <Stack gap={8}>
          <Breadcrumbs path={`/residential/${tier.id}`} />
          <Stack gap={4} className="max-w-measure">
            <p className="font-ui text-overline uppercase tracking-[var(--font-tracking-wider)] text-accent">
              Residential
            </p>
            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-tight tracking-[var(--font-tracking-tight)] text-on-surface">
              {tier.name}
            </h1>
            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2">
              {tier.summary}
            </p>
          </Stack>

          {/* Detail left, summary right — T-15's "sticky tier summary +
              scrolling detail". On mobile the Grid collapses to one column and
              the summary simply follows the detail. */}
          <Grid cols={2} gap={8} className="lg:grid-cols-[2fr_1fr]">
            <section aria-labelledby="included-heading">
              <Stack gap={5}>
                <h2
                  id="included-heading"
                  className="font-display text-[length:var(--typography-h2-font-size)] text-on-surface"
                >
                  What is included
                </h2>
                <InclusionList inclusions={tier.inclusions} />
              </Stack>
            </section>
            <TierSummary tier={tier} />
          </Grid>
        </Stack>
      </Container>

      <CTASection />
    </main>
  );
}
