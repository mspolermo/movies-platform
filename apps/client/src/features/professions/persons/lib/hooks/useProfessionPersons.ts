import { useState, useEffect, useCallback, useRef } from 'react';
import { TPersonBased } from '@common/types';
import { professionsService, PaginatedPersonsResponse } from '@/shared/api/services';

interface UseProfessionPersonsOptions {
  professionId: number | null;
  initialPage?: number;
  initialLimit?: number;
}

interface UseProfessionPersonsReturn {
  persons: TPersonBased[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  reset: () => void;
}

export const useProfessionPersons = ({
  professionId,
  initialPage = 1,
  initialLimit = 20,
}: UseProfessionPersonsOptions): UseProfessionPersonsReturn => {
  const [persons, setPersons] = useState<TPersonBased[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit] = useState(initialLimit);

  const isLoadingRef = useRef(false);

  const loadPersons = useCallback(
    async (page: number, reset = false) => {
      if (isLoadingRef.current || !professionId) return;

      isLoadingRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const response: PaginatedPersonsResponse = await professionsService.getPersonsByProfession(
          professionId,
          page,
          limit
        );

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
    [professionId, limit]
  );

  const loadMore = useCallback(async () => {
    if (!hasMore || loading || !professionId) return;
    await loadPersons(currentPage + 1, false);
  }, [hasMore, loading, currentPage, loadPersons, professionId]);

  const reset = useCallback(() => {
    setPersons([]);
    setCurrentPage(initialPage);
    setHasMore(true);
    setError(null);
    if (professionId) {
      loadPersons(initialPage, true);
    }
  }, [loadPersons, initialPage, professionId]);

  // Загрузка при изменении professionId
  useEffect(() => {
    if (professionId) {
      setPersons([]);
      setCurrentPage(initialPage);
      setHasMore(true);
      setError(null);
      loadPersons(initialPage, true);
    } else {
      setPersons([]);
      setHasMore(false);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [professionId]);

  return {
    persons,
    loading,
    error,
    hasMore,
    loadMore,
    reset,
  };
};

