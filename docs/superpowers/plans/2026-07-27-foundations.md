# Luxe Axis Foundations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the deployable foundation of the Luxe Axis website — token pipeline, bilingual routing, app shell, and the SceneSlot contract — with every quality gate enforced in CI.

**Architecture:** A single Next.js 14 App Router application, Server Components by default. Design tokens flow from one DTCG source through Style Dictionary into CSS custom properties and a Tailwind theme; component tokens reference a theme-agnostic `semantic` tier so a `data-theme` flip re-resolves everything with no rebuild. Every cinematic moment on the site is a `SceneSlot` whose default render is a static poster; live WebGL is a lazily-registered upgrade that this plan deliberately leaves empty.

**Tech Stack:** Next.js 14.2 · React 18.3 · TypeScript 5.7 (strict) · Tailwind CSS 3.4 · Style Dictionary 4.3 · next-intl 3.26 · Zustand 5 · Vitest 2 · Playwright 1.49 · pnpm

**Spec:** `docs/superpowers/specs/2026-07-27-luxeaxis-architecture-design.md`

## Global Constraints

Every task's requirements implicitly include this section.

- **TypeScript strict.** No `any` without a written justification comment.
- **Server Components by default.** `"use client"` only where state, effects, or handlers are required.
- **Tokens only.** No hard-coded colour, space, duration, or easing value in any component. Components consume semantic or component tokens, never primitives.
- **Layering is one-directional:** `routes → features → components → primitives → tokens`. A module may import only from layers below it.
- **One coupling point between DOM and WebGL:** `three/registry.ts`. Nothing else.
- **Initial route JS ≤ 200 KB gzip.** `three` / R3F excluded from first load.
- **Fonts ≤ 130 KB per locale**, not globally. Tamil families load only on `/ta/*`.
- **WCAG 2.2 AA** is an acceptance gate. `axe` 0 serious/critical.
- **Locales:** `en` (default, unprefixed) and `ta` (under `/ta`). A route is Tamil-live only when a human-reviewed translation exists; otherwise it 307s to English.
- **Forbidden copy:** never "world-class", "best-in-class", "unbeatable", "cheapest".
- **Node ≥ 20.11**, pnpm ≥ 9.

---

## File Structure

| Path | Responsibility |
|---|---|
| `tokens/luxe-axis.tokens.json` | Canonical DTCG source: primitives, `theme.dark.*`, `theme.light.*`, component tokens |
| `tokens/modes/{dark,light}.json` | Map `semantic.*` → the corresponding `theme.<mode>.*` |
| `tokens/transforms.ts` | Custom Style Dictionary shadow transform |
| `scripts/build-tokens.ts` | Runs Style Dictionary twice, once per mode |
| `styles/tokens.css` | **Generated.** Never hand-edited |
| `lib/color/contrast.ts` | WCAG relative luminance and contrast ratio |
| `lib/store.ts` | Zustand store: tier, reducedMotion, activeScene, ladder rungs |
| `lib/tier/resolve.ts` | Pure tier resolution from environment signals |
| `lib/tier/useDeviceTier.ts` | React binding for the above |
| `lib/i18n/published.ts` | Which `(route, locale)` pairs are published |
| `lib/seo/hreflang.ts` | Emits alternates for published locales only |
| `i18n/routing.ts`, `i18n/request.ts` | next-intl configuration |
| `middleware.ts` | Locale negotiation + 307 for unpublished Tamil routes |
| `three/registry.ts` | `SceneId`, `ScenePoster`, `SceneModule`, `POSTERS`, `SCENES` |
| `components/SceneSlot.tsx` | Renders poster + children; upgrades to live scene when eligible |
| `components/SkipLink.tsx` | First element in tab order |
| `app/[locale]/layout.tsx` | App shell: theme, providers, landmarks |

---

## Task 1: Repository scaffold and verify pipeline

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `.gitattributes`, `eslint.config.mjs`, `vitest.config.ts`, `.prettierrc`
- Create: `app/layout.tsx`, `app/page.tsx`
- Create: `tests/unit/smoke.test.ts`
- Move: the eight `LuxeAxis_*.md` files and `luxe-axis.tokens.json` into `docs/` and `tokens/`

**Interfaces:**
- Consumes: nothing
- Produces: `pnpm verify` — runs typecheck, lint, and unit tests. Every later task ends by running it.

- [ ] **Step 1: Create `.gitattributes` before anything else**

Git reported LF→CRLF warnings on every existing file. Fix it once, at the root, so generated CSS and JSON stay stable across machines.

```
* text=auto eol=lf
*.jpg binary
*.png binary
*.glb binary
*.ktx2 binary
```

- [ ] **Step 2: Create `package.json`**

```json
{
  "name": "luxeaxis-web",
  "version": "0.1.0",
  "private": true,
  "packageManager": "pnpm@9.15.0",
  "engines": { "node": ">=20.11" },
  "scripts": {
    "dev": "next dev",
    "build": "pnpm tokens && next build",
    "start": "next start",
    "tokens": "tsx scripts/build-tokens.ts",
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "verify": "pnpm typecheck && pnpm lint && pnpm test"
  },
  "dependencies": {
    "next": "14.2.20",
    "react": "18.3.1",
    "react-dom": "18.3.1"
  },
  "devDependencies": {
    "@types/node": "22.10.2",
    "@types/react": "18.3.17",
    "@types/react-dom": "18.3.5",
    "@vitejs/plugin-react": "4.3.4",
    "eslint": "9.17.0",
    "eslint-config-next": "14.2.20",
    "prettier": "3.4.2",
    "tsx": "4.19.2",
    "typescript": "5.7.2",
    "vitest": "2.1.8"
  }
}
```

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "jsx": "preserve",
    "incremental": true,
    "skipLibCheck": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

`noUncheckedIndexedAccess` is on deliberately. `POSTERS[id]` must be provably present, and this is what makes that a compile error rather than a runtime surprise.

- [ ] **Step 4: Create `next.config.mjs` and `vitest.config.ts`**

```js
// next.config.mjs
/** @type {import('next').NextConfig} */
export default {
  reactStrictMode: true,
  images: { formats: ['image/avif', 'image/webp'] },
};
```

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': resolve(__dirname, '.') } },
  test: { environment: 'node', include: ['tests/unit/**/*.test.ts?(x)'] },
});
```

- [ ] **Step 5: Create `eslint.config.mjs` enforcing the layering rule**

```js
import next from 'eslint-config-next';

export default [
  ...next(),
  {
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { group: ['@/features/*'], message: 'components/ may not import from features/ — see spec §1.2 layering.' },
          { group: ['@/three/!(registry)'], message: 'three/registry.ts is the only DOM→WebGL seam — see spec §1.2.' },
        ],
      }],
    },
  },
];
```

- [ ] **Step 6: Create a placeholder app so `next build` succeeds**

```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
```

```tsx
// app/page.tsx
export default function Page() {
  return <main><h1>Luxe Axis</h1></main>;
}
```

Task 4 replaces both with the locale-segmented shell.

- [ ] **Step 7: Write the failing smoke test**

```ts
// tests/unit/smoke.test.ts
import { describe, expect, it } from 'vitest';
import pkg from '../../package.json';

