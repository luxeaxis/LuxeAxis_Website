import { Button } from '@/components/Button';
import { Container, Stack } from '@/components/layout';

/**
 * The 404 page.
 *
 * Next's built-in fallback was what every miss used to render: a bare white
 * document with no `lang`, no header, no footer and no skip link. That is the
 * wrong page to have as the most-visited one, and right now it IS the
 * most-visited one — `lib/nav.ts` and `components/Footer.tsx` link ahead of the
 * build to roughly thirty routes that do not exist yet (both files explain
 * why), so most nav clicks a visitor makes today land here.
 *
 * Sitting at the app root, next to `app/layout.tsx`, it renders inside that
 * layout and gets the lot back — `lang`, the axis, Header, Footer, SkipLink's
 * `#main` target — server-rendered, with no JS required.
 *
 * That last part is new. While the app was organised under `app/[locale]/`
 * there was no root layout for Next to render a 404 into, so the response shell
 * was Next's bare `__next_error__` document and this markup only appeared after
 * hydration — fine for the axe gate, blank for a client with JS off. Removing
 * the locale segment removed the cause; the `[...rest]` catch-all that had
 * existed purely to route misses into the locale layout went with it.
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
