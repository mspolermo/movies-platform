import type { TFilmSortBy } from "@common/types";

import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

import { ToFloat, ToInt, ToNumberArray, ToStringArray } from "../../shared";

const FILM_SORT_BY_VALUES: readonly TFilmSortBy[] = [
  "rating",
  "novelty",
  "alphabet",
  "popularity",
];

export class SearchFilmsDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @ToInt(1)
  page: number = 1;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @ToInt(10)
  perPage: number = 10;

  @ApiPropertyOptional({
    example: ["Drama", "Comedy"],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ToStringArray()
  genres?: string[];

  @ApiPropertyOptional({
    example: ["USA", "France"],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ToStringArray()
  countries?: string[];

  @ApiPropertyOptional({
    example: ["Tom Hanks"],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ToStringArray()
  persons?: string[];

  @ApiPropertyOptional({ example: 7.5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  @ToFloat()
  minRatingKp?: number;

  @ApiPropertyOptional({ example: 10000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @ToInt()
  minVotesKp?: number;

  @ApiPropertyOptional({
    enum: FILM_SORT_BY_VALUES,
  })
  @IsOptional()
  @IsString()
  @IsIn(FILM_SORT_BY_VALUES)
  sortBy?: TFilmSortBy;

  @ApiPropertyOptional({
    example: [2020, 2021],
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Min(1900, { each: true })
  @Max(new Date().getFullYear(), { each: true })
  @ToNumberArray()
  years?: number[];
}