import type { TCountryListItemResponse } from "./country";
import type { TGenreListItemResponse } from "./genre";

/** Ответ API для фильтров. */
export interface TFiltersResponse {
  genres: TGenreListItemResponse[];
  countries: TCountryListItemResponse[];
  years: number[];
}

/** Ответ API для быстрых фильтров (жанры, страны, годы). */
export interface TQuickFiltersResponse {
  genres: TGenreListItemResponse[];
  countries: TCountryListItemResponse[];
  years: number[];
}
