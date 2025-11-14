import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { TPersonModel, TFilmBased } from '@common/types';

export interface PersonWithFilms extends TPersonModel {
  films?: TFilmBased[];
}

export const personsService = {
  // Получить персону по ID
  async getPersonById(id: number): Promise<PersonWithFilms> {
    const response = await apiClient.get(API_ENDPOINTS.PERSONS.BY_ID(id));
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

