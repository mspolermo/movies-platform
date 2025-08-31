import { CountryDto } from "./country.dto";
import { TGenreBased } from "@common/types";

export interface FiltersResult {
  genres: TGenreBased[];
  countries: CountryDto[];
  years: number[];
}
