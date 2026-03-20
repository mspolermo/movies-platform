import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { CountriesService } from "./countries.service";
import { JwtAuthGuard } from "../shared/guards";

@Controller("countries")
@ApiBearerAuth()
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @ApiOperation({ summary: "Получить все страны" })
  @ApiResponse({ status: 200, description: "Список стран" })
  @Get()
  async getAllCountries() {
    return await this.countriesService.getAllCountries();
  }
}
