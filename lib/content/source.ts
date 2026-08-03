import type {
  CalculatorConfig,
  Subscription,
  Faq,
  Guarantee,
  NriRegion,
  ProcessStage,
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
    sceneId: 'vastu',
    summary:
      'A Vastu grid and compass are laid over your floor plan and the whole layout is scanned for compatibility. Favourable zones are marked in gold, zones worth reviewing in teal, each with a plain-language note on what it means and what could change.',
    // Spec §5.3's own "Proves:" line. This is the studio's market claim, not
    // the developer's — but it is a factual assertion about the Indian market
    // rather than a description of the product, so it is worth confirming
    // before launch; it is the one line here that invites challenge.
    proof: 'India’s first AI Vastu compatibility checker.',
    // Spec P4, and §5.3's visible "reviewed by human" chip. Stated as copy
    // rather than left to the scene, because the scene does not exist yet and
    // this is the reassurance that makes the feature credible rather than
    // alarming.
    humanInTheLoop:
      'A designer reviews every result before it reaches you. The AI narrows the question; a person answers it.',
    steps: [
      {
        title: 'Share the plan',
        body: 'Send the floor plan you already have — a builder drawing or a sketch is enough to start.',
      },
      {
        title: 'The grid reads the room',
        body: 'A Vastu grid and compass are aligned to the plan, and each zone is checked against its orientation.',
      },
      {
        title: 'Zones are marked',
        body: 'Favourable zones are marked in gold and zones worth a second look in teal, each with a plain-language note.',
      },
      {
        title: 'A designer confirms it',
        body: 'Nothing reaches you unreviewed. A designer checks the reading and tells you which changes are worth making.',
      },
    ],
  },
  {
    id: 'space-score',
    name: 'Space Score',
    claim: 'A rating for any space across wellness, function, aesthetics and sustainability.',
    href: '/intelligence/space-score',
    icon: 'gauge',
    sceneId: 'space-score',
    summary:
      'Four measures, scored independently and read together, so "is this a good room?" becomes a question with an answer you can compare, argue with and improve.',
    proof: 'A proprietary metric the studio owns, rather than a rating borrowed from someone else.',
    // The four arcs, from Spec §5.4 and the sitemap's own description of the
    // route. Named here rather than in the page so the scene and the DOM
    // cannot disagree about what the gauge measures.
    highlights: ['Wellness', 'Function', 'Aesthetics', 'Sustainability'],
    steps: [
      {
        title: 'Measure the four',
        body: 'Each of wellness, function, aesthetics and sustainability is scored on its own terms.',
      },
      {
        title: 'Read them together',
        body: 'The four arcs fill to their measured values, so a room strong in one and weak in another is visible at a glance rather than averaged away.',
      },
      {
        title: 'Design against the gaps',
        body: 'The weakest arc is usually where the design effort belongs — the score is a brief, not a verdict.',
      },
    ],
  },
  {
    id: 'space-os',
    name: 'Space OS',
    claim: 'Your project live in one place — moodboard, build progress and the budget, visible.',
    href: '/intelligence/space-os',
    icon: 'device',
    sceneId: 'space-os',
    summary:
      'The client portal. Everything the studio knows about your project, in the same view you do — including what it is costing, as it changes.',
    proof:
      'Radical Transparency made structural: the budget is visible to you by default, not on request.',
    // Spec §5.5 enumerates exactly these four.
    highlights: ['Moodboard', '3D progress tracker', 'Budget dashboard', 'AR preview'],
  },
  {
    id: 'virtual-staging',
    name: 'Virtual Staging',
    claim: 'See a room furnished and finished before anything is bought or built.',
    href: '/intelligence/virtual-staging',
    icon: 'layers',
    // No scene: Virtual Staging appears in the sitemap without one of its own
    // (Spec §5 stops at Space OS), so this page reserves no slot.
    summary:
      'Staging for real estate — an empty or unfinished room presented furnished, so a buyer can see what it becomes rather than being asked to imagine it.',
    // Deliberately no `steps` and no `proof`. The sitemap describes this route
    // in five words ("Real-estate B2B staging") and no spec section expands on
    // it, so inventing a process would be writing product detail rather than
    // rendering it. The page shows a "To be published" marker instead.
  },
];

