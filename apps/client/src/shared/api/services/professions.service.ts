import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { TProfessionBased, PaginatedPersonsResponse } from '@common/types';

export const professionsService = {
  // Получить все профессии
  async getAllProfessions(): Promise<TProfessionBased[]> {
    const response = await apiClient.get(API_ENDPOINTS.PROFESSIONS.LIST);
    return Array.isArray(response.data) ? response.data : [];
  },

  // Получить персон по профессии с пагинацией
  async getPersonsByProfession(
    professionId: number,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedPersonsResponse> {
    const response = await apiClient.get(API_ENDPOINTS.PROFESSIONS.PERSONS(professionId), {
      params: {
        page,
        limit,
      },
    });
    return response.data;
  },
};

