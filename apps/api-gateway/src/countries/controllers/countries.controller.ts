import type { TCountriesListResponse } from "@common/types";

import { Controller, Get } from "@nestjs/common";
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";

import { CountriesService } from "../application/countries.service";
import { CountryResponseDto } from "../dto";

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