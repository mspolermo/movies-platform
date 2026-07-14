import type { TLoginParams } from './types';
import type { TAuthResponse } from '@common/types';

import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';

/** Вход: возвращает user + accessToken (cookie refresh выставляет gateway). */
export const loginUser = async (params: TLoginParams): Promise<TAuthResponse> => {
  const response = await apiClient.post<TAuthResponse>(API_ENDPOINTS.AUTH.LOGIN, params);

  return response.data;
};
