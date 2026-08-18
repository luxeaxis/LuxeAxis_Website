/**
 * Shared nav data for Header and MobileSheet — one source so the two
 * surfaces can never drift (a link renamed in one and not the other is
 * exactly the kind of bug a design-system nav is supposed to prevent).
 *
 * Labels and routes are taken verbatim from the sitemap
 * (docs/specs/LuxeAxis_3D_Website_Spec.md §2.2) and the navigation model
 * (§2.3: "Max 5 top items + 1 CTA") — no invented copy. The routes below
 * (other than `/`, `/pricing`, `/style`) do not have pages built yet; linking
 * to them now is intentional (§10.3 phases build the site before the pages
 * exist) and does not affect the axe/e2e gates, which only visit the routes
 * that exist.
 */

export type NavSubItem = { label: string; href: string };

export type MegaGroupItem = {
  label: string;
  href: string;
  description?: string;
  badge?: string;
};

export type MegaGroup = {
  title: string;
  items: MegaGroupItem[];
};

export type MegaFeatured = {
  title: string;
  tagline: string;
  href: string;
  image: string;
  ctaText: string;
};

export type MegaMenuConfig = {
  groups: MegaGroup[];
  featured?: MegaFeatured;
};

export type NavItem = {
  label: string;
  href: string;
  subItems?: readonly NavSubItem[];
  megaMenu?: MegaMenuConfig;
};

export const RESIDENTIAL_SERVICES: readonly NavSubItem[] = [
  { label: 'Complete Home Interiors', href: '/residential/home-interiors' },
  { label: 'Modular Kitchens', href: '/residential/modular-kitchen' },
  { label: 'Bedroom Design', href: '/residential/bedroom' },
  { label: 'Living Room Interiors', href: '/residential/living-room' },
  { label: 'Pooja Room Mandaps', href: '/residential/pooja-room' },
  { label: 'Apartment Interiors', href: '/residential/apartments' },
  { label: 'Home Renovation', href: '/residential/renovation' },
  { label: 'Kitchen Cabinetry', href: '/residential/kitchen-cabinets' },
  { label: 'Wardrobe Suites', href: '/residential/wardrobe' },
  { label: 'TV & Media Units', href: '/residential/tv-unit' },
  { label: 'False Ceiling', href: '/residential/false-ceiling' },
  { label: '3D Spatial OS', href: '/residential/3d-design' },
  { label: 'Ultra-Luxury Interiors', href: '/residential/luxury' },
  { label: 'Remote Digital Design', href: '/digital' },
];

