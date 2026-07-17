import type { TFilmListItemResponse } from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

/**
 * Похожие фильмы по жанрам (бэкенд ранжирует по пересечению).
 */
export const getSimilarFilms = async (
  filmId: number,
  limit?: number
): Promise<TFilmListItemResponse[]> => {
  const response = await apiClient.get<TFilmListItemResponse[]>(
    API_ENDPOINTS.FILMS.SIMILAR(filmId),
    {
      params: limit !== undefined ? { limit } : undefined,
    }
  );

  return response.data;
};
