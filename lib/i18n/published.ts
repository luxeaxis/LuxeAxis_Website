export const LOCALES = ['en', 'ta'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

/** Routes with a human-reviewed Tamil translation. Add a route here ONLY when
 *  a reviewer has signed off — machine translation is forbidden by brand policy.
 *  English is implicitly complete and is not listed. */
export const PUBLISHED: { ta: string[] } = {
  ta: ['/'],
};

export function normalise(route: string): string {
  const trimmed = route.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

export function isPublished(route: string, locale: Locale): boolean {
  if (locale === DEFAULT_LOCALE) return true;
  return PUBLISHED.ta.includes(normalise(route));
}
