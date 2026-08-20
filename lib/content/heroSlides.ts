import type { HeroBackgroundSlide } from '@/components/sections/HeroBackground';

/**
 * Slide sets for the full-bleed `HeroBackground` on the NRI and 3D-design
 * pages.
 *
 * ## Every entry points at a distinct image
 *
 * These sets previously named nine files that turned out to be byte-for-byte
 * copies of four pictures — `nri-hub-hero.png`, `nri-singapore-hero.png` and
 * `residential-3d-design-hero.png` were one image under three names, so the
 * NRI hub and the 3D-design page rendered the same carousel with different
 * captions over it. Adding a filename does not add a photograph. Both sets
 * below draw on the distinct images the repository actually holds, and nothing
 * appears twice within a set or across the two.
 *
 * ## The alt text and labels describe the picture
 *
 * Not the page's argument, and not a project. The earlier captions named real
 * Chennai addresses — "Adyar Luxury Villa Fit-Out", "Boat Club Road
 * Penthouse", "ECR Beachfront Villa" — for generated renders of no particular
 * house, and the same file was described as a villa on one page and a V-Ray
 * study on another, so a screen reader user visiting both heard two
 * incompatible accounts of one image. Captions here name the design shown.
 * When the studio's own photography of a named project exists, the label can
 * name the project.
 */

/**
 * The NRI hub and every `/nri/[region]` page share this set.
 *
 * They previously did not: a `regionSlides` branch gave `/nri/singapore` three
 * "Singapore-specific" files that were copies of these same images. A region
 * page earns its difference through its timezone clock and its copy, which are
 * genuinely computed from the region — not through relabelled stock.
 */
export const NRI_HERO_SLIDES: readonly HeroBackgroundSlide[] = [
  {
    src: '/posters/nri-hub-hero.png',
    alt: 'Double-height living room in emerald velvet, Calacatta marble and brass, glazed the full height onto a lit coastal city at dusk.',
    label: 'Double-Height Coastal Living',
  },
  {
    src: '/posters/residential-hub-hero.png',
    alt: 'Villa entrance hall with a curved marble staircase, glass balustrade and tiered brass chandelier, opening onto a poolside garden.',
    label: 'Villa Entrance & Marble Stair',
  },
  {
    src: '/posters/home-interiors-hero.png',
    alt: 'Open-plan living and dining room with a marble fireplace, emerald velvet seating and brass pendants above a walnut table, over a dusk skyline.',
    label: 'Open-Plan Living & Dining',
  },
];

/**
 * Region-tailored hero slides for Singapore NRI Hub (`/nri/singapore`).
 */
export const SINGAPORE_NRI_HERO_SLIDES: readonly HeroBackgroundSlide[] = [
  {
    src: '/posters/nri-singapore-hero.png',
    alt: 'High-rise luxury penthouse living room designed for Singapore NRIs with full-height glazing over city skyline at dusk.',
    label: 'Singapore NRI Penthouse',
  },
  {
    src: '/posters/nri-hub-hero.png',
    alt: 'Double-height living room in emerald velvet, Calacatta marble and brass, glazed full height onto a lit coastal city.',
    label: 'Double-Height Coastal Villa',
  },
  {
    src: '/posters/residential-hub-hero.png',
    alt: 'Villa entrance hall with a curved marble staircase, glass balustrade and tiered brass chandelier.',
    label: 'Villa Entrance & Marble Stair',
  },
];

export function heroSlidesForNriRegion(slug: string): readonly HeroBackgroundSlide[] {
  if (slug === 'singapore') {
    return SINGAPORE_NRI_HERO_SLIDES;
  }
  return NRI_HERO_SLIDES;
}

/**
 * The 3D-design page.
 *
 * Every image on this site is a render, so the page's subject is not a
 * separate category of picture — it is these rooms, shown at the fidelity the
 * page is selling. The set spans living room, bedroom and kitchen to match the
 * rooms the page's own gallery and revision copy talk about.
 */
