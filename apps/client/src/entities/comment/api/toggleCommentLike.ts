import type { TToggleCommentLikeResponse } from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

/** Переключить лайк комментария (JWT). */
export const toggleCommentLike = async (commentId: number): Promise<TToggleCommentLikeResponse> => {
  const response = await apiClient.post<TToggleCommentLikeResponse>(
    API_ENDPOINTS.COMMENTS.LIKE(commentId)
  );

  return response.data;
};
