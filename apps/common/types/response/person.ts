import type { TFilmEntity, TPersonEntity } from "../entity";
import type { TProfessionItemResponse } from "./profession";

/** Ответ API для списка персон. */
export type TPersonListItemResponse = Pick<
  TPersonEntity,
  "id" | "photoUrl" | "nameRu" | "nameEn"
>;

/** Ответ API для профессии персоны. */
export type TPersonProfessionResponse = TProfessionItemResponse;

/** Ответ API для фильма персоны. */
export type TPersonFilmographyItemResponse = Pick<
TFilmEntity,
  "id" | "smallPictureUrl" | "filmNameRu" | "filmNameEn" | "year" | "ratingKp"
>;

/** Ответ API для пагинированного списка персон. */
export type TPaginatedPersonsResponse = {
  items: TPersonListItemResponse[];
  total: number;
  hasMore: boolean;
};

/** Ответ API для детальной информации о персоне. */
export type TPersonDetailsResponse = TPersonListItemResponse & {
  professions?: TPersonProfessionResponse[];
  films?: TPersonFilmographyItemResponse[];
  filmsTotal?: number;
};
