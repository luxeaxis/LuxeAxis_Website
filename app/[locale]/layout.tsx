import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { LOCALES, type Locale } from '@/lib/i18n/published';
import { SkipLink } from '@/components/SkipLink';
import '@/styles/globals.css';

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
        <SkipLink />
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