describe('scaffold', () => {
  it('pins an exact Next.js version so CI and local builds match', () => {
    expect(pkg.dependencies.next).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('exposes a single verify entry point', () => {
    expect(pkg.scripts.verify).toContain('typecheck');
    expect(pkg.scripts.verify).toContain('lint');
    expect(pkg.scripts.verify).toContain('test');
  });
});
```

- [ ] **Step 8: Run the test to verify it fails**

Run: `pnpm vitest run tests/unit/smoke.test.ts`
Expected: FAIL — `Cannot find module '../../package.json'` until Step 2's file exists, or a version-range mismatch if a caret slipped in.

- [ ] **Step 9: Install and verify the whole pipeline**

```bash
pnpm install
pnpm verify
```

Expected: typecheck passes, lint passes, 2 tests pass.

- [ ] **Step 10: Move the specification documents out of the repo root**

```bash
mkdir -p docs/specs tokens
git mv LuxeAxis_3D_Interaction_Framework.md LuxeAxis_3D_Website_Spec.md \
       LuxeAxis_Build_Backlog.md LuxeAxis_Cinematic_Direction.md \
       LuxeAxis_Design_System.md LuxeAxis_Landing_Page_Blueprint.md \
       LuxeAxis_Master_Program.md LuxeAxis_Performance_A11y_QA.md docs/specs/
git mv luxe-axis.tokens.json tokens/
git mv brand public/brand
```

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app with strict TS and verify pipeline"
```

---

## Task 2: Token pipeline with the semantic tier

**Files:**
- Modify: `tokens/luxe-axis.tokens.json` (component tokens → `{semantic.*}`; add three semantic roles)
- Create: `tokens/modes/dark.json`, `tokens/modes/light.json`
- Create: `tokens/transforms.ts`, `scripts/build-tokens.ts`
- Create: `tailwind.config.ts`, `styles/globals.css`
- Test: `tests/unit/tokens.test.ts`

**Interfaces:**
- Consumes: `pnpm verify` from Task 1
- Produces: `styles/tokens.css` declaring `--surface`, `--on-surface`, `--accent`, `--accent-contrast`, `--accent-hover`, `--signal`, `--focus-ring`, `--border-subtle`, `--border`, `--border-strong`, `--field-bg`, `--field-border-focus` under `:root` and `[data-theme="light"]`; component variables `--btn-primary-bg`, `--btn-primary-fg`, `--card-bg`, `--nav-bg` declared once as `var()` references. Also `pnpm tokens`, run by `pnpm build`.

- [ ] **Step 1: Add the three missing semantic roles to `theme.dark` and `theme.light`**

Spec §2.2 requires these; the source file has none of them. Add to `theme.dark`:

```jsonc
"accent-hover":       { "$value": "{color.brand.gold-champagne}" },
"field-bg":           { "$value": "rgba(252,250,245,0.04)" },
"field-border-focus": { "$value": "{color.brand.gold}" }
```

And to `theme.light`:

```jsonc
"accent-hover":       { "$value": "#15656E", "$description": "Teal darkened for hover; on ivory 6.1:1." },
"field-bg":           { "$value": "rgba(13,43,78,0.03)" },
"field-border-focus": { "$value": "{color.brand.teal}" }
```

- [ ] **Step 2: Create the two mode files**

```json
// tokens/modes/dark.json
{
  "semantic": {
    "$type": "color",
    "surface":            { "$value": "{theme.dark.surface}" },
    "surface-deep":       { "$value": "{theme.dark.surface-deep}" },
    "surface-raised":     { "$value": "{theme.dark.surface-raised}" },
    "on-surface":         { "$value": "{theme.dark.on-surface}" },
    "on-surface-2":       { "$value": "{theme.dark.on-surface-2}" },
    "on-surface-muted":   { "$value": "{theme.dark.on-surface-muted}" },
    "accent":             { "$value": "{theme.dark.accent}" },
    "accent-contrast":    { "$value": "{theme.dark.accent-contrast}" },
    "accent-hover":       { "$value": "{theme.dark.accent-hover}" },
    "signal":             { "$value": "{theme.dark.signal}" },
    "border-subtle":      { "$value": "{theme.dark.border-subtle}" },
    "border":             { "$value": "{theme.dark.border}" },
    "border-strong":      { "$value": "{theme.dark.border-strong}" },
    "focus-ring":         { "$value": "{theme.dark.focus-ring}" },
    "field-bg":           { "$value": "{theme.dark.field-bg}" },
    "field-border-focus": { "$value": "{theme.dark.field-border-focus}" }
  }
}
```

`tokens/modes/light.json` is byte-identical with `theme.dark` replaced by `theme.light` throughout.

- [ ] **Step 3: Rewrite the component tier to reference semantics**

In `tokens/luxe-axis.tokens.json`, replace the `component` block's primitive references:

```jsonc
"component": {
  "button": {
    "height-sm":        { "$type": "dimension", "$value": "{size.control-sm}" },
    "height-md":        { "$type": "dimension", "$value": "{size.control-md}" },
    "height-lg":        { "$type": "dimension", "$value": "{size.control-lg}" },
    "padding-x-md":     { "$type": "dimension", "$value": "{space.5}" },
    "radius":           { "$type": "dimension", "$value": "{radius.pill}" },
    "gap":              { "$type": "dimension", "$value": "{space.2}" },
    "dur":              { "$type": "duration",  "$value": "{duration.micro}" },
    "primary-bg":       { "$type": "color", "$value": "{semantic.accent}" },
    "primary-fg":       { "$type": "color", "$value": "{semantic.accent-contrast}" },
    "primary-hover-bg": { "$type": "color", "$value": "{semantic.accent-hover}" }
  },
  "card": {
    "radius":  { "$type": "dimension", "$value": "{radius.lg}" },
    "padding": { "$type": "dimension", "$value": "{space.6}" },
    "gap":     { "$type": "dimension", "$value": "{space.4}" },
    "bg":      { "$type": "color", "$value": "{semantic.surface-raised}" },
    "border":  { "$type": "color", "$value": "{semantic.border-subtle}" }
  },
  "field": {
    "height":       { "$type": "dimension", "$value": "{size.control-lg}" },
    "radius":       { "$type": "dimension", "$value": "{radius.md}" },
    "padding-x":    { "$type": "dimension", "$value": "{space.4}" },
    "bg":           { "$type": "color", "$value": "{semantic.field-bg}" },
    "border":       { "$type": "color", "$value": "{semantic.border}" },
    "border-focus": { "$type": "color", "$value": "{semantic.field-border-focus}" },
    "label-dur":    { "$type": "duration", "$value": "{duration.micro}" }
  },
  "nav": {
    "height":           { "$type": "dimension", "$value": "72px" },
    "height-condensed": { "$type": "dimension", "$value": "56px" },
    "border":           { "$type": "color", "$value": "{semantic.border-subtle}" },
    "blur":             { "$type": "dimension", "$value": "{blur.glass}" },
    "dur":              { "$type": "duration", "$value": "{duration.ui}" }
  }
}
```

The `*-dark` suffixes are gone — that duplication is what the semantic tier exists to remove. `component.nav.bg` is dropped here and generated in Step 5 instead, because it needs a `color-mix` fallback pair that a single token cannot express.

- [ ] **Step 4: Create the shadow transform**

```ts
// tokens/transforms.ts
import StyleDictionary from 'style-dictionary';

type ShadowLayer = { color: string; offsetX: string; offsetY: string; blur: string; spread: string };

StyleDictionary.registerTransform({
  name: 'shadow/css-list',
  type: 'value',
  transitive: true,
  filter: (token) => token.$type === 'shadow',
  transform: (token) => {
    const layers: ShadowLayer[] = Array.isArray(token.$value) ? token.$value : [token.$value];
    return layers
      .map((l) => `${l.offsetX} ${l.offsetY} ${l.blur} ${l.spread} ${l.color}`)
      .join(', ');
  },
});
```

- [ ] **Step 5: Create the build script**

```ts
// scripts/build-tokens.ts
import StyleDictionary from 'style-dictionary';
import { writeFileSync, readFileSync } from 'node:fs';
import './../tokens/transforms';

const MODES = [
  { name: 'dark',  selector: ':root' },
  { name: 'light', selector: '[data-theme="light"]' },
] as const;

for (const mode of MODES) {
  const sd = new StyleDictionary({
    source: ['tokens/luxe-axis.tokens.json', `tokens/modes/${mode.name}.json`],
    usesDtcg: true,
    expand: { include: ['typography'] },
    platforms: {
      css: {
        transformGroup: 'css',
        transforms: ['shadow/css-list'],
        buildPath: 'styles/',
        files: [{
          destination: `tokens.${mode.name}.css`,
          format: 'css/variables',
          // The light build emits ONLY the semantic overrides. Primitives,
          // component tokens, and every scale are theme-independent — emitting
          // them twice would declare each variable twice and defeat the whole
          // point of the semantic tier.
          filter: mode.name === 'light' ? (token) => token.path[0] === 'semantic' : undefined,
          options: { outputReferences: true, selector: mode.selector },
        }],
      },
    },
  });
  await sd.buildAllPlatforms();
}

// Append the nav glass recipe, derived from the surface and opacity tokens.
import tokens from '../tokens/luxe-axis.tokens.json';

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const GLASS = [
  {
    selector: ':root',
    fill: hexToRgba(tokens.color.brand.navy.$value, tokens.opacity['glass-dark'].$value),
  },
  {
    selector: '[data-theme="light"]',
    fill: hexToRgba(tokens.color.brand.ivory.$value, tokens.opacity['glass-light'].$value),
  },
]
  .map(({ selector, fill }) => `${selector} {\n  --nav-bg: ${fill};\n}`)
  .join('\n');

const dark = readFileSync('styles/tokens.dark.css', 'utf8');
const light = readFileSync('styles/tokens.light.css', 'utf8');
writeFileSync('styles/tokens.css', `/* GENERATED by scripts/build-tokens.ts — do not edit. */\n${dark}\n${light}\n${GLASS}\n`);
```

The glass fill is computed from `color.brand.*` and `opacity.glass-*` at build time, so it satisfies the tokens-only constraint with no hand-written literal. `color-mix()` was considered and rejected: with two themes generated at build time there is no runtime `--surface` override for it to track, so it bought only a browser-support caveat.

- [ ] **Step 6: Write the failing tests**

```ts
// tests/unit/tokens.test.ts
import { describe, expect, it, beforeAll } from 'vitest';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

let css: string;

beforeAll(() => {
  execSync('pnpm tokens', { stdio: 'pipe' });
  css = readFileSync('styles/tokens.css', 'utf8');
});

const SEMANTIC_ROLES = [
  'surface', 'surface-deep', 'surface-raised', 'on-surface', 'on-surface-2',
  'on-surface-muted', 'accent', 'accent-contrast', 'accent-hover', 'signal',
  'border-subtle', 'border', 'border-strong', 'focus-ring',
  'field-bg', 'field-border-focus',
];

describe('token build', () => {
  it('declares every semantic role in both themes', () => {
    const [, darkBlock, lightBlock] = css.split(/:root\s*\{|\[data-theme="light"\]\s*\{/);
    for (const role of SEMANTIC_ROLES) {
      expect(darkBlock, `--${role} missing from dark`).toContain(`--${role}:`);
      expect(lightBlock, `--${role} missing from light`).toContain(`--${role}:`);
    }
  });

  it('emits component tokens as var() references, not resolved hex', () => {
    expect(css).toMatch(/--btn-primary-bg:\s*var\(--accent\)/);
    expect(css).toMatch(/--btn-primary-fg:\s*var\(--accent-contrast\)/);
  });

  it('declares component tokens exactly once — the semantic tier removes duplication', () => {
    const occurrences = css.match(/--btn-primary-bg:/g) ?? [];
    expect(occurrences).toHaveLength(1);
  });

  it('flattens shadow arrays into a single box-shadow list', () => {
    expect(css).toMatch(/--elevation-dark-1:\s*0 0 0 1px rgba\(252,250,245,0\.06\), 0 8px 40px 0 rgba\(201,168,76,0\.10\)/);
  });

  it('derives the nav glass fill from the surface and opacity tokens', () => {
    expect(css).toMatch(/--nav-bg:\s*rgba\(13, ?43, ?78, ?0\.55\)/);
    expect(css).toMatch(/--nav-bg:\s*rgba\(252, ?250, ?245, ?0\.7\)/);
  });

  it('declares nav-bg exactly once per theme', () => {
    expect(css.match(/--nav-bg:/g) ?? []).toHaveLength(2);
  });

  it('resolves every value at build time — no color-mix, no browser caveat', () => {
    expect(css).not.toContain('color-mix');
  });

  it('leaves no unresolved aliases', () => {
    expect(css).not.toMatch(/\{[a-z][a-z0-9.-]*\}/i);
  });
});
```

- [ ] **Step 7: Run the tests to verify they fail**

Run: `pnpm vitest run tests/unit/tokens.test.ts`
Expected: FAIL — `pnpm tokens` errors because `style-dictionary` and `tsx` deps for the build are not yet installed, or `--accent-hover` is missing from output.

- [ ] **Step 8: Install token dependencies and iterate to green**

```bash
pnpm add -D style-dictionary@4.3.0 tailwindcss@3.4.17 postcss@8.4.49 autoprefixer@10.4.20
pnpm vitest run tests/unit/tokens.test.ts
```

Expected: PASS, 6 tests.

If the shadow assertion fails on exact spacing, read the generated `styles/tokens.css` and align the test to the real output rather than loosening it to a substring match — the point of this assertion is to catch silent format drift.

- [ ] **Step 9: Wire Tailwind to the generated variables**

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './features/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: 'var(--surface)',
        'surface-deep': 'var(--surface-deep)',
        'surface-raised': 'var(--surface-raised)',
        'on-surface': 'var(--on-surface)',
        'on-surface-2': 'var(--on-surface-2)',
        accent: 'var(--accent)',
        'accent-contrast': 'var(--accent-contrast)',
        signal: 'var(--signal)',
      },
      borderRadius: { sm: 'var(--radius-sm)', md: 'var(--radius-md)', lg: 'var(--radius-lg)', pill: 'var(--radius-pill)' },
      transitionDuration: { micro: 'var(--duration-micro)', ui: 'var(--duration-ui)', enter: 'var(--duration-enter)' },
    },
  },
  plugins: [],
} satisfies Config;
```

```css
/* styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
@import './tokens.css';
```

- [ ] **Step 10: Add generated output to `.gitignore` and commit**

```
styles/tokens.css
styles/tokens.dark.css
styles/tokens.light.css
```

```bash
git add -A
git commit -m "feat: token pipeline with semantic tier for theme-agnostic components"
```

---

## Task 3: Contrast assertion gate

**Files:**
- Create: `lib/color/contrast.ts`
- Test: `tests/unit/contrast.test.ts`

**Interfaces:**
- Consumes: `tokens/luxe-axis.tokens.json`
- Produces: `contrastRatio(fg: string, bg: string): number` — accepts `#rgb`, `#rrggbb`, or `rgb()/rgba()` strings; returns a ratio in `[1, 21]`.

Spec §2.4. Every ratio in the specifications is prose, and prose drifts the first time a hex is nudged.

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/contrast.test.ts
import { describe, expect, it } from 'vitest';
import { contrastRatio } from '@/lib/color/contrast';
import tokens from '@/tokens/luxe-axis.tokens.json';

const brand = tokens.color.brand;
const onDark = tokens.color['neutral-on-dark'];

describe('contrastRatio', () => {
  it('returns 21 for black on white', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 1);
  });

  it('returns 1 for a colour against itself', () => {
    expect(contrastRatio('#0D2B4E', '#0D2B4E')).toBeCloseTo(1, 2);
  });

  it('is symmetric', () => {
    expect(contrastRatio('#C9A84C', '#0D2B4E')).toBeCloseTo(contrastRatio('#0D2B4E', '#C9A84C'), 4);
  });
});

describe('verified pairings hold', () => {
  it('ivory body text on navy reaches AAA', () => {
    expect(contrastRatio(onDark.primary.$value, brand.navy.$value)).toBeGreaterThanOrEqual(7);
  });

  it('secondary text on navy reaches AAA', () => {
    expect(contrastRatio(onDark.secondary.$value, brand.navy.$value)).toBeGreaterThanOrEqual(7);
  });

  it('ink on gold reaches AAA — this is the primary button', () => {
    expect(contrastRatio(brand.ink.$value, brand.gold.$value)).toBeGreaterThanOrEqual(7);
  });

  it('gold on navy reaches AA for large text and UI', () => {
    expect(contrastRatio(brand.gold.$value, brand.navy.$value)).toBeGreaterThanOrEqual(4.5);
  });

  it('teal-bright is the accessible teal for text on dark', () => {
    expect(contrastRatio(brand['teal-bright'].$value, brand.navy.$value)).toBeGreaterThanOrEqual(4.5);
  });

  it('the focus ring is distinguishable against navy', () => {
    expect(contrastRatio(tokens.theme.dark['focus-ring'].$value, brand.navy.$value)).toBeGreaterThanOrEqual(3);
  });
});

describe('forbidden pairings stay forbidden', () => {
  // These assertions document WHY the usage rules exist. If one starts
  // passing, a primitive moved and the rule needs revisiting — not deleting.
  it('gold text on ivory fails, which is why gold is never body text on light', () => {
    expect(contrastRatio(brand.gold.$value, brand.ivory.$value)).toBeLessThan(4.5);
  });

  it('brand teal on navy fails, which is why teal-bright exists', () => {
    expect(contrastRatio(brand.teal.$value, brand.navy.$value)).toBeLessThan(4.5);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest run tests/unit/contrast.test.ts`
Expected: FAIL — `Failed to resolve import "@/lib/color/contrast"`.

- [ ] **Step 3: Implement the module**

```ts
// lib/color/contrast.ts

/** Parses #rgb, #rrggbb, rgb(), or rgba() into 0–255 channels. Alpha is ignored:
 *  WCAG contrast is defined for composited colours, and every pairing we assert
 *  is opaque text on an opaque surface. */
