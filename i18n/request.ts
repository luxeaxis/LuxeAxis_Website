import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/published';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = (routing.locales as readonly string[]).includes(requested ?? '')
    ? (requested as Locale)
    : DEFAULT_LOCALE;
  return { locale, messages: (await import(`../messages/${locale}.json`)).default };
});
