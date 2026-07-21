import type { TFilmListItemResponse, TSearchFilmsParams } from '@common/types';

import { useCallback, useLayoutEffect, useState } from 'react';

import { searchFilms } from '@/entities/film';
import { usePaginatedResource } from '@/shared/lib';

import { areSearchFilmsParamsEqual } from '../utils';

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
  const [params, setParams] = useState<TSearchFilmsParams>(initialParams);

  /** Синхронизация с родителем до reset-эффекта; без сравнения по значению — новая ссылка `initialParams` каждый рендер даёт бесконечный цикл setState. */
  useLayoutEffect(() => {
    setParams((prev) => (areSearchFilmsParamsEqual(prev, initialParams) ? prev : initialParams));
  }, [initialParams]);

  const fetchPage = useCallback(
    async (page: number) => {
      return searchFilms({
        ...params,
        page,
        perPage: params.perPage ?? 20,
      });
    },
    [params]
  );

  const { items, loading, error, hasMore, loadMore, refetch } =
    usePaginatedResource<TFilmListItemResponse>({
      fetchPage,
      resetDeps: [params],
      enabled,
      errorFallback: 'Ошибка загрузки фильмов',
    });

  const updateParams = useCallback((newParams: TSearchFilmsParams) => {
    setParams(newParams);
  }, []);

  return {
    films: items,
    loading,
    error,
    hasMore,
    loadMore,
    reset: refetch,
    updateParams,
  };
};
