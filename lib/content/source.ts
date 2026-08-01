import type {
  IntelligenceFeature,
  Persona,
  Project,
  Stat,
  Testimonial,
  Tier,
} from './types';

/**
 * The content source (Build Backlog T-12).
 *
 * Everything here is taken verbatim or near-verbatim from the specs, with the
 * section cited — the same discipline `lib/nav.ts` and `components/Footer.tsx`
 * already follow for routes and labels. Nothing on this page is written by the
 * developer building it.
 *
 * ## The empty collections are the point
 *
 * `PROJECTS`, `TESTIMONIALS` and `STATS` are empty, and `Tier.priceFrom` is
 * `null` throughout, because the specs describe those sections without
 * supplying their facts. The specs give the *shape* of the proof strip
 * ("projects delivered, on-time %, NPS, referral rate") but no numbers; they
 * require "real ₹ ranges" but publish none; they call for testimonials "tied to
 * real projects/neighbourhoods" and name no client.
 *
 * Inventing any of it would be the worst available option here, and not only
 * on principle: the studio's entire differentiator is "most Chennai studios
 * hide the price, we publish it" (Landing Blueprint §3.6). A fabricated price
 * or a fabricated review discredits precisely the claim the site exists to
 * make — and a fake testimonial is a fake review whoever ends up reading it.
 *
 * So the sections that depend on them render nothing at all until the data
 * arrives (see `components/sections/`), rather than shipping placeholder proof.
 * A missing section reads as "not published yet". A section full of invented
 * numbers reads as true. Fill these arrays and the sections appear, with no
 * component change — that is what makes this a content gap and not a code one.
 */

// Spec §2.1 "Audience → intent → path". Labels, questions, paths and CTAs are
// the spec's own table, one row per persona, in its order. Several paths point
// at routes that do not exist yet — the same deliberate position lib/nav.ts
// documents, and now a soft landing rather than a broken one, since a miss
// renders app/not-found.tsx.
const PERSONAS: readonly Persona[] = [
  {
    id: 'homeowner',
    label: 'I own a flat in Chennai',
    question: 'Can I afford a premium job, and what will it cost?',
    href: '/residential',
    cta: 'Book free audit',
  },
  {
    id: 'villa',
    label: 'I am building a villa',
    question: 'Is this bespoke enough for me?',
    href: '/portfolio',
    cta: 'Book design audit',
  },
  {
    id: 'nri',
    label: 'I live abroad',
    question: 'Can I run a Chennai project from abroad?',
    href: '/nri',
    cta: 'Start remote design',
  },
  {
    id: 'workplace',
    label: 'I run a workplace',
    question: 'Will this improve my workspace and be data-backed?',
    href: '/commercial/workplace',
    cta: 'Request workspace consult',
  },
  {
    id: 'retail',
    label: 'I run a retail, F&B or healthcare space',
    question: 'Do they understand experience and compliance?',
    href: '/commercial',
    cta: 'Request consult',
  },
  {
    id: 'curious',
    label: 'I am exploring ideas',
    question: 'Are these people credible authorities?',
    href: '/journal',
    cta: 'Read the journal',
  },
];

// Spec §5.3–5.5 supply each feature's "Proves:" line, which is the claim the
// scene is meant to make; §2.2's sitemap supplies the routes. Virtual Staging
// appears in the sitemap without a scene of its own, so its claim is drawn from
// the route's own name rather than invented detail.
const INTELLIGENCE: readonly IntelligenceFeature[] = [
  {
    id: 'vastu-tech',
    name: 'Vastu-Tech',
    claim: 'We check your plan against Vastu in seconds — then a human designer confirms it.',
    href: '/intelligence/vastu-tech',
    icon: 'compass',
  },
  {
    id: 'space-score',
    name: 'Space Score',
    claim: 'A rating for any space across wellness, function, aesthetics and sustainability.',
    href: '/intelligence/space-score',
    icon: 'gauge',
  },
  {
    id: 'space-os',
    name: 'Space OS',
    claim: 'Your project live in one place — moodboard, build progress and the budget, visible.',
    href: '/intelligence/space-os',
    icon: 'device',
  },
  {
    id: 'virtual-staging',
    name: 'Virtual Staging',
    claim: 'See a room furnished and finished before anything is bought or built.',
    href: '/intelligence/virtual-staging',
    icon: 'layers',
  },
];

// Tier names and routes: Spec §2.2. Summaries paraphrase the personas each tier
// serves (§2.1). Prices are null — see the file comment; nothing here may
// invent one.
const TIERS: readonly Tier[] = [
  {
    id: 'essential',
    name: 'Essential',
    summary: 'A complete, well-made 2 or 3BHK, delivered to a published price.',
    priceFrom: null,
    inclusions: ['Full design and drawings', 'Vastu-Tech check', 'Vetted execution partners'],
  },
  {
    id: 'signature',
    name: 'Signature',
    summary: 'Bespoke detailing and materials, with the studio running delivery.',
    priceFrom: null,
    inclusions: [
      'Everything in Essential',
      'Bespoke joinery and material palette',
      'Space OS project portal',
    ],
    recommended: true,
  },
  {
    id: 'elite',
    name: 'Elite',
    summary: 'Villas and landmark homes, designed and delivered end to end.',
    priceFrom: null,
    inclusions: [
      'Everything in Signature',
      'Full architectural collaboration',
      'Dedicated project director',
    ],
  },
];

// Landing Blueprint §1: the trust strip, verbatim. These are the studio's own
// claims from its own spec, not developer copy — the same provenance rule
// lib/nav.ts applies to labels.
const TRUST_POINTS: readonly string[] = [
  'Transparent pricing',
  'Vastu-smart AI',
  '60-day handover guarantee',
  '200+ vetted vendors',
];

// Awaiting real content — see the file comment for why these are not seeded.
const PROJECTS: readonly Project[] = [];
const TESTIMONIALS: readonly Testimonial[] = [];
const STATS: readonly Stat[] = [];

/**
 * Async by design, though nothing here awaits anything yet.
 *
 * This is the seam T-12 calls for: when the content moves to Sanity, these
 * bodies become GROQ queries with Zod parsing and ISR tags, and not one caller
 * changes. Making them synchronous now would mean rewriting every consumer
 * later — the cost of the seam is one `await` per page, paid once.
 */
export async function getPersonas(): Promise<readonly Persona[]> {
  return PERSONAS;
}

export async function getIntelligenceFeatures(): Promise<readonly IntelligenceFeature[]> {
  return INTELLIGENCE;
}

export async function getTiers(): Promise<readonly Tier[]> {
  return TIERS;
}

export async function getTrustPoints(): Promise<readonly string[]> {
  return TRUST_POINTS;
}

/** Empty until real, consented case studies exist (Spec §2.4 carries a
 *  `consentStatus` field on Project for exactly that reason). */
export async function getFeaturedProjects(): Promise<readonly Project[]> {
  return PROJECTS;
}

/** Empty until real, attributable quotes exist. */
export async function getTestimonials(): Promise<readonly Testimonial[]> {
  return TESTIMONIALS;
}

/** Empty until the studio publishes real figures. */
export async function getStats(): Promise<readonly Stat[]> {
  return STATS;
}
