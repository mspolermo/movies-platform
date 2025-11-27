import apiClient from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";
import { PaginatedPersonsResponse } from "@common/types";

/** 
 * Получить персон фильма по профессии с пагинацией
 */ 
export const getFilmPersonsByProfession = async (
  filmId: number,
  professionName: string,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedPersonsResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.FILMS.PERSONS_BY_PROFESSION(filmId), {
    params: {
      profession: professionName,
      page,
      limit,
    },
  });
  return response.data;
}