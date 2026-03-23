import type { TCountryEntity } from "../country";
import type { TFilmBased } from "../film";
import { TCountryListItemResponse } from "./country";
import type { TFilmFactResponse } from "./fact";
import type { TGenreListItemResponse } from "./genre";

export type TFilmSortBy = "rating" | "novelty" | "alphabet" | "popularity";

export interface TSearchFilmsParams {
  page?: number;
  perPage?: number;
  year?: number;
  genres?: string[];
  countries?: string[];
  persons?: string[];
  minRatingKp?: number;
  minVotesKp?: number;
  sortBy?: TFilmSortBy;
}

export type TFilmCardResponse = Pick<
  TFilmBased,
  | "id"
  | "filmNameRu"
  | "filmNameEn"
  | "bigPictureUrl"
  | "smallPictureUrl"
  | "ratingKp"
  | "year"
  | "premiereCountry"
  | "movieLength"
>;

export interface TFilmFiltersListPayload {
  films: TFilmCardResponse[];
  total: number;
}

export interface TFilmsResponse {
  films: TFilmCardResponse[];
  total: number;
  page: number;
  perPage: number;
  hasMore: boolean;
}

/** Ответ API для детальной информации о фильме. */
export type TFilmDetailsResponse = Pick<
  TFilmBased,
  | "id"
  | "trailerUrl"
  | "ratingKp"
  | "votesKp"
  | "movieLength"
  | "filmNameRu"
  | "filmNameEn"
  | "description"
  | "slogan"
  | "bigPictureUrl"
  | "smallPictureUrl"
  | "year"
> & {
  countries?: TCountryListItemResponse[];
  genres?: TGenreListItemResponse[];
  fact?: TFilmFactResponse;
};
