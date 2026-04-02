import type { TFilmsFilters } from "../../types";
import type { TSearchParams } from "@/shared/types";
import type { TFilmSortBy } from "@common/types";

import { isSortOption } from "@/shared/lib";

import { DEFAULT_FILTERS } from "../../types";

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

  const yearRaw = searchParams.get('year')?.split(',').filter(Boolean)[0];
  const yearParsed = yearRaw ? parseInt(yearRaw, 10) : NaN;
  const year: number | null = Number.isFinite(yearParsed) ? yearParsed : null;

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
    year,
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
const parseSortFromURL = (
  searchParams: URLSearchParams | null
): TFilmSortBy => {
  const DEFAULT_SORT: TFilmSortBy = 'popularity';
  if (!searchParams) return DEFAULT_SORT;

  const rawSort = searchParams.get('sort');
  if (!rawSort) return DEFAULT_SORT;

  return isSortOption(rawSort) ? rawSort : DEFAULT_SORT;
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
export const parseSettingsFromNextSearchParams = (
  searchParams: TSearchParams
) => {
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