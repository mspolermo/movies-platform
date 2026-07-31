import type { TMyFavoriteIdsResponse } from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

/** Compact hydrate: все filmId избранного. */
export const getMyFavoriteIds = async (): Promise<TMyFavoriteIdsResponse> => {
  const response = await apiClient.get<TMyFavoriteIdsResponse>(API_ENDPOINTS.FAVORITES.IDS);

  return response.data;
};
