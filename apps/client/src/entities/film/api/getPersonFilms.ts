import type { TGetPersonFilmsRequest, TPersonFilmsPaginationResponse } from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

const DEFAULT_LIMIT = 10;

/**
 * Получение всех фильмов с участием персоны
 */
export const getPersonFilms = async (
  params: TGetPersonFilmsRequest
): Promise<TPersonFilmsPaginationResponse> => {
  const { id, limit, offset } = params;
  const response = await apiClient.get<TPersonFilmsPaginationResponse>(
    API_ENDPOINTS.PERSONS.FILMOGRAPHY(id),
    {
      params: {
        limit: limit ?? DEFAULT_LIMIT,
        offset: offset ?? 0,
      },
    }
  );
  return response.data;
};
