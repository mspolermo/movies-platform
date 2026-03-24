import type {
  TFiltersResponse,
  TCountryItemResponse,
  TGenreItemResponse,
  TQuickFiltersResponse,
} from "@common/types";

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { kinoDbRpc } from "@common/messaging";

import { BaseMicroserviceService } from "../shared/services";

const QUICK_FILTERS_MAX_GENRES = 23;
const QUICK_FILTERS_MAX_COUNTRIES = 25;
const QUICK_FILTERS_MAX_YEARS = 9;

@Injectable()
export class FiltersService extends BaseMicroserviceService {
  constructor(configService: ConfigService) {
    super(configService, "Filters Service");
  }

  async getFilters(): Promise<TFiltersResponse> {
    const [genres, countries, years] = await Promise.all([
      this.sendMessage<TGenreItemResponse[]>(kinoDbRpc.genres.getAll, ""),
      this.sendMessage<TCountryItemResponse[]>(kinoDbRpc.countries.getAll, ""),
      this.sendMessage<number[]>(kinoDbRpc.films.getAllFilmYears, ""),
    ]);

    return {
      genres,
      countries,
      years,
    };
  }

  async getQuickFilters(): Promise<TQuickFiltersResponse> {
    const [genresRaw, countriesRaw, yearsRaw] = await Promise.all([
      this.sendMessage<TGenreItemResponse[]>(kinoDbRpc.genres.getAll, ""),
      this.sendMessage<TCountryItemResponse[]>(kinoDbRpc.countries.getAll, ""),
      this.sendMessage<number[]>(kinoDbRpc.films.getAllFilmYears, ""),
    ]);

    const genres = genresRaw.slice(0, QUICK_FILTERS_MAX_GENRES).map((
      { nameRu, nameEn }
    ) => ({ nameRu, nameEn }));

    const countries = countriesRaw
      .slice(0, QUICK_FILTERS_MAX_COUNTRIES)
      .map(({countryName, countryNameEn}) => (
        { countryName, countryNameEn }));

    const years = [...yearsRaw]
      .sort((a, b) => b - a)
      .slice(0, QUICK_FILTERS_MAX_YEARS);

    return { genres, countries, years };
  }
}
