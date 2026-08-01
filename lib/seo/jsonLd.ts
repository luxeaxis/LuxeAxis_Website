import { SITE_ORIGIN } from './origin';

/**
 * Structured data (Build Backlog T-20, Spec §2.5).
 *
 * ## What is emitted, and what is deliberately not
 *
 * T-20 lists `Organization`, `LocalBusiness`, `Service`, `Article` and
 * `BreadcrumbList`. Three of those ship here. Two do not, and the reasons are
 * the same reason the visible pages carry "To be published" markers — except
 * that structured data makes the stakes higher, not lower.
 *
 * - **`LocalBusiness` is withheld.** Its useful properties are `address`,
 *   `telephone`, `openingHours` and `geo`, and the studio has supplied none of
 *   them. A `LocalBusiness` node with an invented address is not a placeholder a
 *   reader can see through — it is a machine-readable assertion fed straight
 *   into Google's local index and Maps, where it can generate directions to a
 *   building that has nothing to do with the studio. Emitting the type with its
 *   substance missing also earns nothing: Google ignores an incomplete node at
 *   best, and flags the site at worst. It lands with the real address.
 * - **`Article` is withheld** because there are no articles. It belongs with
 *   the first Journal post.
 *
 * Everything below asserts only what the site already says in prose, which is
 * the rule structured data has to follow: Google treats markup that disagrees
 * with the visible page as spam, so JSON-LD is generated from the same content
 * the page renders rather than hand-maintained beside it.
 */

/** The studio itself. Name and URL are all that is known for certain — no
 *  founding date, no logo asset, no social profiles, no contact point. Each of
 *  those is a real property of this type, and each is omitted rather than
 *  guessed. */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Luxe Axis',
    url: SITE_ORIGIN,
    description:
      'Interior design studio in Chennai. Published pricing, AI-assisted design, and designers who decide.',
  };
}

/** A service the studio offers. `areaServed` is Chennai, which the specs state
 *  throughout; `provider` points back at the Organization node so a crawler can
 *  join them up. No `offers` — that needs a price, and none is published. */
export function serviceJsonLd(input: { name: string; description: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: input.name,
    description: input.description,
    serviceType: 'Interior design',
    areaServed: { '@type': 'City', name: 'Chennai' },
    provider: { '@type': 'Organization', name: 'Luxe Axis', url: SITE_ORIGIN },
    url: new URL(input.url, SITE_ORIGIN).href,
  };
}

/**
 * Breadcrumbs, derived from the URL path rather than passed in.
 *
 * Deriving means the markup cannot drift from where the page actually sits, and
 * it is only safe because every segment of this site's URLs is a real page —
 * which `tests/unit/routes.test.ts` enforces. A `BreadcrumbList` naming an
 * intermediate URL that 404s is worse than none at all.
 *
 * `labels` overrides the humanised segment where a slug reads badly
 * ("retail-hospitality" -> "Retail & Hospitality"), so the crumb matches the
 * page's own heading.
 */
export function breadcrumbJsonLd(path: string, labels: Record<string, string> = {}) {
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

/** `retail-hospitality` -> `Retail Hospitality`. Deliberately dumb: anything
 *  that needs to read better supplies an explicit label. */
export function humanise(segment: string): string {
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
