import type {
  TGetFilmPersonsByProfessionRequest,
  TPaginatedPersonsResponse,
} from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

/**
 * Получить персон фильма по профессии с пагинацией
 */
export const getFilmPersonsByProfession = async (
  params: TGetFilmPersonsByProfessionRequest
): Promise<TPaginatedPersonsResponse> => {
  const { filmId, ...queryParams } = params;
  const response = await apiClient.get<TPaginatedPersonsResponse>(
    API_ENDPOINTS.FILMS.PERSONS_BY_PROFESSION(filmId),
    { params: queryParams }
  );
  return response.data;
};
