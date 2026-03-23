import type {
  TPaginatedPersonsResponse,
  TPersonListItemResponse,
} from '@common/types';

import { isAxiosError } from 'axios';
import { useState, useEffect, useCallback, useRef } from 'react';

import { getFilmPersonsByProfession } from '@/entities/person';

interface UseFilmPersonsByProfessionOptions {
  filmId: number;
  professionName: string | null;
  initialPage?: number;
  initialLimit?: number;
}

const DEFAULT_LIMIT = 14;

interface UseFilmPersonsByProfessionReturn {
  persons: TPersonListItemResponse[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  reset: () => void;
}

/**
Хук для загрузки персон по конкретной профессии, относящихся к определённому фильму.

Реализует:
- начальную загрузку списка при смене профессии;
- постраничную подгрузку данных (пагинация);
- защиту от повторных запросов;
- хранение ошибок, состояния загрузки и флага наличия следующих страниц.
*/
export const useFilmPersonsByProfession = ({
  filmId,
  professionName,
  initialPage = 1,
  initialLimit = DEFAULT_LIMIT,
}: UseFilmPersonsByProfessionOptions): UseFilmPersonsByProfessionReturn => {
  const [persons, setPersons] = useState<TPersonListItemResponse[]>([]);
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
        const response: TPaginatedPersonsResponse =
          await getFilmPersonsByProfession(filmId, professionName, page, limit);

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
          typeof (err.response.data as { message: unknown }).message ===
            'string'
            ? (err.response.data as { message: string }).message
            : fallback;
        setError(msg);
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
