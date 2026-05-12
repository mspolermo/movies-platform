import type { TCountriesListResponse } from "@common/types";

import { Injectable } from "@nestjs/common";

import { CountriesClient } from "../clients";

@Injectable()
export class CountriesService {
  constructor(
    private readonly countriesClient: CountriesClient
  ) {}

  getAllCountries(): Promise<TCountriesListResponse> {
    return this.countriesClient.getAllCountries();
  }
}