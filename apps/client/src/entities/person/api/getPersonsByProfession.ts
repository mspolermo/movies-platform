import type { TPaginatedPersonsResponse } from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

/**
 * Получить всех персон по профессии с пагинацией
 */
export const getPersonsByProfession = async (
  professionId: number,
  page: number = 1,
  limit: number = 20
): Promise<TPaginatedPersonsResponse> => {
  const response = await apiClient.get(
    API_ENDPOINTS.PROFESSIONS.PERSONS(professionId),
    {
      params: {
        page,
        limit,
      },
    }
  );
  return response.data;
};
