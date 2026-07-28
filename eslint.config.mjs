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
  group: ['@/three/**', '!@/three/registry'],
  message: 'three/registry.ts is the only DOM→WebGL seam — see spec §1.2.',
};

export default [
  {
    ignores: ['.next/**', 'node_modules/**'],
  },
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { sourceType: 'module', ecmaFeatures: { jsx: true } },
    },
    plugins: { '@next/next': nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      // These two rules call the removed `context.getAncestors()` API and
      // crash outright under ESLint 9 (confirmed: TypeError linting
      // app/layout.tsx). Both only apply to the legacy Pages Router
      // (`pages/_document`), which this App Router project doesn't use.
      '@next/next/no-duplicate-head': 'off',
      '@next/next/no-page-custom-font': 'off',
    },
  },
  {
    // The one DOM→WebGL seam. Repo-wide: nothing anywhere may reach into
    // three/ except through the registry.
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    rules: {
      // ESLint's `no-restricted-imports` "patterns" option matches `group`
      // entries with the `ignore` package (gitignore syntax), not minimatch —
      // it does not support bash extglobs like `!(registry)` (that string is
      // treated as a literal path segment and matches nothing, confirmed by
      // exercising the `ignore` package directly). The gitignore-native way
      // to say "everything under three/ except registry" is two patterns in
      // one group: a blanket glob followed by a `!`-prefixed negation.
      'no-restricted-imports': ['error', { patterns: [SEAM] }],
    },
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
