import type { TCurrentUserResponse } from '@common/types';

import { API_ENDPOINTS } from '../endpoints';
import apiClient from '../session/apiClient';

/** Текущий пользователь по access token (GET /auth/me). */
export const getCurrentUser = async (): Promise<TCurrentUserResponse> => {
  const response = await apiClient.get<TCurrentUserResponse>(API_ENDPOINTS.AUTH.ME);

  return response.data;
};
