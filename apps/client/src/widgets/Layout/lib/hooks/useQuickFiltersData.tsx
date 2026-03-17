import { useEffect, useState } from "react";
import { TCountryBased, TGenreBased } from "@common/types";

import apiClient from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

//TODO: на сервере нужно написать единый эндпойнт по получению qickFilters и чтоб
// там было оптимизированно и выдавало нарезанный данные, а не слайсить данные
// на фронте в хуке useQuickFiltersList

/**
 * Состояние dropdown данных
 */
interface DropdownData {
  genres: TGenreBased[];
  countries: TCountryBased[];
  years: number[];
}

interface DropdownState extends DropdownData {
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
  genres: { data: null, promise: null } as CacheEntry<TGenreBased[]>,
  countries: { data: null, promise: null } as CacheEntry<TCountryBased[]>,
  years: { data: null, promise: null } as CacheEntry<number[]>,
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
 * Загрузка жанров
 */
function fetchGenres() {
  return fetchWithCache(cache.genres, async () => {
    const res = await apiClient.get(API_ENDPOINTS.GENRES.LIST);
    return Array.isArray(res.data) ? res.data : [];
  });
}

/**
 * Загрузка стран
 */
function fetchCountries() {
  return fetchWithCache(cache.countries, async () => {
    const res = await apiClient.get(API_ENDPOINTS.COUNTRIES.LIST);
    return Array.isArray(res.data) ? res.data : [];
  });
}

/**
 * Загрузка годов
 */
function fetchYears() {
  return fetchWithCache(cache.years, async () => {
    const res = await apiClient.get(API_ENDPOINTS.FILTERS.ROOT);

    const years = res.data?.years ?? [];

    return Array.isArray(years)
      ? [...years].sort((a, b) => b - a).slice(0, 10)
      : [];
  });
}

/**
 * Хук загрузки данных для dropdown фильтров
 *
 * Особенности:
 * - in-memory кеш
 * - дедупликация запросов
 * - параллельная загрузка
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
        const [genres, countries, years] = await Promise.all([
          fetchGenres(),
          fetchCountries(),
          fetchYears(),
        ]);

        if (ignore) return;

        setState({
          genres,
          countries,
          years,
          isLoading: false,
          isError: false,
        });
      } catch (e) {
        console.error("Dropdown data load error:", e);

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