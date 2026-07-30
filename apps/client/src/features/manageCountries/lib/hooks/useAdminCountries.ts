'use client';

import type { UsePaginatedResourceReturn } from '@/shared/lib/hooks';
import type { TAdminCountryItemResponse } from '@common/types';

import { useAdminSearchList } from '@/shared/lib/hooks';

import { listCountries } from '../../api';

export const useAdminCountries = (
  query = ''
): UsePaginatedResourceReturn<TAdminCountryItemResponse> =>
  useAdminSearchList({
    query,
    fetchPage: (page, q) => listCountries({ page, q }),
    errorFallback: 'Не удалось загрузить страны',
  });