export const THREE_D_HERO_SLIDES: readonly HeroBackgroundSlide[] = [
  {
    src: '/posters/residential-apartments-hero.png',
    alt: 'Apartment living and dining room with wood-panelled walls, a curved cove-lit ceiling and emerald velvet seating, over a coastal city at dusk.',
    label: 'Living Room Render',
  },
  {
    src: '/posters/residential-bedroom-hero.png',
    alt: 'Master bedroom with a tufted emerald upholstered bed, brass chandelier and a glass-fronted walk-in wardrobe on marble flooring.',
    label: 'Master Bedroom Render',
  },
  {
    src: '/posters/residential-modular-kitchen-hero.png',
    alt: 'Modular kitchen with a Calacatta marble waterfall island, matte graphite cabinetry and brass pendants beside full-height balcony glazing.',
    label: 'Modular Kitchen Render',
  },
];

/**
 * The portfolio page.
 *
 * Spans completed ultra-luxury villa architecture, open-plan living sanctuaries,
 * and Vastu-Tech sacred pooja mandaps delivered in Chennai.
 */
export const PORTFOLIO_HERO_SLIDES: readonly HeroBackgroundSlide[] = [
  {
    src: '/posters/residential-luxury-hero.png',
    alt: 'Ultra-luxury villa living area with Italian statuario marble flooring, custom brass inlays, and double-height architectural glazing.',
    label: 'Adyar Ultra-Luxury Villa',
  },
  {
    src: '/posters/residential-living-room-hero.png',
    alt: 'Open-plan contemporary living room with book-matched marble TV wall, warm recessed LED lighting, and bespoke velvet seating.',
    label: 'OMR Duplex Penthouse',
  },
  {
    src: '/posters/residential-pooja-room-hero.png',
    alt: 'Vastu-Tech sacred pooja room mandap with translucent lighted onyx wall, carved teak doors, and brass accents.',
    label: 'Besant Nagar Sacred Mandap',
  },
];

/**
 * The commercial office interiors page.
 *
 * Spans activity-based IT office workspaces, MNC executive boardrooms,
 * and luxury reception lobbies executed across Chennai IT corridors.
 */
export const COMMERCIAL_HERO_SLIDES: readonly HeroBackgroundSlide[] = [
  {
    src: '/posters/commercial-it-office-hero.png',
    alt: 'High-end corporate IT office workspace with ergonomic workstation pods, glass executive cabins, and acoustic baffle ceilings in Sholinganallur IT Park.',
    label: 'OMR Corporate IT Workplace',
  },
  {
    src: '/posters/commercial-boardroom-hero.png',
    alt: 'Executive conference boardroom with 14-seater walnut and brass table, integrated AV screens, and panoramic skyline view in Guindy.',
    label: 'Guindy Executive Boardroom',
  },
  {
    src: '/posters/commercial-reception-hero.png',
    alt: 'First impressions reception lobby with backlit onyx counter, branded metallic wall backdrop, and polished stone flooring in Nungambakkam.',
    label: 'Nungambakkam Reception Lobby',
  },
];

/**
 * The commercial workplace interiors page (`/commercial/workplace`).
 *
 * Spans tech workplace benching, executive suites, and AV boardrooms.
 */
export const WORKPLACE_HERO_SLIDES: readonly HeroBackgroundSlide[] = [
  {
    src: '/posters/commercial-workplace-hero.png',
    alt: 'Modern tech workplace interior in Chennai with open-plan workstation benching, acoustic divider screens, warm oak wood panels, and linear LED lighting.',
    label: 'Open-Plan Tech Workplace',
  },
  {
    src: '/posters/commercial-it-office-hero.png',
    alt: 'High-end corporate IT office workspace with ergonomic workstation pods, glass executive cabins, and acoustic baffle ceilings.',
    label: 'Ergonomic Workstation Suite',
  },
  {
    src: '/posters/commercial-boardroom-hero.png',
    alt: 'Executive conference boardroom with 14-seater walnut and brass table, integrated AV screens, and panoramic skyline view.',
    label: 'Executive Conference Boardroom',
  },
];

/**
 * Returns vertical-tailored hero slides for `/commercial/[vertical]`.
 */
export function heroSlidesForVertical(slug: string): readonly HeroBackgroundSlide[] {
  if (slug === 'workplace') {
    return WORKPLACE_HERO_SLIDES;
  }
  return COMMERCIAL_HERO_SLIDES;
}

/**
 * The intelligence hub page (`/intelligence`).
 */
