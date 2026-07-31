import type { TUpsertFilmRatingRequest, TUpsertFilmRatingResponse } from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

/** Создать или обновить оценку фильма. */
export const upsertFilmRating = async (
  filmId: number,
  body: TUpsertFilmRatingRequest
): Promise<TUpsertFilmRatingResponse> => {
  const response = await apiClient.put<TUpsertFilmRatingResponse>(
    API_ENDPOINTS.RATINGS.BY_FILM(filmId),
    body
  );

  return response.data;
};
