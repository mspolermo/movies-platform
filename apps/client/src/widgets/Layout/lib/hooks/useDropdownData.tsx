import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { TGenreBased, TCountryBased } from '@common/types';
import { dropdownCache } from '../utils';
import { TDropdownElement } from '../../models';



interface DropdownState {
  genres: TGenreBased[];
  countries: TCountryBased[];
  years: number[];
  loading: boolean;
}

export const useDropdownData = (onClose: () => void) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [state, setState] = useState<DropdownState>({
    genres: [],
    countries: [],
    years: [],
    loading: true,
  });

  const isOnFilmsPage = pathname === '/films';

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const [genres, countries, years] = await Promise.all([
        dropdownCache.getGenres(),
        dropdownCache.getCountries(),
        dropdownCache.getYears(),
      ]);

      if (!mounted) return;

      setState({
        genres,
        countries,
        years,
        loading: false,
      });
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const genreMap = useMemo(() => {
    const map = new Map<string, TGenreBased>();
    state.genres.forEach((g) => map.set(g.nameEn || g.nameRu, g));
    return map;
  }, [state.genres]);

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

  const handleGenreClick = useCallback(
    (genreKey: string) => {
      const genre = genreMap.get(genreKey);
      if (!genre) return;

      const genreNameRu = genre.nameRu;

      if (isOnFilmsPage) {
        const current =
          searchParams?.get('genres')?.split(',').filter(Boolean) || [];

        const isSelected = current.length === 1 && current[0] === genreNameRu;

        updateQueryParams({ genres: isSelected ? null : genreNameRu }, true);
      } else {
        const params = new URLSearchParams();
        params.set('genres', genreNameRu);

        router.push(`/films?${params.toString()}`);
        onClose();
      }
    },
    [genreMap, searchParams, updateQueryParams, isOnFilmsPage, router, onClose]
  );

  const handleCountryClick = useCallback(
    (countryName: string) => {
      if (isOnFilmsPage) {
        const current =
          searchParams?.get('countries')?.split(',').filter(Boolean) || [];

        const isSelected = current.length === 1 && current[0] === countryName;

        updateQueryParams({ countries: isSelected ? null : countryName }, true);
      } else {
        const params = new URLSearchParams();
        params.set('countries', countryName);

        router.push(`/films?${params.toString()}`);
        onClose();
      }
    },
    [searchParams, updateQueryParams, isOnFilmsPage, router, onClose]
  );

  const handleYearClick = useCallback(
    (year: string) => {
      if (isOnFilmsPage) {
        const currentYear = searchParams?.get('year');
        const isSelected = currentYear === year;

        updateQueryParams({ year: isSelected ? null : year }, true);
      } else {
        const params = new URLSearchParams();
        params.set('year', year);

        router.push(`/films?${params.toString()}`);
        onClose();
      }
    },
    [searchParams, updateQueryParams, isOnFilmsPage, router, onClose]
  );

  const items: TDropdownElement[] = useMemo(
    () => [
      { type: 'heading', label: 'Жанры' },

      ...state.genres.slice(0, 30).map((g) => ({
        type: 'item' as const,
        label: g.nameRu,
        key: g.id,
        onClick: () => handleGenreClick(g.nameEn || g.nameRu),
      })),

      { type: 'heading', label: 'Страны' },

      ...state.countries.slice(0, 20).map((c) => ({
        type: 'item' as const,
        label: c.countryName,
        key: c.id,
        onClick: () => handleCountryClick(c.countryName),
      })),

      { type: 'heading', label: 'Годы' },

      ...state.years.map((year) => ({
        type: 'item' as const,
        label: year,
        key: year,
        onClick: () => handleYearClick(String(year)),
      })),
    ],
    [state.genres, state.countries, state.years, handleGenreClick, handleCountryClick, handleYearClick]
  );

  return {
    items,
    isLoading: state.loading,
  };
};