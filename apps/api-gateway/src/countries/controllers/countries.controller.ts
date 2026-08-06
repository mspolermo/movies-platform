import type { TCountriesListResponse } from "@common/types";

import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { JwtAuthGuard, Public } from "../../shared";
import { CountryItemResponseDto } from "../dto";
import { CountriesService } from "../services/countries.service";

@ApiTags("Countries")
@Controller("countries")
@UseGuards(JwtAuthGuard)
export class CountriesController {
  constructor(
    private readonly countriesService: CountriesService
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "Получить список стран" })
  @ApiOkResponse({
    description: "Список стран (`countryName` / `countryNameEn`)",
    type: CountryItemResponseDto,
    isArray: true,
  })
  getAllCountries(): Promise<TCountriesListResponse> {
    return this.countriesService.getAllCountries();
  }
}
