import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { TPersonModel, TFilmBased, TPersonFullWithPagination } from '@common/types';


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

  // Получить всех персон
  async getAllPersons(): Promise<TPersonModel[]> {
    const response = await apiClient.get(API_ENDPOINTS.PERSONS.LIST);
    return Array.isArray(response.data) ? response.data : [];
  },

  // Поиск персон по имени и профессии
  async findPersonsByNameAndProfession(
    name?: string,
    professionId?: number
  ): Promise<TPersonModel[]> {
    const response = await apiClient.get(API_ENDPOINTS.PERSONS_EX.SEARCH_FIND, {
      params: {
        name,
        professionId,
      },
    });
    return Array.isArray(response.data) ? response.data : [];
  },
};

