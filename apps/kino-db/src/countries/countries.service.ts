import type { TCountryItemResponse } from "@common/types";

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import { Country } from "./countries.model";

@Injectable()
export class CountriesService {
  constructor(
    @InjectModel(Country) private countryRepository: typeof Country
  ) {}

  async getAllCountries(): Promise<TCountryItemResponse[]> {
    const country = await this.countryRepository.findAll({
      attributes: ["countryName", "countryNameEn"],
      order: [["countryName", "ASC"]],
    });
    return country;
  }
}
