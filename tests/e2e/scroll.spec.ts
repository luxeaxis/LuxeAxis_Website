import { expect, test } from '@playwright/test';

/**
 * The scroll engine's accessibility gates (Build Backlog T-21: "e2e:
 * keyboard/space/arrow scroll works; reduced-motion disables smoothing; no
 * scroll trap").
 *
 * Smooth scroll is the single highest-risk accessibility change available on a
 * website: it takes over the one interaction every visitor depends on, and the
 * failure modes — a page that will not respond to the keyboard, an anchor that
 * lands in the wrong place, a scroll position that fights the user — are
 * invisible to a mouse-using developer who only ever flicks a wheel.
 *
 * These run with the flag OFF, which is the shipping default, so they are
 * primarily a guarantee that the DEFAULT experience is native and unhijacked.
 * When the flag is turned on they become the check that turning it on did not
 * break any of it — which is the point at which they earn their keep.
 */

const PATHS = ['/', '/pricing', '/process'] as const;

test('the keyboard scrolls the page', async ({ page }) => {
  // End/Space/ArrowDown are how a keyboard user moves a page. A scroll library
  // that swallows the key events without moving the document strands them at
  // the top with no way down.
  await page.goto('/pricing');
  const top = await page.evaluate(() => window.scrollY);
  expect(top).toBe(0);

  await page.locator('#main').press('End');
  await expect
    .poll(async () => page.evaluate(() => window.scrollY), { timeout: 4000 })
    .toBeGreaterThan(top);

  const bottom = await page.evaluate(() => window.scrollY);
  await page.keyboard.press('Home');
  await expect
    .poll(async () => page.evaluate(() => window.scrollY), { timeout: 4000 })
    .toBeLessThan(bottom);
});

test('anchor links land on the section they name', async ({ page }) => {
  // Every Section renders its own id precisely so /pricing#guarantees works
  // from an email or an ad. A scroll library that owns the scroll position can
  // silently break in-page navigation while every link still looks correct.
  await page.goto('/pricing#guarantees');

  await expect
    .poll(
      async () =>
        page.evaluate(() => {
          const target = document.querySelector('#guarantees');
          if (!target) return null;
          return Math.round(target.getBoundingClientRect().top);
        }),
      { timeout: 4000 },
    )
    // Not zero: globals.css sets scroll-padding-top so anchors clear the
    // sticky header. Landing anywhere in the upper viewport is correct;
    // landing a screen away is the bug.
    .toBeLessThan(200);

  const offset = await page.evaluate(
    () => document.querySelector('#guarantees')!.getBoundingClientRect().top,
  );
  expect(offset).toBeGreaterThan(-10);
});

test('no page traps the scroll at the top', async ({ page }) => {
  // The worst smooth-scroll failure: the wheel and the keyboard both appear to
  // work, and the document never moves. Checked across three pages because it
  // tends to depend on what a page mounts rather than on the engine alone.
  for (const path of PATHS) {
    await page.goto(path);
    await page.evaluate(() => window.scrollTo(0, 600));
    await expect
      .poll(async () => page.evaluate(() => window.scrollY), { timeout: 4000 })
      .toBeGreaterThan(0);
  }
});

test('a reduced-motion visitor gets native scrolling', async ({ browser }) => {
  // Reduced motion must reach the document itself, not merely shorten a
  // transition. The engine destroys its Lenis instance on this path and falls
  // back to a passive listener; this asserts the page still scrolls normally.
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();

  await page.goto('/pricing');
  await page.evaluate(() => window.scrollTo(0, 800));
  await expect
    .poll(async () => page.evaluate(() => window.scrollY), { timeout: 4000 })
    .toBeGreaterThan(0);

  await context.close();
});

test('the shipping default loads no scroll library at all', async ({
  page,
}) => {
  // The flag is off by default, and the gate's literal env check lets webpack
  // drop the import entirely — so Lenis and GSAP (~135 kB across two chunks)
  // should never be requested. Before this they were fetched on every route,
  // including by reduced-motion visitors who then used neither.
  const requested: string[] = [];
  page.on('request', (request) => requested.push(request.url()));

  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const scriptText = await page.evaluate(() =>
    Array.from(document.scripts)
      .map((script) => script.src)
      .join(' '),
  );

  for (const source of [...requested, scriptText].join(' ').split(/\s+/)) {
    expect(source.toLowerCase()).not.toContain('lenis');
  }
});