export const RESIDENTIAL_MEGA_MENU: MegaMenuConfig = {
  groups: [
    {
      title: 'Turnkey & Spaces',
      items: [
        {
          label: 'Complete Home Interiors',
          href: '/residential/home-interiors',
          description: 'Full villa & home spatial transformation',
          badge: 'Popular',
        },
        {
          label: 'Ultra-Luxury Interiors',
          href: '/residential/luxury',
          description: 'Italian marble, liquid metal & automation',
          badge: 'Elite',
        },
        {
          label: 'Apartment Interiors',
          href: '/residential/apartments',
          description: 'Smart 2BHK/3BHK luxury planning',
        },
        {
          label: 'Home Renovation',
          href: '/residential/renovation',
          description: 'Civil remodeling & structural upgrades',
        },
        {
          label: 'Remote Digital Design',
          href: '/digital',
          description: 'Starter, Pro & Premium remote packages',
          badge: 'Digital',
        },
      ],
    },
    {
      title: 'Living Sanctuaries',
      items: [
        {
          label: 'Living Room Interiors',
          href: '/residential/living-room',
          description: 'Statement TV walls & open-plan layouts',
        },
        {
          label: 'Bedroom Design',
          href: '/residential/bedroom',
          description: 'Acoustic sanctuaries & circadian lighting',
        },
        {
          label: 'Pooja Room Mandaps',
          href: '/residential/pooja-room',
          description: 'Vastu-Tech sacred brass & onyx mandaps',
        },
      ],
    },
    {
      title: 'Bespoke Millwork & NRI',
      items: [
        {
          label: 'Modular Kitchens',
          href: '/residential/modular-kitchen',
          description: 'Blum soft-close & marine BWP plywood',
          badge: 'Featured',
        },
        {
          label: 'Kitchen Cabinetry',
          href: '/residential/kitchen-cabinets',
          description: 'Acrylic, lacquered glass & PU finishes',
        },
        {
          label: 'Wardrobe Suites',
          href: '/residential/wardrobe',
          description: 'Walk-in closets & sensor LED lighting',
        },
        {
          label: 'TV & Media Consoles',
          href: '/residential/tv-unit',
          description: 'Cantilevered stone & soundbar coves',
        },
        {
          label: 'Architectural False Ceilings',
          href: '/residential/false-ceiling',
          description: 'Magnetic light tracks & Gyproc coves',
        },
        {
          label: '3D Spatial OS',
          href: '/residential/3d-design',
          description: 'Photorealistic VR walkthroughs',
        },
        {
          label: 'NRI Global Design Hub',
          href: '/nri',
          description: 'Remote design & execution for overseas Indians',
          badge: 'Global',
        },
        {
          label: 'Singapore NRI Hub',
          href: '/nri/singapore',
          description: 'Bespoke design for Singapore home owners',
        },
        {
          label: 'UAE & Gulf NRI Hub',
          href: '/nri/uae',
          description: 'Turnkey interior design for Dubai & GCC',
        },
      ],
    },
  ],
  featured: {
    title: 'The Platinum Residence',
    tagline: 'Vastu-Tech Villa Interiors with Real-time 3D VR Simulation',
    href: '/residential/luxury',
    image: '/posters/residential-spotlight.png',
    ctaText: 'Explore Ultra-Luxury →',
  },
};

export const COMMERCIAL_SERVICES: readonly NavSubItem[] = [
  { label: 'Corporate Workspaces', href: '/commercial/workplace' },
  { label: 'Retail & Hospitality', href: '/commercial/retail-hospitality' },
  { label: 'Healthcare & Clinics', href: '/commercial/healthcare' },
];

export const COMMERCIAL_MEGA_MENU: MegaMenuConfig = {
  groups: [
    {
      title: 'Commercial Environments',
      items: [
        {
          label: 'Corporate Workspaces',
          href: '/commercial/workplace',
          description: 'High-performance ergonomic tech offices & IT hubs',
          badge: 'Enterprise',
        },
        {
          label: 'Retail & Hospitality',
          href: '/commercial/retail-hospitality',
          description: 'Experiential brand showrooms, boutiques & dining',
          badge: 'Featured',
        },
        {
          label: 'Healthcare & Clinics',
          href: '/commercial/healthcare',
          description: 'Clinical spaces, dental hubs & wellness suites',
          badge: 'Compliant',
        },
      ],
    },
  ],
  featured: {
    title: 'Corporate Headquarters',
    tagline: 'Precision engineered 15,000 sq.ft tech hub fitout in Chennai',
    href: '/commercial/workplace',
    image: '/posters/commercial-workplace-hero.png',
    ctaText: 'View Commercial Showcase →',
  },
};

export const INTELLIGENCE_SERVICES: readonly NavSubItem[] = [
  { label: 'Vastu-Tech AI Grid', href: '/intelligence/vastu-tech' },
  { label: 'Space Score™ Index', href: '/intelligence/space-score' },
  { label: 'Space OS Client Portal', href: '/intelligence/space-os' },
  {
    label: 'Virtual Real-Estate Staging',
    href: '/intelligence/virtual-staging',
  },
  { label: 'Digital Hub & Design Club', href: '/digital' },
];

export const DIGITAL_SERVICES: readonly NavSubItem[] = [
  { label: 'Digital Hub & Design Club', href: '/digital' },
  { label: 'Starter Package (₹25,000)', href: '/digital/starter' },
  { label: 'Pro Package (₹45,000)', href: '/digital/pro' },
  { label: 'Premium VIP Package (₹75,000)', href: '/digital/premium' },
];

