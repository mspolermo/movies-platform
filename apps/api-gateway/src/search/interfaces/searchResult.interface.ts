import { TFilmBased, TGenreBased, TPersonBased } from "@common/types";

/**
 * Результат поиска по фильмам, людям и жанрам
 */
export interface SearchResult {
  /** Найденные фильмы */
  films: TFilmBased[];
  /** Найденные люди */
  persons: TPersonBased[];
  /** Найденные жанры */
  genres: TGenreBased[];
}
