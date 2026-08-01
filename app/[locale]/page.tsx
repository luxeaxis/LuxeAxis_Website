import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SceneSlot } from '@/components/SceneSlot';
import { alternatesFor } from '@/lib/seo/hreflang';
import type { Locale } from '@/lib/i18n/published';

const ROUTE = '/';

// generateMetadata, not a static `metadata` export: a static object is shared by
// every locale, so /ta would canonicalise to the English URL and be dropped as a
// duplicate.
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return { alternates: alternatesFor(ROUTE, locale as Locale) };
}

// `setRequestLocale` is what keeps this route STATIC, and it has to be called
// here — not just in app/[locale]/layout.tsx, which already calls it.
// next-intl scopes that call to the render it happens in; a page that reaches
// for a translation without having made it falls back to reading `headers()`,
// and touching `headers()` opts the whole route into dynamic rendering.
//
// This page previously called `useTranslations` with no `setRequestLocale` of
// its own, and the cost was invisible from the build summary: `next build`
// still printed `● /[locale] → /en, /ta`, but .next/prerender-manifest.json
// listed only /en/pricing and /en/style, and a running server answered `/`
// with `Cache-Control: private, no-cache, no-store` while /pricing got
// `s-maxage=31536000` + `x-nextjs-cache: HIT`. The site's LCP-critical page
// was the one page being server-rendered on every request and refused by
// every CDN. /pricing and /style escaped only because neither uses a
// translation — which is exactly why they now call this too (see their own
// files): the trap is re-armed the moment anyone adds a `t()` to them.
//
// `getTranslations` (async, server) rather than `useTranslations` (sync,
// hook): a page that awaits `params` is an async component, and hooks cannot
// be called from one. The alternative — keeping `useTranslations` in a
// synchronous child — would work, but splitting a five-line page in two to
// preserve the hook form buys nothing here.
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations('hero');

  return (
    <main id="main" tabIndex={-1}>
      <SceneSlot id="hero">
        <h1>{t('headline')}</h1>
      </SceneSlot>
    </main>
  );
}
