import type { TCountryBased } from "../country";
import type { TGenreBased } from "../genre";

/** Элемент жанра для dropdown быстрых фильтров (минимальный набор полей). */
export type TGenreQuickFilterItem = Pick<
  TGenreBased,
  "nameRu" | "nameEn"
>;

/** Элемент страны для dropdown быстрых фильтров (минимальный набор полей). */
export type TCountryQuickFilterItem = Pick<
  TCountryBased,
  "countryName" | "countryNameEn"
>;

/** Ответ BFF для Header: жанры, страны и годы без лишних полей. */
export interface TQuickFiltersResponse {
  genres: TGenreQuickFilterItem[];
  countries: TCountryQuickFilterItem[];
  years: number[];
}
