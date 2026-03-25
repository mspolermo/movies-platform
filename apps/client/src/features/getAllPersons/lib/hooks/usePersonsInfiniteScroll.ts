import type { TPaginatedPersonsResponse, TPersonListItemResponse } from '@common/types';

import { isAxiosError } from 'axios';
import { useState, useEffect, useCallback, useRef } from 'react';

import { getAllPersonsPaginated } from '@/entities/person';

interface UsePersonsInfiniteScrollOptions {
  initialPage?: number;
  initialLimit?: number;
}

interface UsePersonsInfiniteScrollReturn {
  persons: TPersonListItemResponse[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  reset: () => void;
}

export const usePersonsInfiniteScroll = ({
  initialPage = 1,
  initialLimit = 20,
}: UsePersonsInfiniteScrollOptions = {}): UsePersonsInfiniteScrollReturn => {
  const [persons, setPersons] = useState<TPersonListItemResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit] = useState(initialLimit);

  const isLoadingRef = useRef(false);

  const loadPersons = useCallback(
    async (page: number, reset = false) => {
      if (isLoadingRef.current) return;

      isLoadingRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const response: TPaginatedPersonsResponse = await getAllPersonsPaginated({ page, limit });

        if (reset) {
          setPersons(response.items);
        } else {
          setPersons((prev) => [...prev, ...response.items]);
        }

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
    await loadPersons(currentPage + 1, false);
  }, [hasMore, loading, currentPage, loadPersons]);

  const reset = useCallback(() => {
    setPersons([]);
    setCurrentPage(initialPage);
    setHasMore(true);
    setError(null);
    loadPersons(initialPage, true);
  }, [loadPersons, initialPage]);

  // Загрузка при монтировании
  useEffect(() => {
    loadPersons(initialPage, true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    persons,
    loading,
    error,
    hasMore,
    loadMore,
    reset,
  };
};
