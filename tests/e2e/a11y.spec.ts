import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// /style is included deliberately: a design-system reference that itself fails
// accessibility is self-refuting, and it renders more component states than any
// real page does — every Button variant, every Field state, both themes — so it
// is the widest axe surface in the app.
//
// The 404 is in the list for a blunter reason: it is currently the most
// likely destination on the whole site. lib/nav.ts and components/Footer.tsx
// link ahead of the build to roughly thirty routes that do not exist yet, so
// most nav clicks land there — and until app/not-found.tsx shipped it was
// Next's own fallback, with no lang, no header and no skip-link target, and
// the only page no gate ever looked at.
const ROUTES = [
  '/',
  '/pricing',
  '/residential',
  '/residential/signature',
  '/book-audit',
  '/intelligence',
  '/intelligence/vastu-tech',
  '/process',
  '/nri',
  '/nri/singapore',
  '/commercial/workplace',
  '/about',
  '/journal',
  '/portfolio',
  '/contact',
  '/privacy',
  '/accessibility',
  '/style',
  '/this-route-does-not-exist',
  // The service, collection, tier and package routes. These are built from a
  // shared template, so one of each family would catch a template fault — but
  // not a per-page copy fault, and every one of them carries its own hand-
  // written headings, tables and FAQ blocks. The whole family shipped without
  // ever being looked at by axe, which is how forty copies of a malformed
  // breadcrumb reached main; the extra minute of runtime is the cheaper side
  // of that trade.
  '/residential/modular-kitchen',
  '/residential/luxury',
  '/residential/3d-design',
  '/portfolio/villas',
  '/portfolio/penthouses',
  '/portfolio/apartments',
  '/pricing/essential',
  '/pricing/signature',
  '/pricing/elite',
  '/pricing/calculator',
  '/digital/starter',
  '/digital/pro',
  '/digital/premium',
];

for (const route of ROUTES) {
  test(`${route} has no serious or critical accessibility violations`, async ({
    page,
  }) => {
    await page.goto(route);
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    const blocking = violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    );
    expect(
      blocking,
      JSON.stringify(
        blocking.map((v) => v.id),
        null,
        2,
      ),
    ).toEqual([]);
  });
}
