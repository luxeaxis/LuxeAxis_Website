import { isPublished, normalise } from '@/lib/i18n/published';

const ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN ?? 'https://luxeaxis.com';

export function alternatesFor(route: string): {
  languages: Record<string, string>;
  canonical: string;
} {
  // Normalise once, through the same function that decides publication
  // (lib/i18n/published.ts), so every URL below is derived from a single
  // canonical route string. Root normalises to '/', everything else loses
  // its trailing slash.
  const normalisedRoute = normalise(route);
  const canonical = new URL(normalisedRoute, ORIGIN).href;

  const languages: Record<string, string> = { en: canonical };
  if (isPublished(route, 'ta')) {
    const taPath = normalisedRoute === '/' ? '/ta' : `/ta${normalisedRoute}`;
    languages.ta = new URL(taPath, ORIGIN).href;
  }
  languages['x-default'] = canonical;

  return { languages, canonical };
}
