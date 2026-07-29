import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// /style is included deliberately: a design-system reference that itself fails
// accessibility is self-refuting, and it renders more component states than any
// real page does — every Button variant, every Field state, both themes — so it
// is the widest axe surface in the app.
const ROUTES = ['/', '/ta', '/pricing', '/style'];

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
