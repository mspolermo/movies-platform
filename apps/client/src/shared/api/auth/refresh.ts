import type { TAuthResponse } from '@common/types';

import { performTokenRefresh } from '../client';

/** Обновить сессию по HttpOnly refresh cookie (single-flight). */
export const refreshSession = async (): Promise<TAuthResponse> => {
  return performTokenRefresh();
};
