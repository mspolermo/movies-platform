import type { TGetMyFavoritesParams, TMyFavoritesResponse } from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

/** Пагинированный список избранного. */
export const getMyFavorites = async (
  params: TGetMyFavoritesParams = {}
): Promise<TMyFavoritesResponse> => {
  const response = await apiClient.get<TMyFavoritesResponse>(API_ENDPOINTS.FAVORITES.LIST, {
    params,
  });

  return response.data;
};
