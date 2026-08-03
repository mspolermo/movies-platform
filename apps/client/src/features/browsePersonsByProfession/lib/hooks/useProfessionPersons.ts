'use client';

import type { TPersonListItemResponse } from '@common/types';

import { useCallback } from 'react';

import { getPersonsByProfession } from '@/entities/person';
import { usePaginatedResource } from '@/shared/lib';

interface UseProfessionPersonsOptions {
  professionId: number | null;
  initialPage?: number;
  initialLimit?: number;
}

interface UseProfessionPersonsReturn {
  persons: TPersonListItemResponse[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

/**
Хук для загрузки и постраничного получения персон, относящихся к выбранной профессии.

Обеспечивает:
- начальную загрузку персон при смене professionId;
- пагинацию (подгрузку следующей страницы);
- защиту от одновременных запросов;
- хранение состояния загрузки, ошибки и возможности подгрузки.
*/
export const useProfessionPersons = ({
  professionId,
  initialPage = 1,
  initialLimit = 20,
}: UseProfessionPersonsOptions): UseProfessionPersonsReturn => {
  const fetchPage = useCallback(
    async (page: number) => {
      // `enabled` не даёт сюда попасть без id; early-return — страховка для типов.
      if (professionId == null) {
        return {
          items: [],
          hasMore: false,
          total: 0,
          page,
          perPage: initialLimit,
        };
      }

      return getPersonsByProfession({
        professionId,
        page,
        limit: initialLimit,
      });
    },
    [professionId, initialLimit]
  );

  const { items, loading, error, hasMore, loadMore } =
    usePaginatedResource<TPersonListItemResponse>({
      fetchPage,
      resetDeps: [professionId],
      enabled: Boolean(professionId),
      initialPage,
      errorFallback: 'Ошибка загрузки персон',
    });

  return {
    persons: items,
    loading,
    error,
    hasMore,
    loadMore,
  };
};
