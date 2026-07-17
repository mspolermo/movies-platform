import { TFilmSortBy } from "@common/types";

export const FILM_CARD_ATTRIBUTES = [
  "id",
  "filmNameRu",
  "filmNameEn",
  "bigPictureUrl",
  "smallPictureUrl",
  "ratingKp",
  "year",
  "premiereCountry",
  "movieLength",
] as const;

//TODO: переделать колонки 

/**
 * Физические колонки junction `_FilmToGenre` (A = filmId, B = genreId).
 * Attribute-имена в COUNT/ORDER ломают Postgres — используем эти пути.
 */
export const FILM_GENRE_DB = {
  filmId: "FilmGenre.A",
  genreId: "FilmGenre.B",
} as const;

export const FILM_SORT_ORDER: Record<TFilmSortBy, [string, "ASC" | "DESC"]> = {
  rating: ["ratingKp", "DESC"],
  novelty: ["premiereWorldDate", "DESC"],
  alphabet: ["filmNameRu", "ASC"],
  popularity: ["votesKp", "DESC"],
};
