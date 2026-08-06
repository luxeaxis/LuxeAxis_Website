import StyleDictionary from 'style-dictionary';
import { writeFileSync, readFileSync } from 'node:fs';
import './../tokens/transforms';
// Appended below the per-theme builds: the nav glass recipe, derived from
// the surface and opacity tokens.
import tokens from '../tokens/luxe-axis.tokens.json';
// The semantic role list for the light-theme override block (see the
// concatenation step at the bottom of this file) is derived from this file
// instead of hardcoded, so it can never drift from the tokens themselves.
import darkMode from '../tokens/modes/dark.json';

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
      // No file-level `filter` is used here (deliberately — see the removed
      // filter this replaces). Style Dictionary's css/variables format
      // triggers its reference-sort pass whenever `outputReferences` is any
      // truthy value — a function included — regardless of what that
      // function returns per token (see formattedVariables.js:
      // `if (outputReferences) { ...sortByReference... }`, which is not
      // gated per-token). That pass walks every referencing token's
      // original value and, if the referenced token was withheld from this
      // file by a `filter`, logs "filtered out token references were
      // found" via `getReferences.js`'s `unfilteredTokens` fallback path —
      // even when the resolved value is already correct. A blanket
      // `log: { warnings: 'disabled' }` would silence that cosmetic
      // message, but it has no per-category granularity: it also silences
      // the name-collision warning (this pipeline has a real one to catch
      // — see the `name/luxe-css` comment in tokens/transforms.ts about
      // why `component.field.*` and `component.nav.*` keep their full path
      // to avoid colliding with the semantic tier) and the unknown
      // CSS font-shorthand warning (relevant here because `expand: {
      // include: ['typography'] }` runs over `clamp()` font sizes). Instead,
      // every token is left in-file for both builds (no `filter` below), so
      // no reference ever resolves via the `unfilteredTokens` fallback and
      // the warning never fires — nothing needs suppressing. The theme-tier
      // exclusion and the dark/light split now happen textually, after the
      // fact, in the concatenation step at the bottom of this file, working
      // from the generated (git-ignored) intermediate files.
      platforms: {
        css: {
          transformGroup: 'css',
          transforms: ['shadow/css-list', 'name/luxe-css'],
          buildPath: 'styles/',
          files: [{
            destination: `tokens.${mode.name}.css`,
            format: 'css/variables',
            // No filter here — see the comment on `source`/`expand` above for
            // why. This intermediate file (styles/tokens.${mode.name}.css) is
            // generated and git-ignored, so it transiently contains every
            // tier, including theme.* and (for the light build) the full
            // dark/light primitive and component scales. Only the final
            // styles/tokens.css, assembled in the concatenation step below,
            // has to be clean — that's where theme.* gets dropped and the
            // light build gets narrowed down to just its semantic overrides.
            options: {
              selector: mode.selector,
              // Component tokens (`--btn-primary-bg`, etc.) keep their var()
              // reference — e.g. `var(--accent)` — so flipping `data-theme`
              // re-resolves them live with no rebuild. Semantic tokens
              // cannot do the same: they alias `theme.<mode>.*` internally,
              // and that tier is dropped from the final output (see the
              // concatenation step below), so an unresolved reference would
              // point at a variable that no longer exists.
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
      fill: hexToRgba(tokens.color.brand.emerald.$value, tokens.opacity['glass-dark'].$value),
    },
    {
      selector: '[data-theme="light"]',
      fill: hexToRgba(tokens.color.brand.ivory.$value, tokens.opacity['glass-light'].$value),
    },
  ]
    .map(({ selector, fill }) => `${selector} {\n  --nav-bg: ${fill};\n}`)
    .join('\n');

  // Card (§3.2) needs elevation that swaps by theme — §1.6: "elevation is
  // light, not shadow, on dark… on light, soft navy-tinted drop shadows.
  // Never heavy black shadows on navy." The token file only ever defines the
  // fixed pair `elevation.dark-1/2` and `elevation.light-1/2` (see
  // `--elevation-dark-1` etc. above, both always present in `:root`
  // regardless of `data-theme` — confirmed by inspecting the generated
  // output); nothing resolves "the right one for the current theme"
  // automatically the way the semantic colour roles (`--surface`, `--accent`…)
  // do. `--elevation-1`/`--elevation-2` are that missing semantic alias, built
  // the same way `--nav-bg` above already bridges a similar gap: `var()`
  // references to the existing tokens, not new values, so a card can write
  // `shadow-1`/`shadow-2` once and have it resolve correctly in both themes
  // exactly like every colour-based utility already does.
  const ELEVATION = [
    { selector: ':root', tier: 'dark' },
    { selector: '[data-theme="light"]', tier: 'light' },
  ]
    .map(
      ({ selector, tier }) =>
        `${selector} {\n  --elevation-1: var(--elevation-${tier}-1);\n  --elevation-2: var(--elevation-${tier}-2);\n}`,
    )
    .join('\n');

  // Both intermediate files are now unfiltered (see the `files[0]` comment
  // above), so each contains every tier — primitives, theme.*, semantic,
  // component, and every theme-independent scale. Rebuild the final
  // dark/light blocks textually, keeping only what belongs in each.
  //
  // A css/variables file has exactly one rule (its declarations may span
  // several lines each, but never nest another `{ ... }`), so the first `{`
  // and the last `}` in the file bound the full declaration list.
  function getDeclarations(css: string): string[] {
    const open = css.indexOf('{');
    const close = css.lastIndexOf('}');
    return css
      .slice(open + 1, close)
      .split('\n')
      .map((line) => line.trimEnd())
      .filter((line) => line.trim().length > 0);
  }

  // Pulls the bare custom-property name out of a declaration line, e.g.
  // `  --surface: #0D2B4E;` -> `surface`.
  function declName(line: string): string | null {
    const match = line.match(/--([a-z0-9-]+):/i);
    return match?.[1] ?? null;
  }

  const darkRaw = readFileSync('styles/tokens.dark.css', 'utf8');
  const lightRaw = readFileSync('styles/tokens.light.css', 'utf8');

  // dark -> :root keeps everything EXCEPT the internal theme tier. The
  // `name/luxe-css` transform (tokens/transforms.ts) sends theme.* tokens
  // down its default (unabbreviated) path-join branch, so e.g.
  // `theme.dark.surface` becomes `--theme-dark-surface` — confirmed by
  // inspecting the generated styles/tokens.dark.css, which (before this
  // filtering) declares `--theme-dark-surface`, `--theme-light-surface`,
  // etc. `--theme-` is therefore the exact, verified prefix to strip.
  const darkDeclarations = getDeclarations(darkRaw).filter((line) => {
    const name = declName(line);
    return name !== null && !name.startsWith('theme-');
  });

  // light -> [data-theme="light"] keeps ONLY the semantic role variables —
  // the role list comes from tokens/modes/dark.json's `semantic` object
  // (any mode file has the same role keys; dark.json is used as the
  // canonical source) rather than being hardcoded, so it can't drift from
  // the tokens themselves.
  const semanticRoles = new Set(
    Object.keys(darkMode.semantic).filter((key) => !key.startsWith('$')),
  );
  const lightDeclarations = getDeclarations(lightRaw).filter((line) => {
    const name = declName(line);
    return name !== null && semanticRoles.has(name);
  });

  const darkBlock = [':root {', ...darkDeclarations, '}'].join('\n');
  const lightBlock = ['[data-theme="light"] {', ...lightDeclarations, '}'].join('\n');

  writeFileSync(
    'styles/tokens.css',
    `/* GENERATED by scripts/build-tokens.ts — do not edit. */\n${darkBlock}\n${lightBlock}\n${GLASS}\n${ELEVATION}\n`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

