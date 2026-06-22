import type { Country } from "../models";
import type { TCountryItemResponse } from "@common/types";

/**
 * Преобразует ORM-модель страны в DTO ответа.
 */
export function mapCountryToItem(
  country: Country
): TCountryItemResponse {
  return {
    countryName: country.countryName,
    countryNameEn: country.countryNameEn,
  };
}