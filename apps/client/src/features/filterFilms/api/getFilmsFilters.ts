'use server';

import type { TFiltersLocale, TFiltersResponse } from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';
import { DEFAULT_FILTERS_LOCALE } from '@/shared/constants';

/**
 * Полный каталог фильтров для страницы «Фильмы» (жанры, страны, годы).
 */
export const getFilmsFilters = async (
  locale: TFiltersLocale = DEFAULT_FILTERS_LOCALE
): Promise<TFiltersResponse | null> => {
  try {
    const { data } = await apiClient.get<TFiltersResponse>(API_ENDPOINTS.FILTERS.ROOT, {
      params: { locale },
    });

    return data;
  } catch {
    return null;
  }
};
