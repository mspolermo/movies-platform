import { AUTH_LOGIN_PATH } from '@/shared/api/session';

/**
 * Href логина с returnUrl текущей страницы (после auth — обратно).
 * На SSR без window — только путь логина.
 */
export const buildLoginHref = (): string => {
  if (typeof window === 'undefined') {
    return AUTH_LOGIN_PATH;
  }

  const returnUrl = `${window.location.pathname}${window.location.search}`;
  return `${AUTH_LOGIN_PATH}?returnUrl=${encodeURIComponent(returnUrl)}`;
};