export const DIGITAL_MEGA_MENU: MegaMenuConfig = {
  groups: [
    {
      title: 'Digital & Design Club',
      items: [
        {
          label: 'Digital Hub & Design Club',
          href: '/digital',
          description: 'Complete remote architectural design & VIP club',
          badge: 'Hub',
        },
        {
          label: 'Starter Package',
          href: '/digital/starter',
          description: '₹25,000 / room 2D CAD layout & moodboard',
        },
        {
          label: 'Pro Package',
          href: '/digital/pro',
          description: '₹45,000 / room 4K 3D renders & working drawings',
          badge: 'Popular',
        },
        {
          label: 'Premium VIP Package',
          href: '/digital/premium',
          description: '₹75,000 / room 360 VR & physical sample box',
          badge: 'VIP',
        },
      ],
    },
  ],
  featured: {
    title: 'Luxe Axis Digital',
    tagline:
      'Professional architectural design delivered remotely anywhere in the world',
    href: '/digital',
    image: '/posters/digital-hub-hero.png',
    ctaText: 'Explore Digital Hub →',
  },
};

export const INTELLIGENCE_MEGA_MENU: MegaMenuConfig = {
  groups: [
    {
      title: 'Proprietary Tech',
      items: [
        {
          label: 'Vastu-Tech AI Engine',
          href: '/intelligence/vastu-tech',
          description: 'Solar orientation & electromagnetic compass alignment',
          badge: 'Patent-Pending',
        },
        {
          label: 'Space Score™ Index',
          href: '/intelligence/space-score',
          description: '4-pillar wellness, function & sustainability audit',
          badge: 'Proprietary',
        },
        {
          label: 'Space OS Portal',
          href: '/intelligence/space-os',
          description: 'Real-time project timeline, BOQ budget & 3D tracker',
        },
        {
          label: 'Virtual Staging',
          href: '/intelligence/virtual-staging',
          description: 'Real-estate B2B 3D staging & photorealistic VR',
        },
        {
          label: 'Digital Hub & Design Club',
          href: '/digital',
          description: 'Complete remote architectural design & VIP membership',
          badge: 'New',
        },
      ],
    },
    {
      title: 'Studio & Methodology',
      items: [
        {
          label: 'Process & Guarantees',
          href: '/process',
          description: '10-stage execution SLA & price-lock guarantee',
          badge: '45-Day SLA',
        },
        {
          label: 'About Studio & Leadership',
          href: '/about',
          description: 'Architectural lineage & design philosophy',
        },
        {
          label: 'Design Journal',
          href: '/journal',
          description: 'Luxury trend forecasts, materials & Vastu guides',
        },
        {
          label: 'Contact & Consultations',
          href: '/contact',
          description: 'Book in-person studio appointment',
        },
      ],
    },
  ],
  featured: {
    title: 'Vastu-Tech AI Simulator',
    tagline: 'Scan your CAD floorplan against ancient cosmic grids in seconds',
    href: '/intelligence/vastu-tech',
    image: '/posters/service-vastu-tech.png',
    ctaText: 'Launch Vastu Scan →',
  },
};

export const PORTFOLIO_SERVICES: readonly NavSubItem[] = [
  { label: 'All Projects Catalogue', href: '/portfolio' },
  { label: 'Penthouse Residences', href: '/portfolio/penthouses' },
  { label: 'Gated Estate Villas', href: '/portfolio/villas' },
  { label: 'Luxury Apartments', href: '/portfolio/apartments' },
];

