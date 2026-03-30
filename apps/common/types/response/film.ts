import type { TFilmEntity } from "../entity";
import type { TPaginationMeta } from "../shared";
import type { TCountryItemResponse } from "./country";
import type { TFilmFactResponse } from "./fact";
import type { TGenreItemResponse } from "./genre";

/** Элемент ответа списка фильмов для каталогов и поисковой выдачи. */
export type TFilmListItemResponse = Pick<
  TFilmEntity,
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



/** Ответ API для пагинированного списка фильмов. */
export type TFilmsResponse = {
  films: TFilmListItemResponse[];
} & TPaginationMeta;

/** Ответ API для детальной информации о фильме. */
export type TFilmDetailsResponse = Pick<
  TFilmEntity,
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
  countries?: TCountryItemResponse[];
  genres?: TGenreItemResponse[];
  facts?: TFilmFactResponse[];
};

/** Элемент ответа API для фильма персоны. */
export type TPersonFilmResponse = Pick<
  TFilmEntity,
  "id" | "smallPictureUrl" | "filmNameRu" | "filmNameEn" | "year" | "ratingKp"
>;

/** Ответ API для списка фильмов персоны. */
export type TPersonFilmsListResponse = TPersonFilmResponse[];

/** Ответ API для пагинированного списка фильмов персоны. */
export type TPersonFilmsPaginationResponse = {
  items: TPersonFilmsListResponse;
} & TPaginationMeta;