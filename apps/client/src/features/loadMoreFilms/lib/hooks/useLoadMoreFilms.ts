import type { TFilmListItemResponse, TFilmsResponse, TSearchFilmsParams } from '@common/types';

import { isAxiosError } from 'axios';
import { useState, useEffect, useCallback, useRef } from 'react';

import { searchFilms } from '@/entities/film';

interface UseLoadMoreFilmsOptions {
  initialParams?: TSearchFilmsParams;
}

export const useLoadMoreFilms = ({ initialParams = {} }: UseLoadMoreFilmsOptions = {}) => {
  const [films, setFilms] = useState<TFilmListItemResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [params, setParams] = useState<TSearchFilmsParams>(initialParams);

  const isLoadingRef = useRef(false);

  const loadFilms = useCallback(
    async (page: number, reset = false) => {
      if (isLoadingRef.current) return;

      isLoadingRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const searchParams: TSearchFilmsParams = {
          ...params,
          page,
          perPage: params.perPage ?? 20,
        };

        const response: TFilmsResponse = await searchFilms(searchParams);

        if (reset) {
          setFilms(response.films);
        } else {
          setFilms((prev) => [...prev, ...response.films]);
        }

        setHasMore(response.hasMore);
        setCurrentPage(page);
      } catch (err: unknown) {
        const fallback = 'Ошибка загрузки фильмов';
        const message = isAxiosError(err)
          ? (() => {
              const data = err.response?.data;
              if (
                data &&
                typeof data === 'object' &&
                'message' in data &&
                typeof (data as { message: unknown }).message === 'string'
              ) {
                return (data as { message: string }).message;
              }
              return fallback;
            })()
          : fallback;
        setError(message);
      } finally {
        setLoading(false);
        isLoadingRef.current = false;
      }
    },
    [params]
  );

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    await loadFilms(currentPage + 1, false);
  }, [hasMore, loading, currentPage, loadFilms]);

  const reset = useCallback(() => {
    setFilms([]);
    setCurrentPage(1);
    setHasMore(true);
    setError(null);
    loadFilms(1, true);
  }, [loadFilms]);

  const updateParams = useCallback((newParams: TSearchFilmsParams) => {
    setParams(newParams);
  }, []);

  // Загрузка при изменении параметров
  useEffect(() => {
    reset();
  }, [params, reset]);

  return {
    films,
    loading,
    error,
    hasMore,
    loadMore,
    reset,
    updateParams,
  };
};
