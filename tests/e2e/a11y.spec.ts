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
// most nav clicks land there — and until app/[locale]/not-found.tsx shipped it
// was the one page rendering outside the locale layout, with no lang, no
// header and no skip-link target, and the only one no gate ever looked at.
const ROUTES = ['/', '/ta', '/pricing', '/style', '/this-route-does-not-exist'];

for (const route of ROUTES) {
  test(`${route} has no serious or critical accessibility violations`, async ({ page }) => {
    await page.goto(route);
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    const blocking = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(blocking, JSON.stringify(blocking.map((v) => v.id), null, 2)).toEqual([]);
  });
}
