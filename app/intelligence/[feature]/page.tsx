import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Grid } from '@/components/layout';
import { Badge } from '@/components/Badge';
import { FeatureCard } from '@/components/Card';
import {
  ClaimProof,
  FeatureHero,
  PendingDetail,
  Stepper,
} from '@/components/sections/FeatureHero';
import { Section } from '@/components/sections/Section';
import { CTASection } from '@/components/sections/CTASection';
import { canonicalFor } from '@/lib/seo/hreflang';
import { getIntelligenceFeatures } from '@/lib/content/source';

/**
 * `/intelligence/[feature]` (Build Backlog T-17) — Vastu-Tech, Space Score,
 * Space OS and Virtual Staging.
 *
 * One dynamic segment rather than four route files, for the same reason
 * `/residential/[tier]` is: these are content, not routing. Adding a fifth
 * capability should be an edit to `lib/content/source.ts`.
 * `generateStaticParams` prerenders all four; `dynamicParams = false` makes
 * anything outside the set a 404 at the routing layer.
 *
 * Each page reserves its scene slot (T-17: "each page reserves the scene slot
 * for T-32") through `FeatureHero`, so the live scenes drop in later with no
 * layout change and no edit here.
 *
 * Sections render only where the content layer has something to put in them.
 * Virtual Staging has no documented process — the sitemap describes it in five
 * words and no spec section expands on it — so its how-it-works names the gap
 * rather than the page inventing a procedure for a product feature.
 */
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
    title: `${feature.name} — Luxe Axis`,
    description: feature.claim,
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
  // Unreachable while `dynamicParams` is false, and kept so everything below
  // can treat `feature` as defined rather than half-rendering from undefined.
  if (!feature) notFound();

  const others = features.filter((candidate) => candidate.id !== feature.id);

  return (
    <main id="main" tabIndex={-1}>
      <FeatureHero feature={feature} />

      <Section id="what-it-is" eyebrow="What it is" title={`${feature.name}, in one paragraph`}>
        <ClaimProof feature={feature} />
      </Section>

      {feature.highlights && feature.highlights.length > 0 && (
        <Section
          id="inside"
          eyebrow="What is inside"
          title={feature.id === 'space-score' ? 'The four measures' : 'What you get'}
        >
          <div className="flex flex-wrap gap-3">
            {feature.highlights.map((highlight) => (
              <Badge key={highlight} tone="neutral">
                {highlight}
              </Badge>
            ))}
          </div>
        </Section>
      )}

      <Section
        id="how-it-works"
        eyebrow="How it works"
        title="Step by step"
        lede="Written out rather than animated, so it reads the same whether or not the scene is running."
      >
        <Stepper
          steps={feature.steps}
          pendingNote={<PendingDetail what="A step-by-step walkthrough" />}
        />
      </Section>

      <Section
        id="more"
        eyebrow="Also in Intelligence"
        title="The rest of what we have built"
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

      <CTASection />
    </main>
  );
}
