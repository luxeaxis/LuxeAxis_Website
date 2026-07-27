import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from '@/i18n/routing';
import { isPublished } from '@/lib/i18n/published';

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
  }

  return intl(request);
}

export const config = { matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'] };
