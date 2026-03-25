import type { TFilmsResponse, TSearchFilmsParams } from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

export const searchFilms =
  // Поиск фильмов
  async (params: TSearchFilmsParams = {}): Promise<TFilmsResponse> => {
    const response = await apiClient.get<TFilmsResponse>(API_ENDPOINTS.FILMS.SEARCH, {
      params: {
        page: params.page || 1,
        perPage: params.perPage || 20,
        ...params,
      },
    });
    return response.data;
  };
