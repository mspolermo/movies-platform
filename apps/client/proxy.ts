import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

import {
  HAS_SESSION_COOKIE,
  HAS_SESSION_VALUE,
  resolveSessionRedirect,
} from '@/shared/api/session';

/**
 * Next 16 proxy: UX-редиректы по has_session (не security).
 * Matcher — static literals; sync-тест в resolveSessionRedirect.
 */
export const proxy = (request: NextRequest) => {
  const { pathname, search } = request.nextUrl;
  const hasSession = request.cookies.get(HAS_SESSION_COOKIE)?.value === HAS_SESSION_VALUE;

  const redirectTo = resolveSessionRedirect({ pathname, search, hasSession });

  if (redirectTo) {
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  return NextResponse.next();
};

/** На каких маршрутах запускать proxy (sync с SESSION_PROTECTED / AUTH paths). */
export const config = {
  matcher: ['/profile/:path*', '/auth/login', '/auth/register'],
};
