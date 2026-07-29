'use client';

import type { UsePaginatedResourceReturn } from '@/shared/lib/hooks';
import type { TGenreAdminItemResponse } from '@common/types';

import { usePaginatedResource } from '@/shared/lib/hooks';

import { listGenres } from '../../api';

/** Пагинированный список жанров админки; после мутаций вызывать `refetch`. */
export const useAdminGenres = (): UsePaginatedResourceReturn<TGenreAdminItemResponse> =>
  usePaginatedResource<TGenreAdminItemResponse>({
    fetchPage: (page) => listGenres({ page }),
    errorFallback: 'Не удалось загрузить жанры',
  });
