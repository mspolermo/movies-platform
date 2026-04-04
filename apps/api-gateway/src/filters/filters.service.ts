import type {
  TFiltersResponse,
  TCountryItemResponse,
  TGenreItemResponse,
  TQuickFiltersResponse,
  TFiltersLocale,
} from "@common/types";

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { kinoDbRpc } from "@common/messaging";

import { BaseMicroserviceService } from "../shared/services";

const QUICK_FILTERS_MAX_GENRES = 23;
const QUICK_FILTERS_MAX_COUNTRIES = 25;
const QUICK_FILTERS_MAX_YEARS = 9;

const pickGenreLabel = (g: TGenreItemResponse, locale: TFiltersLocale): string => {
  if (locale === "en") {
    return g.nameEn?.trim() ? g.nameEn : g.nameRu;
  }
  return g.nameRu;
};

const pickCountryLabel = (c: TCountryItemResponse, locale: TFiltersLocale): string => {
  if (locale === "en") {
    return c.countryNameEn?.trim() ? c.countryNameEn : c.countryName;
  }
  return c.countryName;
};

@Injectable()
export class FiltersService extends BaseMicroserviceService {
  constructor(configService: ConfigService) {
    super(configService, "Filters Service");
  }

  async getFilters(locale: TFiltersLocale): Promise<TFiltersResponse> {
    const [genresRaw, countriesRaw, yearsRaw] = await Promise.all([
      this.sendMessage<TGenreItemResponse[]>(kinoDbRpc.genres.getAll, ""),
      this.sendMessage<TCountryItemResponse[]>(kinoDbRpc.countries.getAll, ""),
      this.sendMessage<number[]>(kinoDbRpc.films.getAllFilmYears, ""),
    ]);

    const years = [...yearsRaw].sort((a, b) => b - a);

    return {
      genres: genresRaw.map((g) => pickGenreLabel(g, locale)),
      countries: countriesRaw.map((c) => pickCountryLabel(c, locale)),
      years,
    };
  }

  async getQuickFilters(locale: TFiltersLocale): Promise<TQuickFiltersResponse> {
    const [genresRaw, countriesRaw, yearsRaw] = await Promise.all([
      this.sendMessage<TGenreItemResponse[]>(kinoDbRpc.genres.getAll, ""),
      this.sendMessage<TCountryItemResponse[]>(kinoDbRpc.countries.getAll, ""),
      this.sendMessage<number[]>(kinoDbRpc.films.getAllFilmYears, ""),
    ]);

    const genresSliced = genresRaw.slice(0, QUICK_FILTERS_MAX_GENRES);
    const countriesSliced = countriesRaw.slice(0, QUICK_FILTERS_MAX_COUNTRIES);
    const years = [...yearsRaw]
      .sort((a, b) => b - a)
      .slice(0, QUICK_FILTERS_MAX_YEARS);

    return {
      genres: genresSliced.map((g) => pickGenreLabel(g, locale)),
      countries: countriesSliced.map((c) => pickCountryLabel(c, locale)),
      years,
    };
  }
}
