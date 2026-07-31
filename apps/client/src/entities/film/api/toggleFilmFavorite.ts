import type { TToggleFavoriteResponse } from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

/** Toggle избранного по filmId. */
export const toggleFilmFavorite = async (filmId: number): Promise<TToggleFavoriteResponse> => {
  const response = await apiClient.post<TToggleFavoriteResponse>(
    API_ENDPOINTS.FAVORITES.TOGGLE(filmId)
  );

  return response.data;
};
