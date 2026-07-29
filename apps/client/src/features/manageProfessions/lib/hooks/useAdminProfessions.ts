'use client';

import type { UsePaginatedResourceReturn } from '@/shared/lib/hooks';
import type { TProfessionAdminItemResponse } from '@common/types';

import { usePaginatedResource } from '@/shared/lib/hooks';

import { listProfessions } from '../../api';

/**
 * Пагинированный список профессий админки; после мутаций вызывать `refetch`.
 * Словарь маленький (~9 записей) — целиком помещается в первую страницу.
 */
export const useAdminProfessions = (): UsePaginatedResourceReturn<TProfessionAdminItemResponse> =>
  usePaginatedResource<TProfessionAdminItemResponse>({
    fetchPage: (page) => listProfessions({ page }),
    errorFallback: 'Не удалось загрузить профессии',
  });
