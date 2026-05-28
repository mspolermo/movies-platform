import type {
  TFiltersLocale,
  TFiltersResponse,
  TQuickFiltersResponse,
} from "@common/types";

import { Injectable } from "@nestjs/common";

import { FiltersClient } from "../clients";
import { QUICK_FILTERS_MAX_COUNTRIES, QUICK_FILTERS_MAX_GENRES, QUICK_FILTERS_MAX_YEARS } from "../constants";
import { pickCountryLabel, pickGenreLabel } from "../utils";

@Injectable()
export class FiltersService {
  constructor(private readonly filtersClient: FiltersClient) {}

  async getFilters(locale: TFiltersLocale): Promise<TFiltersResponse> {
    const { genresRaw, countriesRaw, yearsSortedDesc } = await this.getRawFiltersData(locale);

    return {
      genres: genresRaw,
      countries: countriesRaw,
      years: yearsSortedDesc,
    };
  }

  async getQuickFilters(locale: TFiltersLocale): Promise<TQuickFiltersResponse> {
    const { genresRaw, countriesRaw, yearsSortedDesc } = await this.getRawFiltersData(locale);

    const genres = genresRaw.slice(0, QUICK_FILTERS_MAX_GENRES);
    const countries = countriesRaw.slice(0, QUICK_FILTERS_MAX_COUNTRIES);
    const years = yearsSortedDesc.slice(0, QUICK_FILTERS_MAX_YEARS);

    return {
      genres,
      countries,
      years,
    };
  }

  private async getRawFiltersData(
    locale: TFiltersLocale
  ): Promise<{
    genresRaw: string[];
    countriesRaw: string[];
    yearsSortedDesc: number[];
  }> {
    const [genresRaw, countriesRaw, yearsRaw] = await Promise.all([
      this.filtersClient.getAllGenres(),
      this.filtersClient.getAllCountries(),
      this.filtersClient.getAllFilmYears(),
    ]);

    const genreLabels = genresRaw.map((genre) => pickGenreLabel(genre, locale));
    const countryLabels = countriesRaw.map((country) => pickCountryLabel(country, locale));
    const yearsSortedDesc = [...yearsRaw].sort((firstYear, secondYear) => secondYear - firstYear);

    return {
      genresRaw: genreLabels,
      countriesRaw: countryLabels,
      yearsSortedDesc,
    };
  }
}

