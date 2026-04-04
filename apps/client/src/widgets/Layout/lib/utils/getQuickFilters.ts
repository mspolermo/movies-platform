import type { TFiltersLocale, TQuickFiltersResponse } from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';
import { DEFAULT_FILTERS_LOCALE } from '@/shared/constants';

/**
 * Запрос быстрых фильтров (жанры / страны / годы) для хедера.
 */
export async function getQuickFilters(
  locale: TFiltersLocale = DEFAULT_FILTERS_LOCALE
): Promise<TQuickFiltersResponse> {
  const { data } = await apiClient.get<TQuickFiltersResponse>(API_ENDPOINTS.FILTERS.QUICK, {
    params: { locale },
  });
  return data;
}
