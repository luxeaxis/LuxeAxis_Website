import type { Config } from 'tailwindcss';

// The token build emits ~120 CSS custom properties, but only colours, radii and
// three durations were ever mapped into the theme. That left "tokens only — no
// hard-coded colour, space, duration or easing" with no sanctioned path for
// most of those families, and the very first component shipped already broke it:
// SkipLink reached for Tailwind's own `left-4`, `px-4`, `z-50`, `outline-2`
// defaults because no token-backed equivalent was exposed.
//
// Everything below maps to a variable the token build actually emits. A design
// token that cannot be spent is not a design system, it's documentation.

// Control and icon sizes exist as `size.control-*` / `size.icon-*` tokens
// (see tokens/luxe-axis.tokens.json) and are already emitted as CSS custom
// properties, but no scale exposed them to Tailwind's `height`/`width`
// theme — the primitives brief needed Button/Field heights (36/44/52) and
// Icon dimensions (16/20/24), so both are added here rather than reaching
// for an arbitrary-value literal at each call site.
const controlAndIconSize = {
  'control-sm': 'var(--size-control-sm)',
  'control-md': 'var(--size-control-md)',
  'control-lg': 'var(--size-control-lg)',
  'icon-sm': 'var(--size-icon-sm)',
  'icon-md': 'var(--size-icon-md)',
  'icon-lg': 'var(--size-icon-lg)',
};

