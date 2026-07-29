import type { Film } from "../models";
import type { TAdminFilmItemResponse } from "@common/types";

/** Nullable-колонка Sequelize → optional-поле ответа (null не отдаём наружу). */
const toOptional = <T>(value: T | null | undefined): T | undefined =>
  value ?? undefined;

/**
 * Преобразует ORM-модель фильма в admin-ответ (скаляры + id, даты — ISO string).
 */
export function mapFilmToAdminItem(film: Film): TAdminFilmItemResponse {
  return {
    id: film.id,
    filmNameRu: film.filmNameRu,
    filmNameEn: toOptional(film.filmNameEn),
    description: toOptional(film.description),
    slogan: toOptional(film.slogan),
    year: toOptional(film.year),
    movieLength: toOptional(film.movieLength),
    originalFilmLanguage: toOptional(film.originalFilmLanguage),
    premiereCountry: toOptional(film.premiereCountry),
    premiereWorldDate: film.premiereWorldDate
      ? new Date(film.premiereWorldDate).toISOString()
      : undefined,
    trailerName: toOptional(film.trailerName),
    trailerUrl: toOptional(film.trailerUrl),
    bigPictureUrl: toOptional(film.bigPictureUrl),
    smallPictureUrl: toOptional(film.smallPictureUrl),
    ratingKp: toOptional(film.ratingKp),
    votesKp: toOptional(film.votesKp),
    ratingImdb: toOptional(film.ratingImdb),
    votesImdb: toOptional(film.votesImdb),
    ratingFilmCritics: toOptional(film.ratingFilmCritics),
    votesFilmCritics: toOptional(film.votesFilmCritics),
    ratingRussianFilmCritics: toOptional(film.ratingRussianFilmCritics),
    votesRussianFilmCritics: toOptional(film.votesRussianFilmCritics),
    top10: toOptional(film.top10),
    top250: toOptional(film.top250),
  };
}
