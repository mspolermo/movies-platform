import { TCountryBased, TGenreBased } from "@common/types";

export interface FiltersResult {
  genres: TGenreBased[];
  countries: TCountryBased[];
  years: number[];
}
