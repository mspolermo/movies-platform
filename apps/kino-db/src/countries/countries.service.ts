import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Country } from "./countries.model";
import { TCountryListResponse } from "@common/types";

@Injectable()
export class CountriesService {
  constructor(
    @InjectModel(Country) private countryRepository: typeof Country
  ) {}

  async getAllCountries(): Promise<TCountryListResponse> {
    const country = await this.countryRepository.findAll({
      attributes: ["countryName", "countryNameEn"],
      order: [["countryName", "ASC"]],
    });
    return country;
  }
}
