import type { TCommentResponse } from '@common/types';

import { useCallback, useEffect, useState } from 'react';

import { getFilmComments } from '@/entities/comment';
import { usePaginatedResource } from '@/shared/lib';

const DEFAULT_PER_PAGE = 10;

interface UseFilmCommentsOptions {
  filmId: number;
  perPage?: number;
  enabled?: boolean;
}

interface UseFilmCommentsReturn {
  comments: TCommentResponse[];
  total: number;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refetch: () => Promise<void>;
  updateCommentLike: (commentId: number, likesCount: number, liked: boolean) => void;
}

export const useFilmComments = ({
  filmId,
  perPage = DEFAULT_PER_PAGE,
  enabled = true,
}: UseFilmCommentsOptions): UseFilmCommentsReturn => {
  const [likeOverrides, setLikeOverrides] = useState<
    Record<number, Pick<TCommentResponse, 'likesCount' | 'liked'>>
  >({});

  const fetchPage = useCallback(
    async (page: number) => {
      return getFilmComments(filmId, { page, perPage });
    },
    [filmId, perPage]
  );

  const { items, total, loading, error, hasMore, loadMore, refetch } =
    usePaginatedResource<TCommentResponse>({
      fetchPage,
      resetDeps: [filmId, perPage],
      enabled: enabled && Boolean(filmId),
      errorFallback: 'Ошибка загрузки отзывов',
    });

  useEffect(() => {
    setLikeOverrides({});
  }, [filmId]);

  const handleRefetch = useCallback(async () => {
    setLikeOverrides({});
    await refetch();
  }, [refetch]);

  const updateCommentLike = useCallback((commentId: number, likesCount: number, liked: boolean) => {
    setLikeOverrides((prev) => ({ ...prev, [commentId]: { likesCount, liked } }));
  }, []);

  const comments =
    Object.keys(likeOverrides).length === 0
      ? items
      : items.map((comment) =>
          likeOverrides[comment.id] ? { ...comment, ...likeOverrides[comment.id] } : comment
        );

  return {
    comments,
    total: total ?? 0,
    loading,
    error,
    hasMore,
    loadMore,
    refetch: handleRefetch,
    updateCommentLike,
  };
};