function parse(color: string): [number, number, number] {
  const hex = color.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const h = hex[1]!;
    const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
    return [
      parseInt(full.slice(0, 2), 16),
      parseInt(full.slice(2, 4), 16),
      parseInt(full.slice(4, 6), 16),
    ];
  }
  const rgb = color.trim().match(/^rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
  throw new Error(`Unsupported colour format: ${color}`);
}

/** WCAG 2.x relative luminance. */
function luminance(color: string): number {
  const [r, g, b] = parse(color).map((channel) => {
    const s = channel / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2.x contrast ratio, in [1, 21]. Symmetric in its arguments. */
export function contrastRatio(fg: string, bg: string): number {
  const a = luminance(fg);
  const b = luminance(bg);
  const [lighter, darker] = a > b ? [a, b] : [b, a];
  return (lighter + 0.05) / (darker + 0.05);
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `pnpm vitest run tests/unit/contrast.test.ts`
Expected: PASS, 11 tests.

If "secondary text on navy reaches AAA" fails, the token file claims 8.71:1 for `#C3CBD6` on navy — recompute and correct the token's `$description`, not the threshold.

- [ ] **Step 5: Commit**

```bash
git add lib/color/contrast.ts tests/unit/contrast.test.ts
git commit -m "feat: assert WCAG contrast from token values, including forbidden pairings"
```

---

## Task 4: Bilingual routing with the publication gate

**Files:**
- Create: `i18n/routing.ts`, `i18n/request.ts`, `middleware.ts`
- Create: `lib/i18n/published.ts`, `lib/seo/hreflang.ts`
- Create: `messages/en.json`, `messages/ta.json`
- Create: `app/[locale]/layout.tsx`, `app/[locale]/page.tsx`
- Delete: `app/layout.tsx`, `app/page.tsx`
- Test: `tests/unit/published.test.ts`, `tests/unit/hreflang.test.ts`, `tests/e2e/locale.spec.ts`

**Interfaces:**
- Consumes: nothing from earlier tasks
- Produces: `isPublished(route: string, locale: Locale): boolean` · `alternatesFor(route: string): { languages: Record<string, string>; canonical: string }` · `type Locale = 'en' | 'ta'`

Spec §3.4. `ta` is published per-route, never globally.

- [ ] **Step 1: Write the failing publication-gate test**

```ts
// tests/unit/published.test.ts
import { describe, expect, it } from 'vitest';
import { isPublished, PUBLISHED } from '@/lib/i18n/published';

describe('isPublished', () => {
  it('treats every route as published in English', () => {
    expect(isPublished('/', 'en')).toBe(true);
    expect(isPublished('/pricing', 'en')).toBe(true);
    expect(isPublished('/a-route-nobody-has-built', 'en')).toBe(true);
  });

  it('publishes Tamil only where a reviewed translation is recorded', () => {
    expect(isPublished('/', 'ta')).toBe(true);
    expect(isPublished('/pricing', 'ta')).toBe(false);
  });

  it('normalises a trailing slash', () => {
    expect(isPublished('/', 'ta')).toBe(isPublished('', 'ta'));
  });

  it('records Tamil routes explicitly, never by wildcard', () => {
    // A wildcard would let an untranslated route go live silently, which the
    // brand policy forbids. Keep this list literal.
    expect(Array.isArray(PUBLISHED.ta)).toBe(true);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm vitest run tests/unit/published.test.ts`
Expected: FAIL — `Failed to resolve import "@/lib/i18n/published"`.

- [ ] **Step 3: Implement the publication gate**

```ts
// lib/i18n/published.ts
export const LOCALES = ['en', 'ta'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

/** Routes with a human-reviewed Tamil translation. Add a route here ONLY when
 *  a reviewer has signed off — machine translation is forbidden by brand policy.
 *  English is implicitly complete and is not listed. */
export const PUBLISHED: { ta: string[] } = {
  ta: ['/'],
};

function normalise(route: string): string {
  const trimmed = route.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

export function isPublished(route: string, locale: Locale): boolean {
  if (locale === DEFAULT_LOCALE) return true;
  return PUBLISHED.ta.includes(normalise(route));
}
```

- [ ] **Step 4: Run it to verify it passes**

Run: `pnpm vitest run tests/unit/published.test.ts`
Expected: PASS, 4 tests.

- [ ] **Step 5: Write the failing hreflang test**

```ts
// tests/unit/hreflang.test.ts
import { describe, expect, it } from 'vitest';
import { alternatesFor } from '@/lib/seo/hreflang';

describe('alternatesFor', () => {
  it('advertises Tamil only where it is actually published', () => {
    expect(alternatesFor('/').languages).toEqual({
      en: 'https://luxeaxis.com/',
      ta: 'https://luxeaxis.com/ta',
      'x-default': 'https://luxeaxis.com/',
    });
  });

  it('omits Tamil entirely on unpublished routes rather than lying to crawlers', () => {
    const { languages } = alternatesFor('/pricing');
    expect(languages).toEqual({
      en: 'https://luxeaxis.com/pricing',
      'x-default': 'https://luxeaxis.com/pricing',
    });
    expect(languages).not.toHaveProperty('ta');
  });

  it('canonicalises to the English URL', () => {
    expect(alternatesFor('/pricing').canonical).toBe('https://luxeaxis.com/pricing');
  });
});
```

- [ ] **Step 6: Run it to verify it fails**

Run: `pnpm vitest run tests/unit/hreflang.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 7: Implement hreflang**

```ts
// lib/seo/hreflang.ts
import { isPublished } from '@/lib/i18n/published';

const ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN ?? 'https://luxeaxis.com';

export function alternatesFor(route: string): {
  languages: Record<string, string>;
  canonical: string;
} {
  const path = route === '/' ? '' : route;
  const en = `${ORIGIN}/${path}`.replace(/([^:])\/+/g, '$1/').replace(/\/$/, '') || ORIGIN;
  const canonical = route === '/' ? `${ORIGIN}/` : en;

  const languages: Record<string, string> = { en: canonical };
  if (isPublished(route, 'ta')) languages.ta = `${ORIGIN}/ta${path}`;
  languages['x-default'] = canonical;

  return { languages, canonical };
}
```

- [ ] **Step 8: Run it to verify it passes**

Run: `pnpm vitest run tests/unit/hreflang.test.ts`
Expected: PASS, 3 tests.

- [ ] **Step 9: Install next-intl and configure routing**

```bash
pnpm add next-intl@3.26.3
```

```ts
// i18n/routing.ts
import { defineRouting } from 'next-intl/routing';
import { LOCALES, DEFAULT_LOCALE } from '@/lib/i18n/published';

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'as-needed',
});
```

```ts
// i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/published';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = (routing.locales as readonly string[]).includes(requested ?? '')
    ? (requested as Locale)
    : DEFAULT_LOCALE;
  return { locale, messages: (await import(`../messages/${locale}.json`)).default };
});
```

- [ ] **Step 10: Add the middleware with the 307 redirect**

```ts
// middleware.ts
import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from '@/i18n/routing';
import { isPublished } from '@/lib/i18n/published';

