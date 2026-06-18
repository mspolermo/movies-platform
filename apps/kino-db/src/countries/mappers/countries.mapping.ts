import type { Country } from "../models";
import type { TCountryItemResponse } from "@common/types";

/**
 * Преобразует ORM-модель страны в DTO для API/RPC ответа
 * (Sequelize-модель Country в объект ответа, содержащий только публичные поля страны).
 */
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