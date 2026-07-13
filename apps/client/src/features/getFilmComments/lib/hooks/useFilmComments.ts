import type { TCommentResponse } from '@common/types';

import { isAxiosError } from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';

import { getFilmComments } from '@/entities/comment';

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

const getErrorMessage = (err: unknown): string => {
  const fallback = 'Ошибка загрузки отзывов';

  if (
    isAxiosError(err) &&
    err.response?.data &&
    typeof err.response.data === 'object' &&
    err.response.data !== null &&
    'message' in err.response.data &&
    typeof (err.response.data as { message: unknown }).message === 'string'
  ) {
    return (err.response.data as { message: string }).message;
  }

  return fallback;
};

export const useFilmComments = ({
  filmId,
  perPage = DEFAULT_PER_PAGE,
  enabled = true,
}: UseFilmCommentsOptions): UseFilmCommentsReturn => {
  const [comments, setComments] = useState<TCommentResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const requestIdRef = useRef(0);

  const loadComments = useCallback(
    async (page: number, reset = false) => {
      if (!filmId || !enabled) {
        return;
      }

      const requestId = ++requestIdRef.current;

      setLoading(true);
      setError(null);

      try {
        const response = await getFilmComments(filmId, { page, perPage });

        if (requestId !== requestIdRef.current) {
          return;
        }

        if (reset) {
          setComments(response.items);
        } else {
          setComments((prev) => [...prev, ...response.items]);
        }

        setTotal(response.total);
        setHasMore(response.hasMore);
        setCurrentPage(page);
      } catch (err: unknown) {
        if (requestId !== requestIdRef.current) {
          return;
        }

        setError(getErrorMessage(err));
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [enabled, filmId, perPage]
  );

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) {
      return;
    }

    await loadComments(currentPage + 1, false);
  }, [currentPage, hasMore, loadComments, loading]);

  const refetch = useCallback(async () => {
    setCurrentPage(1);
    await loadComments(1, true);
  }, [loadComments]);

  const updateCommentLike = useCallback((commentId: number, likesCount: number, liked: boolean) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId ? { ...comment, likesCount, liked } : comment
      )
    );
  }, []);

  useEffect(() => {
    if (!enabled || !filmId) {
      setLoading(false);
      return;
    }

    setComments([]);
    setCurrentPage(1);
    setHasMore(false);
    setError(null);

    void loadComments(1, true);

    return () => {
      requestIdRef.current += 1;
    };
  }, [enabled, filmId, loadComments]);

  return {
    comments,
    total,
    loading,
    error,
    hasMore,
    loadMore,
    refetch,
    updateCommentLike,
  };
};
