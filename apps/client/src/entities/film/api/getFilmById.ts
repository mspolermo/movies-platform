import type { TFilmDetailsResponse } from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

/**
 * Получить фильм по ID
 */
export const getFilmById = async (id: number): Promise<TFilmDetailsResponse> => {
  const response = await apiClient.get<TFilmDetailsResponse>(API_ENDPOINTS.FILMS.BY_ID(id));
  return response.data;
};
