import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from '@/i18n/routing';
import { isPublished } from '@/lib/i18n/published';
import { LOCALE_COOKIE } from '@/lib/i18n/cookie';

const intl = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/ta' || pathname.startsWith('/ta/')) {
    const route = pathname.replace(/^\/ta/, '') || '/';
    if (!isPublished(route, 'ta')) {
      const url = request.nextUrl.clone();
      url.pathname = route;
      // 307, not 308: the route goes live the moment a translation publishes,
      // and a permanent redirect would be cached against exactly that.
      return NextResponse.redirect(url, 307);
    }
    // A published /ta route, already prefixed. Returning here matters: it
    // keeps the cookie branch below unreachable for any /ta path, which is
    // half of why the two redirects cannot form a cycle.
    return intl(request);
  }

  // Honour the visitor's own recorded choice of Tamil — components/
  // LangSwitch.tsx writes `lx-locale` when they click the switch. This is what
  // makes the spec's "persists via cookie" true rather than a cookie that was
  // written and never read by anything.
  //
  // Loop-free by construction, and worth being exact about, because the
  // predecessor of this branch — next-intl's `localeDetection` — was not:
  // this redirects only when `isPublished(route, 'ta')` is TRUE, while the /ta
  // branch above redirects away only when it is FALSE. The two conditions are
  // exact complements, so no request can satisfy both and nothing can bounce
  // between them. next-intl's version redirected on Accept-Language
  // regardless of publication, which is why it ping-ponged against the branch
  // above for 12 hops on every unpublished route. See i18n/routing.ts.
  //
  // Only `'ta'` redirects. `lx-locale=en` is a meaningful value, not a missing
  // one — it records "this visitor chose English" — and its correct effect is
  // to do nothing, which is also why this cannot be generalised to "redirect
  // to whatever the cookie says": under `localePrefix: 'as-needed'` English
  // has no prefix to redirect to.
  if (request.cookies.get(LOCALE_COOKIE)?.value === 'ta' && isPublished(pathname, 'ta')) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === '/' ? '/ta' : `/ta${pathname}`;
    // 307 again, and here for a second reason too: this response depends on a
    // request cookie, so a permanent redirect cached at a shared edge would
    // apply one visitor's language choice to everybody behind it.
    return NextResponse.redirect(url, 307);
  }

  return intl(request);
}

export const config = { matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'] };
