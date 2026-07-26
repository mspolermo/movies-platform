import type { TAuthorizedUserResponse } from '@common/types';

type TSessionBridge = {
  onAuthenticated: (user: TAuthorizedUserResponse) => void;
  onUnauthenticated: () => void;
  /** UX-редирект после failed refresh (не во время bootstrap / не на /auth/*). */
  onSessionExpired?: () => void;
};

let sessionBridge: TSessionBridge | null = null;

/**
 * Связь axios refresh/interceptor → store/навигация (регистрируется в AuthProvider).
 * Без React-зависимости в apiClient. `null` — cleanup на unmount.
 */
export const setSessionBridge = (bridge: TSessionBridge | null): void => {
  sessionBridge = bridge;
};

/**
 * Сбросить bridge только если это всё ещё наш экземпляр.
 * Strict Mode: cleanup mount1 не затрёт bridge mount2 (через microtask).
 */
export const clearSessionBridgeIf = (bridge: TSessionBridge): void => {
  if (sessionBridge === bridge) {
    sessionBridge = null;
  }
};

/** После успешного refresh — обновить user в store. */
export const notifyAuthenticated = (user: TAuthorizedUserResponse): void => {
  sessionBridge?.onAuthenticated(user);
};

/** При сбросе сессии — сбросить user в store. */
export const notifyUnauthenticated = (): void => {
  sessionBridge?.onUnauthenticated();
};

/** После failed refresh — UX-редирект на логин (если зарегистрирован). */
export const notifySessionExpired = (): void => {
  sessionBridge?.onSessionExpired?.();
};
