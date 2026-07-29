'use client';

import type { UsePaginatedResourceReturn } from '@/shared/lib/hooks';
import type { TAdminFilmItemResponse } from '@common/types';

import { useEffect, useState } from 'react';

import { usePaginatedResource } from '@/shared/lib/hooks';

import { listFilms } from '../../api';

const SEARCH_DEBOUNCE_MS = 300;

/**
 * Пагинированный список фильмов админки с серверным поиском (debounce 300ms).
 * После мутаций вызывать `refetch`.
 */
export const useAdminFilms = (query = ''): UsePaginatedResourceReturn<TAdminFilmItemResponse> => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedQuery(query), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const q = debouncedQuery.trim() || undefined;

  return usePaginatedResource<TAdminFilmItemResponse>({
    fetchPage: (page) => listFilms({ page, q }),
    resetDeps: [q],
    errorFallback: 'Не удалось загрузить фильмы',
  });
};
