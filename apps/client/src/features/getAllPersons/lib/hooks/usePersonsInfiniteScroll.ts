import type { TPaginatedPersonsResponse, TPersonListItemResponse } from '@common/types';

import { isAxiosError } from 'axios';
import { useState, useCallback, useRef } from 'react';

import { getAllPersonsPaginated } from '@/entities/person';

interface UsePersonsInfiniteScrollOptions {
  initialPage?: number;
  initialLimit?: number;
  /** Первая страница с сервера (RSC); дальше только `loadMore` на клиенте. */
  initialData?: TPaginatedPersonsResponse;
}

interface UsePersonsInfiniteScrollReturn {
  persons: TPersonListItemResponse[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

export const usePersonsInfiniteScroll = ({
  initialPage = 1,
  initialLimit = 20,
  initialData,
}: UsePersonsInfiniteScrollOptions = {}): UsePersonsInfiniteScrollReturn => {
  const [persons, setPersons] = useState<TPersonListItemResponse[]>(() => initialData?.items ?? []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(() => initialData?.hasMore ?? true);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit] = useState(initialLimit);

  const isLoadingRef = useRef(false);

  const loadNextPage = useCallback(
    async (page: number) => {
      if (isLoadingRef.current) return;

      isLoadingRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const response: TPaginatedPersonsResponse = await getAllPersonsPaginated({ page, limit });

        setPersons((prev) => [...prev, ...response.items]);
        setHasMore(response.hasMore);
        setCurrentPage(page);
      } catch (err: unknown) {
        const fallback = 'Ошибка загрузки персон';
        const msg =
          isAxiosError(err) &&
          err.response?.data &&
          typeof err.response.data === 'object' &&
          err.response.data !== null &&
          'message' in err.response.data &&
          typeof (err.response.data as { message: unknown }).message === 'string'
            ? (err.response.data as { message: string }).message
            : fallback;
        setError(msg);
      } finally {
        setLoading(false);
        isLoadingRef.current = false;
      }
    },
    [limit]
  );

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    await loadNextPage(currentPage + 1);
  }, [hasMore, loading, currentPage, loadNextPage]);

  return {
    persons,
    loading,
    error,
    hasMore,
    loadMore,
  };
};