export const PORTFOLIO_MEGA_MENU: MegaMenuConfig = {
  groups: [
    {
      title: 'Curated Works',
      items: [
        {
          label: 'All Projects Catalogue',
          href: '/portfolio',
          description: 'Filter by style, area, and investment tier',
          badge: '45+ Works',
        },
        {
          label: 'Penthouse Residences',
          href: '/portfolio/penthouses',
          description: 'Panoramic high-rise duplex transformations',
          badge: 'High-Rise',
        },
        {
          label: 'Gated Estate Villas',
          href: '/portfolio/villas',
          description: 'Sprawling private sanctuary architecture',
          badge: 'Estate',
        },
        {
          label: 'Luxury Apartments',
          href: '/portfolio/apartments',
          description: 'Smart 3BHK & 4BHK luxury residences',
          badge: 'Urban',
        },
      ],
    },
    {
      title: 'NRI Global Portfolios',
      items: [
        {
          label: 'NRI Global Hub',
          href: '/nri',
          description: 'Remote luxury design & site management',
          badge: 'Global',
        },
        {
          label: 'Singapore NRI Projects',
          href: '/nri/singapore',
          description: 'Residences designed for Singapore clients',
        },
        {
          label: 'UAE & Gulf Projects',
          href: '/nri/uae',
          description: 'Luxury estates for Middle East clients',
        },
        {
          label: 'USA & North America',
          href: '/nri/usa',
          description: 'Vastu-Tech villas for US homeowners',
        },
      ],
    },
  ],
  featured: {
    title: 'The Emerald Villa',
    tagline: '8,200 sq.ft Vastu-Tech Masterpiece in Indiranagar',
    href: '/portfolio/villas',
    image: '/posters/residential-luxury-hero.png',
    ctaText: 'View Case Study →',
  },
};

export const PRICING_SERVICES: readonly NavSubItem[] = [
  { label: 'All Investment Tiers', href: '/pricing' },
  { label: 'Essential Tier (₹1,800/sqft)', href: '/pricing/essential' },
  { label: 'Signature Tier (₹2,800/sqft)', href: '/pricing/signature' },
  { label: 'Elite Tier (Bespoke)', href: '/pricing/elite' },
  { label: 'Remote Digital Design (₹25k-75k)', href: '/digital' },
  { label: 'Interactive Fee Calculator', href: '/pricing/calculator' },
];

export const PRICING_MEGA_MENU: MegaMenuConfig = {
  groups: [
    {
      title: 'Transparent Investment',
      items: [
        {
          label: 'All Investment Tiers',
          href: '/pricing',
          description: 'Zero hidden fees & transparent timeline',
          badge: 'Guaranteed',
        },
        {
          label: 'Essential Luxury Tier',
          href: '/pricing/essential',
          description: '₹1,800/sq.ft curated premium finishes',
        },
        {
          label: 'Signature Bespoke Tier',
          href: '/pricing/signature',
          description: '₹2,800/sq.ft Italian joinery & automation',
          badge: 'Popular',
        },
        {
          label: 'Elite Commission Tier',
          href: '/pricing/elite',
          description: 'Custom architect-designed private luxury',
          badge: 'Elite',
        },
        {
          label: 'Remote Digital Packages',
          href: '/digital',
          description: 'Starter, Pro & Premium remote packages (₹25k-75k)',
          badge: 'Digital',
        },
        {
          label: 'Fee Calculator Tool',
          href: '/pricing/calculator',
          description: 'Estimate your exact project budget instantly',
        },
      ],
    },
  ],
  featured: {
    title: 'Instant Cost Audit',
    tagline: 'Get a accurate BOQ breakdown tailored to your floorplan',
    href: '/pricing/calculator',
    image: '/posters/residential-spotlight.png',
    ctaText: 'Calculate Budget →',
  },
};

export const NAV_ITEMS: readonly NavItem[] = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Residential',
    href: '/residential',
    subItems: RESIDENTIAL_SERVICES,
    megaMenu: RESIDENTIAL_MEGA_MENU,
  },
  {
    label: 'Commercial',
    href: '/commercial',
    subItems: COMMERCIAL_SERVICES,
    megaMenu: COMMERCIAL_MEGA_MENU,
  },
  {
    label: 'Intelligence',
    href: '/intelligence',
    subItems: INTELLIGENCE_SERVICES,
    megaMenu: INTELLIGENCE_MEGA_MENU,
  },
  {
    label: 'Portfolio',
    href: '/portfolio',
    subItems: PORTFOLIO_SERVICES,
    megaMenu: PORTFOLIO_MEGA_MENU,
  },
  {
    label: 'Pricing',
    href: '/pricing',
    subItems: PRICING_SERVICES,
    megaMenu: PRICING_MEGA_MENU,
  },
];

// Label matches §3.1/§3.3's button copy ("Book Audit") verbatim — the
// dedicated conversion route from the sitemap (§2.2 "/book-audit").
export const BOOK_AUDIT: NavItem = { label: 'Book Audit', href: '/book-audit' };
