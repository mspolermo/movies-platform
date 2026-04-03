import type { TFilmSortBy } from "@common/types";

import { Transform } from "class-transformer";
import {
  IsNumber,
  IsOptional,
  IsArray,
  IsString,
  IsIn,
  Min,
  Max,
} from "class-validator";

const FILM_SORT_BY_VALUES: readonly TFilmSortBy[] = [
  "rating",
  "novelty",
  "alphabet",
  "popularity",
];

export class SearchFilmsDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => {
    const parsed = parseInt(value);
    return isNaN(parsed) ? 1 : parsed;
  })
  page: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => {
    const parsed = parseInt(value);
    return isNaN(parsed) ? 10 : parsed;
  })
  perPage: number = 10;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === "string") {
      return value.split(",").map((item) => item.trim()).filter(Boolean);
    }
    return value;
  })
  genres?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === "string") {
      return value.split(",").map((item) => item.trim()).filter(Boolean);
    }
    return value;
  })
  countries?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === "string") {
      return value.split(",").map((item) => item.trim()).filter(Boolean);
    }
    return value;
  })
  persons?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  @Transform(({ value }) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? undefined : parsed;
  })
  minRatingKp?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => {
    const parsed = parseInt(value);
    return isNaN(parsed) ? undefined : parsed;
  })
  minVotesKp?: number;

  @IsOptional()
  @IsString()
  @IsIn(FILM_SORT_BY_VALUES)
  sortBy?: TFilmSortBy;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Min(1900, { each: true })
  @Max(new Date().getFullYear(), { each: true })
  @Transform(({ value }) => {
    if (typeof value === "string") {
      return value
        .split(",")
        .map((item) => parseInt(item.trim(), 10))
        .filter((n) => !Number.isNaN(n));
    }
    if (Array.isArray(value)) {
      return value.map((v) => (typeof v === "string" ? parseInt(v, 10) : v)).filter((n) => !Number.isNaN(n));
    }
    return value;
  })
  years?: number[];
}