// Tier names and routes: Spec §2.2. Summaries paraphrase the personas each tier
// serves (§2.1). Prices are null — see the file comment; nothing here may
// invent one.
const TIERS: readonly Tier[] = [
  {
    id: 'essential',
    name: 'Essential',
    summary: 'A complete, well-made 1 or 2BHK, delivered to a published price.',
    // The floor of the published list: a 1BHK is served by Essential and starts
    // at 3.5L for the whole project. `priceFrom` is TOTAL project cost, which is
    // the figure a visitor is deciding against — the design fee within it is
    // published separately on /pricing rather than folded in here.
    priceFrom: 350_000,
    inclusions: ['Full design and drawings', 'Vastu-Tech check', 'Vetted execution partners'],
  },
  {
    id: 'signature',
    name: 'Signature',
    summary: 'Bespoke detailing and materials, with the studio running delivery.',
    // The lowest published row Signature appears on is the 2BHK (7L-15L,
    // Essential/Signature). Taken as the floor rather than the 3BHK's 12L,
    // because a 2BHK genuinely can be specified as Signature — quoting the
    // higher number would overstate the entry point.
    priceFrom: 700_000,
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
    summary: 'Villas, penthouses and landmark homes, designed and delivered end to end.',
    // Same reasoning: the lowest row Elite appears on is the villa
    // (25L-80L, Signature/Elite), not the penthouse's 60L.
    priceFrom: 2_500_000,
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
  // The blueprint's strip said "60-day handover guarantee" and the studio's own
  // tier data contradicts it: 60 days is Signature's commitment, Essential is
  // 45 and Elite is milestone-based. A flat claim overstates one tier and
  // misdescribes another, on the strip whose entire job is to be trusted at a
  // glance. Generalised to what is true of all three; the specific figure is
  // published against each tier on /pricing and /process.
  'A guaranteed handover date',
  '200+ vetted vendors',
];

// The measures Landing Blueprint §3.5 names for the stat band. The blueprint
// states WHICH numbers the studio intends to publish and none of their values,
// so the labels are real content and the figures are the gap — which is exactly
// what `ToBePublished` renders against each one.
const PENDING_STAT_LABELS: readonly string[] = [
  'Projects delivered',
  'On-time completion',
  'Net Promoter Score',
  'Referral rate',
];


// The residential price list, exactly as the studio publishes it. Total project
// cost and design fee are separate figures because they answer different
// questions, and publishing only the first is what makes a visitor suspect the
// second is hidden inside it.
//
// Areas are the typical carpet area for each property type, for orientation
// when choosing a row. They are NOT multiplied by anything — see the
// `PropertyBracket` comment in types.ts for why a per-square-foot rate cannot
// honestly be derived from these bands.
const CALCULATOR: CalculatorConfig = {
  brackets: [
    {
      id: '1bhk',
      label: '1BHK',
      area: { min: 400, max: 650 },
      tiers: ['Essential'],
      projectCost: { low: 350_000, high: 600_000 },
      designFee: { low: 50_000, high: 75_000 },
    },
    {
      id: '2bhk',
      label: '2BHK',
      area: { min: 800, max: 1_200 },
      tiers: ['Essential', 'Signature'],
      projectCost: { low: 700_000, high: 1_500_000 },
      designFee: { low: 75_000, high: 180_000 },
    },
    {
      id: '3bhk',
      label: '3BHK',
      area: { min: 1_200, max: 1_800 },
      tiers: ['Signature'],
      projectCost: { low: 1_200_000, high: 2_500_000 },
      designFee: { low: 150_000, high: 350_000 },
    },
    {
      id: 'villa',
      label: 'Villa',
      // Published as "2,000+ sq ft" — open-ended, and modelled as such rather
      // than given an invented ceiling.
      area: { min: 2_000, max: null },
      tiers: ['Signature', 'Elite'],
      projectCost: { low: 2_500_000, high: 8_000_000 },
      designFee: { low: 300_000, high: 1_200_000 },
    },
    {
      id: 'penthouse',
      label: 'Penthouse',
      // No area published for this row, and it is not a size category — a
      // penthouse overlaps the villa band on area and is priced differently.
      // `null` rather than a guessed range, which is also why this calculator
      // asks for property TYPE rather than deriving it from square feet.
      area: null,
      tiers: ['Elite'],
      projectCost: { low: 6_000_000, high: 20_000_000 },
      designFee: { low: 800_000, high: 2_500_000 },
    },
  ],
};

// Published recurring services. Annual rates are listed only where the studio
// publishes one — Elite Concierge has no annual price, and inventing one by
// multiplying by twelve would misstate a discount that may not exist.
const SUBSCRIPTIONS: readonly Subscription[] = [
  {
    id: 'home-concierge',
    name: 'Home Concierge',
    summary: 'Ongoing care for a finished home — the things that surface after you have lived in it.',
    monthly: 2_499,
    yearly: 24_999,
  },
  {
    id: 'elite-concierge',
    name: 'Elite Concierge',
    summary: 'Priority care for villas and landmark homes.',
    monthly: 4_999,
    yearly: null,
  },
  {
    id: 'business-concierge',
    name: 'Business Concierge',
    summary: 'For commercial spaces that keep changing after handover.',
    monthly: 15_000,
    yearly: 150_000,
  },
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

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await getFeaturedProjects();
  return projects.find((p) => p.slug === slug) ?? null;
}

/** Empty until real, attributable quotes exist. */
export async function getTestimonials(): Promise<readonly Testimonial[]> {
  return TESTIMONIALS;
}

// Spec 5.8 / Cinematic SCENE 07 name the seven stages and their order verbatim.
// The one-line bodies are written here, and assert nothing the rest of this file
// does not already claim (vetted partners, the Vastu-Tech check, the Space OS
// portal, the handover guarantee). They are the only visitor-facing copy in this
// file not lifted from a spec, so they are the first thing a copy review should
// look at.
const PROCESS_STAGES: readonly ProcessStage[] = [
  {
    id: 'discover',
    name: 'Discover',
    body: 'We learn how you actually live in the space, what you want changed, and what you would rather not touch.',
  },
  {
    id: 'audit',
    name: 'Audit',
    body: 'A designer walks the space, in person or over video, and comes back with a read on it and an indicative cost.',
  },
  {
    id: 'concept',
    name: 'Concept',
    body: 'Layouts, materials and a Vastu-Tech check, presented as options rather than a single take-it-or-leave-it design.',
  },
  {
    id: 'approve',
    name: 'Approve',
    body: 'Drawings and the costed scope are signed off before anything is ordered. Nothing starts on an assumption.',
  },
  {
    id: 'build',
    name: 'Build',
    body: 'Vetted execution partners work to the approved drawings, with progress and spend visible to you in Space OS.',
  },
  {
    id: 'handover',
    name: 'Handover',
    body: 'Snagging, cleaning and the final walkthrough, which is the point the space becomes yours to use.',
    guaranteeIds: ['timeline', 'warranty'],
  },
  {
    id: 'concierge',
    name: 'Concierge',
    body: 'We stay reachable afterwards for the things that only surface once you have lived in a space for a month.',
  },
];

// The published commitments. `terms: null` now means genuinely unwritten, not
// "not supplied yet" — the studio has published warranty and timeline terms, so
// anything still null here is a real gap that renders as one.
const GUARANTEES: readonly Guarantee[] = [
  {
    id: 'timeline',
    name: 'Timeline guarantee',
    summary:
      'A committed handover date, backed by a published guarantee rather than an apology.',
    // Per tier, and this is why the site no longer states a flat "60-day
    // handover guarantee" anywhere: 60 days is SIGNATURE's commitment. Quoting
    // it site-wide overstated it for Essential and misdescribed Elite, whose
    // commitment is milestone-based rather than a single date.
    byTier: {
      Essential: '45-day handover',
      Signature: '60-day handover',
      Elite: 'Milestone-based, agreed up front',
    },
    terms: 'Every snag must be closed before handover — the date is not met until the list is empty.',
  },
  {
    id: 'warranty',
    name: 'Post-handover warranty',
    summary: 'Cover after you move in, with a response time attached rather than a promise to look into it.',
    byTier: {
      Essential: '30 days, snags',
      Signature: '90 days, snags',
      Elite: '6 months, full',
    },
    terms:
      'Response times by severity: same day for anything that stops you using the space, within 5 days for a significant defect, within 14 days for everything else. In the first 7 days after handover we cover the full cost. From 30 to 180 days we cover workmanship and material defects. Beyond 180 days, Concierge covers it. Acts of nature and damage from misuse are excluded.',
  },
  {
    id: 'supply-chain-fee',
    name: 'Transparent Supply-Chain Management fee',
    summary:
      'The fee for sourcing and managing materials is stated as its own line rather than folded invisibly into a per-square-foot rate.',
    // Still genuinely unwritten. Renders as an explicit gap.
    terms: null,
  },
  {
    id: 'quote-validity',
    name: 'How long a quote holds',
    summary: 'A quote is good for a stated period, so you are not deciding against a number that moves.',
    byTier: {
      Essential: '14 days',
      Signature: '14 days',
      Elite: '30 days for NRI Elite',
    },
    terms:
      'Residential quotes hold for 14 days and commercial quotes for 21. NRI Elite quotes hold for 30, since a decision across time zones takes longer. If material costs rise by more than 8% between quote and order, the difference is passed through at cost and shown to you — we do not absorb it silently, and we do not mark it up.',
  },
];


// Spec 2.2's sitemap lists exactly these six.
const NRI_REGIONS: readonly NriRegion[] = [
  { slug: 'singapore', name: 'Singapore', timeZone: 'Asia/Singapore' },
  { slug: 'uae', name: 'UAE', timeZone: 'Asia/Dubai' },
  { slug: 'usa', name: 'USA', timeZone: 'America/New_York' },
  { slug: 'uk', name: 'UK', timeZone: 'Europe/London' },
  { slug: 'canada', name: 'Canada', timeZone: 'America/Toronto' },
  { slug: 'australia', name: 'Australia', timeZone: 'Australia/Sydney' },
];

// The questions are Landing Blueprint 3.7's own list of "the real objections".
// Every answer is assembled from facts stated elsewhere in the specs: the
// published tiers, the 60-day guarantee, the NRI remote capability, Vastu-Tech's
// human review, and P4's "AI assists, humans decide". None of them invents a
// policy, and none states a term the studio has not already committed to.
const FAQS: readonly Faq[] = [
  {
    id: 'cost',
    question: 'How much does it cost?',
    answer:
      'We publish our tiers rather than quoting privately, so you can find out before speaking to anyone. What a specific project costs depends on its area, condition and finish level, which the audit settles.',
    link: { label: 'See pricing', href: '/pricing' },
  },
  {
    id: 'duration',
    question: 'How long does it take?',
    answer:
      'Every tier commits to a handover date: 45 days on Essential, 60 on Signature, and agreed milestones on Elite. The full timeline depends on scope and approvals, and a designer gives you a dated plan at the audit.',
    link: { label: 'See the process', href: '/process' },
  },
  {
    id: 'abroad',
    question: 'Can I manage this from abroad?',
    answer:
      'Yes. Progress, drawings and spend are visible in Space OS, and reviews happen over video at a time that works in your zone rather than ours.',
    link: { label: 'Designing from abroad', href: '/nri' },
  },
  {
    id: 'vastu',
    question: 'Do you do Vastu?',
    answer:
      'Yes. Vastu-Tech checks your plan against Vastu in seconds, and a designer reviews every result before it reaches you.',
    link: { label: 'How Vastu-Tech works', href: '/intelligence/vastu-tech' },
  },
  {
    id: 'ai',
    question: 'Is the AI designing my home?',
    answer:
      'No. The software narrows the question, and a designer decides. Nothing reaches you that a person has not reviewed.',
    link: { label: 'What we have built', href: '/intelligence' },
  },
];

/** Empty until the studio publishes real figures. */
export async function getStats(): Promise<readonly Stat[]> {
  return STATS;
}

export async function getProcessStages(): Promise<readonly ProcessStage[]> {
  return PROCESS_STAGES;
}

export async function getGuarantees(): Promise<readonly Guarantee[]> {
  return GUARANTEES;
}

export async function getNriRegions(): Promise<readonly NriRegion[]> {
  return NRI_REGIONS;
}

export async function getFaqs(): Promise<readonly Faq[]> {
  return FAQS;
}

/** The labels the proof strip shows while `getStats()` is empty, so the section
 *  names what is coming rather than disappearing. Never paired with a value. */
export async function getPendingStatLabels(): Promise<readonly string[]> {
  return PENDING_STAT_LABELS;
}

/** The published residential price list. */
export async function getCalculatorConfig(): Promise<CalculatorConfig | null> {
  return CALCULATOR;
}

/** Published recurring services. */
export async function getSubscriptions(): Promise<readonly Subscription[]> {
  return SUBSCRIPTIONS;
}
