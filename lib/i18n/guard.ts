import { notFound } from 'next/navigation';
import { isPublished, type Locale } from './published';

/**
 * Defence in depth for the publication gate.
 *
 * `middleware.ts` already 307s unpublished `/ta/*` routes to English, but that
 * left the constraint "never render English under `lang="ta"`" resting on a
 * single mechanism — and one with a known hole: the matcher skips any path
 * containing a dot, so a future `/ta/projects/villa-2.0` would sail past it.
 *
 * Calling this at the top of a page means an unpublished locale 404s at render
 * time even if it is reached by a path middleware never inspected.
 */
export function assertPublished(route: string, locale: Locale): void {
  if (!isPublished(route, locale)) notFound();
}
