// Типы для фильтрации фильмов

export interface FilterItem {
  nameRu: string;
  nameEn: string;
}

export interface ActiveFilters {
  genres: string[];
  countries: string[];
  years: number | null | string;
  rating: number;
  grade: number;
  producer: string;
  actor: string;
}

export interface AllFilters {
  genres: FilterItem[];
  countries: FilterItem[];
  years: number[];
  rating: number;
  grade: number;
  producer: string;
  actor: string;
}

export type SortOption = 'popularity' | 'rating' | 'novelty' | 'alphabet';

export const DEFAULT_ACTIVE_FILTERS: ActiveFilters = {
  genres: [],
  countries: [],
  years: '',
  rating: 0,
  grade: 0,
  producer: '',
  actor: '',
};

export const DEFAULT_ALL_FILTERS: AllFilters = {
  genres: [],
  countries: [],
  years: [],
  rating: 0,
  grade: 0,
  producer: '',
  actor: '',
};

export const SORT_OPTIONS: SortOption[] = [
  'popularity',
  'rating',
  'novelty',
  'alphabet',
];
