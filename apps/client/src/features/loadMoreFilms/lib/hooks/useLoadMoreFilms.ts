import type { TFilmListItemResponse, TFilmsResponse, TSearchFilmsParams } from '@common/types';

import { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';

import { searchFilms } from '@/entities/film';

import { areSearchFilmsParamsEqual, searchFilmsErrorMessage } from '../utils';

export interface UseLoadMoreFilmsOptions {
  /** Стартовые параметры поиска (страница перезапишется при загрузке). */
  initialParams?: TSearchFilmsParams;
  /** Если `false`, сброс и запросы не выполняются (например, route `loading.tsx`). */
  enabled?: boolean;
}

/**
 * Постраничная загрузка фильмов через `searchFilms`.
 *
 * При смене внутренних `params` (через `updateParams`) вызывается полный сброс и запрос 1-й страницы.
 * `loadMore` догружает следующую страницу с теми же `params`.
 */
export const useLoadMoreFilms = ({
  initialParams = {},
  enabled = true,
}: UseLoadMoreFilmsOptions = {}) => {
  const [films, setFilms] = useState<TFilmListItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [params, setParams] = useState<TSearchFilmsParams>(initialParams);

  const isLoadingRef = useRef(false);

  /** Синхронизация с родителем до `useEffect(reset)`; без сравнения по значению — новая ссылка `initialParams` каждый рендер даёт бесконечный цикл setState. */
  useLayoutEffect(() => {
    setParams((prev) => (areSearchFilmsParamsEqual(prev, initialParams) ? prev : initialParams));
  }, [initialParams]);

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
        setError(searchFilmsErrorMessage(err));
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

  useEffect(() => {
    if (!enabled) return;
    reset();
  }, [params, reset, enabled]);

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