const space = {
  0: 'var(--space-0)',
  1: 'var(--space-1)',
  2: 'var(--space-2)',
  3: 'var(--space-3)',
  4: 'var(--space-4)',
  5: 'var(--space-5)',
  6: 'var(--space-6)',
  7: 'var(--space-7)',
  8: 'var(--space-8)',
  9: 'var(--space-9)',
  10: 'var(--space-10)',
  gutter: 'var(--space-gutter)',
  'section-y': 'var(--space-section-y)',
};

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './features/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // All 16 semantic roles, not the 9 that happened to be needed first.
      // A role that exists in the token file but not here is a role a
      // component cannot use without hard-coding.
      colors: {
        surface: 'var(--surface)',
        'surface-deep': 'var(--surface-deep)',
        'surface-raised': 'var(--surface-raised)',
        'surface-raised-2': 'var(--surface-raised-2)',
        'on-surface': 'var(--on-surface)',
        'on-surface-2': 'var(--on-surface-2)',
        'on-surface-muted': 'var(--on-surface-muted)',
        accent: 'var(--accent)',
        'accent-contrast': 'var(--accent-contrast)',
        'accent-hover': 'var(--accent-hover)',
        signal: 'var(--signal)',
        'border-subtle': 'var(--border-subtle)',
        border: 'var(--border)',
        'border-strong': 'var(--border-strong)',
        'focus-ring': 'var(--focus-ring)',
        'field-bg': 'var(--field-bg)',
        'field-border-focus': 'var(--field-border-focus)',
        'nav-bg': 'var(--nav-bg)',
        // Promoted from the status primitive tier (`color.status.*`) to the
        // semantic tier for Field's error/success states (§3.4) — see the
        // tokens/modes/*.json + tokens.json comments at `theme.*.error`.
        error: 'var(--error)',
        success: 'var(--success)',
        // Same promotion, added for the feedback/status set (§3.5) — Badge,
        // InlineAlert and Toast all need a warning and an info tone
        // alongside error/success, and "never colour-only" still applies, so
        // these need to be real semantic roles a component can name, not a
        // reach for the withheld `color.status.warning`/`.info` primitives.
        warning: 'var(--warning)',
        info: 'var(--info)',
      },
      spacing: space,
      height: controlAndIconSize,
      width: controlAndIconSize,
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        pill: 'var(--radius-pill)',
        round: 'var(--radius-round)',
      },
      borderWidth: {
        hairline: 'var(--border-width-hairline)',
        regular: 'var(--border-width-regular)',
        focus: 'var(--border-width-focus)',
      },
      outlineWidth: { focus: 'var(--border-width-focus)' },
      outlineOffset: { focus: 'var(--border-width-focus-offset)' },
      transitionDuration: {
        instant: 'var(--duration-instant)',
        micro: 'var(--duration-micro)',
        ui: 'var(--duration-ui)',
        enter: 'var(--duration-enter)',
        section: 'var(--duration-section)',
        signature: 'var(--duration-signature)',
      },
      // Tailwind's built-in `transition-colors` utility only ever animates
      // `color, background-color, border-color, text-decoration-color, fill,
      // stroke` — `transform` isn't in that list, so a component animating
      // both colour AND `scale`/`translate` on the same trigger (Button's
      // press scale, alongside its colour states) needs a named property
      // list that includes both. `transition-all` was rejected as the fix
      // (see Button.tsx) because it would also pick up layout properties
      // (width, padding, etc.) that aren't meant to animate.
      transitionProperty: {
        'colors-transform':
          'color, background-color, border-color, text-decoration-color, fill, stroke, transform',
        // Card's hover state (§2.3 "Hover-lift": translateY + elevation step,
        // together) needs `transform` and `box-shadow` to animate on one
        // trigger. Two separate `transition-property` utilities can't be
        // combined by stacking classes — `transition-property` is a single
        // CSS declaration, so the later one in the compiled stylesheet wins
        // outright rather than merging lists, the same reasoning
        // `colors-transform` above already documents for colour + transform.
        'shadow-transform': 'transform, box-shadow',
      },
      transitionTimingFunction: {
        standard: 'var(--easing-standard)',
        entrance: 'var(--easing-entrance)',
        exit: 'var(--easing-exit)',
        spatial: 'var(--easing-spatial)',
      },
      fontFamily: {
        display: 'var(--font-family-display)',
        ui: 'var(--font-family-ui)',
        mono: 'var(--font-family-mono)',
        'display-ta': 'var(--font-family-display-ta)',
        'ui-ta': 'var(--font-family-ui-ta)',
      },
      boxShadow: {
        'dark-1': 'var(--elevation-dark-1)',
        'dark-2': 'var(--elevation-dark-2)',
        'light-1': 'var(--elevation-light-1)',
        'light-2': 'var(--elevation-light-2)',
        // Theme-resolved elevation steps — `--elevation-1`/`-2` are the
        // scripts/build-tokens.ts alias that picks dark-1/2 vs light-1/2 for
        // the active `data-theme`, the same indirection every colour role
        // already gets (`--surface`, `--accent`…). Card is the first
        // consumer: `shadow-1` at rest, `shadow-2` on hover, correct in both
        // themes with no per-theme branching in component code.
        1: 'var(--elevation-1)',
        2: 'var(--elevation-2)',
      },
      opacity: {
        disabled: 'var(--opacity-disabled)',
        muted: 'var(--opacity-muted)',
        scrim: 'var(--opacity-scrim)',
      },
      blur: { glass: 'var(--blur-glass)', 'glass-strong': 'var(--blur-glass-strong)' },
      // `typography.small`/`typography.overline` composite tokens already
      // get expanded into standalone `--typography-<name>-font-size` CSS
      // vars by the token build (`expand: { include: ['typography'] }` in
      // scripts/build-tokens.ts — confirmed present in styles/tokens.css).
      // Exposing just the font-size half of each composite here is a clean,
      // fully-wired change; the other sub-properties (weight, tracking,
      // family) aren't part of this fontSize scale and are left alone.
      fontSize: {
        overline: 'var(--typography-overline-font-size)',
        small: 'var(--typography-small-font-size)',
      },
      // The z-index scale exists precisely so layering is decided once, in the
      // token file, rather than re-argued at each call site with a magic number.
      zIndex: {
        base: 'var(--z-index-base)',
        canvas: 'var(--z-index-canvas)',
        content: 'var(--z-index-content)',
        sticky: 'var(--z-index-sticky)',
        header: 'var(--z-index-header)',
        drawer: 'var(--z-index-drawer)',
        overlay: 'var(--z-index-overlay)',
        modal: 'var(--z-index-modal)',
        toast: 'var(--z-index-toast)',
        tooltip: 'var(--z-index-tooltip)',
      },
      maxWidth: { container: 'var(--size-container)', measure: 'var(--size-measure)' },
      // `control-sm/md/lg` reused here (alongside `height` above) so a
      // multi-row control (Field's `<textarea>`) can enforce the same
      // ≥44px-floor scale as a MINIMUM without capping its ability to grow
      // taller than one row — see Field.tsx's `min-h-control-lg`.
      minHeight: { ...controlAndIconSize, touch: 'var(--size-touch-min)' },
      minWidth: { touch: 'var(--size-touch-min)' },
      // `motion.press-scale` (0.98) is a token, not a stylistic pick — Tailwind's
      // built-in `scale-*` utilities are percentage-keyed (50/75/90/95…) and have
      // no slot for it, so it needs its own theme key rather than an inline
      // arbitrary value at every pressable component.
      scale: { press: 'var(--motion-press-scale)' },
      // The shimmer sheen is "the one looping animation the whole system
      // permits" (§2.3/§3.6) — Skeleton's only consumer. 1.4s has no home in
      // `duration.*` (those tokens model transition durations — 80/120/240/
      // 480/800/1200ms — not a sheen-sweep period; see Header.tsx's
      // CONDENSE_THRESHOLD_PX for the same "spec-text literal, not a token
      // family" reasoning already established in this codebase). Reported in
      // the delivery notes as a value with no backing token, per the brief.
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '150% 0' },
          '100%': { backgroundPosition: '-150% 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.4s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
