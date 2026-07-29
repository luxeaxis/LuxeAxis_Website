import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';

/**
 * Every nav component reads `useLocale()` (directly, or transitively via
 * `i18n/navigation.ts`'s `usePathname`, which resolves the locale internally
 * too — see LangSwitch.tsx's file comment). Outside a real Next.js App
 * Router request, `useLocale()` throws unless it finds an ancestor
 * `NextIntlClientProvider` — this wraps `render()` with one so isolated
 * component tests don't need to spin up an actual router.
 *
 * `next/navigation`'s `usePathname()` itself still resolves to `null` in
 * this environment (no Next.js router context at all) — every component
 * under test guards that with `?? '/'` itself, so this helper does not try
 * to fake a pathname too.
 */
export function renderWithIntl(ui: ReactElement, locale: 'en' | 'ta' = 'en') {
  return render(
    <NextIntlClientProvider locale={locale} messages={{}}>
      {ui}
    </NextIntlClientProvider>,
  );
}
