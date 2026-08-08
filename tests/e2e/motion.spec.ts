import { expect, test } from '@playwright/test';

/**
 * Reduced-motion parity (Build Backlog T-22: "e2e reduced-motion parity —
 * content identical, no transforms").
 *
 * The two runs below load the same page with `prefers-reduced-motion` set
 * differently and compare what a visitor actually ends up with. The standard
 * anyone building this has to meet is not "the animation is faster" — it is
 * that a reduced-motion visitor sees the same content, in the same place.
 */

const PAGE = '/pricing';

/** Text of every section heading, in order — the cheapest proxy for "the same
 *  content in the same order". */
async function headings(page: import('@playwright/test').Page) {
  return page.locator('main h2').allTextContents();
}

test('reduced motion produces the same content as full motion', async ({
  browser,
}) => {
  const normal = await browser.newContext({ reducedMotion: 'no-preference' });
  const reduced = await browser.newContext({ reducedMotion: 'reduce' });

  const normalPage = await normal.newPage();
  const reducedPage = await reduced.newPage();
  await normalPage.goto(PAGE);
  await reducedPage.goto(PAGE);

  expect(await headings(reducedPage)).toEqual(await headings(normalPage));

  await normal.close();
  await reduced.close();
});

test('reduced motion leaves nothing hidden or displaced', async ({
  browser,
}) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(PAGE);

  // Every reveal wrapper must be fully opaque and untransformed. This is the
  // assertion that matters: the danger of a reveal system is content stuck at
  // opacity 0, and reduced motion is where a JS-side guard is most likely to be
  // forgotten.
  const offenders = await page.evaluate(() => {
    const bad: string[] = [];
    for (const node of document.querySelectorAll('[data-reveal]')) {
      const style = getComputedStyle(node);
      if (style.opacity !== '1') bad.push(`opacity ${style.opacity}`);
      if (
        style.transform !== 'none' &&
        style.transform !== 'matrix(1, 0, 0, 1, 0, 0)'
      ) {
        bad.push(`transform ${style.transform}`);
      }
    }
    return bad;
  });
  expect(offenders, offenders.join('; ')).toEqual([]);

  await context.close();
});

test('no section is left invisible once scrolled past', async ({ page }) => {
  // The failure this guards is the worst and quietest one available: an element
  // hidden by the reveal system and never un-hidden, so a section is simply
  // blank for everyone with motion enabled.
  //
  // Scrolled in viewport-sized steps rather than jumped to the bottom. That is
  // both what a visitor does and what the assertion requires: a single
  // `scrollTo(0, scrollHeight)` leaves most sections ABOVE the viewport, where
  // IntersectionObserver correctly never fires for them, so the test would
  // report content as "stuck hidden" that was simply skipped.
  await page.goto(PAGE);

  const steps = await page.evaluate(() =>
    Math.ceil(document.body.scrollHeight / window.innerHeight),
  );
  for (let step = 1; step <= steps; step += 1) {
    await page.evaluate(
      (index) => window.scrollTo(0, window.innerHeight * index),
      step,
    );
    await page.waitForTimeout(150);
  }
  // Room for the last 480ms transition to finish.
  await page.waitForTimeout(800);

  const invisible = await page.evaluate(() =>
    [...document.querySelectorAll('[data-reveal]')]
      .filter((node) => getComputedStyle(node).opacity !== '1')
      .map((node) => node.textContent?.slice(0, 40) ?? ''),
  );
  expect(
    invisible,
    `still hidden after scrolling: ${invisible.join(' | ')}`,
  ).toEqual([]);
});

test('content above the fold is never animated', async ({ page }) => {
  // The hero headline is the LCP element. Fading it in delays first meaningful
  // paint to buy nothing, because the visitor is already looking at it.
  await page.goto('/');
  const heroHidden = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    if (!h1) return 'no h1';
    return h1.closest('[data-reveal]')?.getAttribute('data-reveal') ?? 'none';
  });
  expect(heroHidden).toBe('none');
});

test('the page still works with JavaScript disabled', async ({ browser }) => {
  // The reason the reveal system renders its final state on the server: a
  // dropped chunk on bad wifi is far more common than a disabled setting, and
  // either way an animation that fails closed is a blank page.
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(PAGE);

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Three tiers' }),
  ).toBeVisible();
  // No reveal state was ever applied, so nothing can be stuck hidden.
  expect(await page.locator('[data-reveal]').count()).toBe(0);

  await context.close();
});
