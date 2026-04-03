'use client';

import type { TQickFilter } from '../../models';
import type { TGenreItemResponse } from '@common/types';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useMemo, useCallback } from 'react';
import { useContext } from 'react';

import { QuickFiltersContext } from '../../models';

/**
 * Хук для подготовки списка быстрых фильтров с данными и экшенами для dropdown.
 * Данные берутся из контекста `QuickFiltersContext`.
 */
export const useQuickFiltersList = (onClose: () => void): TQickFilter[] => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ctx = useContext(QuickFiltersContext);

  const state = ctx
    ? {
        genres: ctx.genres,
        countries: ctx.countries,
        years: ctx.years,
        isLoading: false,
        isError: false,
      }
    : {
        genres: [],
        countries: [],
        years: [],
        isLoading: false,
        isError: true,
      };

  const isOnFilmsPage = pathname === '/films';

  const genreMap = useMemo(() => {
    const map = new Map<string, TGenreItemResponse>();
    state.genres.forEach((g) => map.set(g.nameEn || g.nameRu, g));
    return map;
  }, [state.genres]);

  /**
   * Обновление query параметров страницы фильмов
   */
  const updateQueryParams = useCallback(
    (updates: Record<string, string | null>, clearOthers = false) => {
      if (!isOnFilmsPage) return;

      const params = clearOthers
        ? new URLSearchParams()
        : new URLSearchParams(searchParams?.toString() || '');

      Object.entries(updates).forEach(([key, value]) => {
        if (!value) params.delete(key);
        else params.set(key, value);
      });

      const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname || '/films';

      router.replace(newUrl, { scroll: false });

      onClose();
    },
    [router, pathname, searchParams, isOnFilmsPage, onClose]
  );

  /**
   * Универсальный обработчик фильтров
   */
  const handleFilterClick = useCallback(
    (key: 'genres' | 'countries' | 'years', value: string) => {
      if (isOnFilmsPage) {
        if (key === 'years') {
          const fromYears = searchParams?.get('years')?.split(',').filter(Boolean) ?? [];
          const legacyYear = searchParams?.get('year');
          const current = fromYears.length > 0 ? fromYears : legacyYear ? [legacyYear] : [];
          const isSelected = current.length === 1 && current[0] === value;

          updateQueryParams({ years: isSelected ? null : value }, true);
          return;
        }

        const current = searchParams?.get(key)?.split(',').filter(Boolean) || [];

        const isSelected = current.length === 1 && current[0] === value;

        updateQueryParams({ [key]: isSelected ? null : value }, true);
      } else {
        const params = new URLSearchParams();
        if (key === 'years') {
          params.set('years', value);
        } else {
          params.set(key, value);
        }

        router.push(`/films?${params.toString()}`);
        onClose();
      }
    },
    [searchParams, updateQueryParams, isOnFilmsPage, router, onClose]
  );

  const items: TQickFilter[] = useMemo(
    () => [
      { type: 'heading', label: 'Жанры' },

      ...state.genres.map((g) => ({
        type: 'item' as const,
        label: g.nameRu,
        onClick: () =>
          handleFilterClick('genres', genreMap.get(g.nameEn || g.nameRu)?.nameRu || g.nameRu),
      })),

      { type: 'heading', label: 'Страны' },

      ...state.countries.map((c) => ({
        type: 'item' as const,
        label: c.countryName,
        onClick: () => handleFilterClick('countries', c.countryName),
      })),

      { type: 'heading', label: 'Годы' },

      ...state.years.map((year) => ({
        type: 'item' as const,
        label: year,
        key: year,
        onClick: () => handleFilterClick('years', String(year)),
      })),
    ],
    [state.genres, state.countries, state.years, handleFilterClick, genreMap]
  );

  return items;
};
