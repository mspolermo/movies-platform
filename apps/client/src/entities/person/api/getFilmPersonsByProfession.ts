import type { TPaginatedPersonsResponse } from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

/**
 * Получить персон фильма по профессии с пагинацией
 */
export const getFilmPersonsByProfession = async (
  filmId: number,
  professionName: string,
  page: number = 1,
  limit: number = 20
): Promise<TPaginatedPersonsResponse> => {
  const response = await apiClient.get(
    API_ENDPOINTS.FILMS.PERSONS_BY_PROFESSION(filmId),
    {
      params: {
        profession: professionName,
        page,
        limit,
      },
    }
  );
  return response.data;
};
