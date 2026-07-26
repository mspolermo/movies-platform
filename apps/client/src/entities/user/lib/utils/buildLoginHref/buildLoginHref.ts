/**
 * Href логина с returnUrl текущей страницы (после auth — обратно).
 */
export const buildLoginHref = (): string => {
  const returnUrl = `${window.location.pathname}${window.location.search}`;
  return `/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`;
};
