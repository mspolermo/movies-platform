'use client';

import type { TFilmsFilters, TUseFiltersOptions, TUseFiltersReturn } from '../../model';
import type { TFilmSortBy, TSearchFilmsParams } from '@common/types';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

import { FILMS_LIST_PER_PAGE } from '../../constants';
import { isEqualFilters, parseSettingsFromURL, serializeFilmsPageQuery } from '../utils';

/**
 * Хук управления фильтрами фильмов с синхронизацией URL.
 *
 * Особенности:
 * - URL является источником истины при внешних изменениях (back/forward, deeplink)
 * - локальный state управляет UI
 * - предотвращает лишние обновления через сравнение query string
 */
export const useFilters = ({
  initialFilters,
  initialSort,
}: TUseFiltersOptions): TUseFiltersReturn => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [selectedFilters, setSelectedFilters] = useState<TFilmsFilters>(initialFilters);
  const [selectedSort, setSelectedSortState] = useState<TFilmSortBy>(initialSort);

  /** защита от лишней синхронизации */
  const prevSearchParamsString = useRef<string>('');

  /** обновление URL */
  const replaceUrl = useCallback(
    (filters: TFilmsFilters, sort: TFilmSortBy) => {
      if (!pathname) return;

      const query = serializeFilmsPageQuery(filters, sort).toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [router, pathname]
  );

  /**
   * Синхронизация state ← URL
   * (back/forward, внешние изменения)
   */
  useEffect(() => {
    if (!searchParams) return;

    const serialized = searchParams.toString();
    if (prevSearchParamsString.current === serialized) return;

    prevSearchParamsString.current = serialized;

    const { filters: fromUrl, sort: sortFromUrl } = parseSettingsFromURL(searchParams);

    setSelectedFilters((prev) => (isEqualFilters(prev, fromUrl) ? prev : fromUrl));
    setSelectedSortState((prev) => (prev === sortFromUrl ? prev : sortFromUrl));
  }, [searchParams]);

  /** сбор параметров для API */
  const buildFilterParams = useCallback(
    (
      filters: TFilmsFilters,
      page = 1,
      limit = FILMS_LIST_PER_PAGE,
      sort: TFilmSortBy = selectedSort
    ): TSearchFilmsParams => {
      const persons = [filters.producer, filters.actor].filter(Boolean) as string[];

      return {
        perPage: limit,
        page,
        genres: filters.genres.length ? filters.genres : undefined,
        countries: filters.countries.length ? filters.countries : undefined,
        years: filters.years.length ? filters.years : undefined,
        persons: persons.length ? persons : undefined,
        minRatingKp: filters.rating || undefined,
        minVotesKp: filters.grade || undefined,
        sortBy: sort,
      };
    },
    [selectedSort]
  );

  /**
   * Обновление фильтров (UI → state → URL)
   */
  const handleUpdateFilters = useCallback(
    (updates: Partial<TFilmsFilters>) => {
      setSelectedFilters((prev) => {
        const next = { ...prev, ...updates };
        replaceUrl(next, selectedSort);
        return next;
      });
    },
    [replaceUrl, selectedSort]
  );

  /**
   * Обновление сортировки (UI → state → URL)
   */
  const setSortValue = useCallback(
    (value: TFilmSortBy) => {
      setSelectedSortState(value);
      replaceUrl(selectedFilters, value);
    },
    [replaceUrl, selectedFilters]
  );

  /** готовые параметры для запроса */
  const searchFilmsParams = useMemo(
    () => buildFilterParams(selectedFilters, 1),
    [selectedFilters, buildFilterParams]
  );

  return {
    selectedFilters,
    selectedSort,
    searchFilmsParams,
    onUpdateSort: setSortValue,
    onUpdateFilters: handleUpdateFilters,
  };
};
