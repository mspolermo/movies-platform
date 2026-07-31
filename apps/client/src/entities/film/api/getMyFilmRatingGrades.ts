import type { TMyFilmRatingGradesResponse } from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

/** Compact hydrate: все оценки пользователя. */
export const getMyFilmRatingGrades = async (): Promise<TMyFilmRatingGradesResponse> => {
  const response = await apiClient.get<TMyFilmRatingGradesResponse>(API_ENDPOINTS.RATINGS.GRADES);

  return response.data;
};
