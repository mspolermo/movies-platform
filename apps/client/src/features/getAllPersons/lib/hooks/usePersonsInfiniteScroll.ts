import type { TPaginatedPersonsResponse, TPersonListItemResponse } from '@common/types';

import { useCallback } from 'react';

import { getAllPersonsPaginated } from '@/entities/person';
import { usePaginatedResource } from '@/shared/lib';

interface UsePersonsInfiniteScrollOptions {
  initialPage?: number;
  initialLimit?: number;
  /** Первая страница с сервера (RSC); дальше только `loadMore` на клиенте. */
  initialData?: TPaginatedPersonsResponse;
}

interface UsePersonsInfiniteScrollReturn {
  persons: TPersonListItemResponse[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

export const usePersonsInfiniteScroll = ({
  initialPage = 1,
  initialLimit = 20,
  initialData,
}: UsePersonsInfiniteScrollOptions = {}): UsePersonsInfiniteScrollReturn => {
  const fetchPage = useCallback(
    async (page: number) => {
      return getAllPersonsPaginated({ page, limit: initialLimit });
    },
    [initialLimit]
  );

  const { items, loading, error, hasMore, loadMore } =
    usePaginatedResource<TPersonListItemResponse>({
      fetchPage,
      initialPage,
      initialData,
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
