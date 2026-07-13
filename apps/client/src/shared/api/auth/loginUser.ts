import type { TAuthResponse } from '@common/types';

import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';

type TLoginParams = {
  email: string;
  password: string;
};

/** Вход пользователя. */
export const loginUser = async (params: TLoginParams): Promise<TAuthResponse> => {
  const response = await apiClient.post<TAuthResponse>(API_ENDPOINTS.AUTH.LOGIN, params);

  return response.data;
};
