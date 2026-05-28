import { TCountryItemResponse, TFiltersLocale, TGenreItemResponse } from "@common/types";

export const pickGenreLabel = (genre: TGenreItemResponse, locale: TFiltersLocale): string => {
  if (locale === "en") {
    return genre.nameEn?.trim() || genre.nameRu;
  }
  return genre.nameRu;
};

export const pickCountryLabel = (country: TCountryItemResponse, locale: TFiltersLocale): string => {
  if (locale === "en") {
    return country.countryNameEn?.trim() || country.countryName;
  }
  return country.countryName;
};