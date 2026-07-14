import type { TAuthResponse } from '@common/types';

import { useUserStore } from '@/entities/user';
import {
  clearAccessToken,
  clearHasSessionCookie,
  hasSessionCookie,
  logoutUser,
  refreshSession,
  runSessionBootstrap,
  setAccessToken,
} from '@/shared/api';

/** Применить ответ login/register/refresh: token в память + user в store. */
export const applyAuthResponse = (response: TAuthResponse): void => {
  setAccessToken(response.accessToken);
  useUserStore.getState().setUser(response.user);
  useUserStore.getState().setStatus('authenticated');
};

const runBootstrap = async (): Promise<void> => {
  const { setStatus } = useUserStore.getState();

  if (!hasSessionCookie()) {
    setStatus('unauthenticated');
    return;
  }

  setStatus('loading');

  try {
    const response = await refreshSession();
    applyAuthResponse(response);
  } catch {
    clearAccessToken();
    clearHasSessionCookie();
    useUserStore.getState().reset();

    try {
      await logoutUser();
    } catch {
      // logout идемпотентен — cookie могли уже быть невалидны
    }
  }
};

/**
 * Восстановить сессию при старте приложения (AuthProvider).
 * По `has_session` → refresh; при ошибке — полный сброс локального состояния.
 */
export const bootstrapSession = (): Promise<void> => {
  const { status } = useUserStore.getState();

  if (status === 'authenticated') {
    return Promise.resolve();
  }

  return runSessionBootstrap(runBootstrap);
};

/** Выход: revoke на бэке + очистка token, cookie и store (идемпотентно). */
export const logout = async (): Promise<void> => {
  try {
    await logoutUser();
  } catch {
    // logout идемпотентен
  } finally {
    clearAccessToken();
    clearHasSessionCookie();
    useUserStore.getState().reset();
  }
};
