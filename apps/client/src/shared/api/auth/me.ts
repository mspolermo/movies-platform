import type { TCurrentUserResponse } from '@common/types';

import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';

/** Текущий пользователь по access token (GET /auth/me). */
export const getCurrentUser = async (): Promise<TCurrentUserResponse> => {
  const response = await apiClient.get<TCurrentUserResponse>(API_ENDPOINTS.AUTH.ME);

  return response.data;
};
