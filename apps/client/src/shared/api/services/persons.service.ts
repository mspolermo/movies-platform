import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { TPersonModel, TFilmBased, TPersonFullWithPagination, PaginatedPersonsResponse } from '@common/types';


export interface PersonFilmsParams {
  filmsLimit?: number;
  filmsOffset?: number;
}

export const personsService = {
  // Получить персону по ID
  async getPersonById(id: number, params: PersonFilmsParams = {}): Promise<TPersonFullWithPagination> {
    const queryParams: Record<string, number> = {};
    if (typeof params.filmsLimit === 'number') {
      queryParams.filmsLimit = params.filmsLimit;
    }
    if (typeof params.filmsOffset === 'number') {
      queryParams.filmsOffset = params.filmsOffset;
    }

    const response = await apiClient.get(API_ENDPOINTS.PERSONS.BY_ID(id), {
      params: queryParams,
    });
    return response.data;
  },

  // Получить всех персон с пагинацией
  async getAllPersonsPaginated(page: number = 1, limit: number = 20): Promise<PaginatedPersonsResponse> {
    const response = await apiClient.get(API_ENDPOINTS.PERSONS.LIST, {
      params: {
        page,
        limit,
      },
    });
    return response.data;
  },
};

