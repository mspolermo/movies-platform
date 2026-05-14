import type { Country } from "../models";
import type { TCountryItemResponse } from "@common/types";

export function mapCountryToItem(
  country: Country
): TCountryItemResponse {
  const data =
    typeof country.toJSON === "function"
      ? country.toJSON()
      : country;

  return {
    countryName: data.countryName,
    countryNameEn: data.countryNameEn,
  };
}