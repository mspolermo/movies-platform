import type { TPersonEntity } from "../entity";
import type { TProfessionItemResponse } from "./profession";

/** Ответ API для списка персон. */
export type TPersonListItemResponse = Pick<
  TPersonEntity,
  "id" | "photoUrl" | "nameRu" | "nameEn"
>;

/** Ответ API для профессии персоны. */
export type TPersonProfessionResponse = TProfessionItemResponse;

/** Ответ API для пагинированного списка персон. */
export type TPaginatedPersonsResponse = {
  items: TPersonListItemResponse[];
  total: number;
  hasMore: boolean;
};

/** Профиль персоны c профессиями. */
export type TPersonProfileResponse = TPersonListItemResponse & {
  professions?: TPersonProfessionResponse[];
};
