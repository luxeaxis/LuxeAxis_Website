import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { SkipLink } from '@/components/SkipLink';
import { TierProbe } from '@/components/TierProbe';
import { TrustMarquee } from '@/components/TrustMarquee';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ToastProvider } from '@/components/Toast';
import { ConsentBanner } from '@/components/ConsentBanner';
import { SmoothScrollGate } from '@/components/SmoothScrollGate';
import WhatsAppWidget from '@/components/ui/WhatsAppWidget';
import { JsonLd } from '@/components/JsonLd';
import { localBusinessJsonLd, organizationJsonLd, websiteJsonLd } from '@/lib/seo/jsonLd';
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
    default: 'Luxe Axis | Luxury Interior Design & Vastu-Tech Studio Chennai',
    template: '%s | Luxe Axis',
  },
  description:
    'Chennai’s premier luxury interior design & Vastu-Tech studio. Turnkey residences, un-gated itemized BOQs, 45-day guaranteed handover, and 10-year warranty.',
  keywords: [
    'luxury interior designers chennai',
    'vastu compliant interior design',
    'turnkey home interiors chennai',
    'modular kitchen chennai',
    'luxury villa interior design poes garden',
    'luxury apartment interiors boat club chennai',
    'nri interior design services chennai',
    'modern architectural interiors',
    'space intelligence',
    'german cnc joinery chennai',
  ],
  metadataBase: new URL(SITE_ORIGIN),
  openGraph: {
    type: 'website',
    siteName: 'Luxe Axis',
    locale: 'en_IN',
    url: SITE_ORIGIN,
    title: 'Luxe Axis | Luxury Interior Design & Vastu-Tech Studio Chennai',
    description:
      'Chennai’s premier luxury interior design & Vastu-Tech studio. Turnkey residences, un-gated itemized BOQs, 45-day guaranteed handover, and 10-year warranty.',
    images: [
      {
        url: '/posters/home-interiors-hero.png',
        width: 1200,
        height: 630,
        alt: 'Luxe Axis Luxury Interiors Chennai',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luxe Axis — Chennai Luxury Interior Design & Vastu-Tech Architecture',
    description:
      'AI-assisted space planning, Vastu-smart, delivered on a guaranteed handover date with transparent BOQ pricing.',
    images: ['/posters/home-interiors-hero.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon', type: 'image/png' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

// Only the weights that appear above the fold are preloaded. The site is
// English-only, so there is one display family and one UI family — shipping a
// second script's face
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const localBusiness = localBusinessJsonLd();

  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${display.variable} ${ui.variable}`}
    >
      <body className="lx-grain bg-surface text-on-surface">
        {/* Global Structured Data: WebSite, Organization, and LocalBusiness */}
        <JsonLd data={websiteJsonLd()} />
        <JsonLd data={organizationJsonLd()} />
        {localBusiness && <JsonLd data={localBusiness} />}
        {/* Resolves the device's motion preference into the store, which
            SmoothScroll reads. It also resolves a capability tier for future
            perf gating — see lib/tier/useDeviceTier.ts. */}
        <TierProbe />
        {/* Must stay the first focusable element in the DOM — Header adds
            several more focusable controls (logo, nav, Book Audit, hamburger)
            ahead of `#main`, which is exactly what the skip link exists to let
            a keyboard user bypass. */}
        <SkipLink />
        {/* Mounted once, site-wide, so any feature can call `useToast()`
            without also remembering to wire a provider (design system §3.5). */}
        <ToastProvider>
          {/* Renders nothing itself and no longer wraps the tree — it drives
              Lenis and publishes scroll progress, gated so that Lenis and GSAP
              leave the bundle entirely when the flag is off. */}
          <SmoothScrollGate />
          <div className="sticky top-0 z-header w-full">
            <TrustMarquee />
            <Header />
          </div>
          {children}
          <Footer />
          <WhatsAppWidget />
          {/* Last in the DOM deliberately: a keyboard user reaches the page's
              real content before the banner, which is the order of importance.
              It is positioned at the bottom of the viewport by CSS. */}
          <ConsentBanner />
        </ToastProvider>
      </body>
    </html>
  );
}
