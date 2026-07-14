/** Внутренние примитивы слайса api — импорт только из `shared/api/*`, не снаружи. */
export { getAccessToken, setAccessToken, clearAccessToken } from './access-token';
export { hasSessionCookie, clearHasSessionCookie } from './session-cookie';
export { setSessionBridge, notifyAuthenticated, notifyUnauthenticated } from './session-bridge';
export {
  runSessionBootstrap,
  waitForSessionBootstrap,
  isSessionBootstrapping,
} from './session-bootstrap';
