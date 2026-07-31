import type { TDeleteFilmRatingResponse } from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

/** Удалить оценку фильма. */
export const deleteFilmRating = async (filmId: number): Promise<TDeleteFilmRatingResponse> => {
  const response = await apiClient.delete<TDeleteFilmRatingResponse>(
    API_ENDPOINTS.RATINGS.BY_FILM(filmId)
  );

  return response.data;
};
