import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { TFilmModel } from '@common/types';

export interface SearchFilmsParams {
  page?: number;
  perPage?: number;
  year?: number;
  genres?: string[];
  countries?: string[];
  persons?: string[];
  minRatingKp?: number;
  minVotesKp?: number;
  sortBy?: string;
}

export interface FilmsResponse {
  films: TFilmModel[];
  total: number;
  page: number;
  perPage: number;
  hasMore: boolean;
}

export const filmsService = {
  // Получить фильм по ID
  async getFilmById(id: number): Promise<TFilmModel> {
    const response = await apiClient.get(API_ENDPOINTS.FILMS.BY_ID(id));
    // API возвращает объект с полем film, извлекаем его
    return response.data.film || response.data;
  },

  // Поиск фильмов
  async searchFilms(params: SearchFilmsParams = {}): Promise<FilmsResponse> {
    const response = await apiClient.get(API_ENDPOINTS.FILMS.SEARCH, {
      params: {
        page: params.page || 1,
        perPage: params.perPage || 20,
        ...params,
      },
    });
    
    // API возвращает массив TFilmModel[] напрямую
    const films = Array.isArray(response.data) ? response.data : [];
    const page = params.page || 1;
    const perPage = params.perPage || 20;
    
    return {
      films,
      total: films.length,
      page,
      perPage,
      hasMore: films.length === perPage, // Если получили полную страницу, возможно есть еще
    };
  },

  // Обновить фильм (только для админов)
  async updateFilm(id: number, data: Partial<TFilmModel>): Promise<TFilmModel> {
    const response = await apiClient.patch(API_ENDPOINTS.FILMS.UPDATE(id), data);
    return response.data;
  },

  // Удалить фильм (только для админов)
  async deleteFilm(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.FILMS.DELETE(id));
  },
};
