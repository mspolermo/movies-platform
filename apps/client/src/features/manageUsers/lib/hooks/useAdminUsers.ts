'use client';

import type { UsePaginatedResourceReturn } from '@/shared/lib/hooks';
import type { TAdminUserItemResponse } from '@common/types';

import { usePaginatedResource } from '@/shared/lib/hooks';

import { listUsers } from '../../api';

export const useAdminUsers = (): UsePaginatedResourceReturn<TAdminUserItemResponse> =>
  usePaginatedResource<TAdminUserItemResponse>({
    fetchPage: (page) => listUsers({ page }),
    errorFallback: 'Не удалось загрузить пользователей',
  });