const intl = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/ta' || pathname.startsWith('/ta/')) {
    const route = pathname.replace(/^\/ta/, '') || '/';
    if (!isPublished(route, 'ta')) {
      const url = request.nextUrl.clone();
      url.pathname = route;
      // 307, not 308: the route goes live the moment a translation publishes,
      // and a permanent redirect would be cached against exactly that.
      return NextResponse.redirect(url, 307);
    }
  }

  return intl(request);
}

export const config = { matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'] };
```

- [ ] **Step 11: Create message catalogs and the locale layout**

```json
// messages/en.json
{ "hero": { "headline": "Where Space Meets Intelligence" } }
```

```json
// messages/ta.json
{ "hero": { "headline": "இடம் அறிவைச் சந்திக்கும் இடம்" } }
```

```tsx
// app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { LOCALES, type Locale } from '@/lib/i18n/published';
import '@/styles/globals.css';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(LOCALES as readonly string[]).includes(locale)) notFound();
  setRequestLocale(locale as Locale);
  const messages = await getMessages();

  return (
    <html lang={locale} data-theme="dark">
      <body className="bg-surface text-on-surface">
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
```

```tsx
// app/[locale]/page.tsx
import { useTranslations } from 'next-intl';
import { alternatesFor } from '@/lib/seo/hreflang';

export const metadata = { alternates: alternatesFor('/') };

export default function HomePage() {
  const t = useTranslations('hero');
  return <main><h1>{t('headline')}</h1></main>;
}
```

Delete `app/layout.tsx` and `app/page.tsx` from Task 1.

- [ ] **Step 12: Write the e2e test**

```ts
// tests/e2e/locale.spec.ts
import { expect, test } from '@playwright/test';

test('English home renders with lang="en"', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Where Space Meets Intelligence');
});

