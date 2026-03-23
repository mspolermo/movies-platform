import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { TCountryListResponse } from "@common/types";
import { CountriesService } from "./countries.service";

@Controller("countries")
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @MessagePattern("getAll.countries")
  async getAllCountries(): Promise<TCountryListResponse> {
    return await this.countriesService.getAllCountries();
  }
}
