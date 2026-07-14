import type { TRegisterParams } from './types';
import type { TRegistrationResponse } from '@common/types';

import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';

/** Регистрация: возвращает user + accessToken. */
export const registerUser = async (params: TRegisterParams): Promise<TRegistrationResponse> => {
  const response = await apiClient.post<TRegistrationResponse>(
    API_ENDPOINTS.AUTH.REGISTRATION,
    params
  );

  return response.data;
};
