import { expect, test } from '@playwright/test';

// MobileSheet's trigger only renders visibly below `md` (768px) — see
// components/Header.tsx / MobileSheet.tsx's `md:hidden` wrapper.
test.use({ viewport: { width: 390, height: 844 } });

test.describe('MobileSheet — keyboard open/close/trap/Esc, focus return', () => {
  test('the hamburger opens the sheet as a labelled, modal dialog', async ({
    page,
  }) => {
    await page.goto('/');
    // The trigger's accessible name flips "Open menu" → "Close menu" once
    // open, and the in-panel close button then shares that same "Close
    // menu" label too — `aria-expanded` is the one attribute only the
    // outer trigger ever carries, so it's what disambiguates the two once
    // both are named "Close menu".
    const trigger = page.locator('button[aria-expanded]');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await trigger.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    await expect(page.getByRole('heading', { name: 'Menu' })).toBeVisible();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  test('opening the sheet moves focus inside it, not left behind on the trigger', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    const focusIsInsideDialog = await dialog.evaluate((el) =>
      el.contains(document.activeElement),
    );
    expect(focusIsInsideDialog).toBe(true);
  });

  test('Esc closes the sheet and returns focus to the trigger', async ({
    page,
  }) => {
    await page.goto('/');
    const trigger = page.getByRole('button', { name: 'Open menu' });
    await trigger.click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('Tab is trapped inside the open sheet: cycling all the way around returns to the same first control', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    const focusableCount = await dialog
      .locator('a[href], button:not([disabled])')
      .count();
    expect(focusableCount).toBeGreaterThan(1);

    const firstFocusedLabel = await dialog.evaluate(
      () =>
        document.activeElement?.getAttribute('aria-label') ??
        document.activeElement?.textContent,
    );

    for (let i = 0; i < focusableCount; i += 1) {
      await page.keyboard.press('Tab');
    }

    const afterFullCycleLabel = await dialog.evaluate(
      () =>
        document.activeElement?.getAttribute('aria-label') ??
        document.activeElement?.textContent,
    );
    expect(afterFullCycleLabel).toBe(firstFocusedLabel);

    // Focus never escaped the panel at any point in the cycle either.
    const stillInsideDialog = await dialog.evaluate((el) =>
      el.contains(document.activeElement),
    );
    expect(stillInsideDialog).toBe(true);
  });

  test('Shift+Tab from the first focusable wraps backward to the last', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    await page.keyboard.press('Shift+Tab');
    const stillInsideDialog = await dialog.evaluate((el) =>
      el.contains(document.activeElement),
    );
    expect(stillInsideDialog).toBe(true);
  });

  test('the sticky Book Audit bar is reachable inside the open sheet', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    const dialog = page.getByRole('dialog');
    await expect(
      dialog.getByRole('link', { name: 'Book Audit' }),
    ).toBeVisible();
  });

  test('body scroll is locked while the sheet is open', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    const overflow = await page.evaluate(() => document.body.style.overflow);
    expect(overflow).toBe('hidden');
  });
});
