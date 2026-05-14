import type { TCountryItemResponse } from "@common/types";

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import { mapCountryToItem } from "../mappers"
import { Country } from "../models";

@Injectable()
export class CountriesService {
  constructor(
    @InjectModel(Country)
    private readonly countryRepository: typeof Country
  ) {}

  async getAllCountries(): Promise<TCountryItemResponse[]> {
    const countries = await this.countryRepository.findAll({
      attributes: [
        "id",
        "countryName",
        "countryNameEn",
      ],
      order: [["countryName", "ASC"]],
    });

    return countries.map(mapCountryToItem);
  }
}