test('published Tamil route renders with lang="ta"', async ({ page }) => {
  await page.goto('/ta');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ta');
});

test('unpublished Tamil route 307s to English instead of showing English under lang="ta"', async ({ page }) => {
  const response = await page.goto('/ta/pricing');
  expect(response?.request().redirectedFrom()?.response()?.status()).toBe(307);
  expect(new URL(page.url()).pathname).toBe('/pricing');
});
```

- [ ] **Step 13: Install Playwright and run the suite**

```bash
pnpm add -D @playwright/test@1.49.1
pnpm exec playwright install --with-deps chromium
```

```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  use: { baseURL: 'http://localhost:3000' },
  webServer: { command: 'pnpm build && pnpm start', url: 'http://localhost:3000', reuseExistingServer: !process.env.CI },
});
```

Run: `pnpm test:e2e`
Expected: PASS, 3 tests. The third will fail until `/pricing` exists — create `app/[locale]/pricing/page.tsx` returning `<main><h1>Pricing</h1></main>` as the redirect target.

- [ ] **Step 14: Commit**

```bash
git add -A
git commit -m "feat: bilingual routing with per-route Tamil publication gate"
```

---

## Task 5: App shell, store, and tier resolution

**Files:**
- Create: `lib/store.ts`, `lib/tier/resolve.ts`, `lib/tier/useDeviceTier.ts`
- Create: `components/SkipLink.tsx`
- Modify: `app/[locale]/layout.tsx`
- Test: `tests/unit/tier.test.ts`

**Interfaces:**
- Consumes: `Locale` from Task 4
- Produces: `type Tier = 'T0' | 'T1' | 'T2' | 'T3'` · `resolveTier(env: TierEnv): Tier` · `useAppStore()` exposing `{ tier, reducedMotion, setTier, setReducedMotion }`

The store deliberately does **not** carry `activeScene` yet. That field needs `SceneId`, which Task 6 defines — a task owns the state it introduces, and importing forward would break this task's typecheck.

Spec §4.1, phase 1 only. Phase 2 (`detect-gpu`) belongs to the task that introduces the WebGL chunk and is deliberately not here.

- [ ] **Step 1: Write the failing tier test**

```ts
// tests/unit/tier.test.ts
import { describe, expect, it } from 'vitest';
import { resolveTier, type TierEnv } from '@/lib/tier/resolve';

const flagship: TierEnv = {
  prefersReducedMotion: false,
  saveData: false,
  effectiveType: '4g',
  deviceMemory: 8,
  hardwareConcurrency: 8,
  coarsePointer: false,
  hasWebGL: true,
};

