import type { TFiltersResponse } from '@common/types';

/** Списки опций с API (жанры / страны / доступные годы). */
export type TAllFilmsFilters = TFiltersResponse & {
  rating: number;
  grade: number;
  producer: string;
  actor: string;
};

/**
 * Выбранные пользователем значения: строки совпадают с API/URL (`genres`, `countries`),
 * годы — список лет премьеры (как OR в запросе).
 */
export type TFilmsFilters = {
  genres: string[];
  countries: string[];
  years: number[];
  rating: number;
  grade: number;
  producer: string;
  actor: string;
};

export const DEFAULT_ALL_FILTERS: TAllFilmsFilters = {
  genres: [],
  countries: [],
  years: [],
  rating: 0,
  grade: 0,
  producer: '',
  actor: '',
};

export const DEFAULT_FILTERS: TFilmsFilters = {
  genres: [],
  countries: [],
  years: [],
  rating: 0,
  grade: 0,
  producer: '',
  actor: '',
};
