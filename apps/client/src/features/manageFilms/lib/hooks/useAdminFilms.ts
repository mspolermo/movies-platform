'use client';

import type { UsePaginatedResourceReturn } from '@/shared/lib/hooks';
import type { TAdminFilmItemResponse } from '@common/types';

import { useAdminSearchList } from '@/shared/lib/hooks';

import { listFilms } from '../../api';

export const useAdminFilms = (query = ''): UsePaginatedResourceReturn<TAdminFilmItemResponse> =>
  useAdminSearchList({
    query,
    fetchPage: (page, q) => listFilms({ page, q }),
    errorFallback: 'Не удалось загрузить фильмы',
  });
