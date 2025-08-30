import { PersonDto } from "../dto/person.dto";
import { FilmDto } from "../dto/film.dto";
import { Genre } from "@common/types";

/**
 * Результат поиска по фильмам, людям и жанрам
 */
export interface SearchResult {
  /** Найденные фильмы */
  films: FilmDto[];
  /** Найденные люди */
  people: PersonDto[];
  /** Найденные жанры */
  genres: Genre[];
}
