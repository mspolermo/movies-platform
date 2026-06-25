import type { TFilmDetailsResponse, TFilmListItemResponse } from "@common/types";

import { Film } from "../models";

export const mapFilmToCardResponse = (
  film: Film
): TFilmListItemResponse => ({
  id: film.id,
  filmNameRu: film.filmNameRu,
  filmNameEn: film.filmNameEn,
  bigPictureUrl: film.bigPictureUrl,
  smallPictureUrl: film.smallPictureUrl,
  ratingKp: film.ratingKp,
  year: film.year,
  premiereCountry: film.premiereCountry,
  movieLength: film.movieLength,
});

export function mapFilmToDetailsResponse(
  film: Film
): TFilmDetailsResponse {
  return {
    id: film.id,
    trailerUrl: film.trailerUrl,
    ratingKp: film.ratingKp,
    votesKp: film.votesKp,
    movieLength: film.movieLength,
    filmNameRu: film.filmNameRu,
    filmNameEn: film.filmNameEn,
    description: film.description,
    slogan: film.slogan,
    bigPictureUrl: film.bigPictureUrl,
    smallPictureUrl: film.smallPictureUrl,
    year: film.year,
    countries: film.countries,
    genres: film.genres,
    facts: film.facts,
  };
}