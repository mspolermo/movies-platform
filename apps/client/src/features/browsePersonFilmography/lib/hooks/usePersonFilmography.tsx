import type { TPersonFilmResponse } from '@common/types';

import { useCallback } from 'react';

import { getPersonFilms } from '@/entities/film';
import { usePaginatedResource } from '@/shared/lib';

const DEFAULT_LIMIT = 10;

/** Фильмография персоны: первая страница, догрузка, флаги загрузки. */
export const usePersonFilmography = (personId: number | null) => {
  const fetchPage = useCallback(
    async (page: number) => {
      if (personId == null) {
        return {
          items: [],
          hasMore: false,
          total: 0,
          page,
          perPage: DEFAULT_LIMIT,
        };
      }

      return getPersonFilms({
        id: personId,
        limit: DEFAULT_LIMIT,
        offset: (page - 1) * DEFAULT_LIMIT,
      });
    },
    [personId]
  );

  const { items, total, loading, error, hasMore, loadMore } =
    usePaginatedResource<TPersonFilmResponse>({
      fetchPage,
      resetDeps: [personId],
      enabled: personId != null,
      errorFallback: 'Ошибка загрузки фильмографии',
    });

  return {
    loading: loading && items.length === 0,
    error,
    filmsTotal: total ?? 0,
    films: items,
    handleLoadMore: loadMore,
    isLoadingMore: loading && items.length > 0,
    hasMoreFilms: hasMore,
  };
};
