import { useState, useEffect, useCallback, useRef } from 'react';
import { TPersonBased } from '@common/types';
import { filmsService, PaginatedPersonsResponse } from '@/shared/api/services';

interface UseFilmPersonsByProfessionOptions {
  filmId: number;
  professionName: string | null;
  initialPage?: number;
  initialLimit?: number;
}

const DEFAULT_LIMIT = 14;

interface UseFilmPersonsByProfessionReturn {
  persons: TPersonBased[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  reset: () => void;
}

export const useFilmPersonsByProfession = ({
  filmId,
  professionName,
  initialPage = 1,
  initialLimit = DEFAULT_LIMIT,
}: UseFilmPersonsByProfessionOptions): UseFilmPersonsByProfessionReturn => {
  const [persons, setPersons] = useState<TPersonBased[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit] = useState(initialLimit);

  const isLoadingRef = useRef(false);

  const loadPersons = useCallback(
    async (page: number, reset = false) => {
      if (isLoadingRef.current || !professionName) return;

      isLoadingRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const response: PaginatedPersonsResponse = await filmsService.getFilmPersonsByProfession(
          filmId,
          professionName,
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
    [filmId, professionName, limit]
  );

  const loadMore = useCallback(async () => {
    if (!hasMore || loading || !professionName) return;
    await loadPersons(currentPage + 1, false);
  }, [hasMore, loading, currentPage, loadPersons, professionName]);

  const reset = useCallback(() => {
    setPersons([]);
    setCurrentPage(initialPage);
    setHasMore(true);
    setError(null);
    if (professionName) {
      loadPersons(initialPage, true);
    }
  }, [loadPersons, initialPage, professionName]);

  // Загрузка при изменении professionName
  useEffect(() => {
    if (professionName) {
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
  }, [professionName]);

  return {
    persons,
    loading,
    error,
    hasMore,
    loadMore,
    reset,
  };
};

