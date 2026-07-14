/** Имена и опции auth-cookies. */

/** HttpOnly refresh — недоступен JS, Path=/api/auth. */
export const REFRESH_TOKEN_COOKIE = "refreshToken";

/**
 * UX-хинт сессии (не HttpOnly). Не security-механизм:
 * middleware / UI, не авторизация API.
 */
export const HAS_SESSION_COOKIE = "has_session";
export const HAS_SESSION_VALUE = "1";

/** TTL refresh / has_session — 30 дней. */
export const REFRESH_TOKEN_MAX_AGE_SEC = 30 * 24 * 60 * 60;

export const getRefreshCookieOptions = (isProduction: boolean) => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax" as const,
  path: "/api/auth",
  maxAge: REFRESH_TOKEN_MAX_AGE_SEC * 1000,
});

export const getHasSessionCookieOptions = (isProduction: boolean) => ({
  httpOnly: false,
  secure: isProduction,
  sameSite: "lax" as const,
  path: "/",
  maxAge: REFRESH_TOKEN_MAX_AGE_SEC * 1000,
});

/** Опции clearCookie должны совпадать с path/flags при set. */
export const getClearRefreshCookieOptions = (isProduction: boolean) => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax" as const,
  path: "/api/auth",
});

export const getClearHasSessionCookieOptions = (isProduction: boolean) => ({
  httpOnly: false,
  secure: isProduction,
  sameSite: "lax" as const,
  path: "/",
});
