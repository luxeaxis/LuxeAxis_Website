import StyleDictionary from 'style-dictionary';
import { writeFileSync, readFileSync } from 'node:fs';
import './../tokens/transforms';
// Appended below the per-theme builds: the nav glass recipe, derived from
// the surface and opacity tokens.
import tokens from '../tokens/luxe-axis.tokens.json';

const MODES = [
  { name: 'dark',  selector: ':root' },
  { name: 'light', selector: '[data-theme="light"]' },
] as const;

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// The build uses `await sd.buildAllPlatforms()`, which requires top-level
// await. This file has no `.mts` extension and the package has no
// `"type": "module"` (that's deliberate elsewhere in the repo — see
// eslint.config.mjs / next.config.mjs, which opt into ESM per-file via
// extension instead of flipping the whole package to ESM). tsx therefore
// loads a bare `.ts` entrypoint as CJS by default, and esbuild rejects
// top-level await under a CJS output format:
//   "Top-level await is currently not supported with the "cjs" output format"
// (confirmed by running `pnpm tokens` before this fix — see task-2-report.md).
// Wrapping the body in an async function and invoking it keeps the same
// file path and CJS-compatible output while still allowing `await` inside.
async function main() {
  for (const mode of MODES) {
    const sd = new StyleDictionary({
      source: ['tokens/luxe-axis.tokens.json', `tokens/modes/${mode.name}.json`],
      usesDtcg: true,
      expand: { include: ['typography'] },
      // Filtering out theme.* (below) is deliberate: semantic tokens still
      // author-reference it (`{theme.dark.surface}`, etc.) so their *value*
      // resolves correctly, but Style Dictionary's css/variables format
      // triggers its reference-sort pass whenever `outputReferences` is any
      // truthy value — a function included — regardless of what that
      // function returns per token (see formattedVariables.js:
      // `if (outputReferences) { ...sortByReference... }`, which is not
      // gated per-token). That pass walks every referencing token's
      // original value, notices `theme.*` was filtered out of this file,
      // and logs "filtered out token references were found" even though
      // the resolved value is already correct and no reference to
      // `theme.*` is ever emitted. Style Dictionary's own message for this
      // is "Ignore this warning if intentional" — it is: `theme.*` is
      // withheld by design (see the filter below), not by mistake.
      // `warnings: 'disabled'` silences it (confirmed empirically: without
      // it, both tokens.dark.css and tokens.light.css log this warning to
      // stdout on every `pnpm tokens` run; with it, stdout is clean and
      // stderr stays empty either way — Style Dictionary always logs via
      // console.log, never console.error). This also silences the
      // token-name-collision warning for this build; that tradeoff is
      // accepted here because collisions are covered by
      // tests/unit/tokens.test.ts's "declares component tokens exactly
      // once" assertion instead.
      log: { warnings: 'disabled' },
      platforms: {
        css: {
          transformGroup: 'css',
          transforms: ['shadow/css-list', 'name/luxe-css'],
          buildPath: 'styles/',
          files: [{
            destination: `tokens.${mode.name}.css`,
            format: 'css/variables',
            // theme.* is an internal mapping from semantic ROLE to PRIMITIVE
            // (e.g. theme.dark.surface -> color.brand.navy) that exists only
            // so each mode file has something for the semantic tier to alias.
            // It must never be published: doing so would let a component read
            // var(--theme-light-surface) directly and bypass the semantic
            // tier entirely, which defeats the whole purpose of this
            // pipeline. It's excluded from BOTH builds below.
            //
            // Beyond that, the dark build emits everything else (primitives,
            // semantic, component — dark is the default `:root` theme), while
            // the light build emits ONLY the semantic overrides. Primitives,
            // component tokens, and every scale are theme-independent —
            // emitting them twice would declare each variable twice and
            // defeat the whole point of the semantic tier.
            filter: (token) =>
              token.path[0] !== 'theme' &&
              (mode.name === 'dark' || token.path[0] === 'semantic'),
            options: {
              selector: mode.selector,
              // Component tokens (`--btn-primary-bg`, etc.) keep their var()
              // reference — e.g. `var(--accent)` — so flipping `data-theme`
              // re-resolves them live with no rebuild. Semantic tokens
              // cannot do the same: they alias `theme.<mode>.*` internally,
              // and that tier is filtered out above, so an unresolved
              // reference would point at a variable that no longer exists.
              // Resolving semantic tokens to literals also means the light
              // block's `--surface: #FCFAF5` genuinely overrides the dark
              // block's `--surface: #0D2B4E` in the cascade, instead of both
              // pointing at the same withheld internal variable. Style
              // Dictionary v4's `outputReferences` accepts a predicate per
              // token, so the two tiers can be told apart in one pass.
              outputReferences: (token) => token.path[0] === 'component',
            },
          }],
        },
      },
    });
    await sd.buildAllPlatforms();
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
}

main();
