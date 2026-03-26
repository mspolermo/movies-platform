import type { TGetPersonFilmographyRequest, TPersonFilmographyResponse } from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

const DEFAULT_LIMIT = 10;

/**
 * Страница фильмографии персоны.
 */
export const getPersonFilmography = async (
  params: TGetPersonFilmographyRequest
): Promise<TPersonFilmographyResponse> => {
  const { id, limit, offset } = params;
  const response = await apiClient.get<TPersonFilmographyResponse>(
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
