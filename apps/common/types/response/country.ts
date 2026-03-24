import type { TCountryEntity } from "../entity";

/** Элемент ответа списка стран для страниц и селекторов без DB-идентификатора. */
export type TCountryItemResponse = Pick<TCountryEntity, "countryName" | "countryNameEn">;