export const INTELLIGENCE_HERO_SLIDES: readonly HeroBackgroundSlide[] = [
  {
    src: '/posters/intel-hero-main.png',
    alt: 'High-tech luxury architectural design studio with holographic 3D floor plans and lighting analysis interface.',
    label: 'Spatial Intelligence Command Studio',
  },
  {
    src: '/posters/service-vastu-tech.png',
    alt: 'Vastu-Tech AI compass and solar orientation grid scan overlaid on a millimeter-accurate floorplan.',
    label: 'Vastu-Tech AI Grid Scan',
  },
  {
    src: '/posters/tech-enabled-studio.png',
    alt: 'Flagship studio VR walkthrough room with 360-degree interactive spatial preview.',
    label: 'Interactive VR Studio Walkthrough',
  },
];

/**
 * Vastu-Tech AI Engine page (`/intelligence/vastu-tech`).
 */
export const VASTU_TECH_HERO_SLIDES: readonly HeroBackgroundSlide[] = [
  {
    src: '/posters/intel-hero-vastu-tech.png',
    alt: 'Vastu-Tech AI solar orientation and magnetic declination grid over luxury architectural floor plan.',
    label: 'AI Vastu Orientation Grid & Compass',
  },
  {
    src: '/posters/service-vastu-tech.png',
    alt: 'Vastu-Tech AI solar orientation and magnetic declination grid over AutoCAD layout.',
    label: 'AI Solar Compass Grid',
  },
  {
    src: '/posters/residential-pooja-room-hero.png',
    alt: 'Sacred Vastu-compliant pooja mandap with backlit onyx wall and carved teak wood joinery.',
    label: 'Vastu Sacred Mandap Suite',
  },
];

/**
 * Space Score™ Index page (`/intelligence/space-score`).
 */
export const SPACE_SCORE_HERO_SLIDES: readonly HeroBackgroundSlide[] = [
  {
    src: '/posters/intel-hero-space-score.png',
    alt: 'Luxury living room analyzed with digital graphics for acoustics, Lux daylight intensity, and air quality.',
    label: 'Quantified 4-Pillar Space Score™',
  },
  {
    src: '/posters/residential-living-room-hero.png',
    alt: 'Contemporary living room scored for 4-pillar wellness, acoustic masking, and circadian Lux levels.',
    label: '4-Pillar Wellness Living Room',
  },
  {
    src: '/posters/residential-bedroom-hero.png',
    alt: 'Master bedroom suite optimized for acoustic isolation and circadian lighting temperatures.',
    label: 'Acoustic Master Suite',
  },
];

/**
 * Space OS Client Portal page (`/intelligence/space-os`).
 */
export const SPACE_OS_HERO_SLIDES: readonly HeroBackgroundSlide[] = [
  {
    src: '/posters/intel-hero-space-os.png',
    alt: 'Space OS client portal tablet dashboard displaying live 3D site progress model and BOQ ledger.',
    label: 'Live Space OS Dashboard',
  },
  {
    src: '/posters/residential-3d-design-hero.png',
    alt: 'Space OS interactive 3D site progress model and live financial drawdown dashboard.',
    label: 'Space OS 3D Progress Model',
  },
  {
    src: '/posters/digital-hub-hero.png',
    alt: 'Digital BOQ budget breakdown and real-time material tracking portal on tablet.',
    label: 'Real-Time BOQ Portal',
  },
];

/**
 * Virtual Real-Estate Staging page (`/intelligence/virtual-staging`).
 */
export const VIRTUAL_STAGING_HERO_SLIDES: readonly HeroBackgroundSlide[] = [
  {
    src: '/posters/intel-hero-virtual-staging.png',
    alt: 'Photorealistic 8K virtual staging render of a luxury penthouse living room at dusk with cove lighting.',
    label: 'Photorealistic 8K Virtual Staging',
  },
  {
    src: '/posters/apt-after-living-luxury.png',
    alt: 'Photorealistic 8K V-Ray virtual staging of a luxury penthouse living room.',
    label: '8K V-Ray Virtual Staging',
  },
  {
    src: '/posters/residential-apartments-hero.png',
    alt: 'B2B real estate virtual staging for developer sales suite.',
    label: 'Developer B2B Staged Suite',
  },
];

/**
 * Returns feature-tailored hero slides for `/intelligence/[feature]`.
 */
