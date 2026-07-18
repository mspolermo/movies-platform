import type { TCountriesListResponse } from "@common/types";

import { Controller, Get } from "@nestjs/common";
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";

import { CountryResponseDto } from "../dto";
import { CountriesService } from "../services/countries.service";

@ApiTags("Countries")
@Controller("countries")
export class CountriesController {
  constructor(
    private readonly countriesService: CountriesService
  ) {}

  @Get()
  @ApiOperation({ summary: "Получить список стран" })
  @ApiOkResponse({
    description: "Список стран",
    type: CountryResponseDto,
    isArray: true,
  })
  getAllCountries(): Promise<TCountriesListResponse> {
    return this.countriesService.getAllCountries();
  }
}