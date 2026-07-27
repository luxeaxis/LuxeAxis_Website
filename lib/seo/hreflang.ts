import { isPublished } from '@/lib/i18n/published';

const ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN ?? 'https://luxeaxis.com';

export function alternatesFor(route: string): {
  languages: Record<string, string>;
  canonical: string;
} {
  const path = route === '/' ? '' : route;
  const en = `${ORIGIN}/${path}`.replace(/([^:])\/+/g, '$1/').replace(/\/$/, '') || ORIGIN;
  const canonical = route === '/' ? `${ORIGIN}/` : en;

  const languages: Record<string, string> = { en: canonical };
  if (isPublished(route, 'ta')) languages.ta = `${ORIGIN}/ta${path}`;
  languages['x-default'] = canonical;

  return { languages, canonical };
}
