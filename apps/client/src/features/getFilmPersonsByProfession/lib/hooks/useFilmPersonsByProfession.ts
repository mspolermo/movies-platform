import type { TPersonListItemResponse } from '@common/types';

import { useCallback } from 'react';

import { getFilmPersonsByProfession } from '@/entities/person';
import { usePaginatedResource } from '@/shared/lib';

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
  reset: () => Promise<void>;
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
  const fetchPage = useCallback(
    async (page: number) => {
      // `enabled` не даёт сюда попасть без профессии; early-return — страховка для типов.
      if (!professionName) {
        return {
          items: [],
          hasMore: false,
          total: 0,
          page,
          perPage: initialLimit,
        };
      }

      return getFilmPersonsByProfession({
        filmId,
        profession: professionName,
        page,
        limit: initialLimit,
      });
    },
    [filmId, professionName, initialLimit]
  );

  const { items, loading, error, hasMore, loadMore, refetch } =
    usePaginatedResource<TPersonListItemResponse>({
      fetchPage,
      resetDeps: [filmId, professionName],
      enabled: Boolean(professionName),
      initialPage,
      errorFallback: 'Ошибка загрузки персон',
    });

  return {
    persons: items,
    loading,
    error,
    hasMore,
    loadMore,
    reset: refetch,
  };
};
