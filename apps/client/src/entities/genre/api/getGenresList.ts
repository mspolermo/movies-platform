import type { TGenreListResponse } from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

/**
 * Получить список всех жанров
 */
export const getGenresList = async (): Promise<TGenreListResponse> => {
  const response = await apiClient.get<TGenreListResponse>(
    API_ENDPOINTS.GENRES.LIST
  );

  return response.data;
};
