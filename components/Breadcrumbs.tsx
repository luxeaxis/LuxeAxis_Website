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
 * ## The Home crumb
 *
 * This component used to omit Home from the visible trail, on the grounds that
 * it repeats the header logo and costs a keyboard user a tab stop. The site
 * built since then disagreed in practice — every service, collection and tier
 * page hand-rolled its own trail starting at Home, forty of them, and each copy
 * put the "/" separator directly inside the `<ol>`, which is an axe `list`
 * violation on every route that rendered one.
 *
 * Rendering Home here settles that in the direction the pages had already
 * chosen, and it is the better end anyway: `breadcrumbJsonLd` has always
 * emitted Home at position 1, so a visible Home makes the trail and the
 * structured data *identical* rather than merely compatible — which is the
 * agreement this component exists to guarantee. The tab-stop objection is real
 * but small, and it is paid once per page for a landmark that keyboard and
 * screen-reader users navigate by.
 *
 * The consequence is that a top-level route now renders "Home / Pricing"
 * instead of nothing, which is what those pages were already showing.
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
  // The home page's own trail is just "Home", which is no trail at all.
  if (segments.length === 0) return null;

  // Everything except the current page, which is shown as plain text rather
  // than a link to itself.
  const trail = segments.slice(0, -1).map((segment, index) => ({
    label: labels[segment] ?? humanise(segment),
    href: `/${segments.slice(0, index + 1).join('/')}`,
  }));
  trail.unshift({ label: 'Home', href: '/' });
  const current = segments[segments.length - 1]!;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(path, labels)} />
      <nav aria-label="Breadcrumb" className="py-2.5 mb-4 sm:mb-6">
        <ol className="flex flex-wrap items-center gap-2 text-small text-on-surface-muted">
          {trail.map((crumb) => (
            <li key={crumb.href} className="flex items-center gap-2">
              <Link
                href={crumb.href}
                variant="standalone"
                className="text-small"
              >
                {crumb.label}
              </Link>
              <span aria-hidden="true">/</span>
            </li>
          ))}
          {/* `aria-current="page"` rather than a link to the page you are on —
              a self-link is a tab stop that goes nowhere. Accent + weight, so
              "you are here" survives a greyscale print and a colour-blind
              reader — never colour alone, the same rule Header follows. */}
          <li aria-current="page" className="font-semibold text-accent">
            {labels[current] ?? humanise(current)}
          </li>
        </ol>
      </nav>
    </>
  );
}
