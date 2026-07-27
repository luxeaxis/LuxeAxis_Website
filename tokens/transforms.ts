import StyleDictionary from 'style-dictionary';

type ShadowLayer = { color: string; offsetX: string; offsetY: string; blur: string; spread: string };

// The brief's `transforms: ['shadow/css-list']` (Step 5) is concatenated
// AFTER `transformGroup: 'css'`'s own transform list, not run in isolation
// (confirmed in node_modules/style-dictionary/lib/transform/config.js:
// `transforms = transforms.concat(to_ret.transforms)`). The `css`
// transformGroup already ships a built-in shadow-flattening value transform
// (`shadowCssShorthand`) that runs first and turns `token.$value` from the
// authored array into an already-joined CSS string. When this transform then
// read `token.$value` too, `Array.isArray(token.$value)` was false, so it
// fell into the `[token.$value]` branch and destructured `.offsetX` etc. off
// a *string* — producing `--elevation-dark-1: undefined undefined undefined
// undefined undefined` (confirmed by running `pnpm tokens` and inspecting
// styles/tokens.dark.css before this fix; see task-2-report.md). Reading
// from `token.original.$value` instead — the untouched source value, never
// mutated by earlier transforms — makes this transform's output correct
// regardless of what ran before it, so it composes safely with the built-in
// one instead of racing it. (The built-in's output is already the right
// shape; this transform now just redundantly re-derives the same string
// from the source of truth rather than depending on transform order.)
StyleDictionary.registerTransform({
  name: 'shadow/css-list',
  type: 'value',
  transitive: true,
  filter: (token) => token.$type === 'shadow',
  transform: (token) => {
    const raw = (token.original?.$value ?? token.$value) as ShadowLayer | ShadowLayer[];
    const layers: ShadowLayer[] = Array.isArray(raw) ? raw : [raw];
    return layers
      .map((l) => `${l.offsetX} ${l.offsetY} ${l.blur} ${l.spread} ${l.color}`)
      .join(', ');
  },
});

// The brief's build script (Step 5) never registers a name transform, but the
// interface contract (see brief "Produces") requires CSS variables named
// `--surface`, `--accent`, etc. — not the `css` transformGroup's default
// `name/kebab`, which joins the FULL token path
// (`semantic.surface` -> `--semantic-surface`, `component.button.primary-bg`
// -> `--component-button-primary-bg`). Confirmed by running the build before
// this transform existed: the generated CSS declared `--semantic-surface`,
// `--component-button-primary-bg`, etc. — none of the required bare names —
// so every "declares every semantic role" / "var() reference" assertion in
// tests/unit/tokens.test.ts failed (see task-2-report.md for the raw output).
//
// The semantic tier's whole purpose is to expose theme-agnostic ROLE names
// as the public CSS surface, so its own tier segment ("semantic") is
// dropped for every semantic token. `component.button.*` and
// `component.card.*` get the same treatment (abbreviating "button" to "btn")
// because those are the two component groups the brief's Produces list names
// explicitly (`--btn-primary-bg`, `--card-bg`). `component.field.*` and
// `component.nav.*` are deliberately left on the default full-path naming:
// dropping "component" there would collide with the semantic tier's own
// `--field-bg` / `--field-border-focus` (component.field.bg's *value* is a
// reference to semantic.field-bg — giving both the same generated name would
// make one shadow the other, defeating the semantic indirection instead of
// exercising it). Every other tier (primitives, theme, typography, etc.)
// keeps Style Dictionary's normal kebab-cased full path, unaffected.
//
// Style Dictionary's own `name/kebab` transform is `kebabCase(prefix +
// path.join(' '))` (via the `change-case` package it depends on but that
// this project does not, so it isn't reused directly here). `toKebab` below
// reimplements just the part this build needs: camelCase segment boundaries
// (from Step 5's `expand`-generated typography sub-tokens, e.g. `fontFamily`)
// get a dash inserted before lowercasing; token-authored segments are
// already lower-kebab and pass through unchanged.
function toKebab(segment: string): string {
  return segment.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

StyleDictionary.registerTransform({
  name: 'name/luxe-css',
  type: 'name',
  transform: (token) => {
    const path = token.path;
    if (path[0] === 'semantic') {
      return path.slice(1).map(toKebab).join('-');
    }
    if (path[0] === 'component' && path[1] === 'button') {
      return ['btn', ...path.slice(2).map(toKebab)].join('-');
    }
    if (path[0] === 'component' && path[1] === 'card') {
      return path.slice(1).map(toKebab).join('-');
    }
    return path.map(toKebab).join('-');
  },
});
