import { TGenreBased, TCountryBased } from '@common/types';
import apiClient from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/api/endpoints';

interface DropdownCache {
  genres: {
    data: TGenreBased[];
    loading: boolean;
    loaded: boolean;
  };
  countries: {
    data: TCountryBased[];
    loading: boolean;
    loaded: boolean;
  };
  years: {
    data: number[];
    loading: boolean;
    loaded: boolean;
  };
}

const cache: DropdownCache = {
  genres: {
    data: [],
    loading: false,
    loaded: false,
  },
  countries: {
    data: [],
    loading: false,
    loaded: false,
  },
  years: {
    data: [],
    loading: false,
    loaded: false,
  },
};

export const dropdownCache = {
  // Получить жанры (загрузить если еще не загружены)
  async getGenres(): Promise<TGenreBased[]> {
    if (cache.genres.loaded) {
      return cache.genres.data;
    }

    if (cache.genres.loading) {
      // Ждем завершения текущей загрузки
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (cache.genres.loaded) {
            clearInterval(checkInterval);
            resolve(cache.genres.data);
          }
        }, 50);
      });
    }

    cache.genres.loading = true;

    try {
      const response = await apiClient.get(API_ENDPOINTS.GENRES.LIST);
      cache.genres.data = Array.isArray(response.data) ? response.data : [];
      cache.genres.loaded = true;
      return cache.genres.data;
    } catch (err) {
      console.error('Error fetching genres:', err);
      cache.genres.data = [];
      cache.genres.loaded = true;
      return [];
    } finally {
      cache.genres.loading = false;
    }
  },

  // Получить страны (загрузить если еще не загружены)
  async getCountries(): Promise<TCountryBased[]> {
    if (cache.countries.loaded) {
      return cache.countries.data;
    }

    if (cache.countries.loading) {
      // Ждем завершения текущей загрузки
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (cache.countries.loaded) {
            clearInterval(checkInterval);
            resolve(cache.countries.data);
          }
        }, 50);
      });
    }

    cache.countries.loading = true;

    try {
      const response = await apiClient.get(API_ENDPOINTS.COUNTRIES.LIST);
      cache.countries.data = Array.isArray(response.data) ? response.data : [];
      cache.countries.loaded = true;
      return cache.countries.data;
    } catch (err) {
      console.error('Error fetching countries:', err);
      cache.countries.data = [];
      cache.countries.loaded = true;
      return [];
    } finally {
      cache.countries.loading = false;
    }
  },

  // Получить годы (загрузить если еще не загружены)
  async getYears(): Promise<number[]> {
    if (cache.years.loaded) {
      return cache.years.data;
    }

    if (cache.years.loading) {
      // Ждем завершения текущей загрузки
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (cache.years.loaded) {
            clearInterval(checkInterval);
            resolve(cache.years.data);
          }
        }, 50);
      });
    }

    cache.years.loading = true;

    try {
      const response = await apiClient.get(API_ENDPOINTS.FILTERS.ROOT);
      const yearsData = response.data?.years || [];
      const sortedYears = Array.isArray(yearsData)
        ? [...yearsData].sort((a, b) => b - a).slice(0, 10)
        : [];
      cache.years.data = sortedYears;
      cache.years.loaded = true;
      return cache.years.data;
    } catch (err) {
      console.error('Error fetching years:', err);
      cache.years.data = [];
      cache.years.loaded = true;
      return [];
    } finally {
      cache.years.loading = false;
    }
  },

  // Проверить, загружены ли данные
  isGenresLoaded(): boolean {
    return cache.genres.loaded;
  },

  isCountriesLoaded(): boolean {
    return cache.countries.loaded;
  },

  isYearsLoaded(): boolean {
    return cache.years.loaded;
  },
};

