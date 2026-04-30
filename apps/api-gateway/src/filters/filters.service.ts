import type {
  TFiltersResponse,
  TCountryItemResponse,
  TGenreItemResponse,
  TQuickFiltersResponse,
  TFiltersLocale,
} from "@common/types";

import { Injectable } from "@nestjs/common";

import { RmqService, kinoDbRpc } from "@common/services";

const QUICK_FILTERS_MAX_GENRES = 23;
const QUICK_FILTERS_MAX_COUNTRIES = 25;
const QUICK_FILTERS_MAX_YEARS = 9;

const pickGenreLabel = (g: TGenreItemResponse, locale: TFiltersLocale): string => {
  return locale === "en"
    ? g.nameEn?.trim() || g.nameRu
    : g.nameRu;
};

const pickCountryLabel = (c: TCountryItemResponse, locale: TFiltersLocale): string => {
  return locale === "en"
    ? c.countryNameEn?.trim() || c.countryName
    : c.countryName;
};

@Injectable()
export class FiltersService {
  constructor(private readonly rmq: RmqService) {}

  async getFilters(locale: TFiltersLocale): Promise<TFiltersResponse> {
    const [genresRaw, countriesRaw, yearsRaw] = await Promise.all([
      this.rmq.sendToFilms(
        kinoDbRpc.genres.getAll,
        {}
      ),
      this.rmq.sendToFilms(
        kinoDbRpc.countries.getAll,
        {}
      ),
      this.rmq.sendToFilms(
        kinoDbRpc.films.getAllFilmYears,
        {}
      ),
    ]);

    return {
      genres: genresRaw.map((g) => pickGenreLabel(g, locale)),
      countries: countriesRaw.map((c) => pickCountryLabel(c, locale)),
      years: [...yearsRaw].sort((a, b) => b - a),
    };
  }

  async getQuickFilters(locale: TFiltersLocale): Promise<TQuickFiltersResponse> {
    const [genresRaw, countriesRaw, yearsRaw] = await Promise.all([
      this.rmq.sendToFilms(
        kinoDbRpc.genres.getAll,
        {}
      ),
      this.rmq.sendToFilms(
        kinoDbRpc.countries.getAll,
        {}
      ),
      this.rmq.sendToFilms(
        kinoDbRpc.films.getAllFilmYears,
        {}
      ),
    ]);

    return {
      genres: genresRaw
        .slice(0, QUICK_FILTERS_MAX_GENRES)
        .map((g) => pickGenreLabel(g, locale)),

      countries: countriesRaw
        .slice(0, QUICK_FILTERS_MAX_COUNTRIES)
        .map((c) => pickCountryLabel(c, locale)),

      years: [...yearsRaw]
        .sort((a, b) => b - a)
        .slice(0, QUICK_FILTERS_MAX_YEARS),
    };
  }
}