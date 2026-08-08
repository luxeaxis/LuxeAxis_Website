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

// Blocks three.js and @react-three/* from app code. The WebGL layer was
// descoped; posters in lib/content/posters.ts replaced live scenes. Keeping
// this rule prevents accidental reintroduction of a heavy dependency the
// bundle no longer needs.
const SEAM = {
  group: [
    '**/three/**',
    '/three',
    '/three/**',
    '@react-three/*',
  ],
  message: 'WebGL/three.js was descoped — do not import three or @react-three/*.',
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
  'ImportExpression[source.value=/^three$|(^|\\/)three\\/|^@react-three\\//]';

export default [
  {
    // Anchored patterns like `.next/**` only match at the repo root, so build
    // output inside a nested checkout is linted as if it were source. That is
    // not hypothetical: a git worktree under `.claude/worktrees/<agent>/` with
    // its own `.next` made `eslint .` fail on compiled Next.js chunks —
    // thousands of `no-require-imports` errors in machine-generated code.
    // `**/` makes each pattern match at any depth; `.claude/**` excludes agent
    // scratch outright, since nothing under it is ever this project's source.
    ignores: [
      '**/.next/**',
      '**/node_modules/**',
      '.claude/**',
      'styles/tokens*.css',
    ],
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
        message: 'WebGL/three.js was descoped — do not dynamically import three or @react-three/*.',
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
