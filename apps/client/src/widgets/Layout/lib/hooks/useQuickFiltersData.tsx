import type { TQuickFiltersResponse } from '@common/types';

import { useEffect, useState } from 'react';

import { getQuickFilters } from '../utils';

interface DropdownState extends TQuickFiltersResponse {
  isLoading: boolean;
  isError: boolean;
}

/**
 * Элемент кеша
 */
type CacheEntry<T> = {
  data: T | null;
  promise: Promise<T> | null;
};

/**
 * In-memory cache между рендерами
 */
const cache = {
  quick: { data: null, promise: null } as CacheEntry<TQuickFiltersResponse>,
};

/**
 * Универсальная функция загрузки с кешированием и дедупликацией
 */
async function fetchWithCache<T>(
  entry: CacheEntry<T>,
  request: () => Promise<T>
): Promise<T> {
  if (entry.data) {
    return entry.data;
  }

  if (entry.promise) {
    return entry.promise;
  }

  entry.promise = request()
    .then((data) => {
      entry.data = data;
      return data;
    })
    .finally(() => {
      entry.promise = null;
    });

  return entry.promise;
}

/**
 * Загрузка данных quick filters одним запросом (BFF агрегирует и режет лимиты).
 */
function fetchQuickFilters() {
  return fetchWithCache(cache.quick, () => getQuickFilters());
}

/**
 * Хук загрузки данных для dropdown фильтров
 *
 * Особенности:
 * - in-memory кеш
 * - дедупликация запросов
 * - защита от setState после unmount
 */
export function useQuickFiltersData(): DropdownState {
  const [state, setState] = useState<DropdownState>({
    genres: [],
    countries: [],
    years: [],
    isLoading: true,
    isError: false,
  });

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const { genres, countries, years } = await fetchQuickFilters();

        if (ignore) return;

        setState({
          genres,
          countries,
          years,
          isLoading: false,
          isError: false,
        });
      } catch (e) {
        console.error('Dropdown data load error:', e);

        if (ignore) return;

        setState((prev) => ({
          ...prev,
          isLoading: false,
          isError: true,
        }));
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, []);

  return state;
}
