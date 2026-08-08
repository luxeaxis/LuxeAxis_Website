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
import { JourneyProvider } from '@/components/JourneyProvider';
import { JourneyRail } from '@/components/JourneyRail';
import { JourneyStation } from '@/components/JourneyStation';
import { HOME_STATIONS } from '@/lib/journey/stations';
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
  const [
    personas,
    stats,
    pendingStatLabels,
    features,
    projects,
    tiers,
    testimonials,
    trustPoints,
  ] = await Promise.all([
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
    // `lx-journey` turns on native CSS scroll-snap for this page only. It is a
    // class and not a script: no wheel handler, no scroll animation, no
    // interception. See styles/globals.css for why it is `proximity` and never
    // `mandatory`.
    <main id="main" tabIndex={-1} className="lx-journey">
      {/* Resolves which station is current from scroll, the URL fragment, and
          browser history, then publishes it. Renders nothing. The camera reads
          the result; nothing reads the camera. */}
      <JourneyProvider stations={HOME_STATIONS} />
      {/* Wayfinding. Real anchor links, so it works with JavaScript disabled,
          with WebGL unavailable, and with the three_v1 flag off — which is
          every visitor today. */}
      <JourneyRail stations={HOME_STATIONS} />

      <JourneyStation id="hero">
        <Hero
          headline="Your home, thoughtfully designed. Transparently priced."
          sub="AI-assisted design, Vastu-smart, delivered on a guaranteed handover date. Real designers, honest pricing."
          trustPoints={trustPoints}
        />
      </JourneyStation>

      {/* AboutSplit, ServicesGrid, ProcessSteps and CTASection render a bare
          <section> with no id of their own, so they are wrapped to become
          stations. Everything built on components/sections/Section.tsx already
          carries its own id and is a station automatically — see that file. */}
      <JourneyStation id="about">
        <AboutSplit />
      </JourneyStation>
      <JourneyStation id="services">
        <ServicesGrid />
      </JourneyStation>

      <PersonaRouter personas={personas} />
      <ProofStrip stats={stats} pendingLabels={pendingStatLabels} />
      <BeforeAfterSection />
      <IntelligenceTeaser features={features} />
      <MaterialPartners />
      <FeaturedProjects projects={projects} />
      <PricingTeaser tiers={tiers} />

      <JourneyStation id="process">
        <ProcessSteps />
      </JourneyStation>

      <TestimonialBand testimonials={testimonials} />

      <JourneyStation id="contact">
        <CTASection />
      </JourneyStation>
    </main>
  );
}
