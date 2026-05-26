import type { TFilmListItemResponse } from "@common/types";

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