import { setRequestLocale } from 'next-intl/server';
import { alternatesFor } from '@/lib/seo/hreflang';
import { assertPublished } from '@/lib/i18n/guard';
import { isPublished, LOCALES, type Locale } from '@/lib/i18n/published';

const ROUTE = '/pricing';

// Only prerender locales this route is actually published in. Without this the
// build wrote .next/server/app/ta/pricing.html containing <html lang="ta"> around
// an English <h1> — English under lang="ta", shipped to disk, kept unreachable
// only by middleware.
export function generateStaticParams() {
  return LOCALES.filter((locale) => isPublished(ROUTE, locale)).map((locale) => ({ locale }));
}

// Previously exported no metadata at all, so /pricing emitted zero hreflang.
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return { alternates: alternatesFor(ROUTE, locale as Locale) };
}

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // Not decorative, and not redundant with the identical call in
  // app/[locale]/layout.tsx: this route is static today only because it uses
  // no translations at all. The first `t()` added to it without this line
  // would send next-intl to `headers()` and silently turn the whole route
  // dynamic — the exact regression app/[locale]/page.tsx was shipping. See
  // that file for the full account.
  setRequestLocale(locale as Locale);
  assertPublished(ROUTE, locale as Locale);

  return (
    <main id="main" tabIndex={-1}>
      <h1>Pricing</h1>
    </main>
  );
}
