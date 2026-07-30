'use client';

import type { UsePaginatedResourceReturn } from '../usePaginatedResource';
import type { TPaginatedItemsResponse } from '@common/types';

import { useDebouncedValue } from '../useDebouncedValue';
import { usePaginatedResource } from '../usePaginatedResource';

export const ADMIN_SEARCH_DEBOUNCE_MS = 300;

type UseAdminSearchListOptions<TItem> = {
  query?: string;
  fetchPage: (page: number, q?: string) => Promise<TPaginatedItemsResponse<TItem>>;
  errorFallback: string;
};

/** Пагинированный admin-список с debounced серверным поиском `q`. */
export const useAdminSearchList = <TItem>({
  query = '',
  fetchPage,
  errorFallback,
}: UseAdminSearchListOptions<TItem>): UsePaginatedResourceReturn<TItem> => {
  const q = useDebouncedValue(query, ADMIN_SEARCH_DEBOUNCE_MS).trim() || undefined;

  return usePaginatedResource<TItem>({
    fetchPage: (page) => fetchPage(page, q),
    resetDeps: [q],
    errorFallback,
  });
};
