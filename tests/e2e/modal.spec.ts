import { expect, test } from '@playwright/test';

/**
 * Modal focus management, exercised in a real browser.
 *
 * `tests/unit/modal.test.tsx` already covers this thoroughly, but jsdom models
 * focus less faithfully than anything else it emulates: it has no real tab
 * order, no true `:focus-visible`, and no layout, so a trap that passes there
 * can still leak in a browser. These assertions are deliberately the same
 * behaviours, re-checked where they actually matter.
 */
test.describe('Modal', () => {
  test('traps focus, closes on Esc, and returns focus to its trigger', async ({ page }) => {
    await page.goto('/style');

    const trigger = page.getByRole('button', { name: 'Open the modal' });
    await trigger.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute('aria-modal', 'true');

    // Focus must have moved inside — a dialog that opens with focus left
    // behind it is one a keyboard user cannot reach.
    await expect(dialog.locator(':focus')).toBeVisible();

    // Tab all the way round: focus must still be inside the dialog, never
    // escaped to the page behind it.
    for (let i = 0; i < 8; i += 1) await page.keyboard.press('Tab');
    await expect(dialog.locator(':focus')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();

    // The specific element that opened it, not merely "something focusable".
    await expect(trigger).toBeFocused();
  });

  test('releases the body scroll lock once closed', async ({ page }) => {
    await page.goto('/style');
    const overflowAtRest = await page.evaluate(() => getComputedStyle(document.body).overflow);

    await page.getByRole('button', { name: 'Open the modal' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).toBe('hidden');

    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();

    // Back to whatever it was before, not merely "not hidden" — a lock that
    // half-releases is how a page ends up permanently unscrollable.
    await expect
      .poll(() => page.evaluate(() => getComputedStyle(document.body).overflow))
      .toBe(overflowAtRest);
  });

  test('a toast announces politely and does not steal focus', async ({ page }) => {
    await page.goto('/style');

    const trigger = page.getByRole('button', { name: 'Fire a success toast' });
    await trigger.click();

    // Scoped to the toast region: the page also renders a Field in its error
    // state, which legitimately carries role="alert" and would otherwise
    // satisfy a looser selector.
    const toast = page.getByRole('status').filter({ hasText: 'Audit request received' });
    await expect(toast).toBeVisible();

    // A toast that grabs focus interrupts whatever the visitor was doing.
    await expect(trigger).toBeFocused();
  });
});
