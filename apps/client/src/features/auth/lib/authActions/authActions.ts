import type { TAuthResponse } from '@common/types';

import { useUserStore } from '@/entities/user';
import { logoutUser, refreshSession } from '@/shared/api';
import {
  clearAccessToken,
  clearHasSessionCookie,
  hasSessionCookie,
  runSessionBootstrap,
  setAccessToken,
} from '@/shared/api/session';

/** Локальный wipe: access + UX-cookie + zustand (без HTTP). */
const clearLocalSession = (): void => {
  clearAccessToken();
  clearHasSessionCookie();
  useUserStore.getState().reset();
};

/** Применить ответ login/register: token в память + user в store.
 * `has_session` ставит gateway через Set-Cookie — здесь не трогаем.
 */
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
    // store обновляется через session-bridge внутри performTokenRefresh
    await refreshSession();
  } catch {
    clearLocalSession();

    try {
      await logoutUser();
    } catch {
      // logout идемпотентен — cookie могли уже быть невалидны
    }
  }
};

/**
 * Восстановить сессию при старте (AuthProvider).
 * По has_session → refresh; при ошибке — полный локальный сброс.
 */
export const bootstrapSession = (): Promise<void> => {
  const { status } = useUserStore.getState();

  if (status === 'authenticated') {
    return Promise.resolve();
  }

  return runSessionBootstrap(runBootstrap);
};

/** Выход: revoke на бэке + локальный wipe (идемпотентно). */
export const logout = async (): Promise<void> => {
  try {
    await logoutUser();
  } catch {
    // logout идемпотентен
  } finally {
    clearLocalSession();
  }
};
