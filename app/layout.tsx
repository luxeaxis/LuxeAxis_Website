import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { SkipLink } from '@/components/SkipLink';
import { TierProbe } from '@/components/TierProbe';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ToastProvider } from '@/components/Toast';
import { ConsentBanner } from '@/components/ConsentBanner';
import { SceneStage } from '@/three/stage';
import { JsonLd } from '@/components/JsonLd';
import { localBusinessJsonLd, organizationJsonLd } from '@/lib/seo/jsonLd';
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
  title: {
    // Pages set their own full title; this is the fallback and the suffix for
    // anything that does not.
    default: 'Luxe Axis',
    template: '%s',
  },
  // Lets pages express OpenGraph/alternate URLs relatively and still emit
  // absolute ones. Shares lib/seo/origin.ts with the sitemap and robots.txt so
  // all three agree on the host.
  metadataBase: new URL(SITE_ORIGIN),
  // Site-wide OpenGraph defaults. Each page's own `title`/`description` flow
  // into these automatically, so a shared card shape is defined once.
  //
  // No `images`: an OG image has to be an actual asset, and the only brand
  // asset in the repo is an unvectorised logo raster that Header and Footer are
  // both still standing in for. A card pointing at a missing image is worse
  // than no card — the platforms render a broken thumbnail rather than falling
  // back cleanly.
  openGraph: {
    type: 'website',
    siteName: 'Luxe Axis',
    locale: 'en_IN',
  },
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
  const localBusiness = localBusinessJsonLd();

  return (
    <html lang="en" data-theme="dark" className={`${display.variable} ${ui.variable}`}>
      <body className="lx-grain bg-surface text-on-surface">
        {/* Organization and LocalBusiness, site-wide rather than repeated per
            page. LocalBusiness renders only once a real address exists — see
            lib/seo/jsonLd.ts for why an invented one would be worse than an
            absent node. */}
        <JsonLd data={organizationJsonLd()} />
        {localBusiness && <JsonLd data={localBusiness} />}
        <TierProbe />
        {/* The WebGL layer, behind all DOM content. Renders null unless the
            three_v1 flag is on, the device is T2+, motion is not reduced and a
            scene is active — so null everywhere today. With the flag off the
            bundler drops three entirely; see three/stage.tsx. */}
        <SceneStage />
        {/* Must stay the first focusable element in the DOM — Header adds
            several more focusable controls (logo, nav, Book Audit, hamburger)
            ahead of `#main`, which is exactly what the skip link exists to let
            a keyboard user bypass. */}
        <SkipLink />
        {/* Mounted once, site-wide, so any feature can call `useToast()`
            without also remembering to wire a provider (design system §3.5). */}
        <ToastProvider>
          <Header />
          {children}
          <Footer />
          {/* Last in the DOM deliberately: a keyboard user reaches the page's
              real content before the banner, which is the order of importance.
              It is positioned at the bottom of the viewport by CSS. */}
          <ConsentBanner />
        </ToastProvider>
      </body>
    </html>
  );
}
