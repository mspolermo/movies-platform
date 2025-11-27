import apiClient from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";
import { TProfessionBased } from "@common/types";

/**  Получить профессии фильма
 * @param filmId - ID фильма
 * @returns Массив профессий
*/
export const getFilmProfessions = async (filmId: number): Promise<TProfessionBased[]> => {
  const response = await apiClient.get(API_ENDPOINTS.FILMS.PROFESSIONS(filmId));
  return Array.isArray(response.data) ? response.data : [];
}
