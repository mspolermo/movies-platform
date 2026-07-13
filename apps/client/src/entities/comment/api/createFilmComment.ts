import type { TCommentResponse, TCreateCommentRequest } from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

/** Создать комментарий или ответ к фильму. */
export const createFilmComment = async (
  filmId: number,
  body: TCreateCommentRequest
): Promise<TCommentResponse> => {
  const response = await apiClient.post<TCommentResponse>(
    API_ENDPOINTS.COMMENTS.BY_FILM(filmId),
    body
  );

  return response.data;
};
