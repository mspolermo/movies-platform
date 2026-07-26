/**
 * Edge-safe / app session primitives.
 * axios client и performTokenRefresh — только через `./apiClient` (не тянуть в proxy).
 */
export {
  AUTH_LOGIN_PATH,
  AUTH_REGISTER_PATH,
  DEFAULT_POST_AUTH_PATH,
  HAS_SESSION_COOKIE,
  HAS_SESSION_VALUE,
} from './constants';
export {
  resolveSessionRedirect,
  type TResolveSessionRedirectParams,
} from './resolveSessionRedirect';
export { getAccessToken, setAccessToken, clearAccessToken } from './accessToken';
export { hasSessionCookie, clearHasSessionCookie } from './sessionCookie';
export { setSessionBridge, clearSessionBridgeIf } from './sessionBridge';
export { runSessionBootstrap } from './sessionBootstrap';
