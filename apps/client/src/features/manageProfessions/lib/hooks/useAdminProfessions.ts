'use client';

import type { UsePaginatedResourceReturn } from '@/shared/lib/hooks';
import type { TAdminProfessionItemResponse } from '@common/types';

import { usePaginatedResource } from '@/shared/lib/hooks';

import { listProfessions } from '../../api';

export const useAdminProfessions = (): UsePaginatedResourceReturn<TAdminProfessionItemResponse> =>
  usePaginatedResource<TAdminProfessionItemResponse>({
    fetchPage: (page) => listProfessions({ page }),
    errorFallback: 'Не удалось загрузить профессии',
  });
