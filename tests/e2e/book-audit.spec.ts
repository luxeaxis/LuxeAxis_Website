import { expect, test } from '@playwright/test';

/**
 * The Book-Audit flow (Build Backlog T-19) — the site's primary conversion.
 *
 * Driven by keyboard and role queries rather than CSS selectors, because
 * T-19's a11y requirement ("keyboard-complete, error focus mgmt") is the part
 * most likely to regress silently.
 */

// Field locators are role-scoped AND anchored. A bare getByLabel is a
// case-insensitive SUBSTRING match, so it collides twice over here: the consent
// label reads "...by phone, WhatsApp or email", and the contact-method radio is
// labelled "Phone call". Asking for the textbox named /^Phone/ is unambiguous
// and says what is actually meant.
// `getByLabel('Email')` is a case-insensitive SUBSTRING match, and the consent
// label reads "...by phone, WhatsApp or email", so the bare strings match two
// controls each and Playwright fails on strict mode. Anchoring to the start of
// the label is both unambiguous and closer to what is meant.

/**
 * Selects a radio by FOCUSING it and pressing Space, rather than clicking.
 *
 * The radios are `sr-only` so the pill around them can carry the styling. They
 * are fully in the accessibility tree and the tab order — verified in a real
 * browser, where clicking the wrapping label checks them exactly as expected —
 * but they occupy a clipped 1px box, so Playwright's pointer heuristics either
 * refuse the click or report the label as intercepting it.
 *
 * Keyboard is the better instrument here regardless of that: T-19's binding
 * requirement is "keyboard-complete", so exercising the control the way a
 * keyboard user does tests the thing that actually has to hold, and needs no
 * geometry at all.
 */
async function chooseOption(page: import('@playwright/test').Page, label: string) {
  const radio = page.getByRole('radio', { name: label, exact: true });
  await radio.focus();
  await page.keyboard.press('Space');
  await expect(radio).toBeChecked();
}

async function fillStepOne(page: import('@playwright/test').Page) {
  await chooseOption(page, 'Apartment');
  await page.getByLabel('Approximate area (sq ft)').fill('1200');
  await chooseOption(page, 'Signature');
  await page.getByLabel('Where is the property?').fill('Chennai');
}

test('every primary CTA on the site now lands here', async ({ page }) => {
  // This route was the target of five CTAs and 404'd until now.
  await page.goto('/');
  await page.getByRole('banner').getByRole('link', { name: 'Book Audit' }).first().click();
  await expect(page).toHaveURL(/\/book-audit$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Book a free design audit');
});

test('advances to step two once the project basics are answered', async ({ page }) => {
  await page.goto('/book-audit');
  await expect(page.getByText('Step 1 of 2')).toBeVisible();

  await fillStepOne(page);
  await page.getByRole('button', { name: 'Next' }).click();

  await expect(page.getByText('Step 2 of 2')).toBeVisible();
  await expect(page.getByRole('textbox', { name: /^Your name/ })).toBeVisible();
});

test('refuses to advance with the basics missing, and says what is wrong', async ({ page }) => {
  await page.goto('/book-audit');
  await page.getByRole('button', { name: 'Next' }).click();

  // Still on step 1 — an error summary, not a silent no-op.
  await expect(page.getByText('Step 1 of 2')).toBeVisible();
  const summary = page.getByRole('alert').first();
  await expect(summary).toBeVisible();
  await expect(summary).toContainText('to fix before we can send this');

  // The summary takes focus, which is what makes it usable rather than merely
  // present — a screen-reader user is put at the list of problems.
  await expect(summary).toBeFocused();
});

test('error copy tells the visitor what to do rather than blaming them', async ({ page }) => {
  await page.goto('/book-audit');
  await page.getByRole('button', { name: 'Next' }).click();
  const summary = page.getByRole('alert').first();
  await expect(summary).not.toContainText(/invalid|incorrect|wrong/i);
});

test('going back preserves everything already typed', async ({ page }) => {
  // T-19: "never lose data on back". Losing a half-filled form is the most
  // reliable way to lose the lead entirely.
  await page.goto('/book-audit');
  await fillStepOne(page);
  await page.getByRole('button', { name: 'Next' }).click();

  await page.getByRole('textbox', { name: /^Your name/ }).fill('A Visitor');
  await page.getByRole('button', { name: 'Back' }).click();

  await expect(page.getByLabel('Approximate area (sq ft)')).toHaveValue('1200');
  await expect(page.getByLabel('Where is the property?')).toHaveValue('Chennai');
  await expect(page.getByRole('radio', { name: 'Apartment' })).toBeChecked();

  // And forward again — step 2's answer survived the round trip too.
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByRole('textbox', { name: /^Your name/ })).toHaveValue('A Visitor');
});

