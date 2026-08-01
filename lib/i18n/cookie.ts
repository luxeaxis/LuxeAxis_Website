/**
 * The app's own "last chosen language" cookie.
 *
 * Deliberately NOT next-intl's `NEXT_LOCALE`. With `localeDetection: false`
 * (i18n/routing.ts) next-intl ignores that cookie entirely — it will neither
 * read it to redirect nor treat it as persistence — so the spec's "Language
 * switch … persists via cookie" (3D Website Spec §2.3, Design System §3.3) has
 * to be satisfied by a cookie this app owns end to end.
 *
 * Shared between the writer (components/LangSwitch.tsx, in the browser) and the
 * reader (middleware.ts, on the edge) so the name cannot drift — a mismatch
 * there fails silently, as a preference that is written and simply never
 * honoured, which is exactly the state this module was created to end.
 */

export const LOCALE_COOKIE = 'lx-locale';

/** One year. A language preference does not go stale the way a session does,
 *  and re-asking someone every fortnight which of two languages they read is
 *  the annoyance the cookie exists to prevent. */
export const LOCALE_COOKIE_MAX_AGE_SECONDS = 31_536_000;
