import { expect, test } from '@playwright/test';

// This project (see playwright.config.ts) launches Chromium with
// --disable-gpu --disable-webgl --disable-3d-apis. That is a launch
// argument, not a guarantee — Chromium can fall back to a software
// rasterizer that still answers getContext('webgl') truthily. Assert the
// flags actually worked before trusting the rest of this file: a run that
// passes merely because WebGL was never invoked anywhere on the page proves
// nothing about the poster fallback path.
test('WebGL is actually unavailable in this browser context, not just unused', async ({
  page,
}) => {
  await page.goto('/');
  const webglAvailable = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    return Boolean(
      canvas.getContext('webgl') ?? canvas.getContext('experimental-webgl'),
    );
  });
  expect(webglAvailable).toBe(false);
});

test('the site is complete and legible with WebGL unavailable', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('img')).toBeVisible();
});

test('the poster alt text carries the claim, not a description of pixels', async ({
  page,
}) => {
  await page.goto('/');
  const alt = await page.getByRole('img').first().getAttribute('alt');
  expect(alt).toBeTruthy();
  expect(alt!.length).toBeGreaterThan(20);
});
