import {
  AUTH_LOGIN_PATH,
  DEFAULT_POST_AUTH_PATH,
  SESSION_AUTH_PATHS,
  SESSION_PROTECTED_PREFIXES,
} from '../constants';

export type TResolveSessionRedirectParams = {
  pathname: string;
  hasSession: boolean;
  /** `request.nextUrl.search` (`?…` или `''`) — для returnUrl. */
  search?: string;
};

const matchesPath = (pathname: string, path: string): boolean =>
  pathname === path || pathname.startsWith(`${path}/`);

/**
 * UX-редирект по has_session: guest↔protected, session↔auth pages.
 * Не security — только подсказка для proxy.
 */
export const resolveSessionRedirect = ({
  pathname,
  hasSession,
  search = '',
}: TResolveSessionRedirectParams): string | null => {
  const isProtected = SESSION_PROTECTED_PREFIXES.some((path) => matchesPath(pathname, path));
  const isAuthPage = SESSION_AUTH_PATHS.some((path) => matchesPath(pathname, path));

  if (isProtected && !hasSession) {
    const returnUrl = `${pathname}${search}`;
    return `${AUTH_LOGIN_PATH}?returnUrl=${encodeURIComponent(returnUrl)}`;
  }

  if (isAuthPage && hasSession) {
    return DEFAULT_POST_AUTH_PATH;
  }

  return null;
};
