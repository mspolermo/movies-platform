import type { TCountryEntity } from "../entity";

/** Элемент ответа списка стран для страниц и селекторов без DB-идентификатора. */
export type TCountryItemResponse = Pick<TCountryEntity, "countryName" | "countryNameEn">;

/** Ответ API для списка стран. */
export type TCountriesListResponse = TCountryItemResponse[];