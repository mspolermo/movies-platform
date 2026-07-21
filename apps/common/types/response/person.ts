import type { TPersonEntity } from "../entity";
import type { TPaginatedItemsResponse } from "../shared";
import type { TProfessionItemResponse } from "./profession";

/** Ответ API для списка персон. */
export type TPersonListItemResponse = Pick<
  TPersonEntity,
  "id" | "photoUrl" | "nameRu" | "nameEn"
>;

/** Ответ API для профессии персоны. */
export type TPersonProfessionResponse = TProfessionItemResponse;

/** Пагинированный список персон. */
export type TPaginatedPersonsResponse =
  TPaginatedItemsResponse<TPersonListItemResponse>;

/** Профиль персоны c профессиями. */
export type TPersonProfileResponse = TPersonListItemResponse & {
  professions?: TPersonProfessionResponse[];
};
