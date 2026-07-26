import type { TRegisterParams } from './types';
import type { TRegistrationResponse } from '@common/types';

import { API_ENDPOINTS } from '../endpoints';
import apiClient from '../session/apiClient';

/** Регистрация: возвращает user + accessToken. */
export const registerUser = async (params: TRegisterParams): Promise<TRegistrationResponse> => {
  const response = await apiClient.post<TRegistrationResponse>(
    API_ENDPOINTS.AUTH.REGISTRATION,
    params
  );

  return response.data;
};
