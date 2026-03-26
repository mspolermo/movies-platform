import type { TCountriesListResponse } from "@common/types";

import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";

import { kinoDbRpc } from "@common/messaging";

import { CountriesService } from "./countries.service";

@Controller("countries")
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @MessagePattern(kinoDbRpc.countries.getAll)
  async getAllCountries(): Promise<TCountriesListResponse> {
    return await this.countriesService.getAllCountries();
  }
}
