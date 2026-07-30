'use client';

import type { UsePaginatedResourceReturn } from '@/shared/lib/hooks';
import type { TAdminPersonItemResponse } from '@common/types';

import { useAdminSearchList } from '@/shared/lib/hooks';

import { listPersons } from '../../api';

export const useAdminPersons = (query = ''): UsePaginatedResourceReturn<TAdminPersonItemResponse> =>
  useAdminSearchList({
    query,
    fetchPage: (page, q) => listPersons({ page, q }),
    errorFallback: 'Не удалось загрузить персон',
  });