test('the consent box is never pre-ticked', async ({ page }) => {
  // DPDPA: consent that was not actively given is not consent. This is the one
  // assertion here that is a legal requirement rather than a UX preference.
  await page.goto('/book-audit');
  await fillStepOne(page);
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByRole('checkbox')).not.toBeChecked();
});

test('will not submit without consent', async ({ page }) => {
  await page.goto('/book-audit');
  await fillStepOne(page);
  await page.getByRole('button', { name: 'Next' }).click();

  await page.getByRole('textbox', { name: /^Your name/ }).fill('A Visitor');
  await page.getByRole('textbox', { name: /^Email/ }).fill('visitor@example.com');
  await page.getByRole('textbox', { name: /^Phone/ }).fill('+91 98400 00000');
  await page.getByRole('button', { name: 'Request my audit' }).click();

  await expect(page.getByRole('alert').first()).toContainText('to fix before we can send this');
});

test('the form is completable by keyboard alone', async ({ page }) => {
  await page.goto('/book-audit');
  // Tab from the top of the document until the first form control has focus,
  // rather than clicking into it — this is the journey a keyboard user makes.
  await page.keyboard.press('Tab'); // skip link
  for (let i = 0; i < 25; i += 1) {
    const isRadio = await page.evaluate(
      () => document.activeElement?.getAttribute('type') === 'radio',
    );
    if (isRadio) break;
    await page.keyboard.press('Tab');
  }
  await page.keyboard.press('Space');
  await expect(page.getByRole('radio', { name: 'Apartment' })).toBeChecked();
});

test('says so honestly when the lead endpoint is not configured', async ({ page }) => {
  // LEAD_WEBHOOK_URL is unset in this environment, so /api/lead answers 503 and
  // the form must NOT claim success. A visitor told "we'll call you in 30
  // minutes" for an enquiry that reached nobody is worse off than one told it
  // failed — only the second can do something about it.
  await page.goto('/book-audit');
  await fillStepOne(page);
  await page.getByRole('button', { name: 'Next' }).click();

  await page.getByRole('textbox', { name: /^Your name/ }).fill('A Visitor');
  await page.getByRole('textbox', { name: /^Email/ }).fill('visitor@example.com');
  await page.getByRole('textbox', { name: /^Phone/ }).fill('+91 98400 00000');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Request my audit' }).click();

  await expect(page.getByText('We cannot take bookings through this form yet')).toBeVisible();
  await expect(page.getByText('Nothing you typed has been sent')).toBeVisible();
  // Crucially, no success message.
  await expect(page.getByText('Your audit request is in')).toHaveCount(0);
});

test('a failed submission offers channels that actually work, carrying what was typed', async ({
  page,
}) => {
  // While LEAD_WEBHOOK_URL is unset every submission fails, which makes this
  // the ONLY route by which a Book-Audit enquiry reaches the studio at all.
  // Telling someone "try later" here throws away a lead for no reason.
  await page.goto('/book-audit');
  await fillStepOne(page);
  await page.getByRole('button', { name: 'Next' }).click();

  await page.getByRole('textbox', { name: /^Your name/ }).fill('A Visitor');
  await page.getByRole('textbox', { name: /^Email/ }).fill('visitor@example.com');
  await page.getByRole('textbox', { name: /^Phone/ }).fill('+91 98400 00000');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Request my audit' }).click();

  const email = page.getByRole('link', { name: 'Send it by email instead' });
  const whatsapp = page.getByRole('link', { name: 'Send it on WhatsApp' });
  await expect(email).toBeVisible();
  await expect(whatsapp).toBeVisible();

  // The enquiry travels with the link, so the visitor retypes nothing.
  const mailto = decodeURIComponent((await email.getAttribute('href')) ?? '');
  expect(mailto.startsWith('mailto:info@luxeaxis.in')).toBe(true);
  expect(mailto).toContain('A Visitor');
  expect(mailto).toContain('visitor@example.com');
  expect(mailto).toContain('Chennai');

  const wa = (await whatsapp.getAttribute('href')) ?? '';
  expect(wa.startsWith('https://wa.me/918124600321?text=')).toBe(true);
  expect(decodeURIComponent(wa)).toContain('A Visitor');
});

test('the lead endpoint refuses a GET', async ({ request }) => {
  expect((await request.get('/api/lead')).status()).toBe(405);
});
