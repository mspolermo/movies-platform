import type { TFilmsFilters } from '../../model';
import type { TSearchParams } from '@/shared/types';
import type { TFilmSortBy } from '@common/types';

import { isSortOption } from '@/shared/lib';

import { DEFAULT_FILM_SORT, DEFAULT_FILTERS } from '../../constants';

/**
 * Функция для парсинга фильтров фильма из URL
 */
const parseFiltersFromURL = (searchParams: URLSearchParams | null): TFilmsFilters => {
  if (!searchParams) return DEFAULT_FILTERS;

  const genres: string[] =
    searchParams
      .get('genres')
      ?.split(',')
      .filter(Boolean)
      .map((g) => g.trim()) || [];

  const countries: string[] =
    searchParams
      .get('countries')
      ?.split(',')
      .filter(Boolean)
      .map((c) => c.trim()) || [];

  const yearsFromParam =
    searchParams
      .get('years')
      ?.split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => Number.isFinite(n)) ?? [];

  const legacyYearRaw = searchParams.get('year')?.split(',').filter(Boolean)[0];
  const legacyYearParsed = legacyYearRaw ? parseInt(legacyYearRaw, 10) : NaN;
  const years: number[] =
    yearsFromParam.length > 0
      ? yearsFromParam
      : Number.isFinite(legacyYearParsed)
        ? [legacyYearParsed]
        : [];

  const rating: TFilmsFilters['rating'] = searchParams.get('rating')
    ? parseFloat(searchParams.get('rating')!)
    : 0;
  const grade: TFilmsFilters['grade'] = searchParams.get('grade')
    ? parseFloat(searchParams.get('grade')!)
    : 0;

  const producer: TFilmsFilters['producer'] = searchParams.get('producer') || '';
  const actor: TFilmsFilters['actor'] = searchParams.get('actor') || '';

  return {
    genres,
    countries,
    years,
    rating,
    grade,
    producer,
    actor,
  };
};

/**
 * Извлекает и валидирует параметр сортировки из URLSearchParams.
 * Возвращает дефолтное значение, если параметр отсутствует или некорректен.
 */
const parseSortFromURL = (searchParams: URLSearchParams | null): TFilmSortBy => {
  if (!searchParams) return DEFAULT_FILM_SORT;

  const rawSort = searchParams.get('sort');
  if (!rawSort) return DEFAULT_FILM_SORT;

  return isSortOption(rawSort) ? rawSort : DEFAULT_FILM_SORT;
};

/**
 * Извлекает и валидирует параметры фильтров и сортировки из URLSearchParams.
 * Возвращает дефолтные значения, если параметры отсутствуют или некорректны.
 */
export const parseSettingsFromURL = (searchParams: URLSearchParams | null) => ({
  filters: parseFiltersFromURL(searchParams),
  sort: parseSortFromURL(searchParams),
});

/**
 * Парсит searchParams из Next.js в настройки страницы (через URLSearchParams).
 */
export const parseSettingsFromNextSearchParams = (searchParams: TSearchParams) => {
  const urlSearchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (value == null) continue;

    if (Array.isArray(value)) {
      for (const v of value) {
        urlSearchParams.append(key, v);
      }
    } else {
      urlSearchParams.set(key, value);
    }
  }

  return parseSettingsFromURL(urlSearchParams);
};
