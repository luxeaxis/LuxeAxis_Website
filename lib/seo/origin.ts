/**
 * The site's absolute origin, in one place.
 *
 * Three separate surfaces need it — hreflang alternates (lib/seo/hreflang.ts),
 * the sitemap (app/sitemap.ts) and the robots `Sitemap:` line (app/robots.ts)
 * — and a sitemap that disagrees with a canonical about the origin is worse
 * than either being wrong alone: it tells a crawler the two URLs are different
 * pages with identical content.
 *
 * `NEXT_PUBLIC_` prefix so the value is inlined at build time and reads the
 * same on the server and (should a client component ever need it) in the
 * browser. The fallback is the production hostname rather than
 * `http://localhost:3000`: a missing env var in a real deployment should
 * degrade to "correct for production", not emit localhost URLs into a live
 * sitemap.
 *
 * `.in`, not `.com` — the studio's domain, confirmed by the team and matching
 * the `@luxeaxis.in` contact addresses. Worth stating because getting this
 * wrong is not a cosmetic error: every canonical, every sitemap entry, every
 * hreflang and every JSON-LD `url` is built from it, so a wrong origin points
 * the whole index at a host the studio does not control. If both domains are
 * owned, whichever is NOT this one should 301 to it rather than serving a
 * duplicate site.
 */
export const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN ?? 'https://luxeaxis.in';
