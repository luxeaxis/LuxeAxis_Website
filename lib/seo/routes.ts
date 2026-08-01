/**
 * The routes that actually have a page, split by whether a crawler should
 * index them.
 *
 * This list exists because `app/sitemap.ts` cannot be trusted to a glob: the
 * sitemap is a promise to a crawler that every URL in it resolves, and the
 * fastest way to break that promise is to add a route file and forget the
 * sitemap, or to remove one and leave it advertised. `tests/unit/routes.test.ts`
 * walks `app/[locale]` and fails if the two ever disagree in either direction,
 * so adding a page without classifying it here is a test failure, not a silent
 * SEO regression.
 *
 * NOT the same list as `lib/nav.ts`. Nav deliberately links ahead of the build
 * to routes that do not exist yet (see that file); this list is only ever what
 * is genuinely reachable today. Conflating them is what would put a 404 in the
 * sitemap.
 */

/** Real pages, meant to be found. Dynamic routes are listed by their expanded
 *  URLs (the three tiers, not `/residential/[tier]`) because that is what a
 *  crawler is being promised — and the drift test expands the segment through
 *  its own `generateStaticParams` to check exactly that. */
export const INDEXABLE_ROUTES = [
  '/',
  '/pricing',
  '/residential',
  '/residential/essential',
  '/residential/signature',
  '/residential/elite',
  '/book-audit',
] as const;

/** Real pages deliberately withheld from crawlers. `/style` sets
 *  `robots: { index: false, follow: false }` in its own metadata — it is a
 *  developer reference, not a marketing surface — and is listed here so the
 *  drift test can tell "excluded on purpose" apart from "forgotten". */
export const NOINDEX_ROUTES = ['/style'] as const;
