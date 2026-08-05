import { Response } from "express";

import {
  getClearHasSessionCookieOptions,
  getClearRefreshCookieOptions,
  getHasSessionCookieOptions,
  getRefreshCookieOptions,
  HAS_SESSION_COOKIE,
  HAS_SESSION_VALUE,
  REFRESH_TOKEN_COOKIE,
} from "./auth-cookies";

/** Ставит refresh (HttpOnly) + has_session (UX) после login/registration/refresh. */
export const setAuthCookies = (
  res: Response,
  refreshToken: string,
  isProduction: boolean
): void => {
  res.cookie(
    REFRESH_TOKEN_COOKIE,
    refreshToken,
    getRefreshCookieOptions(isProduction)
  );
  res.cookie(
    HAS_SESSION_COOKIE,
    HAS_SESSION_VALUE,
    getHasSessionCookieOptions(isProduction)
  );
};

/** Снимает обе cookie при logout. */
export const clearAuthCookies = (res: Response, isProduction: boolean): void => {
  res.clearCookie(
    REFRESH_TOKEN_COOKIE,
    getClearRefreshCookieOptions(isProduction)
  );
  res.clearCookie(
    HAS_SESSION_COOKIE,
    getClearHasSessionCookieOptions(isProduction)
  );
};
