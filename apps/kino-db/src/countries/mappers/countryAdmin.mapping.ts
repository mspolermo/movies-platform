import type { Country } from "../models";
import type { TCountryAdminItemResponse } from "@common/types";

/**
 * Преобразует ORM-модель страны в admin-ответ (с id).
 */
export function mapCountryToAdminItem(
  country: Country
): TCountryAdminItemResponse {
  return {
    id: country.id,
    countryName: country.countryName,
    countryNameEn: country.countryNameEn,
  };
}
