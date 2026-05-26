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

export const FILM_SORT_ORDER: Record<TFilmSortBy, [string, "ASC" | "DESC"]> = {
  rating: ["ratingKp", "DESC"],
  novelty: ["premiereWorldDate", "DESC"],
  alphabet: ["filmNameRu", "ASC"],
  popularity: ["votesKp", "DESC"],
};
