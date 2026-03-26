'use server';

import type { TGenresListResponse } from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

/**
 * Получить список всех жанров
 */
export const getGenresList = async (): Promise<TGenresListResponse> => {
  const response = await apiClient.get<TGenresListResponse>(API_ENDPOINTS.GENRES.LIST);

  return response.data;
};
