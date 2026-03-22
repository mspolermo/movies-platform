import type { FilmsResponse, SearchFilmsParams } from '@/shared/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

export const searchFilms =
  // Поиск фильмов
  async (params: SearchFilmsParams = {}): Promise<FilmsResponse> => {
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
  };
