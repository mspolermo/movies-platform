'use server';

import type { TAllFilmsFilters } from '../model';
import type { TFiltersResponse } from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

import { DEFAULT_ALL_FILTERS } from '../model';

//TODO: годы на сервере переворачивать сразу

/**
 * Полный каталог фильтров для страницы «Фильмы» (жанры, страны, годы).
 */
export const getFilmsFilters = async (): Promise<TAllFilmsFilters | null> => {
  try {
    const { data } = await apiClient.get<TFiltersResponse>(API_ENDPOINTS.FILTERS.ROOT);

    return {
      ...DEFAULT_ALL_FILTERS,
      genres: data.genres ?? [],
      countries: data.countries ?? [],
      years: data.years?.slice().reverse() ?? [],
    };
  } catch {
    return null;
  }
};
