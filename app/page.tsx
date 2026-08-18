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
  title: 'Luxury Interior Designers in Chennai | Vastu-Tech Architecture | Luxe Axis',
  description:
    'Chennai’s premier luxury interior design studio. Turnkey residences, Vastu-Tech computational planning, 45-day guaranteed handover, un-gated itemized BOQs, and 10-year warranty.',
  keywords: [
    'luxury interior designers in chennai',
    'turnkey home interiors chennai',
    'vastu compliant interior design chennai',
    'modern villa interior designers poes garden',
    'luxury apartment interiors boat club chennai',
    'modular kitchen chennai',
    'best interior designers in chennai',
    'un-gated boq interior pricing',
    'nri home interior design chennai',
  ],
  alternates: canonicalFor('/'),
  openGraph: {
    title: 'Luxe Axis | Luxury Interior Design & Vastu-Tech Architecture in Chennai',
    description:
      'Turnkey luxury residences, AI-assisted spatial planning, 45-day guaranteed handover, and un-gated itemized BOQ pricing.',
    url: canonicalFor('/').canonical,
    images: [
      {
        url: '/posters/home-interiors-hero.png',
        width: 1200,
        height: 630,
        alt: 'Luxe Axis Luxury Architectural Interiors in Chennai',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luxe Axis | Luxury Interior Design & Vastu-Tech Architecture in Chennai',
    description:
      'Turnkey luxury residences, 45-day guaranteed handover, and un-gated BOQ pricing in Chennai.',
    images: ['/posters/home-interiors-hero.png'],
  },
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
