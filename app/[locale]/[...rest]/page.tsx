import { notFound } from 'next/navigation';

/**
 * Catch-all that does nothing but 404 — the piece that makes
 * `app/[locale]/not-found.tsx` reachable.
 *
 * Without it, an unmatched URL never enters the `[locale]` segment's render at
 * all: no page matches, so Next serves its own root-level fallback, which sits
 * ABOVE `app/[locale]/layout.tsx` and therefore renders without `<html lang>`,
 * Header, Footer or the skip-link target. Throwing `notFound()` from inside the
 * segment instead means the nearest not-found boundary is the branded one next
 * door.
 *
 * The usual alternative — an `app/not-found.tsx` at the root — is not available
 * here: it would need an `app/layout.tsx` root layout to render into, and this
 * app deliberately has exactly one layout owning `<html>`
 * (`app/[locale]/layout.tsx`, so `lang` always tracks the locale). Adding a
 * second would nest `<html>` inside `<html>`.
 *
 * Static segments win over a catch-all in Next's route matching, so `/pricing`
 * and `/style` are unaffected by this file's existence — only paths with no
 * page of their own reach it.
 *
 * Returns `never`: `notFound()` throws, so there is no render path past it and
 * no JSX to write. The response still carries a real 404 status — this is not a
 * 200 dressed up as an error page, which would let a crawler index every dead
 * nav link as a valid URL.
 */
export default function CatchAllNotFound(): never {
  notFound();
}
