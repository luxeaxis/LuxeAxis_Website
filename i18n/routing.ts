import { defineRouting } from 'next-intl/routing';
import { LOCALES, DEFAULT_LOCALE } from '@/lib/i18n/published';

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'as-needed',
});
