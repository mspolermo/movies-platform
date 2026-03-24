import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Country } from "./countries.model";
import { TCountryItemResponse } from "@common/types";

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
