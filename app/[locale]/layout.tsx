import type { Metadata } from 'next';
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

  return (
    <html lang={locale} data-theme="dark">
      <body className="bg-surface text-on-surface">
        <TierProbe />
        <SkipLink />
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
