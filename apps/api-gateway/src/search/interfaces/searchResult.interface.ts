import { FilmDto } from "../dto/film.dto";
import { TGenreBased, TPersonBased } from "@common/types";

/**
 * Результат поиска по фильмам, людям и жанрам
 */
export interface SearchResult {
  /** Найденные фильмы */
  films: FilmDto[];
  /** Найденные люди */
  persons: TPersonBased[];
  /** Найденные жанры */
  genres: TGenreBased[];
}
