import { FilmDto } from "../dto/film.dto";
import { Genre, Person } from "@common/types";

/**
 * Результат поиска по фильмам, людям и жанрам
 */
export interface SearchResult {
  /** Найденные фильмы */
  films: FilmDto[];
  /** Найденные люди */
  persons: Person[];
  /** Найденные жанры */
  genres: Genre[];
}
