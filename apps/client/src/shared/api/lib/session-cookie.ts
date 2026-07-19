const HAS_SESSION_COOKIE = 'has_session';

/** UX-хинт: наличие сессии (не security-механизм, см. proxy). */
export const hasSessionCookie = (): boolean => {
  if (typeof document === 'undefined') {
    return false;
  }

  return document.cookie.split(';').some((cookie) => cookie.trim() === `${HAS_SESSION_COOKIE}=1`);
};

/**
 * Сбрасывает UX-cookie `has_session`.
 * Пишем с Secure и без — в prod gateway ставит Secure.
 */
export const clearHasSessionCookie = (): void => {
  if (typeof document === 'undefined') {
    return;
  }

  const base = `${HAS_SESSION_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`;
  document.cookie = base;
  document.cookie = `${base}; Secure`;
};
