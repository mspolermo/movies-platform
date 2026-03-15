import { TGenreBased, TCountryBased } from '@common/types';
import apiClient from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/api/endpoints';

/**
 * Элемент кеша для любого типа данных.
 *
 * data    — сохранённые данные
 * loaded  — флаг что запрос уже был выполнен
 * promise — текущий выполняющийся запрос (для дедупликации)
 */
interface CacheEntry<T> {
  data: T;
  loaded: boolean;
  promise?: Promise<T>;
}

/**
 * Общий in-memory кеш для данных dropdown.
 * Используется между рендерами и вызовами хука.
 */
const cache = {
  genres: { data: [] as TGenreBased[], loaded: false } as CacheEntry<TGenreBased[]>,
  countries: { data: [] as TCountryBased[], loaded: false } as CacheEntry<TCountryBased[]>,
  years: { data: [] as number[], loaded: false } as CacheEntry<number[]>,
};

/**
 * Универсальная функция загрузки данных с кешированием.
 *
 * Возможности:
 * - предотвращает повторные запросы
 * - переиспользует текущий Promise
 * - сохраняет результат в память
 */
async function fetchWithCache<T>(
  entry: CacheEntry<T>,
  request: () => Promise<T>
): Promise<T> {
  // Если данные уже загружены — возвращаем кеш
  if (entry.loaded) {
    return entry.data;
  }

  // Если запрос уже выполняется — возвращаем тот же Promise
  if (entry.promise) {
    return entry.promise;
  }

  entry.promise = request()
    .then((data) => {
      entry.data = data;
      entry.loaded = true;
      return entry.data;
    })
    .catch((err) => {
      console.error('Dropdown cache fetch error:', err);

      // Помечаем как загруженное, чтобы не делать бесконечные ретраи
      entry.loaded = true;

      return entry.data;
    });

  return entry.promise;
}

/**
 * Кеш-слой для данных dropdown фильтров.
 */
export const dropdownCache = {
  /**
   * Получить список жанров.
   */
  getGenres() {
    return fetchWithCache(cache.genres, async () => {
      const res = await apiClient.get(API_ENDPOINTS.GENRES.LIST);

      return Array.isArray(res.data) ? res.data : [];
    });
  },

  /**
   * Получить список стран.
   */
  getCountries() {
    return fetchWithCache(cache.countries, async () => {
      const res = await apiClient.get(API_ENDPOINTS.COUNTRIES.LIST);

      return Array.isArray(res.data) ? res.data : [];
    });
  },

  /**
   * Получить список годов (10 последних).
   */
  getYears() {
    return fetchWithCache(cache.years, async () => {
      const res = await apiClient.get(API_ENDPOINTS.FILTERS.ROOT);

      const years = res.data?.years ?? [];

      return Array.isArray(years)
        ? [...years].sort((a, b) => b - a).slice(0, 10)
        : [];
    });
  },

  /** Проверка загрузки жанров */
  isGenresLoaded: () => cache.genres.loaded,

  /** Проверка загрузки стран */
  isCountriesLoaded: () => cache.countries.loaded,

  /** Проверка загрузки годов */
  isYearsLoaded: () => cache.years.loaded,
};