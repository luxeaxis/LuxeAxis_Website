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
      },
      spacing: space,
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
      },
      opacity: {
        disabled: 'var(--opacity-disabled)',
        muted: 'var(--opacity-muted)',
        scrim: 'var(--opacity-scrim)',
      },
      blur: { glass: 'var(--blur-glass)', 'glass-strong': 'var(--blur-glass-strong)' },
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
      minHeight: { touch: 'var(--size-touch-min)' },
      minWidth: { touch: 'var(--size-touch-min)' },
    },
  },
  plugins: [],
} satisfies Config;
