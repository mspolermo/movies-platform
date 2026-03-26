import type { TPersonProfileResponse } from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

/**
 * Профиль персоны (без фильмографии).
 */
export const getPersonProfile = async (id: number): Promise<TPersonProfileResponse> => {
  const response = await apiClient.get<TPersonProfileResponse>(API_ENDPOINTS.PERSONS.BY_ID(id));
  return response.data;
};
