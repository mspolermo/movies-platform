import { TCountryBased } from "@common/types";

export class CountryDto implements TCountryBased {
  id: number;
  countryName: string;
  countryNameEn: string;
  createdAt?: Date;
  updatedAt?: Date;
}
