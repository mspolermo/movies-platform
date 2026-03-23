import type { TCountryEntity } from "../country";

/** Элемент ответа списка стран для страниц и селекторов без DB-идентификатора. */
export type TCountryListItemResponse = Pick<
  TCountryEntity,
  "countryName" | "countryNameEn"
>;

/** Ответ API для списка стран. */
export type TCountryListResponse = TCountryListItemResponse[];
