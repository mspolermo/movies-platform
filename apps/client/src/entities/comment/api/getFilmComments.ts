import type { TCommentsPaginatedResponse, TGetFilmCommentsParams } from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

/** Получить пагинированные комментарии фильма. */
export const getFilmComments = async (
  filmId: number,
  params: TGetFilmCommentsParams = {}
): Promise<TCommentsPaginatedResponse> => {
  const response = await apiClient.get<TCommentsPaginatedResponse>(
    API_ENDPOINTS.COMMENTS.BY_FILM(filmId),
    {
      params: {
        page: params.page ?? 1,
        perPage: params.perPage ?? 10,
      },
    }
  );

  return response.data;
};
