import type { Country } from "../models";
import type { TAdminCountryItemResponse } from "@common/types";

/**
 * Преобразует ORM-модель страны в admin-ответ (с id).
 */
export function mapCountryToAdminItem(
  country: Country
): TAdminCountryItemResponse {
  return {
    id: country.id,
    countryName: country.countryName,
    countryNameEn: country.countryNameEn,
  };
}
