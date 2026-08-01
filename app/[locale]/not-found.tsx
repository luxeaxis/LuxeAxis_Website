import { Button } from '@/components/Button';
import { Container, Stack } from '@/components/layout';

/**
 * The 404 page — deliberately inside `[locale]`, not at the app root.
 *
 * Next's built-in fallback was what every miss rendered until now: a bare
 * white `<html>` with no `lang` attribute, no header, no footer and no skip
 * link, because it sits above `app/[locale]/layout.tsx` — the only layout in
 * this app that renders `<html>` at all. That is the wrong page to have as the
 * most-visited one, and right now it IS the most-visited one: `lib/nav.ts` and
 * `components/Footer.tsx` link ahead of the build to roughly thirty routes
 * that do not exist yet (both files explain why), so almost every nav click a
 * visitor makes today lands here. Rendering inside the locale layout gets the
 * lot back — `lang`, the axis, Header, Footer, SkipLink's `#main` target — for
 * free.
 *
 * `app/[locale]/[...rest]/page.tsx` is what routes an unmatched URL here
 * rather than to the framework fallback; see that file.
 *
 * KNOWN LIMITATION, stated rather than papered over: the initial HTML of a 404
 * response is still Next's bare `<html id="__next_error__">` shell, and this
 * page's markup only appears once React hydrates from the flight payload.
 * Verified post-hydration in a real browser — `lang="en"`, `data-theme`, the
 * body classes, Header, Footer and `#main` are all correct, which is what the
 * axe gate measures — but a client with JS disabled gets a blank document.
 * That is NOT caused by the catch-all: Next's own prerendered
 * `.next/server/app/_not-found.html` emits the same bare `<html>`, because this
 * app deliberately has no `app/layout.tsx` — `app/[locale]/layout.tsx` is the
 * only layout that owns `<html>`, which is what lets `lang` track the locale.
 * Closing the gap means introducing a root layout, and a root layout cannot
 * know the locale, so `lang` would have to be hard-coded or moved. That is a
 * structural trade — per-locale `lang` against a no-JS 404 — not a bug fix,
 * and it should be decided deliberately rather than as a side effect of this
 * change.
 *
 * English only, and that is not a gap: `middleware.ts` redirects any
 * unpublished `/ta/*` path (which every 404 path is, by definition — it is not
 * in `PUBLISHED.ta`) to its unprefixed English equivalent before routing gets
 * this far. So this page is only ever rendered under `lang="en"`, and hard-
 * coding English here cannot produce the English-under-`lang="ta"` violation
 * that `lib/i18n/guard.ts` exists to prevent. When Tamil coverage grows, this
 * page needs a translation and a `/ta` entry in `PUBLISHED` together — one
 * without the other reintroduces exactly that bug.
 */
export default function NotFound() {
  return (
    <main id="main" tabIndex={-1} className="py-section-y">
      <Container>
        <Stack gap={6} className="max-w-measure">
          <Stack gap={3}>
            <p className="font-ui text-overline uppercase tracking-[var(--font-tracking-wider)] text-on-surface-muted">
              404
            </p>
            <h1 className="font-display text-[length:var(--typography-h1-font-size)] text-on-surface">
              We could not find that page
            </h1>
            {/* Honest about the actual most likely cause rather than the
                generic "check the URL": most misses today are links to
                sections of the site that are genuinely still being built, and
                telling a visitor that is more useful — and more in keeping
                with the studio's stated transparency — than implying they
                mistyped something. */}
            <p className="text-on-surface-2">
              The link may be out of date, or that part of the site may not have been published
              yet. Everything already published is reachable from the footer below.
            </p>
          </Stack>
          <div>
            <Button as="a" href="/">
              Back to the home page
            </Button>
          </div>
        </Stack>
      </Container>
    </main>
  );
}
