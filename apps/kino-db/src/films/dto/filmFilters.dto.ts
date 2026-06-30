import type { TFilmSortBy } from "@common/types";

import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export class FilmFiltersDto {
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  perPage!: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genres?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  countries?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  persons?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minRatingKp?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minVotesKp?: number;

  @IsOptional()
  @IsEnum(["rating", "novelty", "alphabet", "popularity"])
  sortBy?: TFilmSortBy;

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  years?: number[];
}