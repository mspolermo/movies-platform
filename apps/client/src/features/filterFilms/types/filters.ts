import type {
  TCountryItemResponse,
  TFiltersResponse,
  TGenreItemResponse,
} from '@common/types';

/** Элемент списка в чекбоксах жанров / стран. */
export type FilterItem = TGenreItemResponse | TCountryItemResponse;

/** Списки опций с API (жанры / страны / доступные годы). */
export type TAllFilmsFilters = TFiltersResponse & {
  rating: number;
  grade: number;
  producer: string;
  actor: string;
};

/**
 * Выбранные пользователем значения: строки совпадают с API/URL (`genres`, `countries`),
 * год — одно число или null.
 */
export type TFilmsFilters = {
  genres: string[];
  countries: string[];
  year: number | null;
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
  year: null,
  rating: 0,
  grade: 0,
  producer: '',
  actor: '',
};
