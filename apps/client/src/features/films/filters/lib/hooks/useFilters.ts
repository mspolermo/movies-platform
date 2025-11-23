import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { ActiveFilters, AllFilters, SortOption, DEFAULT_ACTIVE_FILTERS, DEFAULT_ALL_FILTERS } from '../../types/filters';
import { SearchFilmsParams } from '@/shared/api/services';
import apiClient from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/api/endpoints';

// Функция для парсинга фильтров из URL
const parseFiltersFromURL = (searchParams: URLSearchParams | null): ActiveFilters => {
  const filters: ActiveFilters = { ...DEFAULT_ACTIVE_FILTERS };
  
  if (!searchParams) return filters;
  
  const genres = searchParams.get('genres');
  if (genres) {
    filters.genres = genres.split(',').filter(Boolean);
  }
  
  const countries = searchParams.get('countries');
  if (countries) {
    filters.countries = countries.split(',').filter(Boolean);
  }
  
  const year = searchParams.get('year');
  if (year) {
    const yearNum = parseInt(year, 10);
    if (!isNaN(yearNum)) {
      filters.years = yearNum;
    }
  }
  
  const rating = searchParams.get('rating');
  if (rating) {
    const ratingNum = parseFloat(rating);
    if (!isNaN(ratingNum)) {
      filters.rating = ratingNum;
    }
  }
  
  const grade = searchParams.get('grade');
  if (grade) {
    const gradeNum = parseFloat(grade);
    if (!isNaN(gradeNum)) {
      filters.grade = gradeNum;
    }
  }
  
  const producer = searchParams.get('producer');
  if (producer) {
    filters.producer = producer;
  }
  
  const actor = searchParams.get('actor');
  if (actor) {
    filters.actor = actor;
  }
  
  return filters;
};

export const useFilters = () => {
  const searchParams = useSearchParams();
  
  // Инициализируем фильтры из URL синхронно
  const initialFilters = parseFiltersFromURL(searchParams);
  const hasUrlFilters = JSON.stringify(initialFilters) !== JSON.stringify(DEFAULT_ACTIVE_FILTERS);
  
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

  // Построение параметров для API
  const buildFilterParams = useCallback((
    filters: ActiveFilters,
    page: number = 1,
    limit: number = 35,
    sort: SortOption = sortValue
  ): SearchFilmsParams => {
    const persons: string[] = [];
    if (filters.producer) persons.push(filters.producer);
    if (filters.actor) persons.push(filters.actor);

    // Конвертируем year в number если это строка
    let year: number | undefined;
    if (filters.years) {
      year = typeof filters.years === 'string' 
        ? parseInt(filters.years, 10) 
        : filters.years;
    }

    const params: SearchFilmsParams = {
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
  }, [sortValue]);

  // Получение параметров для текущего состояния
  const getFilterParams = useCallback((page: number = 1, limit: number = 35) => {
    return buildFilterParams(selectedFilters, page, limit);
  }, [buildFilterParams, selectedFilters]);

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
    buildFilterParams,
    fetchFilters
  };
};
