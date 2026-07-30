'use client';

import type { UsePaginatedResourceReturn } from '@/shared/lib/hooks';
import type { TAdminGenreItemResponse } from '@common/types';

import { useAdminSearchList } from '@/shared/lib/hooks';

import { listGenres } from '../../api';

export const useAdminGenres = (query = ''): UsePaginatedResourceReturn<TAdminGenreItemResponse> =>
  useAdminSearchList({
    query,
    fetchPage: (page, q) => listGenres({ page, q }),
    errorFallback: 'Не удалось загрузить жанры',
  });