export function heroSlidesForIntelligenceFeature(slug: string): readonly HeroBackgroundSlide[] {
  switch (slug) {
    case 'vastu-tech':
      return VASTU_TECH_HERO_SLIDES;
    case 'space-score':
      return SPACE_SCORE_HERO_SLIDES;
    case 'space-os':
      return SPACE_OS_HERO_SLIDES;
    case 'virtual-staging':
      return VIRTUAL_STAGING_HERO_SLIDES;
    default:
      return INTELLIGENCE_HERO_SLIDES;
  }
}

/**
 * Process page (`/process`).
 */
export const PROCESS_HERO_SLIDES: readonly HeroBackgroundSlide[] = [
  {
    src: '/posters/hero-process.png',
    alt: 'Luxury home interior under high-precision execution with CNC cabinetry installation, laser alignment, and CAD blueprint on worktable.',
    label: 'Precision Execution Protocol',
  },
  {
    src: '/posters/residential-3d-design-hero.png',
    alt: '3D Spatial OS site progress tracking model and pre-fabrication joinery review.',
    label: '3D Site Progress Modeling',
  },
  {
    src: '/posters/tech-enabled-studio.png',
    alt: 'VR walkthrough and milestone sign-off session in experience studio.',
    label: 'Milestone Review Studio',
  },
];

/**
 * About page (`/about`).
 */
export const ABOUT_HERO_SLIDES: readonly HeroBackgroundSlide[] = [
  {
    src: '/posters/hero-about.png',
    alt: 'Senior interior architectural team collaborating over marble worktable, material swatches, and high-res renders in Chennai studio.',
    label: 'South India Space Intelligence Studio',
  },
  {
    src: '/posters/tech-enabled-studio.png',
    alt: 'Flagship experience studio lounge with interactive VR spatial design walkthrough.',
    label: 'Flagship VR Experience Center',
  },
  {
    src: '/posters/hero-poes-garden.png',
    alt: 'Completed luxury residence reflecting South Indian architectural elegance and craft.',
    label: 'Architectural Heritage & Modern Luxury',
  },
];

/**
 * Journal page (`/journal`).
 */
export const JOURNAL_HERO_SLIDES: readonly HeroBackgroundSlide[] = [
  {
    src: '/posters/hero-journal.png',
    alt: 'Architectural research studio desk with open Vastu Shastra guides, material swatches, and technical drawing tools under spotlight.',
    label: 'Architectural Research & Vastu Essays',
  },
  {
    src: '/posters/service-vastu-tech.png',
    alt: 'Vastu-Tech CAD solar orientation compass and spatial energy alignment diagram.',
    label: 'Spatial Intelligence Guides',
  },
  {
    src: '/posters/residential-living-room-hero.png',
    alt: 'Contemporary living room case study on acoustic reverberation and circadian lighting.',
    label: 'Material & Ergonomic Analyses',
  },
];

/**
 * Contact page (`/contact`).
 */
export const CONTACT_HERO_SLIDES: readonly HeroBackgroundSlide[] = [
  {
    src: '/posters/hero-contact.png',
    alt: 'Flagship experience studio reception lounge in Nungambakkam Chennai with backlit marble wall, VR booth, and Italian leather seating.',
    label: 'Nungambakkam Flagship Studio',
  },
  {
    src: '/posters/tech-enabled-studio.png',
    alt: 'Interactive VR walkthrough lounge for client layout reviews.',
    label: 'VR Immersion Lounge',
  },
  {
    src: '/posters/hero-about.png',
    alt: 'Senior interior architectural consultation desk at Luxe Axis studio.',
    label: 'Direct Architectural Advisory',
  },
];

/**
 * Privacy Policy page (`/privacy`).
 */
export const PRIVACY_HERO_SLIDES: readonly HeroBackgroundSlide[] = [
  {
    src: '/posters/hero-privacy.png',
    alt: 'High-tech digital data privacy vault monitor in architectural studio with 256-bit SSL encryption badge.',
    label: 'DPDP Act 2023 Compliant Vault',
  },
  {
    src: '/posters/intel-hero-main.png',
    alt: 'Encrypted Space OS client portal and data security command dashboard.',
    label: 'Space OS Secure Client Vault',
  },
  {
    src: '/posters/hero-about.png',
    alt: 'Architectural studio client record confidentiality governance desk.',
    label: 'Statutory Data Governance',
  },
];

