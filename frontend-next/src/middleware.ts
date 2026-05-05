import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'tr'] as const;
const handleI18nRouting = createMiddleware({
  locales,
  defaultLocale: 'tr',
  localeDetection: true,
});

function getPreferredLocale(request: NextRequest) {
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;

  if (cookieLocale && locales.includes(cookieLocale as (typeof locales)[number])) {
    return cookieLocale as (typeof locales)[number];
  }

  const acceptLanguage = request.headers.get('accept-language')?.toLowerCase() ?? '';

  if (acceptLanguage.includes('tr')) {
    return 'tr';
  }

  if (acceptLanguage.includes('en')) {
    return 'en';
  }

  return 'tr';
}

function hasLocalePrefix(pathname: string) {
  return locales.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));
}

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!hasLocalePrefix(pathname)) {
    const locale = getPreferredLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;
    return NextResponse.redirect(url);
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|auth|.*\\..*).*)'],
};
