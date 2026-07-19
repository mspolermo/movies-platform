import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

/**
 * Proxy (Next 16): выполняется на сервере до рендера страницы.
 *
 * Зачем: UX-редиректы по cookie `has_session` (не security!).
 * - Гость без сессии не попадает на /profile → /auth/login
 * - Уже залогиненный не видит login/register → /films
 *
 * Важно: `has_session` — только хинт для UI/proxy. Реальная защита
 * данных — Bearer JWT на api-gateway. Подделка has_session без HttpOnly
 * refresh не даёт доступ к API.
 */

/** Страницы, куда без сессии не пускаем (UX-редирект). */
const PROTECTED_PATHS = ['/profile'];

/** Страницы входа/регистрации — при активной сессии уводим в каталог. */
const AUTH_PATHS = ['/auth/login', '/auth/register'];

export const proxy = (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.get('has_session')?.value === '1';

  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));
  const isAuthPage = AUTH_PATHS.some((path) => pathname.startsWith(path));

  if (isProtected && !hasSession) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (isAuthPage && hasSession) {
    return NextResponse.redirect(new URL('/films', request.url));
  }

  return NextResponse.next();
};

/** На каких маршрутах запускать proxy (остальные не трогаем). */
export const config = {
  matcher: ['/profile/:path*', '/auth/login', '/auth/register'],
};
