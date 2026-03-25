import type { TGenreItemResponse } from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

/**
 * Получить список всех жанров
 */
export const getGenresList = async (): Promise<TGenreItemResponse[]> => {
  const response = await apiClient.get<TGenreItemResponse[]>(API_ENDPOINTS.GENRES.LIST);

  return response.data;
};