describe('resolveTier', () => {
  it('gives a flagship the full experience', () => {
    expect(resolveTier(flagship)).toBe('T3');
  });

  it('locks to T1 on reduced-motion regardless of hardware', () => {
    expect(resolveTier({ ...flagship, prefersReducedMotion: true })).toBe('T1');
  });

  it('locks to T1 on Save-Data — the real signal, not prefers-reduced-data', () => {
    expect(resolveTier({ ...flagship, saveData: true })).toBe('T1');
  });

  it('locks to T1 on a slow connection', () => {
    expect(resolveTier({ ...flagship, effectiveType: '2g' })).toBe('T1');
    expect(resolveTier({ ...flagship, effectiveType: '3g' })).toBe('T1');
  });

  it('reports T0 when WebGL is unavailable', () => {
    expect(resolveTier({ ...flagship, hasWebGL: false })).toBe('T0');
  });

  it('drops to T2 on constrained memory', () => {
    expect(resolveTier({ ...flagship, deviceMemory: 2 })).toBe('T2');
  });

  it('drops to T2 on few cores', () => {
    expect(resolveTier({ ...flagship, hardwareConcurrency: 2 })).toBe('T2');
  });

  it('keeps a capable touch device at T3 — coarse pointer alone is not weakness', () => {
    expect(resolveTier({ ...flagship, coarsePointer: true })).toBe('T3');
  });

  it('prefers the most restrictive signal when several apply', () => {
    expect(resolveTier({ ...flagship, prefersReducedMotion: true, deviceMemory: 2 })).toBe('T1');
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm vitest run tests/unit/tier.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement tier resolution**

```ts
// lib/tier/resolve.ts
export type Tier = 'T0' | 'T1' | 'T2' | 'T3';

export type TierEnv = {
  prefersReducedMotion: boolean;
  saveData: boolean;
  effectiveType: string | undefined;
  deviceMemory: number | undefined;
  hardwareConcurrency: number | undefined;
  coarsePointer: boolean;
  hasWebGL: boolean;
};

const SLOW_CONNECTIONS = new Set(['slow-2g', '2g', '3g']);

/** Phase-1 synchronous resolution (spec §4.1). Cheap signals only — detect-gpu
 *  runs later, inside the lazily imported WebGL chunk, so it never touches the
 *  initial bundle. Most restrictive signal wins. */
export function resolveTier(env: TierEnv): Tier {
  if (!env.hasWebGL) return 'T0';
  if (env.prefersReducedMotion) return 'T1';
  if (env.saveData) return 'T1';
  if (env.effectiveType && SLOW_CONNECTIONS.has(env.effectiveType)) return 'T1';
  if (env.deviceMemory !== undefined && env.deviceMemory < 4) return 'T2';
  if (env.hardwareConcurrency !== undefined && env.hardwareConcurrency < 4) return 'T2';
  return 'T3';
}
```

- [ ] **Step 4: Run it to verify it passes**

Run: `pnpm vitest run tests/unit/tier.test.ts`
Expected: PASS, 9 tests.

- [ ] **Step 5: Create the store and the React binding**

```bash
pnpm add zustand@5.0.2
```

```ts
// lib/store.ts
'use client';
import { create } from 'zustand';
import type { Tier } from '@/lib/tier/resolve';

type AppState = {
  tier: Tier;
  reducedMotion: boolean;
  setTier: (tier: Tier) => void;
  setReducedMotion: (value: boolean) => void;
};

export const useAppStore = create<AppState>((set) => ({
  // T1 until proven otherwise: the server renders posters, and an optimistic
  // default would flash live scenes onto devices that cannot hold 30fps.
  tier: 'T1',
  reducedMotion: true,
  setTier: (tier) => set({ tier }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
}));
```

```tsx
// lib/tier/useDeviceTier.ts
'use client';
import { useEffect } from 'react';
import { resolveTier, type TierEnv } from './resolve';
import { useAppStore } from '@/lib/store';

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export function useDeviceTier(): void {
  const setTier = useAppStore((s) => s.setTier);
  const setReducedMotion = useAppStore((s) => s.setReducedMotion);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
      deviceMemory?: number;
    });

    const read = (): TierEnv => ({
      prefersReducedMotion: motionQuery.matches,
      saveData: connection.connection?.saveData ?? false,
      effectiveType: connection.connection?.effectiveType,
      deviceMemory: connection.deviceMemory,
      hardwareConcurrency: navigator.hardwareConcurrency,
      coarsePointer: window.matchMedia('(pointer: coarse)').matches,
      hasWebGL: hasWebGL(),
    });

    const apply = () => {
      const env = read();
      setTier(resolveTier(env));
      setReducedMotion(env.prefersReducedMotion);
    };

    apply();
    motionQuery.addEventListener('change', apply);
    return () => motionQuery.removeEventListener('change', apply);
  }, [setTier, setReducedMotion]);
}
```

- [ ] **Step 6: Add the skip link and wire the shell**

```tsx
// components/SkipLink.tsx
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-surface-raised focus:px-4 focus:py-2 focus:text-on-surface focus:outline focus:outline-2 focus:outline-offset-2"
      style={{ outlineColor: 'var(--focus-ring)' }}
    >
      Skip to content
    </a>
  );
}
```

Add `<SkipLink />` as the first child of `<body>` in `app/[locale]/layout.tsx`, and give the page's `<main>` an `id="main"` and `tabIndex={-1}`.

- [ ] **Step 7: Run the full verification**

Run: `pnpm verify`
Expected: all green.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: app shell with store, phase-1 tier resolution, and skip link"
```

---

## Task 6: The SceneSlot contract

**Files:**
- Create: `three/registry.ts`, `components/SceneSlot.tsx`
- Create: `public/posters/hero.avif` (a placeholder solid-navy image, replaced by workstream `B-01`)
- Test: `tests/unit/registry.test.ts`, `tests/unit/scene-slot.test.tsx`

**Interfaces:**
- Consumes: `useAppStore` from Task 5 (extended here with `activeScene`)
- Produces: `SCENE_IDS`, `SceneId`, `ScenePoster`, `SceneModule`, `POSTERS`, `SCENES`, `<SceneSlot id={SceneId}>`, and `useAppStore().activeScene`

Spec §1.3. This is the architectural keystone. `SCENES` stays empty for the whole of this plan, which is the point — §1.4 says the contract validates the pipeline with zero polygons.

- [ ] **Step 1: Write the failing parity test**

```ts
// tests/unit/registry.test.ts
import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { POSTERS, SCENES, SCENE_IDS } from '@/three/registry';

const PLACEHOLDER_ALT = 'TODO';

describe('scene registry parity', () => {
  it.each(SCENE_IDS)('%s has a poster whose file exists on disk', (id) => {
    const poster = POSTERS[id];
    expect(poster).toBeDefined();
    expect(existsSync(`public${poster.src}`), `missing file: public${poster.src}`).toBe(true);
  });

  it.each(SCENE_IDS)('%s carries alt text stating the claim it makes', (id) => {
    const { alt } = POSTERS[id];
    expect(alt.length).toBeGreaterThan(20);
    expect(alt).not.toContain(PLACEHOLDER_ALT);
  });

  it.each(SCENE_IDS)('%s declares an aspect ratio so the slot reserves space', (id) => {
    expect(POSTERS[id].aspect).toMatch(/^\d+\/\d+$/);
  });

  it('marks exactly one poster as priority — the LCP element', () => {
    const prioritised = SCENE_IDS.filter((id) => POSTERS[id].priority);
    expect(prioritised).toEqual(['hero']);
  });

  it('registers no live scenes yet — posters are the whole contract at this stage', () => {
    expect(Object.keys(SCENES)).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm vitest run tests/unit/registry.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the registry**

```ts
// three/registry.ts
import type { ComponentType } from 'react';

export const SCENE_IDS = [
  'hero', 'persona-router', 'vastu', 'space-score',
  'space-os', 'portfolio', 'journey', 'pricing-axis', 'nri-globe',
] as const;

export type SceneId = (typeof SCENE_IDS)[number];

export type ScenePoster = {
  src: string;
  /** The CLAIM the scene makes — not a description of pixels. Read aloud by
   *  screen readers in place of the scene, so it must carry the same argument. */
  alt: string;
  aspect: `${number}/${number}`;
  /** True for 'hero' only — this is the LCP element. */
  priority?: boolean;
};

export type SceneModule = {
  Scene: ComponentType<{ sceneId: SceneId }>;
  budgetKB: number;
  minTier: 'T2' | 'T3';
  flag: string;
};

/** Total record: every scene must have a poster or the build fails typecheck. */
export const POSTERS: Record<SceneId, ScenePoster> = {
  hero: {
    src: '/posters/hero.avif',
    alt: 'A finished living room resolved along a line of gold light: pendant lit, sofa placed, plant settled — space and applied intelligence producing a designed home.',
    aspect: '16/9',
    priority: true,
  },
  'persona-router': {
    src: '/posters/persona-router.avif',
    alt: 'Six lit routes into the studio, one for each kind of visitor, arranged around a Chennai skyline marker.',
    aspect: '16/9',
  },
  vastu: {
    src: '/posters/vastu.avif',
    alt: 'A floor plan under a gold Vastu grid: favourable zones marked in gold, zones needing review in teal, with a chip confirming a human designer reviewed the result.',
    aspect: '4/3',
  },
  'space-score': {
    src: '/posters/space-score.avif',
    alt: 'A four-arc gauge rating a room on wellness, function, aesthetics and sustainability, each arc filled to its measured value.',
    aspect: '1/1',
  },
  'space-os': {
    src: '/posters/space-os.avif',
    alt: 'The client portal on a tablet, showing a moodboard, live build progress and a visible budget — the project as the client sees it.',
    aspect: '4/3',
  },
  portfolio: {
    src: '/posters/portfolio.avif',
    alt: 'Completed Chennai projects presented as material-rich panels along the gold axis.',
    aspect: '16/9',
  },
  journey: {
    src: '/posters/journey.avif',
    alt: 'The seven stages of a Luxe Axis project as lit nodes descending the axis, from first discovery through handover and concierge care.',
    aspect: '9/16',
  },
  'pricing-axis': {
    src: '/posters/pricing-axis.avif',
    alt: 'A gold bead resting on the axis at a published fee, illustrating pricing that is stated openly rather than quoted privately.',
    aspect: '16/9',
  },
  'nri-globe': {
    src: '/posters/nri-globe.avif',
    alt: 'An arc drawn from the Tamil diaspora to Chennai, tracing how a home here is designed and delivered from abroad.',
    aspect: '1/1',
  },
};

/** Partial by design: the type system encodes that live 3D is optional, so no
 *  page can be written that depends on a scene existing. Populated per scene in
 *  a later phase, each behind its own flag. */
export const SCENES: Partial<Record<SceneId, () => Promise<SceneModule>>> = {};
```

Now extend the Task 5 store with the field that needed `SceneId`. Add to `AppState`, to the initial state, and to the returned object in `lib/store.ts`:

```ts
import type { SceneId } from '@/three/registry';

// in AppState:
  activeScene: SceneId | null;
  setActiveScene: (scene: SceneId | null) => void;

// in the create() body:
  activeScene: null,
  setActiveScene: (activeScene) => set({ activeScene }),
```

This import is the single permitted DOM→WebGL edge. The Task 1 lint rule blocks `@/three/!(registry)`; the negation admits `@/three/registry` and nothing else. Do not "simplify" that pattern — it is load-bearing.

- [ ] **Step 4: Create the nine placeholder posters**

Workstream `B-01` replaces these with art-directed stills. Until then, generate solid-navy files at the declared aspect ratios so the parity gate has something real to assert against.

```bash
pnpm add -D sharp@0.33.5
```

```ts
// scripts/make-placeholder-posters.ts
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { POSTERS, SCENE_IDS } from '../three/registry';

const NAVY = { r: 13, g: 43, b: 78 };
const LONG_EDGE = 1920;

mkdirSync('public/posters', { recursive: true });

for (const id of SCENE_IDS) {
  const poster = POSTERS[id];
  const [w, h] = poster.aspect.split('/').map(Number) as [number, number];
  const scale = LONG_EDGE / Math.max(w, h);
  const width = Math.round(w * scale);
  const height = Math.round(h * scale);

  await sharp({ create: { width, height, channels: 3, background: NAVY } })
    .avif({ quality: 50 })
    .toFile(`public/posters/${id}.avif`);

  console.log(`${id}.avif  ${width}x${height}`);
}
```

Run: `pnpm tsx scripts/make-placeholder-posters.ts`
Expected: nine lines of output, one per scene, and nine files in `public/posters/`.

Deriving the dimensions from `POSTERS[id].aspect` rather than a hand-written size table means the placeholders cannot drift out of sync with the registry the parity gate reads.

- [ ] **Step 5: Run the parity test to verify it passes**

Run: `pnpm vitest run tests/unit/registry.test.ts`
Expected: PASS, 30 tests (three parameterised checks across nine scenes, plus two singletons).

- [ ] **Step 6: Write the failing SceneSlot test**

```tsx
// tests/unit/scene-slot.test.tsx
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SceneSlot } from '@/components/SceneSlot';
import { POSTERS } from '@/three/registry';

describe('SceneSlot', () => {
  it('renders its children as real DOM, independent of any scene', () => {
    render(<SceneSlot id="hero"><h1>Where Space Meets Intelligence</h1></SceneSlot>);
    expect(screen.getByRole('heading', { level: 1 })).toBeDefined();
  });

  it('renders the poster with the claim as alt text', () => {
    render(<SceneSlot id="vastu"><p>copy</p></SceneSlot>);
    expect(screen.getByAltText(POSTERS.vastu.alt)).toBeDefined();
  });

  it('reserves space via aspect-ratio so the slot cannot shift layout', () => {
    const { container } = render(<SceneSlot id="hero"><p>copy</p></SceneSlot>);
    const slot = container.firstElementChild as HTMLElement;
    expect(slot.style.aspectRatio).toBe('16/9');
  });
});
```

- [ ] **Step 7: Run it to verify it fails**

```bash
pnpm add -D @testing-library/react@16.1.0 @testing-library/dom@10.4.0 jsdom@25.0.1
```

Add `environmentMatchGlobs: [['tests/unit/**/*.test.tsx', 'jsdom']]` to `vitest.config.ts`'s `test` block.

Run: `pnpm vitest run tests/unit/scene-slot.test.tsx`
Expected: FAIL — `Failed to resolve import "@/components/SceneSlot"`.

- [ ] **Step 8: Implement SceneSlot**

```tsx
// components/SceneSlot.tsx
import Image from 'next/image';
import { POSTERS, type SceneId } from '@/three/registry';

/** Renders a poster with content above it. When a scene is registered for this
 *  id AND its flag is on AND tier >= minTier AND reduced-motion is off AND first
 *  paint has happened, a later phase upgrades this slot to live WebGL by
 *  publishing activeScene to the store — the persistent canvas renders into
 *  these same coordinates.
 *
 *  Children never move between poster and live modes. That is what makes CLS
 *  zero by construction and reduced-motion parity structural rather than a
 *  branch someone has to remember to maintain. */
export function SceneSlot({
  id,
  children,
}: {
  id: SceneId;
  children: React.ReactNode;
}) {
  const poster = POSTERS[id];

  return (
    <div className="relative isolate w-full" style={{ aspectRatio: poster.aspect }}>
      <Image
        src={poster.src}
        alt={poster.alt}
        fill
        priority={poster.priority ?? false}
        sizes="100vw"
        className="object-cover"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
```

- [ ] **Step 9: Run it to verify it passes**

Run: `pnpm vitest run tests/unit/scene-slot.test.tsx`
Expected: PASS, 3 tests.

- [ ] **Step 10: Use it on the home page**

Replace `app/[locale]/page.tsx`'s body:

```tsx
import { useTranslations } from 'next-intl';
import { SceneSlot } from '@/components/SceneSlot';
import { alternatesFor } from '@/lib/seo/hreflang';

export const metadata = { alternates: alternatesFor('/') };

export default function HomePage() {
  const t = useTranslations('hero');
  return (
    <main id="main" tabIndex={-1}>
      <SceneSlot id="hero">
        <h1>{t('headline')}</h1>
      </SceneSlot>
    </main>
  );
}
```

- [ ] **Step 11: Run the full verification and commit**

```bash
pnpm verify
git add -A
git commit -m "feat: SceneSlot contract with poster registry and parity gate"
```

---

## Task 7: CI pipeline with all gates blocking

**Files:**
- Create: `.github/workflows/verify.yml`, `.size-limit.json`, `lighthouserc.json`
- Create: `tests/e2e/no-webgl.spec.ts`
- Modify: `playwright.config.ts` (add the no-WebGL project)

**Interfaces:**
- Consumes: every earlier task
- Produces: a merge-blocking pipeline

Spec §6.2. Each gate must be proven to fail on a seeded violation before it is trusted.

- [ ] **Step 1: Write the no-WebGL e2e test**

Spec §6.2 gate 4. QA §12 D requires this and nothing automates it.

```ts
// tests/e2e/no-webgl.spec.ts
import { expect, test } from '@playwright/test';

test.use({
  launchOptions: { args: ['--disable-gpu', '--disable-webgl', '--disable-3d-apis'] },
});

test('the site is complete and legible with WebGL unavailable', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('img')).toBeVisible();
});

test('the poster alt text carries the claim, not a description of pixels', async ({ page }) => {
  await page.goto('/');
  const alt = await page.getByRole('img').first().getAttribute('alt');
  expect(alt).toBeTruthy();
  expect(alt!.length).toBeGreaterThan(20);
});
```

- [ ] **Step 2: Run it to verify it passes**

Run: `pnpm exec playwright test tests/e2e/no-webgl.spec.ts`
Expected: PASS, 2 tests. If either fails, the SceneSlot contract is broken — content is depending on WebGL somewhere, which Task 6 exists to prevent.

- [ ] **Step 3: Add the axe accessibility run**

```bash
pnpm add -D @axe-core/playwright@4.10.1
```

```ts
// tests/e2e/a11y.spec.ts
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const ROUTES = ['/', '/ta', '/pricing'];

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
```

Run: `pnpm exec playwright test tests/e2e/a11y.spec.ts`
Expected: PASS, 3 tests.

- [ ] **Step 4: Configure the bundle budget**

```bash
pnpm add -D @size-limit/preset-app@11.1.6 size-limit@11.1.6
```

```json
// .size-limit.json
[
  {
    "name": "home route JS",
    "path": ".next/static/chunks/**/*.js",
    "limit": "200 kB",
    "gzip": true
  }
]
```

Add `"size": "size-limit"` to `package.json` scripts.

Run: `pnpm build && pnpm size`
Expected: PASS, well under budget at this stage.

- [ ] **Step 5: Seed a violation and prove each gate fails**

This step is the reason the task exists. A gate nobody has watched fail is not a gate.

```bash
# Contrast gate — temporarily break a token
sed -i 's/"#C3CBD6"/"#5E6E82"/' tokens/luxe-axis.tokens.json
pnpm vitest run tests/unit/contrast.test.ts   # EXPECT: FAIL on the AAA assertion
git checkout tokens/luxe-axis.tokens.json

# Parity gate — temporarily blank an alt
sed -i "s|alt: 'A floor plan under|alt: 'TODO|" three/registry.ts
pnpm vitest run tests/unit/registry.test.ts   # EXPECT: FAIL on vastu alt
git checkout three/registry.ts

# Publication gate — temporarily publish an untranslated route
sed -i "s|ta: \['/'\]|ta: ['/', '/pricing']|" lib/i18n/published.ts
pnpm vitest run tests/unit/hreflang.test.ts   # EXPECT: FAIL on the omission assertion
git checkout lib/i18n/published.ts
```

Record the three failure messages in the commit body. If any gate passes while seeded, it is not wired correctly — fix it before proceeding.

- [ ] **Step 6: Author the workflow**

```yaml
# .github/workflows/verify.yml
name: verify
on:
  pull_request:
  push: { branches: [main] }

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - name: Tokens build (fails on unresolved alias)
        run: pnpm tokens
      - name: Typecheck, lint, unit tests
        run: pnpm verify
      - run: pnpm build
      - name: Bundle budget
        run: pnpm size
      - name: Install browsers
        run: pnpm exec playwright install --with-deps chromium
      - name: End-to-end, accessibility, no-WebGL
        run: pnpm test:e2e
```

- [ ] **Step 7: Push and confirm the pipeline is green**

```bash
git add -A
git commit -m "ci: block merge on token, contrast, parity, a11y, no-WebGL, and size gates"
git push -u origin HEAD
```

Expected: all steps green on the pull request.

---

## Self-Review

**Spec coverage.** §1.2 layering → Task 1 Step 5 (lint rule). §1.3 scene-slot contract → Task 6. §2.2 semantic tier → Task 2. §2.3 shadow transform → Task 2 Step 4. §2.4 contrast gate → Task 3. §3.4 Tamil publication gate → Task 4. §4.1 tier resolution phase 1 → Task 5. §6.2 gates 1–4 → Tasks 3, 6, 7.

**Deferred with reason, not omitted:** §3.1–§3.3 (CMS, leads, hosting) need a data layer this plan does not build. §4.2–§4.5 (frameloop, view transitions, degrade ladder) and §5 failure modes require the WebGL chunk, which is deliberately absent. §6.2 gate 2 (per-locale font budget) needs `next/font` wiring. §6.2 gate 5 (ladder ordering) needs `PerformanceMonitor`. §6.2 gate 6 (PII lint) needs the Sanity schema. §2.3 typography transform is handled by Style Dictionary's built-in `expand` rather than custom code. Each belongs to a later plan.

**Type consistency.** `SceneId` is defined once in `three/registry.ts` and imported by `lib/store.ts` and `components/SceneSlot.tsx`. `Tier` is defined in `lib/tier/resolve.ts` and imported by `lib/store.ts`. `Locale` is defined in `lib/i18n/published.ts` and imported by `i18n/routing.ts`, `i18n/request.ts`, and `app/[locale]/layout.tsx`. `SCENE_IDS` is exported alongside `SceneId` so the parity test can iterate it — the test in Task 6 Step 1 uses it, and Step 3 exports it.

**One circular-import risk, resolved:** `lib/store.ts` imports `SceneId` from `three/registry.ts`, and the lint rule in Task 1 blocks `@/three/!(registry)`. The negation permits `three/registry` specifically, which is the intended single seam. Verified consistent.

---

## Not in this plan

Named so nobody assumes they were forgotten:

- **Workstream `B-01`** — nine art-directed posters. Task 6 ships solid-navy placeholders. The parity gate passes on them, but the site is not reviewable until real stills land. This is the highest-leverage thing to start in parallel.
- **Workstream `A-01`** — logo vectorization. Gates the `Logo` component.
- **UI primitives** (`Button`, `Link`, `Field`, `Icon`) and layout primitives — the next plan.
- **CMS, lead pipeline, hosting configuration** — spec §3, third plan.
- **Motion and WebGL** — spec §4, fourth plan, after M1 ships.
