import tsParser from '@typescript-eslint/parser';
// `eslint-config-next` 14.2.20 only ships a legacy eslintrc-shaped config
// (`index.js` calls `@rushstack/eslint-patch/modern-module-resolution`, which
// throws under ESLint 9's flat config loader — confirmed by requiring it
// directly: "Failed to patch ESLint because the calling module was not
// recognized"). It has no flat-config entrypoint at this version. We depend
// on the plugin package it wraps (`@next/eslint-plugin-next`, same 14.2.20
// pin) directly instead, which is a plain flat-config-compatible plugin with
// no patch step. `eslint-config-next` itself stays in devDependencies per the
// brief; it is just not the module we import here.
import nextPlugin from '@next/eslint-plugin-next';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

// The one DOM→WebGL seam, extracted so every `no-restricted-imports` block
// spreads the identical pattern object rather than repeating the literal.
// Flat config REPLACES a rule's options wholesale when a later `files:`-scoped
// block sets the same rule key — it does not merge `patterns` arrays across
// blocks (confirmed via `eslint --print-config` on a components/ file: a
// components/-scoped block that set only the features/ pattern silently
// dropped this one for every file under components/, exactly where SceneSlot
// lives). Every block below that touches `no-restricted-imports` MUST spread
// SEAM into its `patterns` array, or the seam goes unenforced for that scope.
// `tests/unit/eslint-seam.test.ts` lints a virtual components/ file
// programmatically and fails if this ever lapses again.
const SEAM = {
  group: [
    // Alias (`@/three/**`) and relative (`../three/**`, `./three/**`) forms
    // reaching into the three/ directory from outside it. One pattern covers
    // both: `ignore` matches on the "three" path *segment* wherever it
    // occurs, not on how the specifier got there, so `@/three/x` and
    // `../../three/x` both match `**/three/**`.
    '**/three/**',
    '!**/three/registry',
    // The bare npm package (`import 'three'`) and any subpath import from it
    // (`three/examples/...`), which would bypass the registry's budget/tier
    // gating just as surely as reaching into our own three/ directory does.
    // Anchored with a leading slash deliberately: an *unanchored* `three`
    // pattern matches the directory named `three` at any depth (equivalent
    // to `**/three`), and once `ignore` treats a path as an excluded
    // directory, its gitignore semantics forbid re-including anything
    // beneath it — including the `!**/three/registry` negation above,
    // regardless of list order (confirmed empirically: with an unanchored
    // `three` pattern anywhere in this group, `@/three/registry` came back
    // blocked no matter where the negation was placed). Anchoring to the
    // start of the specifier with `/three` avoids that trap, since npm
    // package specifiers always start at position zero and never collide
    // with our own three/ directory (which is only ever reached via `@/` or
    // a relative prefix, never bare).
    '/three',
    '/three/**',
    // Scoped packages built on top of three, e.g. @react-three/fiber,
    // @react-three/drei — same bypass risk as importing `three` directly.
    '@react-three/*',
  ],
  message: 'three/registry.ts is the only DOM→WebGL seam — see spec §1.2.',
};

// Mirrors SEAM for dynamic `import()`. `no-restricted-imports` only inspects
// static `import`/`export from` declarations — it has no visibility into
// `ImportExpression` nodes — yet dynamic import is exactly the scene-loading
// mechanism three/registry.ts's `SceneModule` type commits to
// (`() => Promise<SceneModule>`), so leaving this open would let a consumer
// dynamically import straight past the registry with no static trace at all.
// `no-restricted-syntax` selectors are esquery, not the `ignore` package, so
// this is a hand-rolled regex kept in sync with SEAM.group by the shared
// probe cases in tests/unit/eslint-seam.test.ts rather than by construction —
// there is no library that understands both selector syntax.
const SEAM_DYNAMIC_IMPORT_SELECTOR =
  'ImportExpression[source.value=/^three$|(^|\\/)three\\/(?!registry(?:$|\\/))|^@react-three\\//]';

