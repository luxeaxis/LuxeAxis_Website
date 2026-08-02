import { Link } from './Link';
import { JsonLd } from './JsonLd';
import { breadcrumbJsonLd, humanise } from '@/lib/seo/jsonLd';

/**
 * Breadcrumbs — the visible trail and its `BreadcrumbList` markup, from one
 * source (Build Backlog T-20).
 *
 * Generated from the same derived list, never two hand-kept copies. Google
 * treats structured data that disagrees with the visible page as a spam signal,
 * and a second list maintained beside the first is precisely how that
 * disagreement arrives — the same reasoning `components/Faq.tsx` gives for its
 * `FAQPage` node.
 *
 * ## Why it is safe to derive the trail from the URL
 *
 * Every intermediate segment of this site's URLs is a real page:
 * `/residential/signature` implies `/residential`, `/intelligence/vastu-tech`
 * implies `/intelligence`, and both exist. `tests/unit/routes.test.ts` enforces
 * that every route on disk is classified and every nav destination resolves, so
 * a derived crumb cannot point at a 404 — which is the one thing that would
 * make a `BreadcrumbList` worse than none at all.
 *
 * The home crumb is deliberately not rendered visually. A "Home >" prefix on
 * every nested page repeats what the header logo already does, and it is the
 * first thing a keyboard user has to tab past. It stays in the JSON-LD, where
 * position 1 is expected.
 */
export function Breadcrumbs({
  path,
  labels = {},
}: {
  /** The current route, e.g. `/intelligence/vastu-tech`. */
  path: string;
  /** Overrides where a slug reads badly — `retail-hospitality` should show as
   *  "Retail & Hospitality", matching the page's own heading. */
  labels?: Record<string, string>;
}) {
  const segments = path.split('/').filter(Boolean);
  if (segments.length < 2) return null;

  // Everything except the current page, which is shown as plain text rather
  // than a link to itself.
  const trail = segments.slice(0, -1).map((segment, index) => ({
    label: labels[segment] ?? humanise(segment),
    href: `/${segments.slice(0, index + 1).join('/')}`,
  }));
  const current = segments[segments.length - 1]!;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(path, labels)} />
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-small text-on-surface-muted">
          {trail.map((crumb) => (
            <li key={crumb.href} className="flex items-center gap-2">
              <Link href={crumb.href} variant="standalone" className="text-small">
                {crumb.label}
              </Link>
              <span aria-hidden="true">/</span>
            </li>
          ))}
          {/* `aria-current="page"` rather than a link to the page you are on —
              a self-link is a tab stop that goes nowhere. */}
          <li aria-current="page" className="text-on-surface-2">
            {labels[current] ?? humanise(current)}
          </li>
        </ol>
      </nav>
    </>
  );
}
