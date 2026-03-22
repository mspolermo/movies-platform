import type { TGenreBased } from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

/**
 * Получить список всех жанров
 */
export const getGenresList = async (): Promise<TGenreBased[]> => {
  const response = await apiClient.get<TGenreBased[]>(
    API_ENDPOINTS.GENRES.LIST
  );

  return response.data;
};
