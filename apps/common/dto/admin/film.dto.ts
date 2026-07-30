import type { TCreateFilmRequest, TUpdateFilmRequest } from "@common/types";

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
} from "class-validator";

import { OptionalNullable, OptionalStrict } from "./decorators";

export class CreateFilmDto implements TCreateFilmRequest {
  @ApiProperty({ description: "Название на русском" })
  @IsString()
  @IsNotEmpty()
  filmNameRu!: string;

  @ApiPropertyOptional({ description: "Название на английском" })
  @OptionalStrict()
  @IsString()
  filmNameEn?: string;

  @ApiPropertyOptional({ description: "Описание" })
  @OptionalStrict()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: "Слоган" })
  @OptionalStrict()
  @IsString()
  slogan?: string;

  @ApiPropertyOptional({ description: "Год выхода" })
  @OptionalStrict()
  @IsInt()
  year?: number;

  @ApiPropertyOptional({ description: "Длительность, мин" })
  @OptionalStrict()
  @IsInt()
  movieLength?: number;

  @ApiPropertyOptional({ description: "Язык оригинала" })
  @OptionalStrict()
  @IsString()
  originalFilmLanguage?: string;

  @ApiPropertyOptional({ description: "Страна премьеры" })
  @OptionalStrict()
  @IsString()
  premiereCountry?: string;

  @ApiPropertyOptional({ description: "Дата мировой премьеры (ISO 8601)" })
  @OptionalStrict()
  @IsDateString()
  premiereWorldDate?: string;

  @ApiPropertyOptional({ description: "Название трейлера" })
  @OptionalStrict()
  @IsString()
  trailerName?: string;

  @ApiPropertyOptional({ description: "URL трейлера" })
  @OptionalStrict()
  @IsString()
  trailerUrl?: string;

  @ApiPropertyOptional({ description: "URL большого постера" })
  @OptionalStrict()
  @IsString()
  bigPictureUrl?: string;

  @ApiPropertyOptional({ description: "URL маленького постера" })
  @OptionalStrict()
  @IsString()
  smallPictureUrl?: string;

  @ApiPropertyOptional({ description: "Рейтинг Кинопоиска" })
  @OptionalStrict()
  @IsNumber()
  ratingKp?: number;

  @ApiPropertyOptional({ description: "Голоса Кинопоиска" })
  @OptionalStrict()
  @IsInt()
  votesKp?: number;

  @ApiPropertyOptional({ description: "Рейтинг IMDb" })
  @OptionalStrict()
  @IsNumber()
  ratingImdb?: number;

  @ApiPropertyOptional({ description: "Голоса IMDb" })
  @OptionalStrict()
  @IsInt()
  votesImdb?: number;

  @ApiPropertyOptional({ description: "Рейтинг кинокритиков" })
  @OptionalStrict()
  @IsNumber()
  ratingFilmCritics?: number;

  @ApiPropertyOptional({ description: "Голоса кинокритиков" })
  @OptionalStrict()
  @IsInt()
  votesFilmCritics?: number;

  @ApiPropertyOptional({ description: "Рейтинг российских кинокритиков" })
  @OptionalStrict()
  @IsNumber()
  ratingRussianFilmCritics?: number;

  @ApiPropertyOptional({ description: "Голоса российских кинокритиков" })
  @OptionalStrict()
  @IsInt()
  votesRussianFilmCritics?: number;

  @ApiPropertyOptional({ description: "Позиция в топ-10" })
  @OptionalStrict()
  @IsInt()
  top10?: number;

  @ApiPropertyOptional({ description: "Позиция в топ-250" })
  @OptionalStrict()
  @IsInt()
  top250?: number;
}

export class UpdateFilmDto implements TUpdateFilmRequest {
  @ApiPropertyOptional({ description: "Название на русском (null запрещён)" })
  @OptionalStrict()
  @IsString()
  @IsNotEmpty()
  filmNameRu?: string;

  @ApiPropertyOptional({ description: "Название на английском" })
  @OptionalNullable()
  @IsString()
  filmNameEn?: string | null;

  @ApiPropertyOptional({ description: "Описание" })
  @OptionalNullable()
  @IsString()
  description?: string | null;

  @ApiPropertyOptional({ description: "Слоган" })
  @OptionalNullable()
  @IsString()
  slogan?: string | null;

  @ApiPropertyOptional({ description: "Год выхода" })
  @OptionalNullable()
  @IsInt()
  year?: number | null;

  @ApiPropertyOptional({ description: "Длительность, мин" })
  @OptionalNullable()
  @IsInt()
  movieLength?: number | null;

  @ApiPropertyOptional({ description: "Язык оригинала" })
  @OptionalNullable()
  @IsString()
  originalFilmLanguage?: string | null;

  @ApiPropertyOptional({ description: "Страна премьеры" })
  @OptionalNullable()
  @IsString()
  premiereCountry?: string | null;

  @ApiPropertyOptional({ description: "Дата мировой премьеры (ISO 8601)" })
  @OptionalNullable()
  @IsDateString()
  premiereWorldDate?: string | null;

  @ApiPropertyOptional({ description: "Название трейлера" })
  @OptionalNullable()
  @IsString()
  trailerName?: string | null;

  @ApiPropertyOptional({ description: "URL трейлера" })
  @OptionalNullable()
  @IsString()
  trailerUrl?: string | null;

  @ApiPropertyOptional({ description: "URL большого постера" })
  @OptionalNullable()
  @IsString()
  bigPictureUrl?: string | null;

  @ApiPropertyOptional({ description: "URL маленького постера" })
  @OptionalNullable()
  @IsString()
  smallPictureUrl?: string | null;

  @ApiPropertyOptional({ description: "Рейтинг Кинопоиска" })
  @OptionalNullable()
  @IsNumber()
  ratingKp?: number | null;

  @ApiPropertyOptional({ description: "Голоса Кинопоиска" })
  @OptionalNullable()
  @IsInt()
  votesKp?: number | null;

  @ApiPropertyOptional({ description: "Рейтинг IMDb" })
  @OptionalNullable()
  @IsNumber()
  ratingImdb?: number | null;

  @ApiPropertyOptional({ description: "Голоса IMDb" })
  @OptionalNullable()
  @IsInt()
  votesImdb?: number | null;

  @ApiPropertyOptional({ description: "Рейтинг кинокритиков" })
  @OptionalNullable()
  @IsNumber()
  ratingFilmCritics?: number | null;

  @ApiPropertyOptional({ description: "Голоса кинокритиков" })
  @OptionalNullable()
  @IsInt()
  votesFilmCritics?: number | null;

  @ApiPropertyOptional({ description: "Рейтинг российских кинокритиков" })
  @OptionalNullable()
  @IsNumber()
  ratingRussianFilmCritics?: number | null;

  @ApiPropertyOptional({ description: "Голоса российских кинокритиков" })
  @OptionalNullable()
  @IsInt()
  votesRussianFilmCritics?: number | null;

  @ApiPropertyOptional({ description: "Позиция в топ-10" })
  @OptionalNullable()
  @IsInt()
  top10?: number | null;

  @ApiPropertyOptional({ description: "Позиция в топ-250" })
  @OptionalNullable()
  @IsInt()
  top250?: number | null;
}
