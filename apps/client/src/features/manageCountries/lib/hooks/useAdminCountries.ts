'use client';

import type { UsePaginatedResourceReturn } from '@/shared/lib/hooks';
import type { TCountryAdminItemResponse } from '@common/types';

import { usePaginatedResource } from '@/shared/lib/hooks';

import { listCountries } from '../../api';

/** Пагинированный список стран админки; после мутаций вызывать `refetch`. */
export const useAdminCountries = (): UsePaginatedResourceReturn<TCountryAdminItemResponse> =>
  usePaginatedResource<TCountryAdminItemResponse>({
    fetchPage: (page) => listCountries({ page }),
    errorFallback: 'Не удалось загрузить страны',
  });
