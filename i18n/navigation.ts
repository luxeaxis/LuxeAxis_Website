import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

/**
 * Only `usePathname` is exported — Header/MobileSheet/LangSwitch need the
 * current route with its locale prefix already stripped (so it can be
 * compared directly against the locale-less hrefs in `lib/nav.ts` and fed
 * to `isPublished`), which is exactly what this hook does under the hood
 * (`useBasePathname` unprefixes `next/navigation`'s raw pathname).
 *
 * Deliberately NOT exporting `Link`/`useRouter` from here: next-intl's
 * `useRouter().push/replace` calls `syncLocaleCookie`, writing its own
 * locale cookie as a side effect of navigation. `usePathname` performs no
 * navigation and reads no cookie — it is pure `useContext` underneath — so
 * pulling in the rest of this factory's surface would risk a future caller
 * reaching for `useRouter` here and reintroducing exactly the cookie/
 * detection coupling i18n/routing.ts's `localeDetection: false` comment
 * warns against. Every actual link in this codebase goes through
 * components/Link.tsx (`next/link`) or components/Button.tsx (a plain
 * `<a>`), neither of which touches next-intl's navigation layer.
 */
export const { usePathname } = createNavigation(routing);
