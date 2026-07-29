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

export type NavItem = { label: string; href: string };

export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Residential', href: '/residential' },
  { label: 'Commercial', href: '/commercial' },
  { label: 'Intelligence', href: '/intelligence' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Pricing', href: '/pricing' },
];

// Label matches §3.1/§3.3's button copy ("Book Audit") verbatim — the
// dedicated conversion route from the sitemap (§2.2 "/book-audit").
export const BOOK_AUDIT: NavItem = { label: 'Book Audit', href: '/book-audit' };
