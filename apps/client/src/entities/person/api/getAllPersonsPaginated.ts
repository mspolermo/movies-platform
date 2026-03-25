import type { TGetPersonsRequest, TPaginatedPersonsResponse } from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

/**
 * Получить всех персон с пагинацией
 */
export const getAllPersonsPaginated = async (
  params: TGetPersonsRequest = {}
): Promise<TPaginatedPersonsResponse> => {
  const response = await apiClient.get<TPaginatedPersonsResponse>(API_ENDPOINTS.PERSONS.LIST, {
    params,
  });
  return response.data;
};
