import { useState, useEffect, useCallback, useRef } from 'react';
import { TPersonBased } from '@common/types';
import { personsService, PaginatedPersonsResponse } from '@/shared/api/services';

interface UsePersonsInfiniteScrollOptions {
  initialPage?: number;
  initialLimit?: number;
}

interface UsePersonsInfiniteScrollReturn {
  persons: TPersonBased[];
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
  const [persons, setPersons] = useState<TPersonBased[]>([]);
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
        const response: PaginatedPersonsResponse = await personsService.getAllPersonsPaginated(page, limit);

        if (reset) {
          setPersons(response.items);
        } else {
          setPersons((prev) => [...prev, ...response.items]);
        }

        setHasMore(response.hasMore);
        setCurrentPage(page);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Ошибка загрузки персон');
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

