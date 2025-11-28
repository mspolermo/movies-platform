import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { TFilmModel, TFilmWithProfessions } from '@common/types';

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
};
