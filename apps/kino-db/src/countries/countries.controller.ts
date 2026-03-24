import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { TCountryItemResponse } from "@common/types";
import { CountriesService } from "./countries.service";

@Controller("countries")
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @MessagePattern("getAll.countries")
  async getAllCountries(): Promise<TCountryItemResponse[]> {
    return await this.countriesService.getAllCountries();
  }
}
