import { TFilmBased, TPersonBased } from "@common/types";

/**
 * Результат поиска по фильмам и людям
 */
export interface SearchResult {
  /** Найденные фильмы */
  films: TFilmBased[];
  /** Найденные люди */
  persons: TPersonBased[];
}
