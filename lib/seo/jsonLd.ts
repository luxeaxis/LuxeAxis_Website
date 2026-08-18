import { SITE_ORIGIN } from './origin';
import { STUDIO } from '@/lib/content/studio';

/**
 * Structured data (Schema.org / JSON-LD) for SEO, AEO (Answer Engine Optimization)
 * and Local Business Rich Snippets.
 */

/**
 * The Organization schema — Global entity definition.
 */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Luxe Axis',
    legalName: STUDIO.legalName,
    url: SITE_ORIGIN,
    description:
      'Chennai’s premier technology-native luxury interior design & Vastu-Tech architectural studio.',
  };
}

/**
 * The LocalBusiness schema — Highly detailed for Google Local Search & Maps.
 */
export function localBusinessJsonLd() {
  const { address, telephone, email, gst, name, legalName } = STUDIO;
  if (!address) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_ORIGIN}#studio`,
    name,
    legalName,
    url: SITE_ORIGIN,
    telephone: telephone?.e164 ?? '+918124600321',
    email: email?.general ?? 'info@luxeaxis.in',
    priceRange: '₹₹₹₹',
    currenciesAccepted: 'INR, USD, SGD, AED',
    paymentAccepted: 'Wire Transfer, Credit Card, Bank Transfer',
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.street,
      addressLocality: address.locality,
      addressRegion: address.region,
      postalCode: address.postalCode,
      addressCountry: address.country,
    },
    areaServed: [
      { '@type': 'City', name: 'Chennai' },
      { '@type': 'AdministrativeArea', name: 'Tamil Nadu' },
      { '@type': 'Country', name: 'India' },
    ],
    knowsAbout: [
      'Luxury Interior Design',
      'Turnkey Residential Architecture',
      'Vastu-Tech AI Spatial Planning',
      'German CNC Modular Kitchens',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '128',
      bestRating: '5',
      worstRating: '1',
    },
    ...(gst ? { taxID: gst } : {}),
  };
}

/**
 * WebSite schema with SearchAction metadata for Google SERP branding.
 */
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_ORIGIN}#website`,
    name: 'Luxe Axis',
    url: SITE_ORIGIN,
    description:
      'Chennai’s premier luxury interior design, residential architecture & Vastu-Tech studio.',
    inLanguage: 'en-IN',
    publisher: {
      '@type': 'Organization',
      name: 'Luxe Axis',
      url: SITE_ORIGIN,
    },
  };
}

/**
 * Service schema for residential & commercial service pages.
 */
export function serviceJsonLd(input: {
  name: string;
  description: string;
  url: string;
  image?: string;
  serviceType?: string;
  offers?: boolean;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: input.name,
    description: input.description,
    serviceType: input.serviceType ?? 'Luxury Interior Design & Architectural Execution',
    areaServed: { '@type': 'City', name: 'Chennai' },
    provider: {
      '@type': 'LocalBusiness',
      name: 'Luxe Axis',
      url: SITE_ORIGIN,
      telephone: '+918124600321',
    },
    url: new URL(input.url, SITE_ORIGIN).href,
    ...(input.image ? { image: new URL(input.image, SITE_ORIGIN).href } : {}),
    ...(input.offers
      ? {
          offers: {
            '@type': 'Offer',
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            url: new URL('/pricing/calculator', SITE_ORIGIN).href,
            description: 'Transparent un-gated BOQ pricing with 45-day handover guarantee.',
          },
        }
      : {}),
  };
}

/**
 * FAQPage schema for Answer Engine Optimization (AEO) and rich SERP accordions.
 */
export function faqPageJsonLd(faqs: Array<{ q: string; a: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };
}

/**
 * BreadcrumbList schema.
 */
export function breadcrumbJsonLd(
  path: string,
  labels: Record<string, string> = {},
) {
  const segments = path.split('/').filter(Boolean);
  const items = [{ name: 'Home', url: SITE_ORIGIN }];

  let href = '';
  for (const segment of segments) {
    href += `/${segment}`;
    items.push({
      name: labels[segment] ?? humanise(segment),
      url: new URL(href, SITE_ORIGIN).href,
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Helper to humanise URL slugs into readable names.
 */
export function humanise(segment: string): string {
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
