import type { TProfessionBased } from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

/**  Получить профессии фильма
 * @param filmId - ID фильма
 * @returns Массив профессий
 */
export const getFilmProfessions = async (
  filmId: number
): Promise<TProfessionBased[]> => {
  const response = await apiClient.get(API_ENDPOINTS.FILMS.PROFESSIONS(filmId));
  return Array.isArray(response.data) ? response.data : [];
};
