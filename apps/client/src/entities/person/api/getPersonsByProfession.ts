import type {
  TGetPersonsByProfessionRequest,
  TPaginatedPersonsResponse,
} from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

/**
 * Получить всех персон по профессии с пагинацией
 */
export const getPersonsByProfession = async (
  request: TGetPersonsByProfessionRequest
): Promise<TPaginatedPersonsResponse> => {
  const { professionId } = request;

  const response = await apiClient.get<TPaginatedPersonsResponse>(
    API_ENDPOINTS.PROFESSIONS.PERSONS(professionId),
    {
      params: request,
    }
  );
  return response.data;
};
