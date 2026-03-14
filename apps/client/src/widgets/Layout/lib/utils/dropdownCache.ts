import { TGenreBased, TCountryBased } from '@common/types';
import apiClient from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/api/endpoints';

interface CacheEntry<T> {
  data: T;
  loaded: boolean;
  promise?: Promise<T>;
}

const cache = {
  genres: { data: [] as TGenreBased[], loaded: false } as CacheEntry<TGenreBased[]>,
  countries: { data: [] as TCountryBased[], loaded: false } as CacheEntry<TCountryBased[]>,
  years: { data: [] as number[], loaded: false } as CacheEntry<number[]>,
};

export const dropdownCache = {
  async getGenres(): Promise<TGenreBased[]> {
    if (cache.genres.loaded) return cache.genres.data;
    if (cache.genres.promise) return cache.genres.promise;

    cache.genres.promise = apiClient
      .get(API_ENDPOINTS.GENRES.LIST)
      .then((res) => {
        cache.genres.data = Array.isArray(res.data) ? res.data : [];
        cache.genres.loaded = true;
        return cache.genres.data;
      })
      .catch((err) => {
        console.error('Error fetching genres:', err);
        cache.genres.data = [];
        cache.genres.loaded = true;
        return [];
      });

    return cache.genres.promise;
  },

  async getCountries(): Promise<TCountryBased[]> {
    if (cache.countries.loaded) return cache.countries.data;
    if (cache.countries.promise) return cache.countries.promise;

    cache.countries.promise = apiClient
      .get(API_ENDPOINTS.COUNTRIES.LIST)
      .then((res) => {
        cache.countries.data = Array.isArray(res.data) ? res.data : [];
        cache.countries.loaded = true;
        return cache.countries.data;
      })
      .catch((err) => {
        console.error('Error fetching countries:', err);
        cache.countries.data = [];
        cache.countries.loaded = true;
        return [];
      });

    return cache.countries.promise;
  },

  async getYears(): Promise<number[]> {
    if (cache.years.loaded) return cache.years.data;
    if (cache.years.promise) return cache.years.promise;

    cache.years.promise = apiClient
      .get(API_ENDPOINTS.FILTERS.ROOT)
      .then((res) => {
        const yearsData = res.data?.years || [];
        cache.years.data = Array.isArray(yearsData)
          ? [...yearsData].sort((a, b) => b - a).slice(0, 10)
          : [];
        cache.years.loaded = true;
        return cache.years.data;
      })
      .catch((err) => {
        console.error('Error fetching years:', err);
        cache.years.data = [];
        cache.years.loaded = true;
        return [];
      });

    return cache.years.promise;
  },

  isGenresLoaded: () => cache.genres.loaded,
  isCountriesLoaded: () => cache.countries.loaded,
  isYearsLoaded: () => cache.years.loaded,
};