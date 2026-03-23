import type { ActiveFilters, AllFilters, SortOption } from '../../types';
import type { TFiltersResponse, TSearchFilmsParams } from '@common/types';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

import { DEFAULT_ACTIVE_FILTERS, DEFAULT_ALL_FILTERS } from '../../types';
import { parseFiltersFromURL } from '../utils';

export const useFilters = () => {
  const searchParams = useSearchParams();

  // Инициализируем фильтры из URL синхронно
  const initialFilters = parseFiltersFromURL(searchParams);
  const hasUrlFilters =
    JSON.stringify(initialFilters) !== JSON.stringify(DEFAULT_ACTIVE_FILTERS);

  const [allFilters, setAllFilters] = useState<AllFilters>(DEFAULT_ALL_FILTERS);
  const [selectedFilters, setSelectedFilters] = useState<ActiveFilters>(
    hasUrlFilters ? initialFilters : DEFAULT_ACTIVE_FILTERS
  );
  const [sortValue, setSortValue] = useState<SortOption>('popularity');
  const [loading, setLoading] = useState(false);

  // Загрузка фильтров с сервера
  const fetchFilters = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await apiClient.get<TFiltersResponse>(
        API_ENDPOINTS.FILTERS.ROOT
      );

      const filters: AllFilters = {
        ...DEFAULT_ALL_FILTERS,
        genres: data.genres || [],
        countries:
          data.countries?.map((item) => ({
            nameRu: item.countryName,
            nameEn: item.countryNameEn ?? '',
          })) || [],
        years: data.years?.reverse() || [],
      };

      setAllFilters(filters);
    } catch (error) {
      console.error('Ошибка загрузки фильтров:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Проверка на пустые фильтры
  const isEmptyFilters = useCallback(() => {
    return (
      JSON.stringify(selectedFilters) === JSON.stringify(DEFAULT_ACTIVE_FILTERS)
    );
  }, [selectedFilters]);

  // Сброс фильтров
  const resetFilters = useCallback(() => {
    setSelectedFilters(DEFAULT_ACTIVE_FILTERS);
  }, []);

  // Построение параметров для API
  const buildFilterParams = useCallback(
    (
      filters: ActiveFilters,
      page: number = 1,
      limit: number = 35,
      sort: SortOption = sortValue
    ): TSearchFilmsParams => {
      const persons: string[] = [];
      if (filters.producer) persons.push(filters.producer);
      if (filters.actor) persons.push(filters.actor);

      // Конвертируем year в number если это строка
      let year: number | undefined;
      if (filters.years) {
        year =
          typeof filters.years === 'string'
            ? parseInt(filters.years, 10)
            : filters.years;
      }

      const params: TSearchFilmsParams = {
        perPage: limit,
        page,
        genres: filters.genres.length > 0 ? filters.genres : undefined,
        countries: filters.countries.length > 0 ? filters.countries : undefined,
        year,
        persons: persons.length > 0 ? persons : undefined,
        minRatingKp: filters.rating || undefined,
        minVotesKp: filters.grade || undefined,
        sortBy: sort,
      };

      return params;
    },
    [sortValue]
  );

  // Обновление фильтров
  const updateFilters = useCallback((updates: Partial<ActiveFilters>) => {
    setSelectedFilters((prev) => ({ ...prev, ...updates }));
  }, []);

  // Загрузка фильтров при монтировании
  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  return {
    allFilters,
    selectedFilters,
    sortValue,
    loading,
    isEmptyFilters: isEmptyFilters(),
    setSortValue,
    updateFilters,
    resetFilters,
    buildFilterParams,
    fetchFilters,
  };
};
