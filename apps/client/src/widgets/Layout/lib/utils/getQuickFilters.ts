import type { TFiltersLocale, TQuickFiltersResponse } from '@common/types';

import { unstable_cache } from 'next/cache';

import apiClient, { API_ENDPOINTS } from '@/shared/api';
import { DEFAULT_FILTERS_LOCALE, DEFAULT_REVALIDATE_SECONDS } from '@/shared/constants';

/** Запрос быстрых фильтров (жанры / страны / годы) для хедера. Без кэша. */
const fetchQuickFilters = async (locale: TFiltersLocale): Promise<TQuickFiltersResponse> => {
  const { data } = await apiClient.get<TQuickFiltersResponse>(API_ENDPOINTS.FILTERS.QUICK, {
    params: { locale },
  });
  return data;
};

/**
 * Быстрые фильтры для хедера.
 * Результат кэшируется (`unstable_cache`); ключ зависит от locale.
 */
export async function getQuickFilters(
  locale: TFiltersLocale = DEFAULT_FILTERS_LOCALE
): Promise<TQuickFiltersResponse> {
  return unstable_cache(() => fetchQuickFilters(locale), ['quick-filters', 'v1', locale], {
    revalidate: DEFAULT_REVALIDATE_SECONDS,
  })();
}
