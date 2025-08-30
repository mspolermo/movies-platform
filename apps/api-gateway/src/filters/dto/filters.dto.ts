import { CountryDto } from "./country.dto";
import { Genre } from "@common/types";

export interface FiltersResult {
  genres: Genre[];
  countries: CountryDto[];
  years: number[];
}
