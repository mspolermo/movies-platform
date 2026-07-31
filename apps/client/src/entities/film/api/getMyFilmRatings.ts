import type { TGetMyFilmRatingsParams, TMyFilmRatingsResponse } from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

/** Пагинированный список оценок. */
export const getMyFilmRatings = async (
  params: TGetMyFilmRatingsParams = {}
): Promise<TMyFilmRatingsResponse> => {
  const response = await apiClient.get<TMyFilmRatingsResponse>(API_ENDPOINTS.RATINGS.LIST, {
    params,
  });

  return response.data;
};
