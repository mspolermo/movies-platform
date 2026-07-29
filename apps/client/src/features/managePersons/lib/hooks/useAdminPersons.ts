'use client';

import type { UsePaginatedResourceReturn } from '@/shared/lib/hooks';
import type { TPersonAdminItemResponse } from '@common/types';

import { useEffect, useState } from 'react';

import { usePaginatedResource } from '@/shared/lib/hooks';

import { listPersons } from '../../api';

const SEARCH_DEBOUNCE_MS = 300;

/**
 * Пагинированный список персон админки с серверным поиском (debounce 300ms);
 * в БД ~61k персон — весь список не грузим (ADR-007). После мутаций — `refetch`.
 */
export const useAdminPersons = (
  query = ''
): UsePaginatedResourceReturn<TPersonAdminItemResponse> => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedQuery(query), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const q = debouncedQuery.trim() || undefined;

  return usePaginatedResource<TPersonAdminItemResponse>({
    fetchPage: (page) => listPersons({ page, q }),
    resetDeps: [q],
    errorFallback: 'Не удалось загрузить персон',
  });
};
