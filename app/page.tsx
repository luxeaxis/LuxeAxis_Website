import type { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { PersonaRouter } from '@/components/sections/PersonaRouter';
import { ProofStrip } from '@/components/sections/ProofStrip';
import {
  FeaturedProjects,
  IntelligenceTeaser,
  PricingTeaser,
} from '@/components/sections/Teaser';
import { CTASection, TestimonialBand } from '@/components/sections/CTASection';
import { canonicalFor } from '@/lib/seo/hreflang';
import {
  getFeaturedProjects,
  getIntelligenceFeatures,
  getPersonas,
  getPendingStatLabels,
  getStats,
  getTestimonials,
  getTiers,
  getTrustPoints,
} from '@/lib/content/source';

export const metadata: Metadata = {
  title: 'Luxe Axis — premium Chennai interiors, transparently priced',
  description:
    'AI-assisted design, Vastu-smart, delivered on a 60-day handover guarantee. Real designers, honest pricing.',
  alternates: canonicalFor('/'),
};

/**
 * The home page (Build Backlog T-14), composed in the Cinematic §9.1 order:
 * Hero → Six Ways In → proof strip → Intelligence teaser → featured projects →
 * pricing teaser → testimonial → audit CTA band.
 *
 * "This must fully convert with zero 3D" (T-14). Every section here is
 * server-rendered DOM; the only scene slot is the hero's, and that is a static
 * poster which upgrades in place later with no layout change. The LCP element
 * is the `h1`, not an image and not a canvas — Landing Blueprint §1's
 * non-negotiable, since a hero that assembles before it communicates spends the
 * visitor's three-second attention budget on a loading state.
 *
 * Three sections are waiting on facts the specs describe but do not supply —
 * the proof strip, featured projects and the testimonial. Each renders an
 * explicit "To be published" against the named measure rather than either
 * disappearing or inventing a value: §3.5 names the statistics it wants and
 * publishes none of them, §3.6 requires "real ₹ ranges" and gives none, and no
 * client is named anywhere.
 *
 * The placeholder is the honest middle. "Projects delivered: To be published"
 * is a true statement a visitor can act on; "Projects delivered: 120" is not,
 * and is indistinguishable from a real figure to the person reading it. Each
 * section switches to the real thing the moment `lib/content/source.ts` has
 * content, with no change to any component.
 *
 * Content comes through the async getters rather than direct imports so the
 * Sanity swap (T-12) touches one module. All seven resolve in parallel: they
 * are independent, and awaiting them in sequence would serialise seven round
 * trips the day they become real queries.
 */
export default async function HomePage() {
  const [personas, stats, pendingStatLabels, features, projects, tiers, testimonials, trustPoints] =
    await Promise.all([
    getPersonas(),
    getStats(),
    getPendingStatLabels(),
    getIntelligenceFeatures(),
    getFeaturedProjects(),
    getTiers(),
    getTestimonials(),
    getTrustPoints(),
  ]);

  return (
    <main id="main" tabIndex={-1}>
      <Hero
        // Landing Blueprint §3.1's H1b and its sub, verbatim.
        headline="Your Chennai home, thoughtfully designed. Transparently priced."
        sub="AI-assisted design, Vastu-smart, delivered on a 60-day handover guarantee. Real designers, honest pricing."
        trustPoints={trustPoints}
      />
      <PersonaRouter personas={personas} />
      <ProofStrip stats={stats} pendingLabels={pendingStatLabels} />
      <IntelligenceTeaser features={features} />
      <FeaturedProjects projects={projects} />
      <PricingTeaser tiers={tiers} />
      <TestimonialBand testimonials={testimonials} />
      <CTASection />
    </main>
  );
}
