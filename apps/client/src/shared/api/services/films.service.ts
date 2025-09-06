import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { TFilmBased } from '@common/types';

export interface SearchFilmsParams {
  page?: number;
  limit?: number;
  year?: number;
  genre?: string;
  country?: string;
  rating?: number;
  search?: string;
}

export interface FilmsResponse {
  films: TFilmBased[];
  total: number;
  page: number;
  limit: number;
}

export const filmsService = {
  // Получить фильм по ID
  async getFilmById(id: number): Promise<TFilmBased> {
    const response = await apiClient.get(API_ENDPOINTS.FILMS.BY_ID(id));
    return response.data;
  },

  // Поиск фильмов
  async searchFilms(params: SearchFilmsParams = {}): Promise<FilmsResponse> {
    const response = await apiClient.get(API_ENDPOINTS.FILMS.SEARCH, {
      params: {
        page: params.page || 1,
        limit: params.limit || 20,
        ...params,
      },
    });
    
    // API возвращает массив TFilmBased[] напрямую
    const films = Array.isArray(response.data) ? response.data : [];
    
    return {
      films,
      total: films.length,
      page: params.page || 1,
      limit: params.limit || 20,
    };
  },

  // Обновить фильм (только для админов)
  async updateFilm(id: number, data: Partial<TFilmBased>): Promise<TFilmBased> {
    const response = await apiClient.patch(API_ENDPOINTS.FILMS.UPDATE(id), data);
    return response.data;
  },

  // Удалить фильм (только для админов)
  async deleteFilm(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.FILMS.DELETE(id));
  },
};
