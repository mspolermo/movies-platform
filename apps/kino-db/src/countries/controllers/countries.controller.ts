import type { TCountriesListResponse } from "@common/types";

import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";

import { kinoDbRpc } from "@common/services";

import { CountriesService } from "../services";

@Controller()
export class CountriesController {
  constructor(
    private readonly countriesService: CountriesService
  ) {}

  @MessagePattern(kinoDbRpc.countries.getAll)
  getAllCountries(): Promise<TCountriesListResponse> {
    return this.countriesService.getAllCountries();
  }
}