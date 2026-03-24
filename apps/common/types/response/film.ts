import type { TFilmEntity } from "../entity";
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
export interface TFilmsResponse {
  films: TFilmListItemResponse[];
  total: number;
  page: number;
  perPage: number;
  hasMore: boolean;
}

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
