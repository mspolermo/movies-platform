import type { TQuickFiltersResponse } from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

export async function getQuickFilters(): Promise<TQuickFiltersResponse> {
  const { data } = await apiClient.get<TQuickFiltersResponse>(
    API_ENDPOINTS.FILTERS.QUICK
  );
  return data;
}
