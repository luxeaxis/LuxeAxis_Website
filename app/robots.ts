import type { MetadataRoute } from 'next';
import { SITE_ORIGIN } from '@/lib/seo/origin';
import { NOINDEX_ROUTES } from '@/lib/seo/routes';

/**
 * robots.txt — Structured for Search Engines and AI Engine Optimization (AEO/APO).
 *
 * Explicitly welcomes search and generative AI discovery crawlers (GPTBot, PerplexityBot,
 * Google-Extended, Claude-Web, Applebot-Extended) across all indexable routes while strictly
 * preserving NOINDEX_ROUTES disallow rules.
 */
export default function robots(): MetadataRoute.Robots {
  const disallowed = [...NOINDEX_ROUTES];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: disallowed,
      },
      {
        userAgent: [
          'Googlebot',
          'Googlebot-Image',
          'Google-Extended',
          'Bingbot',
          'Applebot',
          'Applebot-Extended',
          'GPTBot',
          'ChatGPT-User',
          'PerplexityBot',
          'Claude-Web',
          'anthropic-ai',
          'Bytespider',
        ],
        allow: '/',
        disallow: disallowed,
      },
    ],
    sitemap: new URL('/sitemap.xml', SITE_ORIGIN).href,
    host: SITE_ORIGIN,
  };
}
