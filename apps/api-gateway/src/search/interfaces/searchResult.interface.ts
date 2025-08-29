import { GenreDto } from "../dto/genre.dto";
import { PersonDto } from "../dto/person.dto";
import { FilmDto } from "../dto/film.dto";

export interface SearchResult {
  films: FilmDto[];
  people: PersonDto[];
  genres: GenreDto[];
}
