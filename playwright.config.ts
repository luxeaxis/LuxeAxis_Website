import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  use: { baseURL: 'http://localhost:3000' },
  webServer: { command: 'npm run build && npm run start', url: 'http://localhost:3000', reuseExistingServer: !process.env.CI },
  projects: [
    {
      name: 'chromium',
      testIgnore: /no-webgl\.spec\.ts/,
    },
    {
      // Spec §6.2 gate 4 / QA §12 D: the conversion path must survive with
      // WebGL genuinely unavailable, not merely software-rendered. These
      // flags are asserted, not trusted — the spec's first test fails the
      // whole run if `getContext('webgl')` still resolves.
      name: 'no-webgl',
      testMatch: /no-webgl\.spec\.ts/,
      use: {
        launchOptions: { args: ['--disable-gpu', '--disable-webgl', '--disable-3d-apis'] },
      },
    },
  ],
});
