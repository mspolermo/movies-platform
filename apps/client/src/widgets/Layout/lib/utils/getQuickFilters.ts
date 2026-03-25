import type { TQuickFiltersResponse } from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

/**
 * Запрос быстрых фильтров (жанры / страны / годы) для хедера.
 */
export async function getQuickFilters(): Promise<TQuickFiltersResponse> {
  const { data } = await apiClient.get<TQuickFiltersResponse>(API_ENDPOINTS.FILTERS.QUICK);
  return data;
}
