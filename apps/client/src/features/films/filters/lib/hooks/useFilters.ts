import { useState, useEffect, useCallback } from 'react';
import { ActiveFilters, AllFilters, SortOption, DEFAULT_ACTIVE_FILTERS, DEFAULT_ALL_FILTERS } from '../../types/filters';
import { SearchFilmsParams } from '@/shared/api/services';
import apiClient from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/api/endpoints';

export const useFilters = () => {
  const [allFilters, setAllFilters] = useState<AllFilters>(DEFAULT_ALL_FILTERS);
  const [selectedFilters, setSelectedFilters] = useState<ActiveFilters>(DEFAULT_ACTIVE_FILTERS);
  const [sortValue, setSortValue] = useState<SortOption>('popularity');
  const [loading, setLoading] = useState(false);

  // Загрузка фильтров с сервера
  const fetchFilters = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get(API_ENDPOINTS.FILTERS.ROOT);

      const filters: AllFilters = {
        ...DEFAULT_ALL_FILTERS,
        genres: data.genres || [],
        countries:
          data.countries?.map((item: any) => ({
            nameRu: item.countryName,
            nameEn: item.countryNameEn,
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
    return JSON.stringify(selectedFilters) === JSON.stringify(DEFAULT_ACTIVE_FILTERS);
  }, [selectedFilters]);

  // Сброс фильтров
  const resetFilters = useCallback(() => {
    setSelectedFilters(DEFAULT_ACTIVE_FILTERS);
  }, []);

  // Получение параметров для API
  const getFilterParams = useCallback((page: number = 1, limit: number = 35): SearchFilmsParams => {
    const persons: string[] = [];
    if (selectedFilters.producer) persons.push(selectedFilters.producer);
    if (selectedFilters.actor) persons.push(selectedFilters.actor);

    // Конвертируем year в number если это строка
    let year: number | undefined;
    if (selectedFilters.years) {
      year = typeof selectedFilters.years === 'string' 
        ? parseInt(selectedFilters.years, 10) 
        : selectedFilters.years;
    }

    return {
      perPage: limit,
      page,
      genres: selectedFilters.genres.length > 0 ? selectedFilters.genres : undefined,
      countries: selectedFilters.countries.length > 0 ? selectedFilters.countries : undefined,
      year,
      persons: persons.length > 0 ? persons : undefined,
      minRatingKp: selectedFilters.rating || undefined,
      minVotesKp: selectedFilters.grade || undefined,
      sortBy: sortValue
    };
  }, [selectedFilters, sortValue]);

  // Обновление фильтров
  const updateFilters = useCallback((updates: Partial<ActiveFilters>) => {
    setSelectedFilters(prev => ({ ...prev, ...updates }));
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
    getFilterParams,
    fetchFilters
  };
};