export default [
  {
    ignores: ['.next/**', 'node_modules/**'],
  },
  // Dropping `eslint-config-next` for the ESLint 9 reason above also silently
  // dropped every plugin it bundles. For the whole of this branch's history
  // `pnpm lint` ran ~22 Next-specific rules and none of these three, so the
  // binding constraint "no `any` without a written justification" had zero
  // enforcement (tsc --strict catches implicit any, never explicit), every
  // hook in the codebase was unchecked by rules-of-hooks/exhaustive-deps, and
  // the WCAG 2.2 AA acceptance gate rested entirely on axe over three routes
  // at runtime. These restore each of them directly.
  ...tseslint.configs.recommended,
  jsxA11y.flatConfigs.recommended,
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { sourceType: 'module', ecmaFeatures: { jsx: true } },
    },
    plugins: { '@next/next': nextPlugin, 'react-hooks': reactHooks },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      // These two rules call the removed `context.getAncestors()` API and
      // crash outright under ESLint 9 (confirmed: TypeError linting
      // app/layout.tsx). Both only apply to the legacy Pages Router
      // (`pages/_document`), which this App Router project doesn't use.
      '@next/next/no-duplicate-head': 'off',
      '@next/next/no-page-custom-font': 'off',
      ...reactHooks.configs.recommended.rules,
    },
  },
  {
    // The one DOM→WebGL seam. Repo-wide: nothing anywhere may reach into
    // three/ except through the registry. `ignores` scopes the restriction to
    // *consumers* — three/registry.ts and everything else under three/ must
    // still be free to import whatever they need (the npm `three` package,
    // relative siblings, @react-three/* if it's ever used inside the seam
    // implementation itself).
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    ignores: ['three/**'],
    rules: {
      // ESLint's `no-restricted-imports` "patterns" option matches `group`
      // entries with the `ignore` package (gitignore syntax), not minimatch —
      // it does not support bash extglobs like `!(registry)` (that string is
      // treated as a literal path segment and matches nothing, confirmed by
      // exercising the `ignore` package directly). The gitignore-native way
      // to say "everything under three/ except registry" is two patterns in
      // one group: a blanket glob followed by a `!`-prefixed negation.
      'no-restricted-imports': ['error', { patterns: [SEAM] }],
      'no-restricted-syntax': ['error', {
        selector: SEAM_DYNAMIC_IMPORT_SELECTOR,
        message: 'three/registry.ts is the only DOM→WebGL seam — see spec §1.2. A dynamic import() of three/ internals, the `three` package, or @react-three/* bypasses it just as a static import would.',
      }],
    },
  },
  {
    // size-limit resolves its config through lilconfig and loads it as
    // CommonJS, so this file cannot use ESM import syntax. Its third require()
    // is also load-bearing at runtime rather than stylistic: it reads Next's
    // generated page_client-reference-manifest.js, whose path is only known
    // after a build, so it cannot be a static import under any module system.
    files: ['.size-limit.js'],
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
  {
    // Scoped to components/ only. Routes ARE permitted to import features —
    // that is the layering direction, not a violation — so this rule must not
    // apply repo-wide.
    //
    // This block's `no-restricted-imports` entry must spread SEAM alongside
    // the features/ restriction, not just add the latter. Flat config merges
    // rules per matching config object in array order, but for a given rule
    // key the LAST matching object's options entirely replace earlier ones —
    // options are not concatenated across objects (confirmed via
    // `eslint --print-config` on a file under components/: with only the
    // features/ pattern here, the effective config for that file dropped the
    // three/ pattern entirely, so a probe import of `@/three/internal/whatever`
    // from components/ went unflagged). Since every file in components/
    // matches both this block and the repo-wide one above, omitting SEAM here
    // would silently disable that seam for the one directory that imports
    // from three/ the most.
    files: ['components/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          SEAM,
          { group: ['@/features/**'], message: 'components/ may not import from features/ — see spec §1.2 layering.' },
        ],
      }],
    },
  },
];
