import type { TProfessionItemResponse } from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

/**  Получить профессии фильма
 * @param filmId - ID фильма
 * @returns Массив профессий
 */
export const getFilmProfessions = async (
  filmId: number
): Promise<TProfessionItemResponse[]> => {
  const response = await apiClient.get(API_ENDPOINTS.FILMS.PROFESSIONS(filmId));
  return Array.isArray(response.data) ? response.data : [];
};