/**
 * Pricing page (`/pricing`).
 */
export const PRICING_HERO_SLIDES: readonly HeroBackgroundSlide[] = [
  {
    src: '/posters/hero-pricing.png',
    alt: 'Studio financial estimation and BOQ cost engine dashboard with material allocation charts and rate cards.',
    label: 'Radical Financial Transparency & BOQ Engine',
  },
  {
    src: '/posters/residential-spotlight.png',
    alt: 'Luxury interior investment tier breakdown and material specification sample board.',
    label: 'Itemized Investment Rate Cards',
  },
  {
    src: '/posters/digital-hub-hero.png',
    alt: 'Interactive fee calculator and real-time budget ledger on tablet screen.',
    label: 'Un-Gated Project Fee Calculator',
  },
];

/**
 * Essential Tier pricing page (`/pricing/essential`).
 */
export const ESSENTIAL_HERO_SLIDES: readonly HeroBackgroundSlide[] = [
  {
    src: '/posters/pricing-tier-essential.png',
    alt: 'Essential Luxury Tier interior specification with acrylic modular kitchen and Blum soft-close hardware.',
    label: 'Essential Luxury Standard (₹1,800/sq.ft)',
  },
  {
    src: '/posters/kitchen-hero-bg.png',
    alt: 'High-gloss acrylic modular kitchen fit-out with marine BWP plywood carcass.',
    label: '45-Day Handover Guaranteed Kitchen',
  },
  {
    src: '/posters/hero-pricing.png',
    alt: 'Itemized BOQ specification and rate card breakdown for Essential Tier.',
    label: 'Zero Hidden Fine-Print Pricing',
  },
];

/**
 * Signature Tier pricing page (`/pricing/signature`).
 */
export const SIGNATURE_HERO_SLIDES: readonly HeroBackgroundSlide[] = [
  {
    src: '/posters/pricing-tier-signature.png',
    alt: 'Signature Bespoke Tier villa interior featuring Italian PU lacquer finish and Hafele hardware.',
    label: 'Signature Bespoke Tier (₹2,800/sq.ft)',
  },
  {
    src: '/posters/intel-hero-virtual-staging.png',
    alt: 'Smart home automation lighting and sensor walk-in wardrobes.',
    label: 'Smart Automation & Acoustic Panelling',
  },
  {
    src: '/posters/residential-spotlight.png',
    alt: 'Bespoke material sample board featuring tinted glass and HDMR finishes.',
    label: 'Italian Material Sophistication & Finish',
  },
];

/**
 * Elite Tier pricing page (`/pricing/elite`).
 */
export const ELITE_HERO_SLIDES: readonly HeroBackgroundSlide[] = [
  {
    src: '/posters/pricing-tier-elite.png',
    alt: 'Elite Private Commission estate interior with book-matched Calacatta Italian marble and liquid metal joinery.',
    label: 'Elite Private Architectural Commission',
  },
  {
    src: '/posters/intel-hero-main.png',
    alt: 'Private sky lounge villa engineering with custom architectural joinery.',
    label: 'Direct Italian Quarry Marble Selection',
  },
  {
    src: '/posters/hero-poes-garden.png',
    alt: 'Legacy private estate residence in Poes Garden, Chennai.',
    label: 'Dedicated Principal Architect Oversight',
  },
];

/**
 * Calculator pricing page (`/pricing/calculator`).
 */
export const CALCULATOR_HERO_SLIDES: readonly HeroBackgroundSlide[] = [
  {
    src: '/posters/pricing-tier-calculator.png',
    alt: 'Interactive un-gated fee calculator and BOQ budget estimation engine dashboard.',
    label: 'Real-Time Interactive BOQ Estimator',
  },
  {
    src: '/posters/digital-hub-hero.png',
    alt: 'Digital project budget ledger and itemized rate cards on tablet display.',
    label: '90%+ Precision Un-Gated Cost Engine',
  },
  {
    src: '/posters/hero-pricing.png',
    alt: 'Radical financial transparency BOQ cost engine visualization.',
    label: 'Instant Carpet-Area Financial Clarity',
  },
];

/**
 * Careers page (`/careers`).
 */
