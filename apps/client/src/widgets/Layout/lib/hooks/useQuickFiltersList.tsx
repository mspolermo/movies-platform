import type { TQickFilter } from '../../models';
import type { TGenreBased } from '@common/types';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useMemo, useCallback } from 'react';

import { useQuickFiltersData } from './useQuickFiltersData';

/**
 * Хук для подготовки списка быстрых фильтров с данными и экшенами для dropdown.
 */
export const useQuickFiltersList = (onClose: () => void): TQickFilter[] => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const state = useQuickFiltersData();

  const isOnFilmsPage = pathname === '/films';

  const genreMap = useMemo(() => {
    const map = new Map<string, TGenreBased>();
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

      const newUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname || '/films';

      router.replace(newUrl, { scroll: false });

      onClose();
    },
    [router, pathname, searchParams, isOnFilmsPage, onClose]
  );

  /**
   * Универсальный обработчик фильтров
   */
  const handleFilterClick = useCallback(
    (key: 'genres' | 'countries' | 'year', value: string) => {
      if (isOnFilmsPage) {
        const current =
          searchParams?.get(key)?.split(',').filter(Boolean) || [];

        const isSelected =
          key === 'year'
            ? searchParams?.get('year') === value
            : current.length === 1 && current[0] === value;

        updateQueryParams({ [key]: isSelected ? null : value }, true);
      } else {
        const params = new URLSearchParams();
        params.set(key, value);

        router.push(`/films?${params.toString()}`);
        onClose();
      }
    },
    [searchParams, updateQueryParams, isOnFilmsPage, router, onClose]
  );

  const items: TQickFilter[] = useMemo(
    () => [
      { type: 'heading', label: 'Жанры' },

      ...state.genres.slice(0, 30).map((g) => ({
        type: 'item' as const,
        label: g.nameRu,
        key: g.id,
        onClick: () =>
          handleFilterClick(
            'genres',
            genreMap.get(g.nameEn || g.nameRu)?.nameRu || g.nameRu
          ),
      })),

      { type: 'heading', label: 'Страны' },

      ...state.countries.slice(0, 20).map((c) => ({
        type: 'item' as const,
        label: c.countryName,
        key: c.id,
        onClick: () => handleFilterClick('countries', c.countryName),
      })),

      { type: 'heading', label: 'Годы' },

      ...state.years.map((year) => ({
        type: 'item' as const,
        label: year,
        key: year,
        onClick: () => handleFilterClick('year', String(year)),
      })),
    ],
    [state.genres, state.countries, state.years, handleFilterClick, genreMap]
  );

  return items;
};
