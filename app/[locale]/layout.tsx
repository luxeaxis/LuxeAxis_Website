import type { Metadata } from 'next';
import { Playfair_Display, Inter, Noto_Serif_Tamil, Noto_Sans_Tamil } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { LOCALES, type Locale } from '@/lib/i18n/published';
import { SkipLink } from '@/components/SkipLink';
import { TierProbe } from '@/components/TierProbe';
import '@/styles/globals.css';

// The brand name is a proper noun, not translated content, so it is safe to
// set here without a human-reviewed Tamil pass (spec §3.4). Per-route,
// per-locale titles are content work for a later plan — this fixes the
// axe `document-title` violation the a11y gate (§6.2 gate) caught on every
// route: no route previously set a <title> at all.
export const metadata: Metadata = {
  title: 'Luxe Axis',
};

// Only the two weights that appear above the fold are preloaded; the font
// budget is ≤130KB PER LOCALE, not globally, which is why the Tamil families
// carry `preload: false` and are only attached to the <html> class list on
// /ta. Loading all four everywhere would blow the budget on both locales at
// once.
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

const displayTa = Noto_Serif_Tamil({
  subsets: ['tamil'],
  weight: ['500', '600'],
  variable: '--font-display-ta',
  display: 'swap',
  preload: false,
});

const uiTa = Noto_Sans_Tamil({
  subsets: ['tamil'],
  variable: '--font-ui-ta',
  display: 'swap',
  preload: false,
});

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(LOCALES as readonly string[]).includes(locale)) notFound();
  setRequestLocale(locale as Locale);
  const messages = await getMessages();

  const fontVars = [display.variable, ui.variable]
    .concat(locale === 'ta' ? [displayTa.variable, uiTa.variable] : [])
    .join(' ');

  return (
    <html lang={locale} data-theme="dark" className={fontVars}>
      <body className="lx-grain bg-surface text-on-surface">
        <TierProbe />
        <SkipLink />
        {/* Decorative: the meaning lives in the DOM beside it, never in it. */}
        <div className="lx-axis" aria-hidden="true" />
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