export const CAREERS_HERO_SLIDES: readonly HeroBackgroundSlide[] = [
  {
    src: '/posters/hero-about.png',
    alt: 'Luxe Axis architectural studio design team collaborating over CAD blueprints and 3D spatial models in Chennai.',
    label: 'Architectural Excellence & Studio Life',
  },
  {
    src: '/posters/hero-omr-campus.png',
    alt: 'Modern high-tech architectural research studio environment with Vastu-Tech workstations.',
    label: 'State-of-the-Art Innovation Hub',
  },
  {
    src: '/posters/commercial-workplace-hero.png',
    alt: 'Collaborative luxury interior design workspace and material sample laboratory.',
    label: 'High-Impact Creative Culture',
  },
];

/**
 * Penthouse & Sky Villa Portfolio (`/portfolio/penthouses`).
 */
export const PENTHOUSES_PORTFOLIO_HERO_SLIDES: readonly HeroBackgroundSlide[] = [
  {
    src: '/posters/penthouse-hero-omr.png',
    alt: 'Double-height luxury duplex penthouse in OMR Chennai with Calacatta gold marble wall and panoramic Bay of Bengal ocean view.',
    label: 'The OMR Duplex Penthouse',
  },
  {
    src: '/posters/penthouse-nungambakkam-sky.png',
    alt: 'Panoramic sky villa penthouse in Nungambakkam with seamless travertine floors and private skyline terrace.',
    label: 'Nungambakkam Sky Villa',
  },
  {
    src: '/posters/penthouse-adyar-riverfront.png',
    alt: 'Riverfront penthouse master suite in Adyar with floor-to-ceiling glass and smoked herringbone oak floors.',
    label: 'Adyar Riverfront Penthouse',
  },
  {
    src: '/posters/penthouse-annanagar-tower.png',
    alt: 'Minimalist tower penthouse kitchen with cantilevered Statuario marble island and city skyline backdrop.',
    label: 'Anna Nagar Tower Residence',
  },
];

/**
 * Luxury Villa & Gated Estate Portfolio (`/portfolio/villas`).
 */
export const VILLAS_PORTFOLIO_HERO_SLIDES: readonly HeroBackgroundSlide[] = [
  {
    src: '/posters/project-villa-velachery.png',
    alt: 'Sprawling 5BHK luxury estate villa in Adyar with double-height mezzanine and brass architectural details.',
    label: 'The Emerald Villa — Adyar',
  },
  {
    src: '/posters/villa-besant-nagar-coastal.png',
    alt: 'Contemporary beachfront villa in Besant Nagar with exposed teakwood ceiling rafters and infinity pool deck.',
    label: 'Besant Nagar Coastal Estate',
  },
  {
    src: '/posters/villa-ecr-sanctuary.png',
    alt: 'Private gated tropical estate on ECR with central open courtyard and solid live-edge teak dining suite.',
    label: 'ECR Sanctuary Bungalow',
  },
  {
    src: '/posters/villa-annanagar-heritage.png',
    alt: 'Modernized heritage villa in Anna Nagar with backlit honey onyx bar and handcrafted teak fluted paneling.',
    label: 'Anna Nagar Heritage Villa',
  },
];

/**
 * Luxury Apartment Portfolio (`/portfolio/apartments`).
 */
export const APARTMENTS_PORTFOLIO_HERO_SLIDES: readonly HeroBackgroundSlide[] = [
  {
    src: '/posters/project-2bhk-tnagar.png',
    alt: 'Smart luxury 3BHK apartment in T. Nagar with fluted paneling and Italian marble accents.',
    label: 'The T. Nagar 3BHK Residence',
  },
  {
    src: '/posters/apt-velachery-4bhk.png',
    alt: 'Contemporary 4BHK apartment in Velachery with Botticino marble breakfast counter and magnetic track lights.',
    label: 'Velachery 4BHK Luxury Flat',
  },
  {
    src: '/posters/apt-sholinganallur-2bhk.png',
    alt: 'Modern 2BHK apartment in Sholinganallur with fluted oak media console and bronze mirror wall.',
    label: 'Sholinganallur 2BHK Modern Home',
  },
  {
    src: '/posters/apt-annanagar-gated.png',
    alt: 'High-end 3BHK gated apartment in Anna Nagar with backlit quartz TV wall and smoked walnut cabinetry.',
    label: 'Anna Nagar Gated Apartment',
  },
];






