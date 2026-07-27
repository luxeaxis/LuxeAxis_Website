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
