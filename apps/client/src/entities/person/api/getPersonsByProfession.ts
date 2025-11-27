import apiClient from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";
import { PaginatedPersonsResponse } from "@common/types";

/** 
 * Получить всех персон по профессии с пагинацией
 */ 
export const getPersonsByProfession = async (
  professionId: number,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedPersonsResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.PROFESSIONS.PERSONS(professionId), {
    params: {
      page,
      limit,
    },
  });
  return response.data;
}
