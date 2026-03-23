import type { TFilmBased } from "../film";
import type { TPersonBased } from "../person";
import type { TProfessionBased } from "../profession";

/** Ответ API для списка персон. */
export type TPersonListItemResponse = Pick<
  TPersonBased,
  "id" | "photoUrl" | "nameRu" | "nameEn"
>;

/** Ответ API для профессии персоны. */
export type TPersonProfessionResponse = Pick<TProfessionBased, "id" | "name">;

/** Ответ API для фильма персоны. */
export type TPersonFilmographyItemResponse = Pick<
  TFilmBased,
  "id" | "smallPictureUrl" | "filmNameRu" | "filmNameEn" | "year" | "ratingKp"
>;

/** Ответ API для пагинированного списка персон. */
export interface TPaginatedPersonsResponse {
  items: TPersonListItemResponse[];
  total: number;
  hasMore: boolean;
}

/** Ответ API для детальной информации о персоне. */
export interface TPersonDetailsResponse extends TPersonListItemResponse {
  professions?: TPersonProfessionResponse[];
  films?: TPersonFilmographyItemResponse[];
  filmsTotal?: number;
}
