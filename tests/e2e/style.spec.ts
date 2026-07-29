import { expect, test } from '@playwright/test';

/** Kept in sync with `ButtonVariant` in components/Button.tsx.
 *
 *  The point of this list is to fail when someone adds a variant and does not
 *  document it. `/style` is the only place a human can see what the system
 *  actually offers, so an undocumented variant is a variant nobody knows
 *  exists — it gets reinvented, inconsistently, at the next call site. */
const LABELLED_VARIANTS = ['primary', 'secondary', 'tertiary', 'destructive'];

test.describe('/style documents the component surface', () => {
  test('renders every labelled Button variant', async ({ page }) => {
    await page.goto('/style');
    for (const variant of LABELLED_VARIANTS) {
      // Three sizes x two themes, so each label appears repeatedly; asserting
      // "at least one" is the meaningful check.
      await expect(
        page.getByRole('button', { name: variant, exact: true }).first(),
        `Button variant "${variant}" is not documented on /style`,
      ).toBeVisible();
    }
  });

  test('renders the icon-only Button, which has no visible label', async ({ page }) => {
    await page.goto('/style');
    await expect(page.getByRole('button', { name: 'Close' }).first()).toBeVisible();
  });

  test('renders both themes on one page so a theme regression is visible', async ({ page }) => {
    await page.goto('/style');
    // Scoped to `main`: <html> itself carries data-theme="dark", so an
    // unscoped selector counts the document as a specimen.
    await expect(page.locator('main [data-theme="dark"]')).toHaveCount(1);
    await expect(page.locator('main [data-theme="light"]')).toHaveCount(1);
  });

  test('the Tamil specimen carries lang="ta" so the font stack resolves', async ({ page }) => {
    await page.goto('/style');
    await expect(page.locator('[lang="ta"]').first()).toBeVisible();
  });

  test('is not indexable — it is a developer reference, not a marketing surface', async ({ page }) => {
    await page.goto('/style');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  });
});
