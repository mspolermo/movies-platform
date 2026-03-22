import type { TFilmWithProfessions } from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

/**
 * Получить фильм по ID
 */
export const getFilmById = async (
  id: number
): Promise<TFilmWithProfessions> => {
  const response = await apiClient.get(API_ENDPOINTS.FILMS.BY_ID(id));
  // API возвращает объект с полем film, извлекаем его
  return response.data.film || response.data;
};
