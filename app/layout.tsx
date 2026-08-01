import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { SkipLink } from '@/components/SkipLink';
import { TierProbe } from '@/components/TierProbe';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ToastProvider } from '@/components/Toast';
import { SITE_ORIGIN } from '@/lib/seo/origin';
import '@/styles/globals.css';

/**
 * The root layout — and now the ONLY layout, since the `[locale]` segment went
 * with the rest of the i18n stack.
 *
 * That flattening bought back something the locale segment had cost: with a
 * real `app/layout.tsx`, `app/not-found.tsx` renders inside it, so a 404 now
 * gets a properly server-rendered `<html lang="en">` document instead of Next's
 * bare `__next_error__` shell. The `[...rest]` catch-all that existed purely to
 * route misses into the locale layout is deleted with it.
 */

export const metadata: Metadata = {
  title: 'Luxe Axis',
  // Lets pages express OpenGraph/alternate URLs relatively and still emit
  // absolute ones. Shares lib/seo/origin.ts with the sitemap and robots.txt so
  // all three agree on the host.
  metadataBase: new URL(SITE_ORIGIN),
};

// Only the weights that appear above the fold are preloaded. The Tamil families
// (Noto Serif/Sans Tamil) that used to sit alongside these are gone with the
// locale routing — nothing renders Tamil any more, so shipping a Tamil face
// would be pure weight.
const display = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-display',
  display: 'swap',
});

const ui = Inter({
  subsets: ['latin'],
  variable: '--font-ui',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={`${display.variable} ${ui.variable}`}>
      <body className="lx-grain bg-surface text-on-surface">
        <TierProbe />
        {/* Must stay the first focusable element in the DOM — Header adds
            several more focusable controls (logo, nav, Book Audit, hamburger)
            ahead of `#main`, which is exactly what the skip link exists to let
            a keyboard user bypass. */}
        <SkipLink />
        {/* Decorative: the meaning lives in the DOM beside it, never in it. */}
        <div className="lx-axis" aria-hidden="true" />
        {/* Mounted once, site-wide, so any feature can call `useToast()`
            without also remembering to wire a provider (design system §3.5). */}
        <ToastProvider>
          <Header />
          {children}
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
