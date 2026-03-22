export type { TPageProps } from './next';

import type {
  TGenreBased,
  TCountryBased,
  TFilmBased,
  TProfessionWithPersons,
  TFilmModel,
} from '@common/types';

// Используем общий тип Film из @common
export interface Film extends TFilmBased {
  genres?: TGenreBased[];
  countries?: TCountryBased[];
  professions?: TProfessionWithPersons[];
}

// API типы
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface SearchParams {
  query?: string;
  page?: number;
  limit?: number;
  genre?: number;
  country?: number;
  year?: number;
}

export interface SearchFilmsParams {
  page?: number;
  perPage?: number;
  year?: number;
  genres?: string[];
  countries?: string[];
  persons?: string[];
  minRatingKp?: number;
  minVotesKp?: number;
  sortBy?: string;
}

export interface FilmsResponse {
  films: TFilmModel[];
  total: number;
  page: number;
  perPage: number;
  hasMore: boolean;
}
