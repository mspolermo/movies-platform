import type { TAuthorizedUserResponse } from '@common/types';

type TSessionBridge = {
  onAuthenticated: (user: TAuthorizedUserResponse) => void;
  onUnauthenticated: () => void;
};

let sessionBridge: TSessionBridge | null = null;

/**
 * Связь axios refresh/interceptor → zustand (регистрируется в AuthProvider).
 * Без React-зависимости в client.ts.
 */
export const setSessionBridge = (bridge: TSessionBridge): void => {
  sessionBridge = bridge;
};

/** Вызывается после успешного refresh — обновить user в store. */
export const notifyAuthenticated = (user: TAuthorizedUserResponse): void => {
  sessionBridge?.onAuthenticated(user);
};

/** Вызывается при сбросе сессии — сбросить user в store. */
export const notifyUnauthenticated = (): void => {
  sessionBridge?.onUnauthenticated();
};
