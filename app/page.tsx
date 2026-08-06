import type { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { AboutSplit } from '@/components/sections/AboutSplit';
import { ServicesGrid } from '@/components/sections/ServicesGrid';
import { PersonaRouter } from '@/components/sections/PersonaRouter';
import { ProofStrip } from '@/components/sections/ProofStrip';
import { BeforeAfterSection } from '@/components/sections/BeforeAfterSection';
import { MaterialPartners } from '@/components/sections/MaterialPartners';
import { ProcessSteps } from '@/components/sections/ProcessSteps';
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
  title: 'Luxe Axis — Premium Chennai Interiors & Tech Intelligence',
  description:
    'AI-assisted design, Vastu-smart, delivered on a guaranteed handover date. Real designers, honest pricing.',
  alternates: canonicalFor('/'),
};

/**
 * The Home Page (Build Backlog T-14 & HomeOne Layout Alignment).
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
        headline="Your home, thoughtfully designed. Transparently priced."
        sub="AI-assisted design, Vastu-smart, delivered on a guaranteed handover date. Real designers, honest pricing."
        trustPoints={trustPoints}
      />
      <AboutSplit />
      <ServicesGrid />
      <PersonaRouter personas={personas} />
      <ProofStrip stats={stats} pendingLabels={pendingStatLabels} />
      <BeforeAfterSection />
      <IntelligenceTeaser features={features} />
      <MaterialPartners />
      <FeaturedProjects projects={projects} />
      <PricingTeaser tiers={tiers} />
      <ProcessSteps />
      <TestimonialBand testimonials={testimonials} />
      <CTASection />
    </main>
  );
}
