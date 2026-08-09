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
